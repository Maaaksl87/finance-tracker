# frontend — service rules

> The agent reads this folder before touching the frontend codebase.

## Stack (actual)

- **Framework / Library**: React 19.3.1
- **Build Tool**: Vite 8.3.8 (`@vitejs/plugin-react` 6.3.0)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` 4.3.5), `tw-animate-css`
- **UI Components**: Radix UI primitives (`radix-ui` 1.8.1), Lucide React icons (`lucide-react`)
- **State Management**: TanStack React Query v5.107 (server state), Zustand 5.1 (client state)
- **Forms & Validation**: React Hook Form 7.92, Zod 4.6, `@hookform/resolvers` 5.9
- **Routing**: React Router DOM 7.18
- **Data Visualization**: Recharts 3.10

## Documents

- `CODE_STYLE.md` — formatting, components, naming, styling rules.
- `CODING_STANDARDS.md` — state management, API hooks, user feedback, error handling.
- `PROJECT_STRUCTURE.md` — folder hierarchy, pages, and components.
- `TESTING_STANDARDS.md` — build verification and green-gate.

## How to run

```bash
cd frontend
npm install
npm run dev           # local dev server on http://localhost:5173
npm run build         # compile production bundle to dist/
```

- API Base URL: configured to communicate with backend on `http://localhost:3000`.

## Public surface

Pages and routes (defined in `src/App.tsx`):

- `/auth/login`, `/auth/register` — public authentication routes.
- `/` (`DashboardPage`) — main overview: balances, wallets, recent transactions, quick stats.
- `/transactions` (`TransactionsPage`) — detailed transaction ledger with filters and pagination.
- `/sources` (`SourcePage`) — wallet and account management.
- `/stats` (`StatsPage`) — financial analytics, charts, category breakdown, calendar.
- `/saving-plans` (`SavingPlansPage`) — goals and progress.

## Requirements for the agent

- All visible UI texts, buttons, placeholders, dialog titles, and notifications MUST be in **Ukrainian**.
- Use design tokens from `src/index.css` via Tailwind classes or CSS variables.
- Maintain responsive layout across desktop and mobile screens.
- Avoid introducing circular dependencies or direct mutations in Zustand stores.
