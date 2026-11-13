# Finance Tracker — project overview

> Product context for the agent. Read first when a module needs to know *why* something exists.
> Facts only; no roadmap, no marketing copy.

## What it is

Finance Tracker is a personal finance management system designed to track income, expenses, account balances, transfers between wallets, and saving goals. The application enables users to consolidate multiple accounts (cash wallets, multiple bank cards, cryptocurrency exchange balances via Bybit integration) into a unified financial dashboard with automated currency conversion into Ukrainian Hryvnia (UAH).

## For whom

Individual users managing their personal or household finances who need a clean, responsive overview of their net worth, daily transactions, recurring spending categories, and progress towards financial saving goals.

## The repositories

- **backend/**: NestJS 11 TypeScript application serving a REST API, connected to MongoDB via Mongoose. Handles authentication, transactions CRUD, source balance updates within MongoDB transactions, Bybit API integrations, exchange rates, and financial analytics aggregations.
- **frontend/**: Single Page Application built with React 19, Vite 8, Tailwind CSS v4, Radix UI, TanStack React Query v5, and Zustand. Provides an interactive dashboard, transaction log, wallet management dialogs, financial calendar, and statistics charts.

## Core concepts

- **User**: Authenticated entity with email and hashed password (bcrypt). Protected by JWT access token and refresh token strategies.
- **Source (Wallet)**: Account holding funds in a specific currency (UAH, USD, EUR, etc.), classified by type (cash, bank, crypto). Balance updates automatically on transaction actions.
- **Transaction**: Operation modifying balance (`income`, `expense`, or `transfer`). Can be excluded from analytics stats via `excludeFromStats`.
- **Category**: Classification for income or expense transactions (e.g., Food, Salary, Housing).
- **Saving Plan**: Goal tracking target amount versus current accumulated amount.
- **Integration**: External sync provider (Bybit) fetching wallet balances automatically via scheduled or manual sync.

## How it works (conceptually)

1. User registers/logs in and obtains JWT tokens.
2. User creates one or more sources (e.g. "Готівка" in UAH, "Monobank" in UAH, "Bybit" in USDT).
3. When recording an expense or income, the backend uses a MongoDB session to atomically modify the source's balance and persist the transaction.
4. When transferring funds between two sources, both sources' balances are atomically updated in the same transaction session.
5. The Dashboard calculates total net worth by converting all source balances to UAH using real-time currency rates.
6. The Analytics and Calendar pages aggregate transaction history into visual spending trends and category breakdowns.

## Where to look for details

- `loop/specs/backend/README.md` — backend architecture, REST endpoints, run commands.
- `loop/specs/backend/PROJECT_STRUCTURE.md` — NestJS modules and file organization.
- `loop/specs/frontend/README.md` — frontend setup, component hierarchy, UI patterns.
- `loop/specs/frontend/PROJECT_STRUCTURE.md` — React components, hooks, stores, and pages.
