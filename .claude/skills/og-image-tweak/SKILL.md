---
name: og-image-tweak
description: Modify the dynamic OG image at src/pages/og.png.ts (uses @vercel/og + Satori). Captures the non-obvious constraints so each iteration doesn't re-discover them.
disable-model-invocation: true
---

The OG endpoint is `src/pages/og.png.ts`. It runs at request time on Vercel (`prerender = false`) and renders via `@vercel/og` (Satori under the hood). Read the existing file first — it's the source of truth for current layout and color tokens.

## Hard constraints (Satori, not React)

These will silently produce broken or empty images if violated:

- **No external CSS.** Only inline `style={{...}}` works. Tailwind classes, CSS modules, and `<style>` tags are ignored.
- **Every flex container needs `display: 'flex'` explicitly.** Satori does not default to flex. Children of a `flex` container must also be flex if they themselves contain multiple children.
- **`whiteSpace: 'pre'` is required to preserve spaces.** Satori collapses whitespace by default — this matters for the code-line indentation and spaces between tokens. See `span()` in the existing file.
- **Fonts must be TTF/OTF, not WOFF2.** Use the `loadGoogleFont` helper already in the file (sends a non-modern User-Agent so Google serves TTF). Don't switch to woff2.
- **Limited CSS subset.** Supported: flexbox, absolute positioning, basic borders, `borderRadius`, `background`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `padding`, `margin`, `width`, `height`, `gap`. Unsupported: grid, transforms beyond translate, filters, most pseudo-elements, `box-shadow` is partial.
- **No `<img>` with relative paths.** If adding images, use absolute URLs or base64 data URIs.

## Project conventions

- Output dimensions are `1200x630` (Open Graph standard) — keep them.
- Colors come from the Catppuccin Mocha `C` constant at the top of the file. It mirrors `.dark` in `src/styles/global.css` — if you add a color, add it to `C` first rather than inlining a hex.
- Fonts are lazy-loaded and memoized via `getFonts()`. The cache is cleared on rejection so a transient Google Fonts hiccup doesn't poison the serverless container. Don't move the fetch to module scope.
- The `span()` and `codeLine()` helpers already handle the `whiteSpace: 'pre'` boilerplate — use them instead of building elements from scratch.
- Query params: `title` and `description` are read from `url.searchParams`. They're truncated via `truncate()` so long values don't break the layout. If you add a new param, truncate it.

## Testing locally

1. `bun run dev`
2. Visit `http://localhost:4321/og.png` — or with params: `/og.png?title=Hello&description=Test`
3. The response is a PNG; the browser renders it directly.

For static preview without the server, paste the JSX into [og-playground.vercel.app](https://og-playground.vercel.app) — same Satori engine, faster iteration.

## When changing layout

- Verify both at default text and with long `title`/`description` values (the truncation guards exist for a reason).
- Test the `description` query param at its max length to make sure the second comment line doesn't wrap unexpectedly.
- Check that line numbers in the code block stay sequential (the `n` counter in `GET` is mutated by the `line()` closure — don't reorder lines without thinking about it).
