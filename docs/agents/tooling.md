# Tooling

## Commands

- Development: `bun run dev`
- Preview: `bun run preview`
- Typecheck: `bun run astro:check`
- Lint: `bun run lint`
- Lint autofix: `bun run lint:fix`
- Format: `bun run format`
- Format check: `bun run format:check`

## TypeScript

- TypeScript runs in strict mode.

## Linting

- ESLint intentionally disables unused import and variable checks inside `.astro` files.
- Do not re-enable those checks unless the lint config is being intentionally redesigned.

## Build Tooling

- Tailwind is wired through the Vite plugin `@tailwindcss/vite`, not PostCSS.
