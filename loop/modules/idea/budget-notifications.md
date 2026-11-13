# Budget overrun alerts and notifications (idea, not a module yet)

> **Status (2026-11-13): idea only.** Not a module, not in `loop/modules/progress-modules.md`, does
> not authorise code.
>
> **In short.** Send automated notifications (Telegram bot / email / browser push) the moment a
> transaction causes a category's monthly spending to reach 80% or exceed 100% of its budget limit.

Evidence: Users may not check the dashboard every day and can inadvertently overspend.

Related files: `loop/modules/budgets-master.md`, `backend/src/transactions/transactions.service.ts`.

## Conflicts and dependencies

- Requires user notification preferences and notification delivery channels (Telegram bot / email provider).
- Depends on core Budgets feature being implemented first.
