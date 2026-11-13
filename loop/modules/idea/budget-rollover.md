# Budget rollover to next month (idea, not a module yet)

> **Status (2026-11-13): idea only.** Not a module, not in `loop/modules/progress-modules.md`, does
> not authorise code.
>
> **In short.** If a user spends less than their monthly budget limit in a given category, allow
> the remaining balance to roll over and increase the budget limit for the subsequent month.

Evidence: Common personal finance pattern (e.g. envelope budgeting / YNAB methodology).

Related files: `loop/modules/budgets-master.md`, `backend/src/budgets/`.

## Proposals to settle in the spec (not decided)

- Option to toggle "Rollover" per category.
- Cap on maximum accumulated rollover.

## Conflicts and dependencies

- Depends on core Budgets feature being implemented first.
