# AGENTS.md

This file provides guidance to AI agent when working with code in this repository.

## Task Completion Requirements

- All of `bun run astro:check`, `bun run biome:check`, and `bun run build` must pass before considering tasks completed.

## Commands

```bash
# Development
bun run dev       # Start dev server
bun run build     # Production build
bun run preview   # Preview production build

# Type checking
bun run astro:check          # Type-check .astro and .tsx files

# Linting & Formatting (via Biome)
bun run biome:check          # Check for lint/format issues
bun run biome:check:write    # Auto-fix lint/format issues
```

No test suite is configured.

## Tech Stack

Astro 6 · React 19 (islands) · Tailwind CSS v4 · Phosphor Icons · Biome · Bun
Deployed to Vercel in hybrid mode — pages are prerendered, but `src/pages/og.png.ts` opts into SSR (`export const prerender = false`) and runs as a serverless function.
Fonts loaded via Astro Fonts API: Space Grotesk (body & brand), Space Mono (mono).

## Architecture

**Component model**: Static `.astro` components by default; `.tsx` React components only for interactivity. Currently `ThemeToggle.tsx` is the only React island (loaded via `client:load` inside `Nav.astro`).

**Routing**: Single-page layout — `index.astro` is the only content page. Nav links use anchor IDs (`#experience`, `#education`, `#skills`) for scroll navigation, not separate pages. `404.astro` handles not-found. `og.png.ts` is a dynamic OG image endpoint.

**Layout**: All pages use `src/layouts/BaseLayout.astro`, which wraps content with `MainHead` and `Nav`. There is no shared Footer component.

**Component structure**: Follows atomic design — `src/components/atoms/` (ButtonLink, TimelineDot, etc.), `src/components/molecules/` (HeroPortrait, PageHeader, etc.), `src/components/organisms/` (Hero, Nav, ExperienceSection, etc.).

**PageHeader**: Reusable `src/components/molecules/PageHeader/PageHeader.astro` renders a page title with an optional tagline and accent underline. Accepts `title`, `tagline?`, and `align?` (`'center'` default or `'start'`).

**Styling approach**: Global theme variables and custom properties in `src/styles/global.css`. Dark/light mode via a `.dark` class on `<html>`. `ThemeToggle.tsx` flips the class between dark and light. On initial load, `MainHead.astro` applies the theme from `localStorage` if set, otherwise from `prefers-color-scheme`. Persistence is handled by a `MutationObserver` in `BaseLayout.astro` that writes the class back to `localStorage` when it changes. Custom breakpoints (`lg: 50em`, `xl: 60em`, `2xl: 70em`) override Tailwind defaults.

- **Tailwind v4 token usage**: `@theme` custom properties map directly to Tailwind utilities — use `text-gray-0`, `bg-accent-regular`, `shadow-md`, `font-brand`, etc. (not `text-[var(--color-gray-0)]`).
- **Gradient variables** (`--gradient-accent`, `--gradient-subtle`, `--gradient-stroke`) are not Tailwind color utilities. In `.astro` files, use Tailwind v4's CSS variable shorthand: `bg-(image:--gradient-subtle)` for image-type gradients, `bg-(--color-accent-subtle-overlay)` for color-type vars. For pseudo-elements, use the arbitrary variant `before:[background:var(--gradient-accent)]`. In `.tsx` React files, use inline `style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}` for gradient text.
- **Background layers**: The `<body class="backgrounds">` in `BaseLayout` owns the page background — a flat Catppuccin surface (`var(--color-gray-999)`), no gradient layers. Do not set backgrounds on individual pages.

**Animations**: Animation keyframes are defined in `global.css` (e.g. `fadeInUp`). Applied via Tailwind's arbitrary animation syntax: `animate-[fadeInUp_0.45s_ease-out_backwards]`. No shared animation utility file; no Astro View Transitions.

**Nav**: Nav items (`textLinks`) and social links (`iconLinks`) are defined in `src/data/nav.ts`. Adding a new page or social link requires editing that file. `Nav.astro` is composed of sub-components (`BrandLink`, `NavLinks`, `SocialLinks`, `MobileMenuToggle`) — all `.astro`. The mobile menu open/close logic lives in a `<script>` tag inside `Nav.astro` and uses a `data-menu-state` attribute (`closed` / `open` / `closing`) driven by CSS animations in `global.css`.

**Icons**: Phosphor icons are imported from `@phosphor-icons/react` in both `.tsx` and `.astro` files. Astro handles server-side React rendering, so the `/ssr` variant is not required.

**Content data**: All editable site content lives in `src/data/` — `experience.ts`, `education.ts`, `skills.ts` export typed arrays consumed by organism components. `nav.ts` is the single source of truth for nav items and section IDs (section IDs must match the `id` attributes on the corresponding section elements).

**OG images**: `MainHead` auto-generates OG images via `src/pages/og.png.ts` (uses `@vercel/og` `ImageResponse`), passing `title` and `description` as query params. `MainHead` also accepts `canonical`, `image`, and `type` props for per-page overrides.

**Images**: Source images live in `src/images/` (not `public/`) so Astro can optimize them. Static assets (resume PDF) go in `public/assets/`.

## Notes

- Biome disables unused variable/import checks for `.astro` files — don't add them back.
- TypeScript strict mode via `tsconfig.json` extending `astro/tsconfigs/strict`.
- Tailwind is configured via the Vite plugin (`@tailwindcss/vite`), not PostCSS.
