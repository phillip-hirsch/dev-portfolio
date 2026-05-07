---
name: pre-deploy
description: Run a full production build and smoke-check the OG endpoint before deploying
disable-model-invocation: true
---

Run the following in sequence and report results. If any step fails, stop and surface the error — don't attempt fixes automatically.

1. `bun run format:check` — Prettier format check
2. `bun run lint` — ESLint
3. `bun run astro:check` — TypeScript + Astro type check
4. `bun run build` — full production build
5. **OG endpoint smoke check** (Playwright MCP). The `/og.png` route is `prerender = false`, so it can't be served by `astro preview` — use `bun run dev`:
   1. Start `bun run dev` in the background (default port `4321`). Wait for the "ready" log line.
   2. For each URL below, use `browser_evaluate` to call `fetch(url)` and confirm `status === 200`, `content-type === 'image/png'`, and a non-trivial body size (`(await r.arrayBuffer()).byteLength > 5 * 1024`). Don't rely on the `content-length` header — `ImageResponse` streams the body and may omit it. Then `browser_navigate` to the URL and `browser_take_screenshot` so the user can eyeball the rendered card.
      - `http://localhost:4321/og.png` — default copy
      - `http://localhost:4321/og.png?title=Test%20Title&description=Custom%20description` — query params honored
      - `http://localhost:4321/og.png?title=A%20deliberately%20long%20title%20that%20should%20be%20truncated&description=A%20deliberately%20long%20description%20that%20should%20also%20be%20truncated` — truncation path
   3. `browser_console_messages` — flag any errors (Satori font fetch, unsupported CSS, etc.).
   4. `browser_close` and stop the dev server.

Report the build output, the three OG screenshots, and any console errors. If everything passes, say so in one line.
