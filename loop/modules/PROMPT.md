# PROMPT.md — fed to the agent on every module-loop iteration

You work on this project in a **module loop**. **Your working directory is the workspace root**;
the repositories and `loop/` are under it. Permanent context is `loop/AGENT.md`. This prompt is
the step-by-step for **one module**.

Your queue is `loop/modules/progress-modules.md`. Your spec is the module file named on the first
unfinished line of that queue.

1. **Read `loop/AGENT.md` in full** — the repositories, branching, verification-first, the
   green-gate, conventions, prohibitions. Then read `loop/specs/<repo>/` for the repo the module
   tags, starting with `loop/specs/overview.md` if you need product context.

2. **Open `loop/modules/progress-modules.md` and take the FIRST unfinished `- [ ]` module** under
   `## Queue`. `[owner]` lines are not yours — skip them. The fenced template at the top of that
   file is not work. Inspect the module's header for a
   `Parent technical brief: \`<path>\`` line. When present, read that parent file **in full on
   every iteration**, then read the **module file** in full. The parent is the cross-module
   contract; the child is the bounded deliverable. A child may add detail but may not weaken or
   contradict the parent. Do not re-derive a settled decision and do not wander into a
   neighbouring module.
   If no unfinished module remains — and only then — say the queue is empty and stop.

3. **Branch once** — the name on the module's `Branch:` line — from the integration branch named
   in `loop/AGENT.md`. If the repository is already on that branch, a previous run was
   interrupted: read the branch log and the diff first and continue; do not start again.

4. **If the module changes anything on screen** and its queue line has no `Approved:` date, write
   **one** prototype into `loop/prototypes/<slug>.html` (slug = the branch name without its
   prefix), add the `Prototype:` line under the module in the queue, and add the row to
   `loop/prototypes/index.html`. See **Visual approval** in `loop/AGENT.md`. A module with
   nothing on screen gets a `No prototype: <reason>` line instead and skips to step 5.

   4a. **Then answer your own questions. This is not optional.** Take every question the page
   raises and try to settle it from, in this order: the module file; the parent brief; the
   `## Answers` section of the queue; the shipped code and its tests; `AGENT.md` and the specs.
   Most "questions" are already answered somewhere — a value the code fixed long ago, a
   convention every other screen follows, a case the acceptance criteria decide. **Write each
   answer into `## Answers`** as a dated entry saying what you decided and which source settles
   it, and correct the prototype to match. Then put `Approved: <date> self-approved — <one-line
   reason>` on the `Prototype:` line yourself and **carry straight on to step 5 in the same
   iteration.**

   4b. **Stop only for a question no source can settle** — a genuinely new product decision, a
   change to what a customer pays, an irreversible action, or something the owner has said they
   want to see. Write exactly that question into `## Answers` as an open question addressed to
   the owner: one paragraph, the options, your recommendation. Commit the prototype and the
   queue edit on the module branch, and stop. One question stops the module; everything else is
   still answered before you stop.

   4c. **Never stop twice for the same reason.** Before stopping, read the newest log in
   `loop/modules/.logs/`. If the previous iteration already stopped on this module's prototype
   and nothing has changed since, that is the loop failing, not a gate working: answer what is
   answerable, self-approve, and build.

5. **Implement the whole module.** Follow `loop/AGENT.md`: verification BEFORE code, then code.
   Split the work into commits that read as steps, but stay on one branch: one module = one
   merge. Do not invent features the module file did not ask for.
   **A module may end early:** if it turns out bigger than the file implied, commit what is
   coherent, leave the line `[ ]` with a note saying what you found, and stop. Never mark `[x]`
   for a partial.

6. **Run the full green-gate once** for the repos you touched (`loop/AGENT.md`, **Green-gate**).

7. **Close the module** — only when its acceptance criteria hold and the gate is green:
   - mark the line `[x]` in the queue with a short note: what was done, which gate ran and its
     numbers, and any departure from the module file with the reason;
   - `mv loop/modules/open/<slug>.md loop/modules/done/<slug>.md` and change the path on the
     `[x]` line so it still points at the file;
   - write anything the next module must know under the module file's `## Findings`;
   - commit, merge into the integration branch with `--no-ff`, push only that branch, and confirm
     the branch still boots.

8. **Stop.** One module = one iteration.

Rules: one module at a time and only what its file specifies; read any declared parent brief on
every iteration; **a visible change is prototyped before it is coded, and the prototype's
questions are answered by you unless one is genuinely the owner's to make**; verification before
code; everything lands on the integration branch and never on a protected one; the branch must
still boot after your merge; leave the working tree clean; don't break existing flows.
