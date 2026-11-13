# frontend — Testing Standards

## Tooling

- Verification tool: Vite TypeScript compiler and bundler (`vite build`).
- Build command: `npm run build`.

## Verification first

- When creating or modifying screens:
  1. Create the visual HTML prototype in `loop/prototypes/<slug>.html` first.
  2. Implement React component.
  3. Verify responsive rendering and interactive states.
  4. Run build verification.

## Green-gate

```bash
cd frontend
npm run build
```

Must complete with 0 TypeScript and Vite compilation errors.
