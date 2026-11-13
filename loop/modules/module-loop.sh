#!/usr/bin/env bash
# module-loop.sh — runs a coding agent through loop/modules/progress-modules.md, one module per
# iteration. Each iteration is a FRESH agent process: nothing carries over except the files.
#
#   ./loop/modules/module-loop.sh              review mode: pauses after every module (default)
#   ./loop/modules/module-loop.sh auto 4       unattended: at most 4 iterations, no prompts
#   ./loop/modules/module-loop.sh keep-going   auto, and a module that crashed or did not finish
#                                              is retried instead of ending the run
#
# A session limit ("You've hit your session limit · resets 2:50pm (Zone/Name)") is never treated
# as a failure: in every mode the runner waits until the stated reset time and continues the
# same module.
#
# Everything is logged to loop/modules/.logs/. Current state: loop/modules/.logs/STATUS.md.
# On a laptop keep the machine awake, e.g. macOS:  caffeinate -i ./loop/modules/module-loop.sh keep-going
#
# Written for bash 3.2+ (the macOS default), so no associative arrays.
set -uo pipefail

cd "$(dirname "$0")/../.."       # workspace root: the parent of loop/
ROOT="$PWD"

# ------------------------------------------------------------------ CONFIG — edit for your project
# Git repositories the loop may touch, relative to the workspace root. Use (.) when loop/ lives
# inside a single repository.
REPOS=(.)
# The branch every module is merged into. The loop starts and ends each module on it.
INTEGRATION_BRANCH="master"
# Branches that must not move while the loop runs. Checked on origin after every module.
PROTECTED_BRANCHES=(master)
# How the agent is started. The iteration prompt is appended as the last argument.
# Choose the permission mode your team is comfortable leaving unattended.
AGENT_CMD=(claude -p --permission-mode auto)
# How long to wait before each retry after the agent process died for a reason that is NOT a
# session limit, in seconds. One entry per retry, so the list is also the retry budget.
RETRY_WAITS=(300 900 1800 3600)
# How many session-limit waits one module may use up before the run stops.
LIMIT_RETRIES=6
# Attempts at one module that end without a [x] before keep-going gives up on it.
MISS_LIMIT=3
# ------------------------------------------------------------------ end of CONFIG

# Test hooks (leave unset in normal use).
[ -n "${MODULE_LOOP_AGENT:-}" ] && AGENT_CMD=($MODULE_LOOP_AGENT)
SLEEP_CMD="${MODULE_LOOP_SLEEP:-sleep}"

QUEUE="loop/modules/progress-modules.md"
PROMPT="loop/modules/PROMPT.md"

MODE="review"; MAX_ITER=0; KEEP_GOING=0
for arg in "$@"; do
  case "$arg" in
    auto)   MODE="auto" ;;
    review) MODE="review" ;;
    keep-going|--keep-going) MODE="auto"; KEEP_GOING=1 ;;
    ''|*[!0-9]*) echo "unknown argument: $arg" >&2; exit 2 ;;
    *)      MAX_ITER="$arg" ;;
  esac
done

# ------------------------------------------------------------------ reading the queue
# A module is one `- [ ] ` line under "## Queue" that names a spec file in backticks.
# [owner] lines are a person's work and are excluded from every count.
MODULE_RE='^- \[ \] '
SKIP_RE='\[owner\]'

# Only the Queue section counts: the template above it and the Answers below it are not work.
queue_body() { awk '/^## Queue/{p=1; next} /^## /{p=0} p' "$QUEUE"; }

open_modules() { queue_body | grep -E "$MODULE_RE" | grep -vcE "$SKIP_RE" || true; }
done_modules() { queue_body | grep -c '^- \[x\]' || true; }
next_line()    { queue_body | grep -E "$MODULE_RE" | grep -vE "$SKIP_RE" | head -1; }

# The spec path is the first `backticked` .md path on the line. A line with none yields nothing,
# and check_queue_paths reports it by name before any work starts.
module_path() {
  printf '%s\n' "$1" | grep -oE '`[^`]+`' | tr -d '`' | grep -E '\.md$' | head -1 || true
}

# Optional programme-level spec a child module declares as:
#   Parent technical brief: `loop/modules/<name>-master.md`
parent_brief() {
  [ -f "$1" ] || return 0
  sed -nE 's/^Parent technical brief:[[:space:]]*`([^`]+)`.*/\1/p' "$1" | head -1
}

next_module() {
  local line; line=$(next_line)
  [ -n "$line" ] || return 0
  module_path "$line"
}

# The next queue line plus its indented notes.
next_block() {
  queue_body | awk '
    /^- \[ \] / && !/\[owner\]/ { if (take) exit; take=1; print; next }
    take && /^- \[/ { exit }
    take { print }
  '
}

next_branch() {
  next_block | grep -oE 'Branch:[[:space:]]*`[^`]+`' | head -1 | grep -oE '`[^`]+`' | tr -d '`'
}

# Waiting for approval = a Prototype: line with no `Approved: <date>` ON THAT LINE. Prose under
# the module may mention the word; only the line itself counts.
waiting_approval() {
  local proto
  proto=$(next_block | grep -E '^[[:space:]]*Prototype:' | head -1)
  [ -n "$proto" ] || return 1
  printf '%s\n' "$proto" | grep -qE 'Approved:[[:space:]]*[0-9]' && return 1
  return 0
}

# Every open module is checked before the first iteration: a queue line whose file is missing is
# cheaper to hear about now than an hour into a run.
check_queue_paths() {
  local bad=0 line path brief
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    path=$(module_path "$line")
    if [ -z "$path" ]; then
      echo "  no \`.md\` path in backticks on this line:" >&2; echo "    ${line:0:150}" >&2; bad=1
    elif [ ! -f "$path" ]; then
      echo "  module file does not exist: $path" >&2; echo "    ${line:0:150}" >&2; bad=1
    else
      brief=$(parent_brief "$path")
      if [ -n "$brief" ] && [ ! -f "$brief" ]; then
        echo "  parent technical brief does not exist: $brief (declared by $path)" >&2; bad=1
      fi
    fi
  done < <(queue_body | grep -E "$MODULE_RE" | grep -vE "$SKIP_RE")
  return $bad
}

# ------------------------------------------------------------------ session limits
# When the agent stops because the usage window closed, it says when the window opens again:
#
#   You've hit your session limit · resets 2:50pm (America/New_York)
#
# That is the real time in the account's own timezone, worth more than any backoff we could
# guess. It is read out of THIS iteration's slice of the log (a byte offset taken before the
# run), so an older iteration's message cannot be mistaken for this one's, and the runner waits
# until two minutes past it. Anything unexpected — no such line, an unknown wording, a time more
# than six hours out — returns 1 and the caller falls back to the fixed backoff.
LIMIT_WAIT=0
LIMIT_TEXT=""
session_limit_wait() {   # session_limit_wait <byte offset into $LOG>  ->  0 and sets LIMIT_WAIT
  local from="$1" slice line low hh mm ampm tz now nowmin target delta
  LIMIT_WAIT=0; LIMIT_TEXT=""
  slice=$(tail -c "+$((from + 1))" "$LOG" 2>/dev/null) || return 1
  printf '%s' "$slice" | grep -aqiE "hit your (session|usage) limit|limit reached" || return 1
  line=$(printf '%s' "$slice" \
    | grep -aoiE "resets[[:space:]]+(at[[:space:]]+)?[0-9]{1,2}(:[0-9]{2})?[[:space:]]*[ap]m([[:space:]]*\([A-Za-z0-9_/+-]+\))?" \
    | tail -1)
  [ -n "$line" ] || return 1

  # The zone name is case-sensitive, so it comes off the original line; the clock is parsed from
  # a lowercased copy.
  tz=$(printf '%s' "$line" | sed -nE 's/.*\(([^)]+)\).*/\1/p')
  low=$(printf '%s' "$line" | tr 'A-Z' 'a-z' | sed -E 's/^resets[[:space:]]+(at[[:space:]]+)?//')
  hh=$(printf '%s' "$low" | sed -E 's/^([0-9]{1,2}).*/\1/')
  mm=$(printf '%s' "$low" | sed -nE 's/^[0-9]{1,2}:([0-9]{2}).*/\1/p')
  # The am/pm marker is taken from the time token itself, never by searching the whole line: a
  # zone such as `America/New_York` lowercases to `america/...`, whose first letters are "am".
  ampm=$(printf '%s' "$low" | sed -E 's/^[0-9]{1,2}(:[0-9]{2})?[[:space:]]*([ap]m).*/\2/')
  [ -n "$mm" ] || mm=0
  hh=$((10#$hh)); mm=$((10#$mm))
  case "$ampm" in
    pm) [ "$hh" -lt 12 ] && hh=$((hh + 12)) ;;
    am) [ "$hh" -eq 12 ] && hh=0 ;;
    *)  return 1 ;;
  esac

  # An unknown zone would make `date` answer in UTC without saying so. If this machine does not
  # have the zone, read the clock in its own instead.
  [ -n "$tz" ] && [ ! -e "/usr/share/zoneinfo/$tz" ] && tz=""
  if [ -n "$tz" ]; then now=$(TZ="$tz" date '+%H %M' 2>/dev/null); else now=$(date '+%H %M'); fi
  [ -n "$now" ] || return 1
  set -- $now
  nowmin=$((10#$1 * 60 + 10#$2))
  target=$((hh * 60 + mm))
  delta=$((target - nowmin))
  [ "$delta" -le 0 ] && delta=$((delta + 1440))   # the window reopens after midnight
  [ "$delta" -gt 360 ] && return 1                # six hours out is not a session window
  LIMIT_WAIT=$((delta * 60 + 120))                # two minutes of slack: early burns a retry
  LIMIT_TEXT="$line"
  return 0
}

clock_after() {   # clock_after <seconds>  ->  HH:MM local time that many seconds from now
  local h m t
  h=$(date '+%H'); m=$(date '+%M')
  t=$(( (10#$h * 60 + 10#$m + $1 / 60) % 1440 ))
  printf '%02d:%02d' $((t / 60)) $((t % 60))
}

# ------------------------------------------------------------------ logging and status
LOGDIR="loop/modules/.logs"; mkdir -p "$LOGDIR"
STAMP=$(date +%Y%m%d-%H%M%S)
LOG="$LOGDIR/run-$STAMP.log"
STATUS="$LOGDIR/STATUS.md"
iteration=0

say() { echo "$@" | tee -a "$LOG"; }

status() {   # status <state> <detail>
  local r d
  {
    echo "# module-loop status"
    echo
    echo "- state: **$1**"
    echo "- detail: $2"
    echo "- mode: $MODE$([ "$KEEP_GOING" = "1" ] && echo " (keep-going)"), iteration: $iteration of $([ "$MAX_ITER" -gt 0 ] && echo "$MAX_ITER" || echo "no limit")"
    echo "- updated: $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo "- log: \`$LOG\`"
    echo
    echo "## queue"
    echo "- done: $(done_modules)"
    echo "- open: $(open_modules)"
    echo "- next: $(next_line | cut -c1-160)"
    echo
    echo "## branches"
    for r in "${REPOS[@]}"; do
      echo "- $r: $(git -C "$r" rev-parse --abbrev-ref HEAD 2>/dev/null) @ $(git -C "$r" log --oneline -1 2>/dev/null)"
      d=$(git -C "$r" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
      [ "$d" != "0" ] && echo "  - UNCOMMITTED: $d path(s)"
    done
  } > "$STATUS"
}

fail() { say ""; say "STOP: $*"; status "stopped" "$*"; exit 1; }

# A retry continues a module that is half-done, so every repo must be either on the integration
# branch or on the branch THIS module lands on. Anything else is not a retry, and the run stops.
retry_safe() {
  local r cur want
  want=$(next_branch)
  for r in "${REPOS[@]}"; do
    cur=$(git -C "$r" rev-parse --abbrev-ref HEAD)
    [ "$cur" = "$INTEGRATION_BRANCH" ] && continue
    [ -n "$want" ] && [ "$cur" = "$want" ] && continue
    say "    $r is on '$cur' — neither $INTEGRATION_BRANCH nor '$want', so this is not a retry."
    return 1
  done
  return 0
}

protected_snapshot() {   # one "repo|branch|sha" line per protected branch
  local r p
  for r in "${REPOS[@]}"; do
    for p in "${PROTECTED_BRANCHES[@]}"; do
      echo "$r|$p|$(git -C "$r" rev-parse --verify --quiet "origin/$p" || echo none)"
    done
  done
}

# ------------------------------------------------------------------ preflight
RESUMING=0
attempts=0; attempts_spec=""; limit_hits=0

command -v "${AGENT_CMD[0]}" >/dev/null || fail "${AGENT_CMD[0]} is not on PATH."
[ -f "$PROMPT" ] && [ -f "$QUEUE" ] || fail "loop/modules/ files not found — wrong directory?"
[ -f loop/AGENT.md ] || fail "loop/AGENT.md is missing."

# One runner per checkout. The queue file cannot say "this line is being worked", so the lock is
# the checkout itself. A live pid is not enough to name the holder: a killed runner leaves the
# file behind and the OS reuses pids, so the pid must still BE a module-loop. And a lock you
# cannot verify is a lock you leave alone — check it on the machine that holds it.
LOCK="$LOGDIR/runner.pid"
if [ -f "$LOCK" ]; then
  other=$(cat "$LOCK" 2>/dev/null)
  othercmd=""
  [ -n "$other" ] && othercmd=$(ps -p "$other" -o command= 2>/dev/null || true)
  case "$othercmd" in
    *module-loop*)
      fail "another module-loop runner (pid $other) is working this checkout. Wait for it or stop it; never run two. If you are sure it is gone, delete $LOCK." ;;
    "") [ -n "$other" ] && say "stale runner lock (pid $other is gone) — clearing it." ;;
    *)  say "stale runner lock (pid $other is now another program) — clearing it." ;;
  esac
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

check_queue_paths || fail "the queue has an open line that names no readable module file (listed above)."

want=$(next_branch)
for r in "${REPOS[@]}"; do
  git -C "$r" rev-parse --git-dir >/dev/null 2>&1 || fail "$r is not a git repository (see REPOS in this script)."
  cur=$(git -C "$r" rev-parse --abbrev-ref HEAD)

  # A run that died mid-module leaves the repo on the module's own branch with real work on it.
  # If that is the branch the NEXT module lands on, carry on where it stopped.
  if [ "$cur" != "$INTEGRATION_BRANCH" ] && [ -n "$want" ] && [ "$cur" = "$want" ]; then
    n=$(git -C "$r" rev-list --count "$INTEGRATION_BRANCH..$cur" 2>/dev/null || echo 0)
    say "$r: resuming '$cur' — $n commit(s) and any working-tree changes are kept."
    RESUMING=1
    continue
  fi

  if [ "$cur" != "$INTEGRATION_BRANCH" ]; then
    echo "" >&2
    echo "  $r is on '$cur', expected $INTEGRATION_BRANCH (or the next module's branch '${want:-?}')." >&2
    echo "  KEEP the work:  run the gate, then merge '$cur' into $INTEGRATION_BRANCH with --no-ff." >&2
    echo "  DROP the work:  git -C $r checkout $INTEGRATION_BRANCH && git -C $r branch -D $cur" >&2
    echo "  Either way the module stays [ ] in the queue, so the loop picks it up again." >&2
    fail "$r is on '$cur' — an unmerged branch the runner will not guess about."
  fi
  [ -z "$(git -C "$r" status --porcelain)" ] || fail "$r has uncommitted changes — commit or stash them first."
done

PROTECTED_BEFORE=$(protected_snapshot)

mkdir -p loop/modules/.backup
cp "$QUEUE" "loop/modules/.backup/progress-modules.$STAMP.md"

say "=== module-loop start $(date '+%F %T') — mode=$MODE max=$MAX_ITER keep-going=$KEEP_GOING"
status "running" "preflight passed"

# ------------------------------------------------------------------ the loop
while true; do
  iteration=$((iteration + 1))
  if [ "$MAX_ITER" -gt 0 ] && [ "$iteration" -gt "$MAX_ITER" ]; then
    say "reached $MAX_ITER iterations."; status "finished" "reached the iteration limit"; break
  fi
  if [ "$(open_modules)" -eq 0 ]; then
    say "no open modules left."; status "finished" "queue is empty"; break
  fi

  line=$(next_line)
  spec=$(next_module)
  say ""
  say "==================== ITERATION $iteration ===================="
  say ">>> $line"
  say "    file: $spec"
  status "running" "$line"

  [ -n "$spec" ] && [ -f "$spec" ] || fail "module file does not exist: ${spec:-<none>} — from: $line"
  brief=$(parent_brief "$spec")
  [ -z "$brief" ] || [ -f "$brief" ] || fail "parent technical brief does not exist: $brief"

  # Consecutive attempts at THIS module. An unticked module simply comes round again; the counter
  # is what bounds the retries.
  if [ "$spec" = "$attempts_spec" ]; then attempts=$((attempts + 1)); else attempts_spec="$spec"; attempts=1; limit_hits=0; fi

  before_done=$(done_modules)
  log_before=$(wc -c < "$LOG" 2>/dev/null | tr -d ' '); [ -n "$log_before" ] || log_before=0

  prompt_text=$(cat "$PROMPT")
  prompt_text="$prompt_text

CURRENT MODULE: $spec"
  if [ -n "$brief" ]; then
    prompt_text="$prompt_text
REQUIRED PARENT TECHNICAL BRIEF: $brief

The complete parent brief is injected below so it cannot be skipped. Treat it as the cross-module
contract, and still read the same file from disk before acting so you see the current copy.

----- BEGIN REQUIRED PARENT TECHNICAL BRIEF -----
$(cat "$brief")
----- END REQUIRED PARENT TECHNICAL BRIEF -----"
  fi
  if [ "$RESUMING" = "1" ]; then
    prompt_text="$prompt_text

RESUMING AN INTERRUPTED MODULE. A previous run of this module stopped before it finished — a
session limit or an error, not a decision. The repository may already be on the module's branch
with commits and uncommitted edits. Read the branch log and the diff FIRST, continue from where
it stopped, and do not start the module again or revert what is already there."
  fi

  "${AGENT_CMD[@]}" "$prompt_text" 2>&1 | tee -a "$LOG"
  rc=${PIPESTATUS[0]}

  # ---- the agent process died
  if [ "$rc" -ne 0 ]; then
    if session_limit_wait "$log_before"; then
      # A session limit is the account's clock, not a defect: wait for it in every mode.
      limit_hits=$((limit_hits + 1))
      [ "$limit_hits" -le "$LIMIT_RETRIES" ] || fail "$spec hit the session limit $limit_hits times — stopping."
      retry_safe || fail "session limit on iteration $iteration, but the checkout is not in a state a retry can continue."
      resume_at=$(clock_after "$LIMIT_WAIT")
      say ""
      say "session limit ($LIMIT_TEXT) — waiting $((LIMIT_WAIT / 60))m; $spec continues at $resume_at local time."
      status "waiting-limit" "session limit on $spec — $LIMIT_TEXT — continues at $resume_at local time"
      $SLEEP_CMD "$LIMIT_WAIT"
      attempts=$((attempts - 1))      # a limit is not an attempt at the module
      RESUMING=1
      continue
    fi
    if [ "$KEEP_GOING" = "1" ] && [ "$attempts" -le "${#RETRY_WAITS[@]}" ] && retry_safe; then
      wait_s=${RETRY_WAITS[$((attempts - 1))]}
      resume_at=$(clock_after "$wait_s")
      say ""
      say "keep-going: agent exited with code $rc — attempt $attempts at $spec; retrying at $resume_at local time."
      status "retrying" "agent exited with code $rc on $spec (attempt $attempts) — continues at $resume_at local time"
      $SLEEP_CMD "$wait_s"
      RESUMING=1
      continue
    fi
    fail "agent exited with code $rc on iteration $iteration."
  fi

  # ---- the agent finished but ticked nothing
  after_done=$(done_modules)
  if [ "$after_done" -le "$before_done" ]; then
    if waiting_approval; then
      # PROMPT.md 4a–4c make the agent answer its own questions and self-approve, so a wait means
      # one genuinely owner-only question is open. Two waits in a row on the same module means
      # nobody answered it — that is the loop spinning, and it fails loudly.
      stall_file="$LOGDIR/.stalled-on"
      stalled_prev=$(cat "$stall_file" 2>/dev/null || true)
      printf '%s\n' "$spec" > "$stall_file"
      if [ "$stalled_prev" = "$spec" ]; then
        say ""
        say "iteration $iteration stopped on the SAME module's prototype as the previous run."
        say "Read the open question in the Answers section of $QUEUE and settle it."
        status "stalled" "second identical approval-wait on $spec — answer the open question in the Answers section"
        exit 1
      fi
      say "iteration $iteration stopped for prototype approval — one owner-only question is open."
      say "Answer it in the Answers section and write 'Approved: <date>' on the Prototype: line, then run again."
      status "waiting-approval" "one owner-only question on $spec — see the Answers section"
      break
    fi
    if [ "$KEEP_GOING" = "1" ] && [ "$attempts" -lt "$MISS_LIMIT" ] && retry_safe; then
      say ""
      say "keep-going: iteration $iteration ended without a [x] — attempt $attempts of $MISS_LIMIT at $spec; continuing it."
      status "retrying" "$spec was not finished on attempt $attempts of $MISS_LIMIT"
      RESUMING=1
      continue
    fi
    fail "iteration $iteration finished but no module was marked [x] — stopping rather than looping on it."
  fi

  # ---- a module was ticked: the checkout must be back where the next one can start
  for r in "${REPOS[@]}"; do
    [ -z "$(git -C "$r" status --porcelain)" ] || fail "$r left uncommitted changes after iteration $iteration."
    cur=$(git -C "$r" rev-parse --abbrev-ref HEAD)
    [ "$cur" = "$INTEGRATION_BRANCH" ] || fail "$r ended on '$cur' — the branch policy was broken."
  done
  [ "$(protected_snapshot)" = "$PROTECTED_BEFORE" ] || fail "a protected branch moved during the run (${PROTECTED_BRANCHES[*]})."

  rm -f "$LOGDIR/.stalled-on"
  RESUMING=0
  say "--- iteration $iteration ok"
  for r in "${REPOS[@]}"; do say "    $r: $(git -C "$r" log --oneline -1)"; done
  status "running" "iteration $iteration finished cleanly"

  if [ "$MODE" = "review" ]; then
    echo
    echo ">>> Review the diff. Enter — next module, CTRL+C — stop."
    read -r _
  fi
done

say "=== module-loop end $(date '+%F %T')"
