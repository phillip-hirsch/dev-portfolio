---
name: verify-before-done
description: Run the full set of project gates (astro:check, lint, format:check, build) before declaring a task complete. Use whenever you are about to tell the user a coding task is done.
user-invocable: false
---

`AGENTS.md` requires four checks before any task is considered complete. Run them in this order — each is fast except `build`, and stopping early on a failure saves time:

1. `bun run astro:check` — TypeScript + Astro diagnostics
2. `bun run lint` — ESLint
3. `bun run format:check` — Prettier
4. `bun run build` — full production build

## Rules

- Run all four. Do not skip `build` even if the prior three pass — it catches issues the others miss (rollup warnings, adapter problems, runtime imports).
- If any step fails, fix the underlying issue and re-run from step 1. Do not declare done with a known failure.
- If you used `Edit` or `Write` during the task, the PostToolUse hook already ran Prettier+ESLint on the touched file — but `format:check` and `lint` against the whole repo can still catch issues elsewhere, so run them anyway.
- Report results to the user as part of your final summary so they know the gates passed.
