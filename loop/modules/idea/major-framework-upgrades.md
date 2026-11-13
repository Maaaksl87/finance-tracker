# Major framework migrations: NestJS 12, TanStack Table v9, React Day Picker v10 (idea, not a module yet)

> **Status (2026-11-13): idea only.** Not a module, not in `loop/modules/progress-modules.md`, does
> not authorise code.
>
> **In short.** Major breaking updates for core architectural dependencies: migrating backend to NestJS 12 (requiring TypeScript >= 6.0 and updated schematics), upgrading frontend data table to `@tanstack/react-table` v9, and updating date picker to `react-day-picker` v10. These require dedicated refactoring of component APIs and type definitions rather than a pure package bump.

Evidence: Investigated during the dependencies audit on 2026-11-13. NestJS 12 has peer dependency constraints requiring TypeScript >= 6.0, which temporarily conflicts with `typescript-eslint@8` (`<6.1.0`). `@tanstack/react-table` v9 and `react-day-picker` v10 introduce breaking API and styling changes affecting `DataTable.tsx`, `getTransactionsColumns.tsx`, and `calendar.tsx`.

Related files:
- `backend/package.json`
- `backend/src/app.module.ts`
- `frontend/package.json`
- `frontend/src/components/data-table/DataTable.tsx`
- `frontend/src/components/transactions/getTransactionsColumns.tsx`
- `frontend/src/components/ui/calendar.tsx`
- `frontend/src/components/stats/PeriodFilter.tsx`

## Owner decisions

| Date | Decision |
| --- | --- |
| 2026-11-13 | Non-breaking dependency upgrades are performed first under the `Dependencies Upgrade` programme. Major breaking migrations are isolated. |

## Proposals to settle in the spec (not decided)

- Migrate backend from NestJS 11 to NestJS 12 once `typescript-eslint` releases full support for TypeScript 6/7 or when an aligned tsconfig configuration is established.
- Refactor `DataTable.tsx` and column definitions to the `@tanstack/react-table` v9 API.
- Migrate `calendar.tsx` and `PeriodFilter.tsx` to the `react-day-picker` v10 API and styling model.

## Conflicts and dependencies

- NestJS 12 schematics require `typescript >= 6.0.0`, while `typescript-eslint@8.72.2` peer requires `typescript < 6.1.0`.
- TanStack Table v9 changes column definition signatures and table state hooks.
- React Day Picker v10 renames CSS classes and changes event handlers.

## Questions for the spec

- Do we want to upgrade to NestJS 12 immediately after NestJS 11 patch upgrades, or wait for minor ecosystem stabilization?
- Should TanStack Table v9 migration be combined with a table UI enhancement module, or done as a pure refactoring module?

