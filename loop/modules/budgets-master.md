# Budgets — master technical brief

Status: **approved 2026-11-13**
Owner decisions incorporated: **2026-11-13**
Execution queue: `loop/modules/progress-modules.md`

This is the mandatory parent specification for the two child modules in section 9. The module
runner injects this document into every child iteration. An agent must still read the current
child file, the repository specs, the current code, and schemas.

## 1. Precedence and change control

1. owner decisions in this document;
2. this programme's security, isolation, and user experience rules (section 6);
3. the selected child module, for its bounded deliverable;
4. current specs and code, for facts about the implementation.

A child may add detail but may not weaken this document. Never pull a later child into the
current one.

## 2. Objective

Provide a complete monthly budgeting capability: users can assign monthly spending limits to
specific expense categories, see live progress bars of spent versus limit for the selected month,
and receive clear visual warnings when spending approaches or exceeds the budget limit (warning at >= 80%, alert at > 100%).

## 3. Fixed owner decisions

| #   | Decision                                                                                                        | Date       |
| --- | --------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | Budgets apply to expense categories only (`type: "expense"`).                                                   | 2026-11-13 |
| 2   | A budget is a recurring monthly limit for a category (applies to each calendar month automatically).            | 2026-11-13 |
| 3   | Thresholds: Normal (<80%, primary/green), Warning (80%–100%, amber/warning), Exceeded (>100%, red/destructive). | 2026-11-13 |
| 4   | Base currency for budget limits is UAH (Ukrainian Hryvnia), aligned with the main dashboard calculations.       | 2026-11-13 |
| 5   | A dedicated `/budgets` page accessible from the sidebar navigation.                                             | 2026-11-13 |

## 4. Scope and explicit non-goals

- **In**: Category limit CRUD, monthly spending vs limit calculation API, dedicated Budgets page with month switcher, progress bars, percentage badges, warning banners for exceeded budgets.
- **Out for this version**: Push/email notifications for budget overruns, automated budget suggestions based on history, subcategory-level budgets, rollover of unspent budget to next month.

## 5. Shared data model

| Collection | Schema / Purpose                                                                                                    | Introduced by |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| `budgets`  | `userId` (ref User), `category` (string, unique per user), `limit` (number > 0), `currency` (string, default "UAH") | Module 1      |

Indexes: `{ userId: 1, category: 1 }` (unique). One active budget limit per category per user.

## 6. Shared rules

- **User Isolation**: All budget queries and mutations MUST be filtered by authenticated `userId`.
- **Spending Calculation**: Spent amount for category $C$ in month $M$ equals the sum of `amount` in `Transaction` where `userId = user`, `type = "expense"`, `category = C`, `excludeFromStats != true`, and `date` is within the start and end of month $M$ (in UTC / user timezone).
- **Language**: All UI strings, statuses, toasts, and dialogs MUST be in Ukrainian.
- **Status Calculation**:
  - `percentage = (spent / limit) * 100`
  - `status`:
    - `normal`: `percentage < 80`
    - `warning`: `percentage >= 80 && percentage <= 100`
    - `exceeded`: `percentage > 100`

## 7. Migration and release boundary

- Module 1 (`budget-management-backend`) delivers the REST API and calculation service. Can be shipped independently.
- Module 2 (`budget-tracking-ui`) delivers the HTML prototype, React components, and navigation. Depends on Module 1.

## 8. Programme-wide acceptance

1. User can set a monthly limit for any expense category.
2. User cannot set a duplicate budget for the same category (conflict is handled gracefully).
3. The spent amount accurately reflects total expenses for the selected month in that category.
4. Progress bar and percentage update in real time when transactions are added or modified.
5. Categories with spent >= 80% show amber warning; categories > 100% show red exceeded warning with excess amount.
6. Navigation link in sidebar opens `/budgets` with month navigation.

## 9. Ordered child modules

| #   | Module file                                      | Repo       | Delivers                                                                 | Depends on | Prototype            |
| --- | ------------------------------------------------ | ---------- | ------------------------------------------------------------------------ | ---------- | -------------------- |
| 1   | `loop/modules/open/budget-management-backend.md` | [backend]  | `Budget` schema, CRUD endpoints, monthly calculation service             | —          | No                   |
| 2   | `loop/modules/open/budget-tracking-ui.md`        | [frontend] | Prototype, `/budgets` page, progress bars, warning dialogs, sidebar link | 1          | Yes (`budgets.html`) |

## 10. Required external inputs before launch

None. All dependencies and UI primitives already exist in the codebase.
