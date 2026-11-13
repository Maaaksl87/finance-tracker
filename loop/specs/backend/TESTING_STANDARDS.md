# backend — Testing Standards

## Tooling

- Jest 30.2 with `ts-jest` for TypeScript compilation.
- Configured in `package.json` under `"jest"`.
- Test files located adjacent to implementation or in `test/` folder with `.spec.ts` suffix.

## Run

```bash
cd backend
npm run test                   # runs jest
npx jest --passWithNoTests     # safe run when test suites are pending
npm run test:cov               # coverage report
```

## What to test

- **Unit tests**: Service business logic (e.g. calculation of balance deltas, currency conversion helpers, DTO validations).
- **Integration tests**: Controllers and database transactions (verifying atomic balance update when creating/reverting transactions).

## Current status

Currently, automated test files (`*.spec.ts`) are not yet written in the backend. Automated test creation will be scheduled in subsequent dedicated modules.

## Verification first

- When creating new features: verify manual QA steps first.
- When automated tests exist:
  - Additive change: failing test first -> code to green.
  - Bug fix: failing regression test first.

## Green-gate

```bash
cd backend
npm run build
```

Must complete with 0 TypeScript compilation errors.
