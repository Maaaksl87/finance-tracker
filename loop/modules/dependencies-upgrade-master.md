# Dependencies Upgrade — master technical brief

Status: **approved 2026-11-13**
Owner decisions incorporated: **2026-11-13**
Execution queue: `loop/modules/progress-modules.md`

This is the mandatory parent specification for the two child modules listed in section 9. An agent
must still read the current child file, the repository specs, the current code, and manifests (`package.json`, `package-lock.json`) before making changes.

## 1. Precedence and change control

Use these sources in this order:

1. owner decisions in this document;
2. this programme's stability, compatibility, and build verification rules (section 6);
3. the selected child module, for its bounded deliverable;
4. current repository specs and code, for facts about the implementation.

The child may add detail but may not weaken this document. If package peer dependencies conflict or contradict this brief, do not improvise broad workarounds or use `--force`/`--legacy-peer-deps` without recorded justification: record the finding and stop on the one genuine owner decision. Never pull a later child into the current one because the final state is described here.

## 2. Objective

Upgrade all `dependencies` and `devDependencies` across both `backend` (NestJS) and `frontend` (React/Vite) to their latest stable compatible versions, ensuring 100% build health (`nest build` and `vite build` with 0 errors), zero regression in runtime capabilities (authentication, database transactions, wallet balances, UI charts, and dialogs), and clean dependency resolution without peer dependency conflicts.

## 3. Fixed owner decisions

| # | Decision | Date |
| --- | --- | --- |
| 1 | Work is split into two independent modules: server side (`backend`) first, client side (`frontend`) second. | 2026-11-13 |
| 2 | Compilations must succeed with 0 errors (`nest build` and `vite build`). | 2026-11-13 |
| 3 | Upgrades must prioritize stability and compatibility: dependencies with breaking API changes or peer dependency blocks (NestJS 12 requiring TypeScript >= 6 vs `typescript-eslint` capping at < 6.1.0, TanStack Table v9 rewrite, React Day Picker v10 rewrite) are updated to the highest stable release in their current active compatible major line, deferring disruptive rewrites to dedicated migration modules. | 2026-11-13 |
| 4 | No changes to business logic or UI strings during dependency upgrades. | 2026-11-13 |

## 4. Scope and explicit non-goals

- **In**:
  - Backend: Updating `package.json` and `package-lock.json` for NestJS 11 latest patches (`11.2.10`), Mongoose (`9.12.1`), `bybit-api` (`4.8.5`), `class-validator` (`0.14.4`), ESLint (`9.39.5`), Jest (`30.5.2`), Prettier (`3.10.1`), `typescript-eslint` (`8.72.2`), and all other safe dev/runtime dependencies.
  - Frontend: Updating `package.json` and `package-lock.json` for React (`19.3.1`), Vite (`8.3.8`), Tailwind CSS (`4.3.5`), TanStack Query (`5.107.1`), Radix UI primitives (`1.x`/`2.x`), Zustand (`5.1.0`), Date-fns (`4.4.0`), Axios (`1.21.1`), Zod (`4.6.7`), Lucide React, and build tooling.
  - Updating repo documentation (`specs/backend/README.md`, `specs/frontend/README.md`) to reflect updated version numbers.
- **Out (deferred to idea backlog / dedicated follow-ups)**:
  - NestJS 11 -> 12 major framework migration (requires TypeScript 6/7 coordination and potential architectural changes).
  - TanStack Table v8 -> v9 API refactoring in `DataTable.tsx` and `getTransactionsColumns.tsx`.
  - React Day Picker v9 -> v10 migration in `calendar.tsx` and `PeriodFilter.tsx`.
  - Product feature enhancements or UI restyling.

## 5. Shared data model

No MongoDB schemas or database documents are altered.
The shared artifacts are:
- `backend/package.json` and `backend/package-lock.json` (owned by Module 1)
- `frontend/package.json` and `frontend/package-lock.json` (owned by Module 2)

## 6. Shared rules

- **Strict Build Verification**:
  - `backend`: `npm run build` (`nest build`) must exit with 0 errors.
  - `frontend`: `npm run build` (`vite build`) must exit with 0 errors.
- **No Peer Dependency Overrides**: Commands must run cleanly without `--force` or `--legacy-peer-deps`. All peer dependencies must resolve naturally.
- **Zero Runtime Regressions**:
  - Backend must boot (`npm run start:dev` or `node dist/main`) and connect to MongoDB without schema or DI crashes.
  - Frontend must boot (`npm run dev`) and render the dashboard without console errors or component mounting failures.
- **TypeScript Alignment**: TypeScript must remain on the latest version supported by both `typescript-eslint` and the build tools (`5.9.3` or compatible `5.x`).

## 7. Migration and release boundary

- Module 1 (`backend-dependencies-update`) can be verified, reviewed, and merged into `master` independently of Module 2.
- Module 2 (`frontend-dependencies-update`) can be merged after Module 1.
- No database migrations or irreversible storage transformations are introduced.

## 8. Programme-wide acceptance

1. All packages in `backend/package.json` are upgraded to their latest stable compatible versions without peer dependency conflicts.
2. `npm run build` in `backend` succeeds with 0 errors.
3. Backend service boots cleanly.
4. All packages in `frontend/package.json` are upgraded to their latest stable compatible versions without peer dependency conflicts.
5. `npm run build` in `frontend` succeeds with 0 errors.
6. Frontend development server builds and renders all main views (Dashboard, Transactions, Budgets, Sources, Stats) without runtime errors.
7. Relevant stack documentation in `loop/specs/` is synchronized with the new versions.

## 9. Ordered child modules

| # | Module file | Repo | Delivers | Depends on | Prototype |
| --- | --- | --- | --- | --- | --- |
| 1 | `loop/modules/open/backend-dependencies-update.md` | [backend] | Updated backend dependencies, refreshed lockfile, clean `nest build` | — | No |
| 2 | `loop/modules/open/frontend-dependencies-update.md` | [frontend] | Updated frontend dependencies, refreshed lockfile, clean `vite build` | 1 | No |

## 10. Required external inputs before launch

None. All packages are retrieved from the public npm registry.

