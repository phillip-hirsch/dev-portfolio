# Styling

## Theme System

- Global theme variables and shared custom properties are centralized in one stylesheet.
- Dark mode is controlled by a `.dark` class on `<html>`.
- Theme selection is persisted in `localStorage`.
- Theme state is applied before paint, with `prefers-color-scheme` as the fallback.

## Tailwind Usage

- Tailwind v4 tokens are mapped through `@theme`; use utilities such as `text-gray-0`, `bg-accent-regular`, `shadow-md`, and `font-brand`.
- Prefer those token-backed utilities over raw CSS variable utilities such as `text-[var(--color-gray-0)]`.
- Custom breakpoints override Tailwind defaults:
- `lg: 50em`
- `xl: 60em`
- `2xl: 70em`

## Gradients And Backgrounds

- Gradient variables such as `--gradient-accent`, `--gradient-subtle`, and `--gradient-stroke` are image values, not Tailwind color tokens.
- In `.astro` files, use Tailwind's CSS variable shorthand such as `bg-(image:--gradient-subtle)` for image gradients and `bg-(--color-accent-subtle-overlay)` for color variables.
- For pseudo-elements, use arbitrary declarations such as `before:[background:var(--gradient-accent)]`.
- If React component files are added later and need gradient text, use inline `style` values instead of Tailwind shorthand.
- Do not introduce page-level backgrounds casually; the base layout already owns the main page background.

## Motion

- Animation keyframes are defined centrally and then consumed from components.
- Use Tailwind arbitrary animation syntax such as `animate-[fadeInUp_0.45s_ease-out_backwards]`.
- There is no shared animation utility file.
- Astro View Transitions are not in use.
