# frontend — Coding Standards

## Core practices

- Component decomposition: Keep pages clean by extracting reusable parts into `src/components/<feature>/`.
- Server sync: Invalidate relevant React Query queries after mutations (e.g. invalidate `["transactions"]` and `["sources"]` after adding a transaction).
- Forms: Built using React Hook Form + Zod resolvers. Validate on submit, provide immediate feedback on error.

## Responsive design & accessibility

- Responsive layouts using Tailwind breakpoints (`md:`, `lg:`, `xl:`).
- Accessible interactive elements using Radix primitives with proper ARIA attributes.
- Use Lucide icons consistently with descriptive `aria-label` when without visible text.

## Performance & React Compiler

- The project uses `babel-plugin-react-compiler`. Avoid calling `setState` directly inside synchronous `useEffect` bodies.
- Handle loading states gracefully (prefer Skeleton placeholders over abrupt text flickers).

## Requirements for the agent

- Never introduce hardcoded English text in user visible buttons, titles, or toasts.
- Always run `npm run build` to verify that TypeScript types and Vite bundle compile cleanly.
