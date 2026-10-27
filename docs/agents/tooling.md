# Tooling

## Commands

- Development: `bun run dev`
- Typecheck: `bun run astro:check`
- Lint: `bun run lint`
- Lint autofix: `bun run lint:fix`
- Format: `bun run format`
- Format check: `bun run format:check`

## TypeScript

- TypeScript runs in strict mode.

## Linting

- oxlint config lives in `.oxlintrc.json`; oxfmt config lives in `.oxfmtrc.json`.
- oxlint intentionally disables unused import and variable checks inside `.astro` files. It only parses frontmatter and `<script>` blocks, so imports used only in the template would look unused.
- Do not re-enable those checks unless the lint config is being intentionally redesigned.
- oxlint does not lint `.astro` templates, and `eslint-plugin-astro` rules do not run under it.
- `no-undef` is off for TypeScript files (TypeScript covers it). `.astro` files get browser globals in frontmatter too, since oxlint applies one env per file. oxlint's `no-undef` misses `export default undefinedName`.

## Formatting

- oxfmt formats `.astro` files only because `astro: true` is set and `@astrojs/compiler-rs` is a direct devDependency. Keep both.
- oxfmt sorts Tailwind classes using `src/styles/global.css` as the stylesheet, so custom `@theme` tokens sort correctly.

## Build Tooling

- Tailwind is wired through the Vite plugin `@tailwindcss/vite`, not PostCSS.
