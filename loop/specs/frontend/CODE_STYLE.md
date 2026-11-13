# frontend — Code Style

## Formatting

- Prettier 3.8 + ESLint 9 with `typescript-eslint` and React Hooks plugins.
- Quotes: double quotes (`"..."`).
- Tailwind v4 classes arranged logically (layout -> spacing -> sizing -> typography -> colors).

## Naming

- Components: PascalCase (`BalanceCard`, `DashboardPage`).
- Custom Hooks: camelCase starting with `use` (`useCurrencyRates`).
- Types & Interfaces: PascalCase (`Transaction`, `Source`, `SavingPlan`).
- Props interfaces: `<ComponentName>Props`.

## Component conventions

- Functional components using React 19 standards.
- Use `cn()` helper (`clsx` + `tailwind-merge`) for dynamic conditional class concatenation.
- Radix UI primitives wrapped in `components/ui/` for accessible, styled components.

## State management

- Server state (fetching, caching, invalidation): managed through TanStack React Query (`useQuery`, `useMutation`).
- Client state (auth tokens, active filters): managed through Zustand (`create(...)`).
- Local UI state (dialog open/close, active tab): `useState` or `useReducer`.

## Language and UI copy

- All user-facing strings must be in Ukrainian.
- Examples: `"Додати гаманець"`, `"Останні транзакції"`, `"Завантаження..."`, `"Зберегти"`.
