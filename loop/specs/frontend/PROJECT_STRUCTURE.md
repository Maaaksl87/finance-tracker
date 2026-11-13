# frontend — Project Structure

## Main principle

Feature-based component structure combined with shared UI primitives (`components/ui/`), custom hooks (`hooks/`), and domain types (`types/`).

## Layout

```
frontend/src/
├── App.tsx                     # Main router and route definitions
├── main.tsx                    # Entry point mounting React DOM root
├── index.css                   # Global styles, Tailwind v4 imports, design tokens
├── components/
│   ├── auth/                   # Login, register forms and auth pages
│   ├── balance/                # Balance overview card
│   ├── calendar/               # Financial calendar with daily drill-down
│   ├── currencies/             # Currency exchange rate widgets
│   ├── saving-plans/           # Saving goals cards and forms
│   ├── sources/                # Wallet lists, wizard steps, creation dialogs
│   ├── stats/                  # Recharts graphs and category breakdown
│   ├── transactions/           # Transaction tables, creation and filter dialogs
│   ├── ui/                     # Reusable Radix UI & Shadcn-like components (button, dialog, card, etc.)
│   └── Layout.tsx              # Main authenticated shell with Sidebar and Header
├── hooks/                      # TanStack React Query hooks (useTransactions, useSources, useAuth, etc.)
├── lib/                        # Utility functions (currency.ts, categoryColor.ts, utils.ts)
├── pages/                      # Page components corresponding to routes
├── store/                      # Zustand client stores (authStore.ts)
└── types/                      # TypeScript interfaces and data models
```

## Where new things go

| I am adding                 | It goes in                                               |
| --------------------------- | -------------------------------------------------------- |
| A new page route            | `src/pages/<Name>Page.tsx` and register in `src/App.tsx` |
| Feature-specific components | `src/components/<feature>/`                              |
| General UI primitive        | `src/components/ui/<component>.tsx`                      |
| Data query / mutation hook  | `src/hooks/use<Feature>.ts`                              |
| TypeScript interface        | `src/types/<feature>.ts`                                 |

## Conventions

- Component filenames: PascalCase (`TransactionsTable.tsx`, `CreateSourceDialog.tsx`).
- Hook filenames: camelCase starting with `use` (`useTransactions.ts`).
- Utility filenames: camelCase (`numberUtils.ts`).
- Alias `@/` maps to `src/`.
