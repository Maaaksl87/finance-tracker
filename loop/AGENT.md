# AGENT.md — permanent project context for Finance Tracker

> Read at the START of every loop iteration. The agent remembers nothing between runs:
> everything that must survive an iteration is written here, in `specs/`, or in
> `modules/progress-modules.md`. If a rule is not in one of those places, it does not exist.

> **Routing** — read the spec folder for the repo the module tags:
> - `specs/overview.md` — what the product is (read first, for context).
> - `specs/backend/` — NestJS 11 + Mongoose (MongoDB) REST API.
> - `specs/frontend/` — React 19 + Vite + Tailwind v4 + Radix UI SPA.

## What Finance Tracker is

Finance Tracker is a personal finance management web application that allows users to manage multiple wallets and accounts (cash, bank, crypto), track income, expenses, and transfers, categorize spending, set saving goals, and view analytics and cash flow charts.
The one flow that must never break: user authentication (JWT) and transaction creation/deletion with atomic wallet balance synchronization (`sources.changeBalance`) and accurate total balance calculation on the dashboard. Full overview lives in `specs/overview.md`.

### Glossary

- **Source / Wallet** — Financial account or wallet (cash, bank card, crypto exchange) with currency, balance, type, and optional integration; lives in `sources` collection (`Source` schema).
- **Transaction** — Financial operation (`income`, `expense`, `transfer`) tied to a user, source(s), category, date, and amount; lives in `transactions` collection (`Transaction` schema).
- **Transfer** — A transaction moving funds from `sourceId` to `destinationSourceId` atomically updating both source balances.
- **Category** — User classification for income or expense transactions; lives in `categories` collection.
- **Saving Plan** — Target savings goal with target amount, current amount, and deadline; lives in `saving-plans` collection.
- **Currency Rate** — Real-time or cached exchange rates used to normalize multi-currency balances to UAH on the dashboard.
- **Integration** — External API sync provider (e.g. Bybit) for auto-updating wallet balances; lives in `integrations/`.

## The repositories

```
finance-tracker/
├── backend/    # NestJS 11 · TypeScript 5.9 · Mongoose (MongoDB) · git: origin/master
├── frontend/   # React 19 · Vite 8 · Tailwind v4 · Radix UI · git: origin/master
└── loop/       # this scaffold: AGENT.md, specs/, modules/, prototypes/
```

Warnings:
- **Balance atomicity**: Modifying transactions MUST use database sessions / transactions (`session.withTransaction`) to adjust source balances via `sourcesService.changeBalance`. Never adjust wallet balances outside transactions.
- **Transfers balance reversal**: When removing a transfer transaction, both source and destination balances must be correctly reversed.
- **Environment variables**: Sensitive keys in `backend/.env` (like `JWT_SECRET`, `MONGO_URI`, API secrets) must never be hardcoded or logged.

## Branching

**The local base branch is `master`. Every module branch starts from `master` and is named with prefix `feature/`.**
`origin/master` is a protected branch on GitHub. Merging into `origin/master` happens exclusively via Pull Requests after manual owner review and code approval.

```bash
git checkout master && git pull --ff-only
git checkout -b feature/<slug>                 # one branch per module
# ... work, build verification, commit ...
git push origin feature/<slug>                # push feature branch for PR
# merge into master locally or via approved PR
```

Rules:

- **Never** push directly to `origin/master`.
- **The master branch must always build.** A module that leaves backend or frontend in a non-building state is not done.
- **Check the working tree before branching.** `git status` must be clean.
- **Local MongoDB**: database changes run against local/development MongoDB instance.

### One agent per checkout

A checkout has exactly one agent. Two agents in one working tree take the same module, commit on each other's branches and make every gate result meaningless. `modules/module-loop.sh` holds a pid lock in `modules/.logs/runner.pid`; a second runner refuses to start.

## How to run (per repo)

- **backend** — `npm install` → `npm run start:dev` → checks `http://localhost:3000` (requires active MongoDB via `MONGO_URI` in `.env`).
- **frontend** — `npm install` → `npm run dev` → checks `http://localhost:5173` (proxies or connects to backend API).
- Details, ports and env in each `specs/<repo>/README.md`.

## Development process (verification before code)

Drive changes from verification, not from intuition:

1. **Analyze** which module the change touches, which schemas and DTOs/components are affected.
2. **Until full automated test coverage is added**, manual QA steps and compilation/build checks must be clearly defined *before* the code.
3. When automated tests are introduced:
   - Additive change → write the new tests (red) → implement to green.
   - Behaviour change → update covering tests first → then code.
4. **Build verification**: run `npm run build` in both touched repos. Both must succeed with zero errors.

## Visual approval (BEFORE the code, for anything that shows on screen)

Code that changes what a user sees is not written until the change exists as a picture.

1. **Does this module need one?** Any module that changes a screen does. A module with backend-only logic does not. When in doubt, it needs one.
2. **Write `loop/prototypes/<slug>.html`**, where `<slug>` is the module's branch name without `feature/`. One self-contained file — CSS and JS inline. It shows **Now** and **Proposal** side by side with real strings and Ukrainian UI copy, the rule in a sentence or two, and the edge cases.
3. **Link it** on the module's queue line with `Prototype:` and add a row to `loop/prototypes/index.html`.
4. **Answer the page's own questions before stopping.** Settle every question from the module file, `## Answers`, shipped code, or design tokens. Write each answer into `## Answers` with the source.
5. **Stop for owner approval on new UI screens or user flows.** The owner inspects the prototype and approves it by writing `Approved: <date>` on the `Prototype:` line.
6. **Corrections go in the same file**, never a second one.
7. **The approved prototype is the spec**: if the built screen and the page disagree, the page is right.

## Green-gate (run AFTER the code — the module is not done until green)

- **backend** → `npm run build` (clean NestJS compilation with 0 errors).
- **frontend** → `npm run build` (clean Vite build with 0 errors).
- **tests (when added)** → `npx jest --passWithNoTests`.
- After the build: manual verification that the application boots and modified endpoints/screens respond correctly.

The gate that was run, with its status, is written on the module's `[x]` line.

## Code conventions

Explicit standards per repo — read and follow them:

- **Backend**: NestJS modular architecture (`*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `schemas/`). Mongoose schemas with `@Prop()` and `@Schema({ timestamps: true })`. Class-validator for DTOs.
- **Frontend**: React 19 with functional components, Tailwind v4 utility classes, Radix UI primitives, Lucide icons, TanStack React Query for server state, Zustand for client state, Zod for forms.
- UI strings, error toasts, and user messages are in **Ukrainian**.
- No secrets in code — environment variables only (`.env`).
- Money amounts: positive numbers, currency conversion handled via `convertToUAH` helper using real-time rates.

## Modules — how an iteration is scoped

An iteration is **one module**: one feature, one spec file, one branch, one commit/PR.

- The queue is `loop/modules/progress-modules.md`. Order in the file is the order of work.
- Open specs live in `loop/modules/open/<slug>.md`; finished ones in `loop/modules/done/<slug>.md`.
- A module is tagged with its repo: `[backend]`, `[frontend]`, `[both]`, or `[owner]`.
- Cross-repo work is split into two modules (server side first, then client side), unless the two ends are a single tight agreement (`[both]`).
- **A module may end early.** If it turns out bigger than its file implied, commit what is coherent, leave the line `[ ]` with a note saying what was found, and stop. Never tick a partial.

## Ideas — the development backlog lives in `loop/modules/idea/`

- **Every idea is written down as `loop/modules/idea/<slug>.md` the moment it comes up.**
- An idea file **is not a module and does not authorise code**. It is not in the queue.
- When the owner decides to build it, the idea is cut into a spec in `open/` and queued.

## Hard prohibitions

- Don't push directly to `origin/master`.
- Don't touch production database or external production credentials.
- Don't run `npm run start:prod` or deployment scripts.
- Don't change anything outside the current module.
- Don't break existing flows: user authentication, balance recalculation on transactions, or dashboard total.
- Don't invent English UI copy when the application standard is Ukrainian.
