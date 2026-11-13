# Budgets: backend management and monthly calculation API

Programme: **Budgets**
Module: **1 of 2**
Parent technical brief: `loop/modules/budgets-master.md` — mandatory (§3, §5, §6).

## 1. Task

**Implement the backend `BudgetsModule` in NestJS: Mongoose `Budget` schema, CRUD endpoints to create, list, update, and delete category budget limits, and a status aggregation endpoint that returns each budget with its current spent amount, remaining balance, percentage, and warning status for a specified month.**

Branch: `feature/budget-management-backend`
Repository: [backend]
No prototype: backend REST API and calculations only.
Depends on: none.

## 2. Where this came from, and what to read first

Parent technical brief `loop/modules/budgets-master.md` §3, §5, §6.
User requirement: «Потрібно зробити модуль Бюджети (Budgets) — місячний ліміт по категорії, прогрес-бар, попередження».

Read first:

- `backend/src/categories/schemas/categories.schema.ts` — how categories are structured and indexed;
- `backend/src/transactions/transactions.service.ts:287-306` — `getStatsByCategory()` aggregation query pattern;
- `backend/src/transactions/schemas/transaction.schema.ts` — `category` and `type` fields;
- `backend/src/saving-plans/saving-palns.module.ts` — example of a standalone CRUD feature module in this project.

## 3. Goal

An authenticated user can call `POST /budgets` to set a monthly limit of 5,000 UAH for category "Продукти". When calling `GET /budgets/status?month=2026-11`, the backend calculates that the user spent 4,200 UAH on "Продукти" in November 2026, returns `spent: 4200`, `limit: 5000`, `remaining: 800`, `percentage: 84`, and `status: "warning"`.

## 4. Context — what actually exists today

Verified on `master`, 13 Nov 2026:

- `backend/src/categories/schemas/categories.schema.ts:8-25`: categories have `name` (string), `type` ("income" | "expense"), and `userId`.
- `backend/src/transactions/schemas/transaction.schema.ts:16-50`: transactions store `category` as a string, `amount` as a number, and `date` as Date.
- `backend/src/transactions/transactions.service.ts:287-306`: `getStatsByCategory` aggregates spending using `$match: { userId, date: { $gte, $lte }, excludeFromStats: { $ne: true }, type: "expense" }` and `$group: { _id: { type, category }, total: { $sum: "$amount" } }`.
- `backend/src/app.module.ts:17-42`: imports all feature modules; `BudgetsModule` will be added here.
- There is currently no `budgets` directory under `backend/src/`.

## 5. Scope — what this module does not do

- **It does not touch any frontend React files.** (That is Module 2).
- **It does not modify the `Transaction` or `Category` schemas.**
- **It does not send emails or push alerts.** Status is returned via API response.
- **It does not handle rollover of unused budgets to future months.**

## 6. Decisions (fixed for this implementation)

1. **Budget model**: Stored in `budgets` collection. Fields: `userId: ObjectId`, `category: string`, `limit: number`, `currency: string` (default: "UAH").
2. **Uniqueness**: A user cannot have two budgets for the same category. Compound index `{ userId: 1, category: 1 }` with `{ unique: true }`.
3. **Monthly spending query**: Reuses the aggregation logic matching `userId`, `type: "expense"`, `category`, and `date` between the first and last millisecond of the given month.
4. **Status values**:
   - `normal` if `percentage < 80`
   - `warning` if `percentage >= 80 && percentage <= 100`
   - `exceeded` if `percentage > 100`
5. **Month parameter**: Accepts query `month=YYYY-MM` (e.g. `2026-11`). Defaults to current month if omitted.

## 7. Data model

Mongoose schema `Budget` in `backend/src/budgets/schemas/budget.schema.ts`:

- `userId`: `Types.ObjectId` (ref `User`, required, indexed)
- `category`: `string` (required, trim)
- `limit`: `number` (required, min 1)
- `currency`: `string` (default: "UAH")
- `timestamps`: true

## 8. API

All endpoints require `JwtAuthGuard`.

| Method & Path         | Query / Body                                             | Response Status & Body     | Description                                            |
| --------------------- | -------------------------------------------------------- | -------------------------- | ------------------------------------------------------ |
| `POST /budgets`       | `{ category: string, limit: number, currency?: string }` | 201 Created `Budget`       | Create/set budget limit                                |
| `GET /budgets`        | —                                                        | 200 OK `Budget[]`          | List user's budget limits                              |
| `GET /budgets/status` | `?month=YYYY-MM`                                         | 200 OK `BudgetStatusDto[]` | List budgets with spent, remaining, percentage, status |
| `PATCH /budgets/:id`  | `{ limit?: number }`                                     | 200 OK `Budget`            | Update budget limit                                    |
| `DELETE /budgets/:id` | —                                                        | 200 OK `Budget`            | Delete budget limit                                    |

`BudgetStatusDto` shape:

```json
{
  "_id": "...",
  "category": "Продукти",
  "limit": 5000,
  "currency": "UAH",
  "spent": 4200,
  "remaining": 800,
  "percentage": 84,
  "status": "warning"
}
```

## 9. Refusals and copy — every sentence

| Condition                 | Status          | Error Sentence (Ukrainian)                    |
| ------------------------- | --------------- | --------------------------------------------- |
| Duplicate category budget | 409 Conflict    | `Бюджет для цієї категорії вже створено`      |
| Budget not found by ID    | 404 Not Found   | `Бюджет не знайдено`                          |
| Invalid limit (<= 0)      | 400 Bad Request | `Ліміт повинен бути більше нуля`              |
| Invalid month format      | 400 Bad Request | `Невірний формат місяця (очікується YYYY-MM)` |

## 10. Screens (prototype-gated)

None. Backend-only module.

## 11. Security and isolation tests / checks

- A user can never see or modify another user's budgets (`userId` always checked).
- `POST /budgets` with a negative or zero limit is refused with 400.
- Creating a duplicate budget for the same category returns 409 Conflict.
- `GET /budgets/status` calculates spent amounts strictly for the authenticated user and excludes transactions with `excludeFromStats: true`.

## 12. Process — branch, prototype, gate

1. Branch `feature/budget-management-backend` from `master`.
2. Implement schema, DTOs, service, controller, and module.
3. Register `BudgetsModule` in `app.module.ts`.
4. Run green-gate: `npm run build` in `backend/` must complete with 0 errors.

## 13. Acceptance criteria

1. `POST /budgets` creates a budget document in MongoDB with valid `userId`.
2. Setting a duplicate category budget returns 409 with Ukrainian message.
3. `GET /budgets/status?month=YYYY-MM` returns accurate `spent` matching sum of expense transactions in that category for that month.
4. If spent is 85% of limit, `percentage` is 85 and `status` is `"warning"`.
5. If spent is 120% of limit, `percentage` is 120, `status` is `"exceeded"`, and `remaining` is 0 (or negative excess).
6. `npm run build` compiles with 0 errors.

## 14. Owner actions

None.

## 15. Findings

- Created `BudgetsModule` in `backend/src/budgets/` with Mongoose `Budget` schema, compound unique index on `{ userId: 1, category: 1 }`.
- Endpoints implemented:
  - `POST /budgets`: creates new category limit.
  - `GET /budgets`: returns all user's budgets.
  - `GET /budgets/status?month=YYYY-MM`: aggregates expenses for given month and calculates `spent`, `remaining`, `percentage`, and alert `status` (`normal` < 80%, `warning` >= 80%, `exceeded` > 100%).
  - `PATCH /budgets/:id`: updates category limit.
  - `DELETE /budgets/:id`: removes budget.
- For Module 2 (Frontend): `GET /budgets/status` returns an array of objects matching `BudgetStatusResult`. If `month` is omitted, defaults to current month.
- Gate verified: `npm run build` completed with 0 errors.
