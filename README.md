# Phillip Hirsch — Developer Portfolio

Personal portfolio site built with [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com). Deployed on [Vercel](https://vercel.com).

## Features

- **Astro 6** with page animations
- **React 19** interactive islands (navigation, theme toggle)
- **Tailwind CSS v4** for styling with custom theme tokens
- **Dark / light / system theme** toggle with persistence
- **Responsive layout** — mobile-first with adaptive grid
- **Phosphor Icons** for a consistent icon set
- **Auto-generated OG images** via `@vercel/og`
- **Biome** for linting and formatting
- **TypeScript** in strict mode

## Architecture

Single-page layout — `index.astro` is the only content page. Nav links use anchor IDs (`#experience`, `#education`, `#skills`) for smooth scroll navigation.

Components follow **atomic design**: atoms (ButtonLink, TimelineDot), molecules (HeroPortrait, PageHeader, EducationEntry), and organisms (Hero, Nav, ExperienceSection, SkillsSection).

Static `.astro` components by default; `.tsx` React components only where interactivity is needed.

## Tech Stack

| Layer     | Technology                           |
| :-------- | :----------------------------------- |
| Framework | Astro 6                              |
| UI        | React 19                             |
| Styling   | Tailwind CSS 4                       |
| Icons     | Phosphor Icons                       |
| Fonts     | Public Sans, Rubik (via Astro Fonts) |
| Linting   | Biome                                |
| Hosting   | Vercel (static)                      |
| Runtime   | Bun                                  |

## Project Structure

```bash
src/
├── components/
│   ├── atoms/         # ButtonLink, TimelineDot, etc.
│   ├── molecules/     # HeroPortrait, PageHeader, EducationEntry, etc.
│   └── organisms/     # Hero, Nav, ExperienceSection, SkillsSection, etc.
├── data/              # Content data (experience, education, skills, nav)
├── images/            # Optimized image assets
├── layouts/           # BaseLayout
├── pages/             # index.astro, 404.astro, og.png.ts
└── styles/            # Global CSS and theme variables
public/
└── assets/            # Static files (resume PDF, favicons)
```

## Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev

# Build for production
bun run build

# Preview the production build locally
bun run preview
```

## Linting & Formatting

```bash
# Check for lint and format issues
bun run biome:check

# Auto-fix issues
bun run biome:check:write

# Type-check Astro and TSX files
bun run astro:check
```
