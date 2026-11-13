# Backend: update dependencies and devDependencies to latest compatible versions

Programme: **Dependencies Upgrade**
Module: **1 of 2**
Parent technical brief: `loop/modules/dependencies-upgrade-master.md` — mandatory (§1, §2, §3, §6).

## 1. Task

**Upgrade all backend `dependencies` and `devDependencies` in `backend/package.json` and `backend/package-lock.json` to their latest stable compatible versions (including NestJS 11 latest releases `@nestjs/*` 11.2.10, Mongoose 9.12.1, Bybit-API 4.8.5, Class-Validator 0.14.4, ESLint 9.39.5, Jest 30.5.2, Prettier 3.10.1, TypeScript-ESLint 8.72.2), verify clean npm resolution with zero peer dependency errors, achieve a green `nest build` compilation with 0 errors, and ensure the NestJS service boots without runtime exceptions.**

Branch: `feature/backend-dependencies-update`
Repository: [backend]
No prototype: backend dependencies update only, no UI screens.
Depends on: none.

## 2. Where this came from, and what to read first

Parent technical brief: `loop/modules/dependencies-upgrade-master.md` (§2, §3, §6).
User requirement:
> «Потрібно оновити всі залежності (dependencies та devDependencies) бекенду (NestJS) та фронтенду (React/Vite) до актуальних стабільних версій.
> Важливо: не зламати працездатність, обов'язково перевірити успішність компіляції (`nest build` та `vite build`). Якщо є великі мажорні оновлення (breaking changes), розділити роботу на окремі модулі для бекенду і фронтенду.»

Read first:
- `backend/package.json` — existing dependencies and scripts;
- `backend/package-lock.json` — dependency tree and resolved versions;
- `loop/specs/backend/README.md:6-15` — documented stack versions;
- `loop/specs/backend/TESTING_STANDARDS.md:34-41` — backend build verification gate.

## 3. Goal

The developer or CI pipeline can run `npm install` and `npm run build` in `backend/` with zero peer dependency warnings or resolution conflicts and zero TypeScript compilation errors. All backend features (authentication, wallet balance adjustments, transactions, budgets, scheduled Bybit sync, exchange rates) continue to operate with the updated runtime and toolchain packages.

## 4. Context — what actually exists today

Verified on `master`, 13 Nov 2026:
- `backend/package.json:22-43`:
  - `@nestjs/common`: `^11.1.11` (installed lockfile 11.1.27; latest v11: 11.2.10, latest v12: 12.5.0)
  - `@nestjs/config`: `^4.0.2` (installed lockfile 4.0.4)
  - `@nestjs/core`: `^11.1.11` (installed lockfile 11.1.27; latest v11: 11.2.10, latest v12: 12.5.0)
  - `@nestjs/jwt`: `^11.0.2`
  - `@nestjs/mapped-types`: `*` (installed lockfile 2.1.0)
  - `@nestjs/mongoose`: `^11.0.4`
  - `@nestjs/passport`: `^11.0.5`
  - `@nestjs/platform-express`: `^11.1.11` (installed lockfile 11.1.27; latest v11: 11.2.10)
  - `@nestjs/schedule`: `^6.1.3`
  - `@types/passport-jwt`: `^4.0.1` (latest)
  - `bcrypt`: `^6.0.0` (latest)
  - `bybit-api`: `^4.6.4` (latest: 4.8.5)
  - `class-transformer`: `^0.5.1` (latest)
  - `class-validator`: `^0.14.3` (wanted: 0.14.4, latest: 0.15.1)
  - `mongoose`: `^9.1.5` (latest: 9.12.1)
  - `passport`: `^0.7.0` (latest)
  - `passport-jwt`: `^4.0.1` (latest)
  - `passport-local`: `^1.0.0` (latest)
  - `reflect-metadata`: `^0.2.2` (latest)
  - `rxjs`: `^7.8.2` (latest)
- `backend/package.json:44-71`:
  - `@eslint/eslintrc`: `^3.3.3` (latest: 3.3.7)
  - `@eslint/js`: `^9.39.2` (wanted: 9.39.5, latest: 10.0.1)
  - `@nestjs/cli`: `^11.0.14` (installed lockfile 11.0.21, wanted: 11.0.24)
  - `@nestjs/schematics`: `^11.0.9` (installed lockfile 11.1.0)
  - `@nestjs/testing`: `^11.1.11` (installed lockfile 11.1.27, wanted: 11.2.10)
  - `@types/node`: `^25.0.8` (wanted: 25.9.9)
  - `@types/supertest`: `^6.0.3` (latest: 7.2.1)
  - `eslint`: `^9.39.2` (wanted: 9.39.5, latest: 10.14.0)
  - `eslint-config-prettier`: `^10.1.8` (latest)
  - `eslint-plugin-prettier`: `^5.5.5` (latest: 5.5.7)
  - `globals`: `^17.0.0` (latest: 17.14.0)
  - `jest`: `^30.2.0` (latest: 30.5.2)
  - `prettier`: `^3.8.0` (latest: 3.10.1)
  - `supertest`: `^7.2.2` (latest: 7.3.2)
  - `ts-jest`: `^29.4.6` (latest: 29.4.15)
  - `ts-loader`: `^9.5.4` (latest: 9.6.2)
  - `typescript`: `^5.9.3`
  - `typescript-eslint`: `^8.53.0` (latest: 8.72.2; requires `typescript: '>=4.8.4 <6.1.0'`)
- `npm run build` runs `nest build` and compiles to `dist/` cleanly with 0 errors.

## 5. Scope — what this module does not do

- **It does not touch frontend files.** (That is Module 2 `frontend-dependencies-update`).
- **It does not migrate to NestJS 12.** NestJS 12 requires TypeScript >= 6.0 while current `typescript-eslint@8` enforces `typescript < 6.1.0`, producing `ERESOLVE` peer dependency failures. NestJS 12 migration is tracked in `loop/modules/idea/major-framework-upgrades.md`.
- **It does not upgrade `typescript` beyond 5.9.x.** TypeScript 7.0 is incompatible with `typescript-eslint@8.72.2` peer dependency range `<6.1.0`.
- **It does not modify backend application logic, DTOs, controllers, or database schemas.**
- **It does not introduce breaking API changes.**

## 6. Decisions (fixed for this implementation)

1. **NestJS 11 LTS Maintenance Line**: Upgrade `@nestjs/*` to latest compatible NestJS 11 releases (`11.2.10` for common, core, platform-express, testing; `11.0.24` for cli; `11.1.0` for schematics; `11.0.5` for passport; `11.0.4` for mongoose; `11.0.2` for jwt; `6.1.3` for schedule).
2. **Database & Vendor Libraries**:
   - `mongoose`: update to `^9.12.1`.
   - `bybit-api`: update to `^4.8.5`.
   - `class-validator`: update to `^0.14.4`.
3. **Tooling & Linter Alignment**:
   - `typescript`: keep at `^5.9.3` to satisfy `typescript-eslint@8.72.2` peer constraint (`>=4.8.4 <6.1.0`).
   - `typescript-eslint`: update to `^8.72.2`.
   - `eslint`: update to `^9.39.5` (ESLint 9 stable stream) to avoid breaking plugin rules.
   - `prettier`: update to `^3.10.1`.
   - `jest`: update to `^30.5.2`, `ts-jest` to `^29.4.15`.
   - `supertest`: update to `^7.3.2`.
   - `globals`: update to `^17.14.0`.
   - `@types/node`: update to `^25.9.9`.
4. **Resolution Rule**: Must install cleanly without `--force` or `--legacy-peer-deps`.
5. **Documentation**: Update `loop/specs/backend/README.md` stack section to reflect updated package versions.

## 7. Data model

No database schema changes. The touched files are:
- `backend/package.json`
- `backend/package-lock.json`
- `loop/specs/backend/README.md`

## 8. API

No API endpoints are added or modified. All existing REST endpoints (`/auth`, `/sources`, `/transactions`, `/budgets`, `/categories`, `/saving-plans`, `/currencies`, `/integrations`) retain identical signatures and contracts.

## 9. Refusals and copy — every sentence

None. This module introduces no new user-facing messages or copy.

## 10. Screens (prototype-gated)

No prototype: backend dependencies update only, no UI screens.

## 11. Security and isolation tests

- `npm audit --prefix backend` must not report new critical or high severity vulnerabilities.
- User isolation and authentication guards in NestJS remain intact.

## 12. Process — branch, prototype, gate

1. Branch from `master` as `feature/backend-dependencies-update`.
2. Update `backend/package.json` with target versions.
3. Run `npm install` inside `backend/` to update `package-lock.json` cleanly.
4. Verify gate: `npm run build` (`nest build`) exits with 0 errors.
5. Verify application boots: `node dist/main` or `npm run start:dev` initializes modules without dependency injection failures.
6. Update `loop/specs/backend/README.md` stack versions.
7. Commit and push feature branch for PR.

## 13. Acceptance criteria

1. `backend/package.json` dependencies and devDependencies reflect the updated target versions.
2. `npm install` in `backend/` succeeds without `--force` or `--legacy-peer-deps`.
3. `npm run build` in `backend/` compiles with 0 errors and generates `backend/dist/`.
4. The backend server starts and boots the NestJS application context without runtime errors.
5. `loop/specs/backend/README.md` lists the updated dependency versions.

## 14. Owner actions

None.

## 15. Findings

- Successfully updated backend runtime dependencies (NestJS to 11.2.10, Mongoose to 9.12.1, Bybit-API to 4.8.5, Class-Validator to 0.14.4) and devDependencies (Nest CLI to 11.0.24, Jest to 30.5.2, Prettier to 3.10.1, TS-ESLint to 8.72.2).
- Clean `npm install` without `--force` or `--legacy-peer-deps`.
- `npm run build` (`nest build`) passes cleanly with 0 compilation errors.
- Verified backend boot: NestJS initializes all modules (Mongoose, Passport, Config, Discovery, Currencies, Schedule, Jwt) cleanly without dependency injection errors.
- Confirmed that TypeScript 5.9.3 must be retained because `typescript-eslint@8.72.2` enforces `<6.1.0`. NestJS 12 migration remains tracked in `major-framework-upgrades.md`.

