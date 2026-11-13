# progress-modules.md — the module-loop backlog

> The agent takes the **FIRST unfinished `- [ ]` module** under `## Queue` each iteration, reads
> that module file **in full**, then implements it as one unit. When the module's acceptance
> criteria hold, it marks the line `[x]` with a short note, runs the gate, merges, and stops.
>
> `[owner]` modules sit in the list on purpose: no agent can do them, so nothing picks them up.
> The fenced block below is the **template, not work** — skip it.

This file is the queue for `loop/modules/module-loop.sh`.

**How to add a module.** Write the spec as a markdown file in `loop/modules/open/` (use
`loop/modules/_templates/module.md`), then append a line under `## Queue`. The path is relative
to the workspace root and is written in backticks. Order in this file is the order of work.

```markdown
- [ ] **[backend]** `loop/modules/open/EXAMPLE ONLY-short-slug.md`
      Short imperative title of the module.
      Branch: `feature/short-slug`
```

**What a module is.** One feature, one file, one iteration, one merge. The file is the spec —
the agent plans the commits inside the iteration. Cap it at one repo unless the two ends are a
single agreement (`[both]`).

**Tag the repo** — `[backend]`, `[frontend]`, `[both]`, or `[owner]`
for something only a person can do (buy a domain, rotate a key, sign a contract).

**Anything visible is prototyped first.** If the module changes a screen, the agent writes
`loop/prototypes/<slug>.html` and adds a `Prototype:` line under the module here. It answers every
question from the module, the code and the specs, writes `Approved: <date> self-approved` on that
line and continues in the same iteration; it stops only for a genuinely new owner decision
(`PROMPT.md` step 4b). The owner approves by writing `Approved: <date>` on the `Prototype:` line.
A module with nothing on screen uses `No prototype: <reason>` so the runner does not mistake it
for a pending approval.

**Lines the runner reads** (keep their spelling):

| Line | Meaning |
| --- | --- |
| `- [ ] **[tag]** \`path.md\`` | an open module; the first one is the next iteration |
| `- [x] ...` | a finished module, with its note |
| `Branch: \`feature/slug\`` | the branch this module lands on; also used to resume an interrupted run |
| `Prototype: \`loop/prototypes/slug.html\`` | a prototype exists; without `Approved: <date>` on the same line the runner stops and waits |
| `No prototype: reason` | nothing on screen, no visual gate |

---

## Queue

- [x] **[backend]** `loop/modules/done/budget-management-backend.md`
      Branch: `feature/budget-management-backend`
      Done 2026-11-13. Implemented BudgetsModule in NestJS (Budget Mongoose schema, unique index on userId+category, DTOs with validation, CRUD endpoints, and monthly spending status aggregation with normal/warning/exceeded thresholds).
      Gate: nest build passed (0 errors).

- [x] **[frontend]** `loop/modules/done/budget-tracking-ui.md`
      Branch: `feature/budget-tracking-ui`
      Prototype: `loop/prototypes/budgets.html` — Approved: 2026-11-13
      Done 2026-11-13. Implemented BudgetsPage, BudgetCard with dynamic progress bars (<80% primary, 80-100% amber warning, >100% red exceeded), CreateBudgetDialog, EditBudgetDialog, useBudgets hook, enabled sidebar link and /budgets route. All user edits applied (clean typography, no icons, light & dark theme compatibility).
      Gate: vite build passed (3.31s, 0 errors).

- [x] **[backend]** `loop/modules/done/backend-dependencies-update.md`
      Branch: `feature/backend-dependencies-update`
      Done 2026-11-13. Updated backend dependencies and devDependencies (NestJS 11.2.10, Mongoose 9.12.1, Bybit-API 4.8.5, Class-Validator 0.14.4, Nest CLI 11.0.24, Jest 30.5.2, Prettier 3.10.1, TS-ESLint 8.72.2). Verified clean bootstrap and 0 DI errors.
      Gate: nest build passed (0 errors).

- [ ] **[frontend]** `loop/modules/open/frontend-dependencies-update.md`
      Update frontend dependencies and devDependencies to latest compatible stable versions.
      Branch: `feature/frontend-dependencies-update`
      No prototype: frontend dependencies update only, no UI layout or visual changes.

## Answers

### 2026-11-13 — budgets: category limits and warning threshold

**Decided:** Budget limits are set individually per expense category by the user. Budgets are recurring monthly limits. Warning threshold is 80% (approaching limit), >100% is exceeded.
**Source:** Owner decision, 2026-11-13.

The agent asks its questions here and the answers are written back here, newest last. An answer
written here binds as hard as the module file. Do not re-ask a question that already has one.

Entry shape:

```markdown
### YYYY-MM-DD — <module slug>: <the question in a few words>

**Decided:** <what was decided>.
**Source:** <module §N · parent brief §N · path/to/file:line · AGENT.md section · owner, date>.
```

An open question for the owner uses the same shape with `**OPEN — owner:**` instead of
`**Decided:**`, followed by the options and the agent's recommendation.

### 2026-11-13 — dependencies-upgrade: strategy for major framework breaking changes (NestJS 12, Table v9, DayPicker v10, TypeScript 7)

**Decided:** Option 1 selected. Two-stage approach: in modules 1 & 2 (`backend-dependencies-update` and `frontend-dependencies-update`), upgrade all backend and frontend packages to the latest stable, fully compatible versions without breaking changes (NestJS 11.2.10, Mongoose 9.12.1, React 19.3.1, Vite 8.3.8, Tailwind 4.3.5, TanStack Query 5.107.1, etc.), keeping TypeScript at 5.9.3 to avoid toolchain peer dependency conflicts with `typescript-eslint`. Major migrations requiring code rewrites and peer dependency workarounds (NestJS 12, Table v9, DayPicker v10) are scheduled as separate subsequent dedicated feature modules.
**Source:** Owner decision, 2026-11-13.
