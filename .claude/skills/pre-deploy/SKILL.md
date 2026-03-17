---
name: pre-deploy
description: Run a full production build to validate the site before deploying
disable-model-invocation: true
---

Run the following commands in sequence and report results:

1. `bunx --bun biome check .` — lint/format check
2. `bunx --bun astro check` — TypeScript + Astro type check
3. `bun run build` — full production build

If any step fails, report the error and stop. Do not attempt fixes automatically — surface the error for the user to review.
