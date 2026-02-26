# Phillip Hirsch — Developer Portfolio

Personal portfolio site built with [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com). Deployed on [Vercel](https://vercel.com).

## Features

- **Astro 5** with view transitions and page animations
- **React 19** interactive components (navigation, theme toggle, gradient icons)
- **Tailwind CSS v4** for styling
- **Dark / light theme** toggle with system-aware defaults
- **Responsive Layout** — mobile-first with adaptive grid on larger screens
- **Phosphor Icons** for a consistent icon set
- **Biome** for linting and formatting
- **TypeScript** in strict mode

## Pages

| Route          | Description                                |
| :------------- | :----------------------------------------- |
| `/`            | Home — hero section, portrait, and skills  |
| `/about`       | Summary, education, and background         |
| `/experience`  | Professional work history and achievements |
| `/404`         | Custom not-found page                      |

## Tech Stack

| Layer       | Technology                     |
| :---------- | :----------------------------- |
| Framework   | Astro 5                        |
| UI          | React 19                       |
| Styling     | Tailwind CSS 4                 |
| Icons       | Phosphor Icons                 |
| Linting     | Biome                          |
| Hosting     | Vercel                         |
| Runtime     | Bun                            |

## Project Structure

```bash
src/
├── components/    # Reusable UI components (Nav, Hero, Footer, etc.)
├── images/        # Optimized image assets
├── layouts/       # Base page layout
├── pages/         # File-based routes
├── styles/        # Global CSS and theme variables
└── utils/         # Helpers (animations, etc.)
public/
└── assets/        # Static files (backgrounds, favicons)
```

## Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun dev

# Build for production
bun build

# Preview the production build locally
bun preview
```

## Linting & Formatting

```bash
# Check for lint and format issues
bunx --bun biome check .

# Auto-fix issues
bunx --bun biome check --write .
```
