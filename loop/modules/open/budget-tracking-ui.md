# Budgets: frontend UI, progress bars, and warnings

Programme: **Budgets**
Module: **2 of 2**
Parent technical brief: `loop/modules/budgets-master.md` — mandatory (§3, §5, §6).

## 1. Task

**Implement the user interface for monthly budgets: create an HTML prototype `loop/prototypes/budgets.html` showing normal, warning (>=80%), and exceeded (>100%) states; implement `/budgets` page with month switcher, budget cards with styled progress bars, remaining balance, percentage badges, warning banners, and create/edit/delete budget dialogs; enable the sidebar navigation link.**

Branch: `feature/budget-tracking-ui`
Repository: [frontend]
Prototype required before code: `loop/prototypes/budgets.html` — month view, budget card states (normal, warning, exceeded), create budget dialog.
Depends on: `budget-management-backend` (Module 1).

## 2. Where this came from, and what to read first

Parent technical brief `loop/modules/budgets-master.md` §3, §5, §6.
User requirement: «Потрібно зробити модуль Бюджети (Budgets) — місячний ліміт по категорії, прогрес-бар, попередження».

Read first:

- `loop/prototypes/_template.html` — design tokens and layout scaffold;
- `frontend/src/components/app-sidebar.tsx:40-44` — commented `/budgets` sidebar link;
- `frontend/src/components/stats/CategoryStatsCard.tsx` — month switching pattern (`ChevronLeft`/`ChevronRight`) and category color helpers;
- `frontend/src/components/ui/progress.tsx` — Radix UI progress bar component;
- `frontend/src/hooks/useCategories.ts` — fetching expense categories for the budget creation selector.

## 3. Goal

The user navigates to **Бюджети** in the sidebar. They see a month switcher (e.g. «Листопад 2026») and a button **+ Встановити бюджет**.
Each category with a budget is rendered as a clean card:

- Category name and colored badge/icon.
- Spent vs Limit (e.g., `8 400 ₴ / 10 000 ₴`).
- A progress bar showing 84%.
- When between 80% and 100%: progress bar turns amber and an alert badge says «Залишилось 1 600 ₴ (84%)».
- When exceeding 100%: progress bar turns red, badge says «Перевищено на 500 ₴!».
- Actions to edit the limit or delete the budget.

## 4. Context — what actually exists today

Verified on `master`, 13 Nov 2026:

- `frontend/src/components/app-sidebar.tsx:40-44` already has a commented-out `{ title: "Бюджети", url: "/budgets", icon: ... }`.
- `frontend/src/components/ui/progress.tsx` exists and uses `@radix-ui/react-progress`.
- `frontend/src/components/utils/numberUtils.ts` has `formatCurrency()`.
- `frontend/src/lib/categoryColor.ts` has `getCategoryHex()` for consistent category coloring.
- `frontend/src/App.tsx:28-54` has authenticated layout routes; `/budgets` route needs to be registered.

## 5. Scope — what this module does not do

- **It does not touch backend code.** (Relies on Module 1 API).
- **It does not support income categories.** (Only expense categories can have budgets).
- **It does not implement push notifications or email alerts.** (Warnings are strictly visual in UI).

## 6. Decisions (fixed for this implementation)

1. **Dedicated page**: Located at `/budgets`, rendered inside `Layout`.
2. **Visual thresholds**:
   - `progress < 80%`: Progress indicator colored in theme primary (`#7d9542`).
   - `80% <= progress <= 100%`: Indicator turns amber (`#f59e0b`), displays warning badge.
   - `progress > 100%`: Indicator clamped at 100% visual width with destructive red color (`#ef4444`), displays red alert badge with exact exceeded amount.
3. **Category selection**: When creating a budget, the select dropdown lists only categories with `type === "expense"`, filtering out categories that already have a budget set.
4. **Overall summary bar**: At the top of `/budgets`, show total budgeted amount, total spent across all budgeted categories, and overall remaining budget.

## 7. Data model (Frontend types)

```typescript
export interface BudgetStatus {
  _id: string;
  category: string;
  limit: number;
  currency: string;
  spent: number;
  remaining: number;
  percentage: number;
  status: "normal" | "warning" | "exceeded";
}
```

## 8. API consumption

- `GET /budgets/status?month=YYYY-MM` via `useQuery({ queryKey: ["budgets", "status", month] })`
- `POST /budgets` via `useMutation`
- `PATCH /budgets/:id` via `useMutation`
- `DELETE /budgets/:id` via `useMutation`

## 9. Refusals and copy — every sentence

| Element                   | Ukrainian Text                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Page title                | `Бюджети`                                                                                                             |
| Add budget button         | `+ Встановити бюджет`                                                                                                 |
| Empty state               | `У вас ще немає встановлених бюджетів на цей місяць. Натисніть «Встановити бюджет», щоб почати контролювати витрати.` |
| Overall summary           | `Загальний бюджет`                                                                                                    |
| Spent of limit            | `{spent} із {limit}`                                                                                                  |
| Remaining label           | `Залишок: {amount}`                                                                                                   |
| Exceeded warning          | `Перевищено на {amount}!`                                                                                             |
| Approaching limit warning | `Використано {percent}% ліміту`                                                                                       |
| Dialog title (create)     | `Встановити бюджет категорії`                                                                                         |
| Dialog title (edit)       | `Змінити ліміт бюджету`                                                                                               |
| Category input label      | `Категорія витрат`                                                                                                    |
| Limit input label         | `Місячний ліміт (₴)`                                                                                                  |
| Save button               | `Зберегти бюджет`                                                                                                     |
| Delete confirmation       | `Видалити бюджет для категорії «{category}»?`                                                                         |
| Toast success created     | `Бюджет успішно встановлено`                                                                                          |
| Toast success updated     | `Ліміт бюджету оновлено`                                                                                              |
| Toast success deleted     | `Бюджет видалено`                                                                                                     |

## 10. Screens (prototype-gated)

HTML Prototype in `loop/prototypes/budgets.html`:

1. **Now**: Empty state or no budgets page.
2. **Proposal**: Full `/budgets` view with:
   - Month navigation header.
   - Summary card (Total Budget vs Total Spent).
   - Grid of budget cards showcasing all three states:
     - Normal state (e.g. "Транспорт": 1 200 / 3 000 ₴, 40%, green bar).
     - Warning state (e.g. "Кафе та ресторани": 4 100 / 5 000 ₴, 82%, amber bar).
     - Exceeded state (e.g. "Продукти": 11 200 / 10 000 ₴, 112%, red bar with "Перевищено на 1 200 ₴!").
   - "Встановити бюджет" dialog form preview.

## 11. Security and isolation tests / checks

- Form validation prevents negative or zero limit inputs.
- Only expense categories can be selected.
- All amounts formatted via `formatCurrency()`.

## 12. Process — branch, prototype, gate

1. Branch `feature/budget-tracking-ui` from `master`.
2. Write `loop/prototypes/budgets.html`, link in `loop/prototypes/index.html`.
3. Settle prototype questions and obtain approval.
4. Implement `useBudgets.ts`, `BudgetsPage.tsx`, dialogs, and cards.
5. Register `/budgets` route in `App.tsx` and enable item in `app-sidebar.tsx`.
6. Run green-gate: `npm run build` in `frontend/` must complete with 0 errors.

## 13. Acceptance criteria

1. Prototype `loop/prototypes/budgets.html` is approved and demonstrates normal, warning, and exceeded states.
2. Navigating to `/budgets` displays user's monthly budgets with active month selector.
3. Progress bar dynamically changes color: primary (<80%), amber (80-100%), red (>100%).
4. Exceeded card clearly displays warning badge and the exact exceeded amount.
5. User can create, edit limit, and delete a category budget; changes update UI immediately via React Query cache invalidation.
6. `npm run build` passes with 0 errors.

## 14. Owner actions

Review and approve visual prototype `loop/prototypes/budgets.html`.

## 15. Findings

<!-- Filled in by the agent when it closes the module. -->
