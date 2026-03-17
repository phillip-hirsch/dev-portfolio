# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev       # Start dev server (uses bunx --bun astro dev)
bun run build     # Production build
bun run preview   # Preview production build

# Type checking
bunx --bun astro check            # Type-check .astro and .tsx files

# Linting & Formatting (via Biome)
bunx --bun biome check .          # Check for lint/format issues
bunx --bun biome check --write .  # Auto-fix lint/format issues
```

No test suite is configured.

## Tech Stack

Astro 6 · React 19 (islands) · Tailwind CSS v4 · Phosphor Icons · Biome · Bun
Deployed to Vercel as a fully static site (no SSR).
Fonts loaded via Astro Fonts API: Public Sans (body), Rubik (brand).

## Architecture

**Component model**: Static `.astro` components by default; `.tsx` React components only for interactivity (theme toggle, nav).

**Routing**: `src/pages/` maps directly to URLs — `index.astro` → `/`, `about.astro` → `/about`, etc.

**Layout**: All pages use `src/layouts/BaseLayout.astro`, which wraps content with `MainHead` and `Nav`. Pages include a `<footer>` inline or omit it entirely — there is no shared Footer component.

**PageHeader**: Reusable `src/components/PageHeader/PageHeader.astro` renders a page title with an optional tagline and accent underline. Accepts `title`, `tagline?`, and `align?` (`'center'` default or `'start'`).

**Styling approach**: Global theme variables and custom properties in `src/styles/global.css`. Dark/light mode via a `.dark` class on `<html>`, applied by `ThemeToggle.tsx` which cycles `system → light → dark` and persists to `localStorage`. In `system` mode it mirrors `prefers-color-scheme`. Custom breakpoints (`lg: 50em`, `xl: 60em`, `2xl: 70em`) override Tailwind defaults.

- **Tailwind v4 token usage**: `@theme` custom properties map directly to Tailwind utilities — use `text-gray-0`, `bg-accent-regular`, `shadow-md`, `font-brand`, etc. (not `text-[var(--color-gray-0)]`).
- **Gradient variables** (`--gradient-accent`, `--gradient-subtle`, `--gradient-stroke`) are not Tailwind color utilities. In `.astro` files, use Tailwind v4's CSS variable shorthand: `bg-(image:--gradient-subtle)` for image-type gradients, `bg-(--color-accent-subtle-overlay)` for color-type vars. For pseudo-elements, use the arbitrary variant `before:[background:var(--gradient-accent)]`. In `.tsx` React files, use inline `style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}` for gradient text.
- **Background layers**: The `<div class="backgrounds">` in `BaseLayout` owns all page background gradients. Below-the-fold layers are deferred — they only render once JS adds `:root.loaded` (on `load` and `astro:page-load`). Do not set backgrounds on individual pages.

**Animations**: Page transitions use Astro View Transitions (`ClientRouter` in `MainHead`). Animation keyframes are defined in `global.css`; shared config objects live in `src/utils/animations.ts`. Every page's `<main>` must include `transition:animate={pageTransition}` — import `pageTransition` from `../utils/animations`.

**Nav**: Nav items (`textLinks`) and social links (`iconLinks`) are hardcoded in `src/components/Nav/Nav.tsx`. Adding a new page or social requires editing those arrays. Nav uses `client:load` and reads `window.location.pathname` at runtime (not from Astro props) to determine the active link.

**Icons**: Phosphor icons are imported from `@phosphor-icons/react` in both `.tsx` and `.astro` files. Astro handles server-side React rendering, so the `/ssr` variant is not required.

**Images**: Source images live in `src/images/` (not `public/`) so Astro can optimize them. Static assets (resume PDF) go in `public/assets/`.

## Notes

- Biome disables unused variable/import checks for `.astro` files — don't add them back.
- TypeScript strict mode via `tsconfig.json` extending `astro/tsconfigs/strict`.
- Tailwind is configured via the Vite plugin (`@tailwindcss/vite`), not PostCSS.
