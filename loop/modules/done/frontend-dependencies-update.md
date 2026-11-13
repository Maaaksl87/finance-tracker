# Frontend: update dependencies and devDependencies to latest compatible versions

Programme: **Dependencies Upgrade**
Module: **2 of 2**
Parent technical brief: `loop/modules/dependencies-upgrade-master.md` — mandatory (§1, §2, §3, §6).

## 1. Task

**Upgrade all frontend `dependencies` and `devDependencies` in `frontend/package.json` and `frontend/package-lock.json` to their latest stable compatible versions (including React 19.3.1, Vite 8.3.8, Tailwind CSS 4.3.5, TanStack React Query 5.107.1, Radix UI primitives, Zustand 5.1.0, Date-fns 4.4.0, Axios 1.21.1, Zod 4.6.7, Prettier 3.10.1, TypeScript-ESLint 8.72.2), verify clean npm resolution with zero peer dependency errors, achieve a green `vite build` production compilation with 0 errors, and verify that the Single Page Application loads and renders the dashboard and budget tracking views without console crashes.**

Branch: `feature/frontend-dependencies-update`
Repository: [frontend]
No prototype: frontend dependencies update only, no UI layout or visual changes.
Depends on: `backend-dependencies-update`.

## 2. Where this came from, and what to read first

Parent technical brief: `loop/modules/dependencies-upgrade-master.md` (§2, §3, §6).
User requirement:
> «Потрібно оновити всі залежності (dependencies та devDependencies) бекенду (NestJS) та фронтенду (React/Vite) до актуальних стабільних версій.
> Важливо: не зламати працездатність, обов'язково перевірити успішність компіляції (`nest build` та `vite build`). Якщо є великі мажорні оновлення (breaking changes), розділити роботу на окремі модулі для бекенду і фронтенду.»

Read first:
- `frontend/package.json` — existing dependencies and scripts;
- `frontend/package-lock.json` — dependency tree and resolved versions;
- `loop/specs/frontend/README.md:6-15` — documented stack versions;
- `loop/specs/frontend/TESTING_STANDARDS.md` — frontend build verification gate;
- `frontend/src/components/data-table/DataTable.tsx` and `frontend/src/components/ui/calendar.tsx` — key components consuming UI table and date libraries.

## 3. Goal

The developer or CI pipeline can run `npm install` and `npm run build` in `frontend/` with zero peer dependency conflicts and zero TypeScript compilation errors. All client pages (Dashboard, Transactions ledger, Budgets, Wallets/Sources, Analytics/Stats) render smoothly without runtime exceptions or broken styling.

## 4. Context — what actually exists today

Verified on `master`, 13 Nov 2026:
- `frontend/package.json:12-70`:
  - `react`: `^19.2.3` (latest: 19.3.1)
  - `react-dom`: `^19.2.3` (latest: 19.3.1)
  - `@tanstack/react-query`: `^5.99.0` (latest: 5.107.1)
  - `@tanstack/react-query-devtools`: `^5.99.0` (latest: 5.107.1)
  - `@tanstack/react-table`: `^8.21.3` (latest v8: 8.21.3; latest v9: 9.3.1)
  - `@tailwindcss/vite`: `^4.1.18` (installed lockfile 4.3.1, latest: 4.3.5)
  - `tailwindcss`: `^4.1.18` (installed lockfile 4.3.1, latest: 4.3.5)
  - `tailwind-merge`: `^3.4.0` (latest: 3.7.0)
  - `zustand`: `^5.0.10` (latest: 5.1.0)
  - `date-fns`: `^4.1.0` (latest: 4.4.0)
  - `axios`: `^1.13.2` (installed lockfile 1.17.0, latest: 1.21.1)
  - `zod`: `^4.3.5` (latest: 4.6.7)
  - `react-hook-form`: `^7.71.1` (latest: 7.92.0)
  - `@hookform/resolvers`: `^5.2.2` (wanted: 5.9.2, latest: 7.0.6)
  - `react-day-picker`: `^9.13.0` (wanted: 9.14.0, latest: 10.0.2)
  - `recharts`: `^3.8.0` (latest: 3.10.1)
  - `sonner`: `^2.0.7` (latest: 2.0.8)
  - `radix-ui`: `^1.4.3` (latest: 1.8.1)
  - `@radix-ui/react-*` primitive packages (all have stable 1.x / 2.x minor updates available)
- `frontend/package.json:71-88`:
  - `vite`: `^8.0.16` (latest: 8.3.8)
  - `@vitejs/plugin-react`: `^6.0.2` (latest: 6.3.0)
  - `eslint`: `^9.39.2` (wanted: 9.39.5, latest: 10.14.0)
  - `eslint-plugin-react-hooks`: `^7.0.1` (latest: 7.1.1)
  - `eslint-plugin-react-refresh`: `^0.4.26` (latest: 0.5.7)
  - `globals`: `^17.0.0` (latest: 17.14.0)
  - `prettier`: `3.8.1` (latest: 3.10.1)
  - `typescript`: `~5.9.3` (latest: 7.0.2; note: `typescript-eslint@8.72.2` peer max is `<6.1.0`)
  - `typescript-eslint`: `^8.53.0` (latest: 8.72.2)
  - `@types/react`: `^19.2.8` (latest: 19.3.0)
  - `@types/react-dom`: `^19.2.3` (latest: 19.3.0)
  - `@types/node`: `^25.0.8` (wanted: 25.9.9)
- `npm run build` runs `vite build` and compiles production bundle to `frontend/dist/` in ~2.15s with 0 errors.

## 5. Scope — what this module does not do

- **It does not touch backend files.** (Covered in Module 1).
- **It does not migrate to `@tanstack/react-table` v9.** v9 is a complete breaking API redesign for table configurations in `frontend/src/components/data-table/DataTable.tsx` and `frontend/src/components/transactions/getTransactionsColumns.tsx`. Migrating to v9 is tracked in `loop/modules/idea/major-framework-upgrades.md`.
- **It does not migrate to `react-day-picker` v10.** v10 introduces breaking CSS imports and API signatures in `frontend/src/components/ui/calendar.tsx` and `frontend/src/components/stats/PeriodFilter.tsx`. Stay on `^9.14.0`.
- **It does not upgrade `typescript` beyond 5.9.x.** (TypeScript 7.0 causes peer dependency conflicts with `typescript-eslint` `<6.1.0`).
- **It does not alter visual styling, colors, layout, or copy.**

## 6. Decisions (fixed for this implementation)

1. **Core React & Build Stack**:
   - `react` and `react-dom`: update to `^19.3.1`.
   - `@types/react` and `@types/react-dom`: update to `^19.3.0`.
   - `vite`: update to `^8.3.8`.
   - `@vitejs/plugin-react`: update to `^6.3.0`.
   - `tailwindcss` and `@tailwindcss/vite`: update to `^4.3.5`.
   - `tailwind-merge`: update to `^3.7.0`.
2. **State & Data Fetching**:
   - `@tanstack/react-query` & `@tanstack/react-query-devtools`: update to `^5.107.1`.
   - `zustand`: update to `^5.1.0`.
   - `axios`: update to `^1.21.1`.
   - `recharts`: update to `^3.10.1`.
   - `date-fns`: update to `^4.4.0`.
   - `zod`: update to `^4.6.7`.
   - `react-hook-form`: update to `^7.92.0`.
   - `@hookform/resolvers`: update to `^5.9.2` (stable Zod v4 resolver).
3. **UI Components & Radix**:
   - Update all `@radix-ui/react-*` components to their latest matching 1.x / 2.x releases.
   - `radix-ui`: update to `^1.8.1`.
   - `sonner`: update to `^2.0.8`.
   - Keep `@tanstack/react-table` on `^8.21.3` (latest v8).
   - Keep `react-day-picker` on `^9.14.0` (latest v9).
4. **Tooling & Linter**:
   - `typescript`: keep at `~5.9.3` to satisfy `typescript-eslint@8.72.2` peer constraint (`>=4.8.4 <6.1.0`).
   - `typescript-eslint`: update to `^8.72.2`.
   - `eslint`: update to `^9.39.5` (ESLint 9 stable stream).
   - `eslint-plugin-react-hooks`: update to `^7.1.1`.
   - `eslint-plugin-react-refresh`: update to `^0.5.7`.
   - `prettier`: update to `3.10.1`.
   - `globals`: update to `^17.14.0`.
   - `@types/node`: update to `^25.9.9`.
5. **Resolution Rule**: Must install cleanly without `--force` or `--legacy-peer-deps`.
6. **Documentation**: Update `loop/specs/frontend/README.md` stack section to reflect updated package versions.

## 7. Data model

No database schema changes. The touched files are:
- `frontend/package.json`
- `frontend/package-lock.json`
- `loop/specs/frontend/README.md`

## 8. API

No API endpoints are touched. Client API request schemas remain unchanged.

## 9. Refusals and copy — every sentence

None. This module introduces no new user-facing messages or copy.

## 10. Screens (prototype-gated)

No prototype: frontend dependencies update only, no UI layout or visual changes.

## 11. Security and isolation tests

- `npm audit --prefix frontend` must not report new critical or high severity vulnerabilities.
- Verification that client routes authenticate and guard sessions properly.

## 12. Process — branch, prototype, gate

1. Branch from `master` as `feature/frontend-dependencies-update`.
2. Update `frontend/package.json` with target versions.
3. Run `npm install` inside `frontend/` to update `package-lock.json` cleanly.
4. Verify gate: `npm run build` (`vite build`) exits with 0 errors.
5. Verify dev server: `npm run dev` boots without console errors, and main pages (Dashboard, Transactions, Budgets) load smoothly.
6. Update `loop/specs/frontend/README.md` stack versions.
7. Commit and push feature branch for PR.

## 13. Acceptance criteria

1. `frontend/package.json` dependencies and devDependencies reflect the updated target versions.
2. `npm install` in `frontend/` succeeds without `--force` or `--legacy-peer-deps`.
3. `npm run build` in `frontend/` compiles with 0 errors and generates `frontend/dist/`.
4. The frontend dev server boots on `http://localhost:5173` without runtime syntax or bundler errors.
5. `loop/specs/frontend/README.md` lists the updated dependency versions.

## 14. Owner actions

None.

## 15. Findings

- Successfully updated frontend runtime dependencies (React to 19.3.1, Vite to 8.3.8, Tailwind CSS to 4.3.5, TanStack React Query to 5.107.1, Radix UI packages to latest 1.x/2.x releases, Zustand to 5.1.0, Date-fns to 4.4.0, Axios to 1.21.1, Zod to 4.6.7, React Hook Form to 7.92.0, Recharts to 3.10.1) and devDependencies (ESLint to 9.39.5, Prettier to 3.10.1, TS-ESLint to 8.72.2, Globals to 17.14.0).
- Clean `npm install` without `--force` or `--legacy-peer-deps`.
- Modernized `alias` path resolution in `frontend/vite.config.ts` using `import.meta.dirname` to eliminate Vite 8 deprecation warnings.
- `npm run build` (`vite build`) successfully compiled in 2.10s with 0 errors.
- Verified frontend dev server startup: Vite boots and initializes client environment smoothly.
- As decided with the owner (Option 1), `@tanstack/react-table` was kept on stable v8 (8.21.3) and `react-day-picker` on stable v9 (9.14.0) to avoid breaking UI components, and TypeScript was kept on ~5.9.3 for `typescript-eslint` compatibility.

