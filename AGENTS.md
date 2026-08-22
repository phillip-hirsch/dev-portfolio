# AGENTS.md

Single-page Astro portfolio for `philliphirsch.com`, deployed on Vercel with a dynamic Open Graph image endpoint.

## Essentials

- Use `bun` for dependency management and scripts.
- Before considering a task complete, run `bun run astro:check`, `bun run lint`, `bun run format:check`, and `bun run build`.
- Tests live in `tests/` and assert on the build output — run `bun run build` first, then `bun test`.

## Repo Docs

- [Architecture](docs/agents/architecture.md)
- [Components](docs/agents/components.md)
- [Styling](docs/agents/styling.md)
- [Tooling](docs/agents/tooling.md)
