# Migrating from ESLint + Prettier to oxlint + oxfmt

Researched 2026-10-27. Covers this repo: Astro 7.4, React 19, Tailwind 4.3, TypeScript 6, bun 1.4.

**How this was checked.** Claims come from the oxc.rs docs, oxc source and changelogs, npm metadata, and upstream GitHub PRs and issues, each linked inline. Claims marked **[trial]** come from running the tools on a throwaway copy of this repo in `/tmp`, using oxlint 1.89.0, oxfmt 0.74.0, and @oxlint/migrate 1.89.0. The repo itself was not touched. Those versions are one release behind the latest because the local npm config refuses packages published in the last 24 hours (`npm pack oxfmt@0.75.0` failed with "No matching version found … with a date before 10/26/2026"). The 0.75.0 changelog lists only a performance change ([CHANGELOG](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md)), so the results should carry over.

## 1. TL;DR

A full replacement is workable today. I recommend it over a hybrid setup.

- **Formatting:** oxfmt formats `.astro` files as of 0.73.0 (2026-10-13). It needs two things: `@astrojs/compiler-rs` installed and `"astro": true` in the config. On this repo, oxfmt's output matches Prettier's except for Tailwind class order. **[trial]**
- **Tailwind sorting is broken in the current setup.** With the repo's versions (prettier-plugin-astro 1.1.2 and prettier-plugin-tailwindcss 0.8.1), Prettier sorts **no** Tailwind classes in `.astro` files. The fix is merged upstream but hasn't been released. oxfmt's built-in sorter does handle `.astro`, so switching fixes this. It also means a one-time reorder of classes in 12 `.astro` files. **[trial]**
- **Linting:** oxlint lints `.astro` frontmatter and `<script>` blocks, but not the template. `eslint-plugin-astro` can't run under oxlint. `@oxlint/migrate` adds it as a JS plugin anyway, and all 9 of its recommended rules then do nothing, with no error. Every eslint-js and typescript-eslint recommended rule carries over except 4. Two of those 4 are nursery rules and two are covered by strict mode. The proposed config reports 0 issues across 31 files, the same as ESLint today. **[trial]**
- **What a full switch costs:** the 9 `eslint-plugin-astro` rules, which find nothing in this repo today, plus a one-time Tailwind reorder. **What it removes:** 9 devDependencies (3 are added back), 3 config files, and the broken Tailwind sorting.

## 2. Findings

### 2.1 Versions, stability, packages, CLI, config files

| Package                | Latest (2026-10-27) | Status                                                                                     | Source                                                                                                                                                        |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oxlint`               | 1.90.0              | Stable since v1.0 (June 2025)                                                              | [npm](https://www.npmjs.com/package/oxlint), [blog: Oxlint v1.0 Stable](https://oxc.rs/blog/2025-06-10-oxlint-stable)                                         |
| `oxfmt`                | 0.75.0              | **Beta** since 2026-02-24. Still 0.x; XML/SVG support is listed as "Planned for Oxfmt 1.0" | [npm](https://www.npmjs.com/package/oxfmt), [blog: Oxfmt Beta](https://oxc.rs/blog/2026-02-24-oxfmt-beta), [compatibility](https://oxc.rs/compatibility.html) |
| `@oxlint/migrate`      | 1.89.0              | ESLint flat config → `.oxlintrc.json`                                                      | [npm](https://www.npmjs.com/package/@oxlint/migrate)                                                                                                          |
| `eslint-plugin-oxlint` | 1.89.0              | For hybrid setups only                                                                     | [npm](https://www.npmjs.com/package/eslint-plugin-oxlint)                                                                                                     |
| `oxlint-tsgolint`      | 7.0.2005            | Type-aware engine; stable since 2026-07-22                                                 | [npm](https://www.npmjs.com/package/oxlint-tsgolint), [blog](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable)                                        |
| `@astrojs/compiler-rs` | 0.5.2               | Needed for oxfmt to format `.astro`                                                        | [npm](https://www.npmjs.com/package/@astrojs/compiler-rs)                                                                                                     |

- **Engines:** both tools require Node `^20.19.0 || >=22.12.0` (`npm view oxlint engines`). The repo's `>=22.23.4` is fine. Both also run under `bunx --bun`. **[trial]**
- **Peer dependencies:** oxfmt declares `@astrojs/compiler-rs`, `svelte`, and `vite-plus` as optional peers. oxlint declares `oxlint-tsgolint` and `vite-plus` as optional peers (`npm view … peerDependenciesMeta`).
- **CLI:** `oxlint [paths]` and `oxlint --fix`. `oxfmt` writes files and `oxfmt --check` only checks ([formatter docs](https://oxc.rs/docs/guide/usage/formatter.html)). With no path, both run on the current directory.
- **oxlint config files:** `.oxlintrc.json` or `oxlint.config.ts` with `defineConfig` from `"oxlint"` ([JS plugins page](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) shows both forms).
- **oxfmt config files:** `.oxfmtrc.json`, `.oxfmtrc.jsonc`, `oxfmt.config.ts`, or `oxfmt.config.mts` ([migrate guide, step 3](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html#step-3-migrate-configuration)).

### 2.2 Astro support (most important)

#### oxfmt formats `.astro`, but only when enabled

- Since **oxfmt 0.73.0** (2026-10-13): "Support Astro via `prettier-plugin-astro@1.x`" ([#27386](https://github.com/oxc-project/oxc/pull/27386)). The same release added Astro support to `--migrate prettier` and the LSP ([CHANGELOG 0.73.0](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md)). The design is described in [oxc#19715](https://github.com/oxc-project/oxc/issues/19715).
- **How it works:** `.astro` is a "Prettier-backed" language. oxfmt ships its own copy of Prettier and runs it for these files. "`.astro` requires the `@astrojs/compiler-rs` package to be installed and the `astro` option to be enabled" ([language support](https://oxc.rs/docs/guide/usage/formatter/language-support.html)).
- **What the package contains:** the oxfmt 0.74.0 tarball includes `prettier@3.9.10` and `prettier-plugin-astro@1.1.1` (the repo uses 1.1.2). The plugin code does `import { parse } from "@astrojs/compiler-rs"`, and the schema says oxfmt "does NOT bundle it, so install it in your project, otherwise formatting fails" (`configuration_schema.json`, `astro` property; [config reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html#astro)).
- **This repo already has the compiler:** `astro@7.4.2` depends on `@astrojs/compiler-rs ^0.5.1`, and bun hoists it to `node_modules/@astrojs/compiler-rs` (0.5.2 in `bun.lock`). Depending on hoisting is fragile, so add it as a direct devDependency.
- **Options:** `astro: true | { allowShorthand?, compressHTML?, skipFrontmatter? }`. `compressHTML` defaults to `"jsx"` and should mirror Astro's own `compressHTML` setting (schema `AstroConfig`). Frontmatter is formatted by the bundled Prettier, not by oxfmt's native engine (schema, `embeddedLanguageFormatting` note).
- **With `astro: false` or unset,** `.astro` files are skipped without any message. The check went from 44 files to 19. **[trial]**
- **Speed:** Prettier-backed languages need Node and the npm package. The standalone binary from GitHub Releases skips them ([language support](https://oxc.rs/docs/guide/usage/formatter/language-support.html#prettier-backed)). So `.astro` files don't get the native speedup, which doesn't matter at this repo's size: about 250 ms for all 44 files. **[trial]**
- **Output on this repo:** with the migrated config and no Tailwind stylesheet set, `oxfmt --check` flagged only 2 source files, and both diffs were Tailwind class order. No whitespace, attribute, or frontmatter differences. **[trial]**

#### oxlint lints frontmatter and `<script>` blocks, not the template

- oxlint's partial loader handles `vue`, `astro`, and `svelte` files (`LINT_PARTIAL_LOADER_EXTENSIONS` in [partial_loader/mod.rs](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/loader/partial_loader/mod.rs)). `AstroPartialLoader` extracts the `---` frontmatter (parsed as TypeScript) and each `<script>` block ([astro.rs](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/loader/partial_loader/astro.rs)). It skips non-JS `type` values such as import maps ([oxc#21954](https://github.com/oxc-project/oxc/issues/21954)).
- The compatibility matrix marks Astro as partial for oxlint: "No template linting yet" ([compatibility](https://oxc.rs/compatibility.html), tracked in [oxc#15761](https://github.com/oxc-project/oxc/issues/15761)).
- **[trial]** On a fixture, oxlint caught `debugger` in both the frontmatter and a `<script>`. It did not catch the template-level problems that ESLint caught: `set:html` conflicting with `set:text`, and an undefined identifier inside `{}`.

#### `eslint-plugin-astro` can't run under oxlint

- JS plugins are alpha, and "Custom file formats and parsers (e.g. Svelte, Vue, Angular)" are listed as "Not supported yet" ([JS plugins → API support](https://oxc.rs/docs/guide/usage/linter/js-plugins.html#api-support)).
- Every rule in `eslint-plugin-astro` begins with `if (!context.sourceCode.parserServices?.isAstro) return {}`. Only `astro-eslint-parser` sets that value, so under oxlint each rule returns immediately. Checked in `eslint-plugin-astro@3.2.1/lib/index.mjs`, more than 20 occurrences ([repo](https://github.com/ota-meshi/eslint-plugin-astro)).
- **[trial]** `@oxlint/migrate` still writes `"jsPlugins": ["eslint-plugin-astro"]` and the 9 `astro/*` rules, and prints only "special parser detected: astro-eslint-parser". oxlint then loads the plugin without error. On a fixture with `export const x` in a component and conflicting `set:` directives, none of the 9 rules fired.

### 2.3 Tailwind class sorting

- oxfmt has a built-in option, `sortTailwindcss`. It is "Based on prettier-plugin-tailwindcss" and off by default ([sorting](https://oxc.rs/docs/guide/usage/formatter/sorting.html#sort-tailwind-css-classes)). Supported languages include Astro, JSX/TSX, HTML, and CSS (schema).
- **Options** use the Prettier plugin's names without the `tailwind` prefix: `stylesheet` (Tailwind v4 entry CSS, resolved relative to the oxfmt config; defaults to the installed Tailwind's `theme.css`), `config` (v3), `functions`, `attributes`, `preserveWhitespace`, and `preserveDuplicates`. `functions` and `attributes` match exact names only; regex isn't supported (schema `SortTailwindcssConfig`).
- **Prettier doesn't sort `.astro` classes in this repo.** prettier-plugin-astro 1.x returns a different AST (ESTree/JSX from `@astrojs/compiler-rs`), "so the Astro transform silently matched nothing" ([tailwindlabs/prettier-plugin-tailwindcss#473](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/pull/473); also [withastro/prettier-plugin-astro#483](https://github.com/withastro/prettier-plugin-astro/issues/483)). The fix was merged on 2026-09-29, but `latest` on npm is still 0.8.1 from 2026-07-15. Only `0.0.0-insiders.5b27f94` contains it (`npm view prettier-plugin-tailwindcss time`).
  - **[trial]** With the repo's `.prettierrc`, `<div class="p-4 flex">` in a `.astro` file stays unsorted. The same plugin sorts `className` in `.tsx`.
- **oxfmt sorts `.astro` classes** using its own build of the Tailwind plugin (`prettier-plugin-tailwindcss@0.0.0` inside the tarball). The oxfmt maintainer wrote and merged the upstream fix in #473.
- **Custom theme tokens need `stylesheet`.** The current `.prettierrc` has no `tailwindStylesheet`, so only Tailwind's default theme is known. Custom tokens from `src/styles/global.css` `@theme` (`accent-regular`, `gray-0`, and so on) count as unknown and get sorted to the front.
  - **[trial]** Without a stylesheet, oxfmt changes 2 files. With `"stylesheet": "./src/styles/global.css"`, it changes 12 `.astro` files, moving custom-token classes into their correct positions. Example: `bg-accent-regular focus-visible:outline-accent-regular hover:bg-accent-dark inline-flex …` becomes `inline-flex … bg-accent-regular … hover:bg-accent-dark … focus-visible:outline-accent-regular`.

### 2.4 Rule coverage

**[trial]** `@oxlint/migrate --details` on `eslint.config.js` produced 91 rules and skipped 4:

| ESLint rule set                                    | Result in oxlint                                                                                                                                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@eslint/js` recommended (ESLint 10)               | All except `no-undef` and `no-useless-assignment` (both nursery, so skipped by default) and `no-dupe-args` and `no-octal` ("Superseded by strict mode", since ES modules are always strict)                                                   |
| `typescript-eslint` recommended, not type-aware    | All 20 rules carried over. `no-unused-vars`, `no-unused-expressions`, and `no-array-constructor` map to the eslint-namespace rules; the others become `typescript/*`. The TS-file override that turns off rules covered by TypeScript is kept |
| `eslint-plugin-astro` `flat/recommended` (9 rules) | Added as JS-plugin rules, but none of them run (see 2.2)                                                                                                                                                                                      |
| `eslint-config-prettier`                           | Not needed. oxlint has no style rules enabled in this config                                                                                                                                                                                  |

Notes:

- **`no-undef` mostly didn't apply anyway.** typescript-eslint's `eslint-recommended` turns it off for `.ts/.tsx/.mts/.cts` ("ts(2304) & ts(2552)"; `@typescript-eslint/eslint-plugin@8.72.1` `dist/configs/eslint-recommended-raw.js`). After migration, the only JS file left is `astro.config.mjs`.
  - **[trial]** Turning on the nursery `no-undef` in oxlint showed gaps. It missed `export default fooBar`. It also flagged browser globals in `.astro` `<script>` blocks, because oxlint gives the whole `.astro` file one set of globals, while ESLint gave scripts their own browser-global "virtual files". Recommendation: leave it off.
- **`no-unused-vars` in `.astro` `<script>` blocks.** ESLint turned it off only in frontmatter; `<script>` virtual files (`*.astro/*.ts`) were still checked. oxlint overrides apply to the whole `.astro` file, so unused variables in client scripts are no longer reported. **[trial]** The override itself is still required: oxlint only sees the frontmatter, so imports used only in the template would look unused.
- **Type-aware linting is not needed.** The current config uses `tseslint.configs.recommended`, which has no type-aware rules. Type-aware mode would also require TypeScript **7.0+** ([type-aware → TypeScript compatibility](https://oxc.rs/docs/guide/usage/linter/type-aware.html#typescript-compatibility)), and this repo is on `typescript ^6.0.3`. Revisit after a TS 7 upgrade: `oxlint --type-aware --type-check` could then replace part of `astro check`'s TS checking, though not its `.astro` template checking.
- **Optional extras, not part of parity:** the built-in `react` and `jsx-a11y` plugins are available but off by default ([built-in plugins](https://oxc.rs/docs/guide/usage/linter/plugins.html)). Setting `plugins` replaces the default plugin list rather than adding to it.

### 2.5 Migration tooling

**`@oxlint/migrate`** ([docs](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html), [options](https://github.com/oxc-project/oxlint-migrate)):

- **Handles:** rules, severities, and options; file overrides; `globals.*` converted to `env`/`globals`; root ignores. Flags: `--with-nursery`, `--type-aware`, `--js-plugins=false`, `--replace-eslint-comments`, `--details`, `--merge`.
- **[trial] Problems on this repo:**
  1. It emits an override with `"jsPlugins": ["eslint-plugin-prettier"]` and `"prettier/prettier": "off"`. This comes from `eslint-plugin-astro`'s virtual-file config. The repo doesn't use that plugin, so oxlint fails with "Failed to load JS plugin: eslint-plugin-prettier" until the override is deleted.
  2. It adds the `eslint-plugin-astro` JS plugin, which does nothing (2.2).
  3. It keeps `eslint.config.js` in the config-files glob.
  4. It writes `"categories": { "correctness": "off" }` and lists each rule explicitly, so the config is long but matches ESLint exactly.
- The bun invocation is `bunx @oxlint/migrate`. That failed here ("could not determine executable") because the package's bin is named `migrate`. `./node_modules/.bin/migrate` worked after `bun add -d @oxlint/migrate`. **[trial]**

**`oxfmt --migrate prettier`** ([docs](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html#step-3-migrate-configuration); source: `dist/migrate-prettier-*.js` in the tarball):

- **Handles:**
  - Reads `.prettierrc` only if it's JSON. This repo's is.
  - Copies Prettier-compatible options.
  - Converts `prettier-plugin-tailwindcss`, `-astro`, `-svelte`, and `-packagejson` options to the built-in equivalents.
  - Turns `overrides[].options.parser` into `associations`.
  - Copies `.prettierignore` lines into `ignorePatterns`.
  - Sets `printWidth: 80` if missing.
  - Sets `sortPackageJson: false` unless `prettier-plugin-packagejson` was in use.
- **Doesn't handle:** YAML, JSON5, or TOML configs; logic in JS configs; nested configs. Other plugins are skipped with a warning.
- **[trial]** On this repo, it produced a working `.oxfmtrc.json` with `"astro": {}`, `"sortTailwindcss": {}`, an `associations` entry for `**/*.astro` (not needed, because `.astro` is detected by extension), and the ignore list. It does not add a Tailwind `stylesheet`, because the Prettier config never had one.

### 2.6 Prettier option parity

Defaults come from the oxfmt 0.74.0 `configuration_schema.json`.

| `.prettierrc`                   | oxfmt default                   | Need to set?                                                                                                 |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `singleQuote: true`             | `false`                         | Yes                                                                                                          |
| `jsxSingleQuote: false`         | `false`                         | No                                                                                                           |
| `semi: false`                   | `true`                          | Yes                                                                                                          |
| `trailingComma: "all"`          | `"all"`                         | No                                                                                                           |
| `printWidth: 80`                | **`100`**                       | Yes                                                                                                          |
| `tabWidth: 2`                   | `2`                             | No                                                                                                           |
| `useTabs: false`                | `false`                         | No                                                                                                           |
| `bracketSpacing: true`          | `true`                          | No                                                                                                           |
| `singleAttributePerLine: false` | `false`                         | No                                                                                                           |
| `endOfLine: "lf"`               | `"lf"` (`"auto"` not supported) | No                                                                                                           |
| `plugins: [astro]`              | —                               | `astro: true` and install `@astrojs/compiler-rs`                                                             |
| `plugins: [tailwindcss]`        | —                               | `sortTailwindcss: { stylesheet }`                                                                            |
| `overrides: parser astro`       | `.astro` detected by extension  | No                                                                                                           |
| (none)                          | **`sortPackageJson: true`**     | Set `false` to keep `package.json` key order. Its order "is NOT compatible with prettier-plugin-packagejson" |

- **Conformance:** "Oxfmt is compatible with Prettier v3.9.9 for many configurations." Prettier plugins aren't supported, apart from the ones implemented natively ([migrate guide → before you migrate](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html#before-you-migrate)). Oxfmt is tested against Prettier's own test suite, treats unexpected differences as bugs, and documents deliberate divergences ([formatter docs](https://oxc.rs/docs/guide/usage/formatter.html#prettier-compatible); [JS/TS divergences](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter/DIVERGENCES.md), [CSS](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_css/DIVERGENCES.md), [Markdown](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_markdown/DIVERGENCES.md), [YAML](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_yaml/DIVERGENCES.md)).
- **[trial]** Across the repo's 44 formattable files (`.ts`, `.tsx`, `.astro`, `.css`, `.json`, `.md`, `.yml`), the only source diffs were Tailwind class order.
- **`.editorconfig`:** oxfmt reads it, and these options override it. The repo has none.
- **Ignore comments:** `// prettier-ignore` keeps working; `// oxfmt-ignore` works only in JS/TS ([migrate guide](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html#update-prettier-ignore-comments)).

### 2.7 Per-file overrides, globals, ignores

- **oxlint overrides** accept `files`, `excludeFiles`, `env`, `globals`, `plugins`, `jsPlugins`, and `rules`. Top-level config keys are `$schema`, `categories`, `env`, `extends`, `globals`, `ignorePatterns`, `jsPlugins`, `options`, `overrides`, `plugins`, `rules`, and `settings` (oxlint 1.89.0 schema). An `astro` env exists.
- **Node globals only in config files:** `{ "files": ["*.config.{js,mjs,cjs,ts,mts,cts}"], "env": { "node": true } }`. **[trial]** `process` was accepted in `a.config.mjs` and flagged in `notconfig.mjs` when `no-undef` was on. With `no-undef` off, as proposed, env and globals have no effect. That was mostly true under ESLint as well (2.4).
- **Unused vars off in `.astro`:** `{ "files": ["**/*.astro"], "rules": { "no-unused-vars": "off" } }`. One rule name covers both ESLint and typescript-eslint, since oxlint has a single `no-unused-vars`.
- **oxlint ignores:** `ignorePatterns` uses gitignore syntax relative to the config file (schema). `.gitignore` is respected automatically, and so is `.eslintignore` ([migrate guide](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html#run-the-migration-tool)). `.astro/`, `dist/`, and `.vercel` are already in `.gitignore`.
- **oxfmt ignores** ([ignore files](https://oxc.rs/docs/guide/usage/formatter/ignore-files.html)):
  - Reads `.gitignore` (but not the global `core.excludesFile`), `.prettierignore`, and `ignorePatterns`.
  - Always skips `.git` and `node_modules`. Always skips lock files like `package-lock.json` and `pnpm-lock.yaml`; whether `bun.lock` counts isn't stated, so keep it in the list.
  - Files matched by `ignorePatterns` or `.prettierignore` can't be formatted even when named explicitly.
  - `.prettierignore` can be deleted once its patterns are in `ignorePatterns`.

### 2.8 Hybrid: oxlint alongside ESLint

- The documented pattern is `oxlint && eslint`, with [`eslint-plugin-oxlint`](https://github.com/oxc-project/eslint-plugin-oxlint) last in the ESLint config so ESLint skips rules oxlint already runs. It can read the oxlint config directly: `...(await oxlint.buildFromConfigFile('./.oxlintrc.json'))` (eslint-plugin-oxlint README; [migrate guide → running together](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html#running-oxlint-and-eslint-together)).
- **For this repo:** keep `eslint`, `eslint-plugin-astro`, and `typescript-eslint` (the parser for `.astro` frontmatter), and run ESLint only on `**/*.astro` to keep the 9 Astro rules and template `no-undef`. That keeps most of the dependencies and two configs to maintain, for rules that find nothing today. Not recommended unless template linting matters.

### 2.9 Editor and CI

- **VS Code:** use the single extension `oxc.oxc-vscode` for both lint and format. It runs `oxfmt --lsp` from the project, so `oxfmt` must be installed locally. Set `"editor.defaultFormatter": "oxc.oxc-vscode"` ([formatter editors](https://oxc.rs/docs/guide/usage/formatter/editors.html)). The LSP formats `.astro` as of 0.73.0 ([#27388 in CHANGELOG](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md)). `.vscode/` is gitignored here, so this is a local setting only.
- **CI and scripts:** `oxlint` and `oxfmt --check`. The repo has no CI workflow; the gates in `AGENTS.md` run through `bun run`.
- **Hook behavior** **[trial]**, relevant to the PostToolUse hook:
  - `oxfmt <ignored-file>` exits 2 ("Expected at least one target file"). `oxfmt --no-error-on-unmatched-pattern <file>` exits 0 for ignored or unsupported files.
  - `oxlint --fix README.md` exits 1 ("No files found to lint"). Either keep the extension `case` filter or add `--no-error-on-unmatched-pattern`, which oxlint also supports.

## 3. Proposed configs

These are the configs validated in the trial: oxlint reported 0 issues on 31 files with 82 rules, and oxfmt's first run reformatted 12 `.astro` files (Tailwind order only).

### `.oxlintrc.json`

This is the `@oxlint/migrate` output with the junk removed:

- removed the `eslint-plugin-prettier` override, the `eslint-plugin-astro` JS plugin, and its 9 rules
- merged the two `.astro` overrides into one
- dropped `eslint.config.js` from the config-files glob
- dropped `node_modules/**` from the ignore list, since it's always ignored

```jsonc
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn"],
  "categories": { "correctness": "off" },
  "env": { "builtin": true },
  "ignorePatterns": [".astro/**", ".vercel/**", "dist/**"],
  "rules": {
    // @eslint/js recommended (ESLint 10), minus nursery no-undef / no-useless-assignment
    "constructor-super": "error",
    "for-direction": "error",
    "getter-return": "error",
    "no-async-promise-executor": "error",
    "no-case-declarations": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-const-assign": "error",
    "no-constant-binary-expression": "error",
    "no-constant-condition": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-class-members": "error",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-empty-static-block": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-fallthrough": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-import-assign": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-new-native-nonconstructor": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-obj-calls": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-self-assign": "error",
    "no-setter-return": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-this-before-super": "error",
    "no-unassigned-vars": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-labels": "error",
    "no-unused-private-class-members": "error",
    "no-unused-vars": "error",
    "no-useless-backreference": "error",
    "no-useless-catch": "error",
    "no-useless-escape": "error",
    "no-with": "error",
    "preserve-caught-error": "error",
    "require-yield": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    // typescript-eslint recommended
    "no-array-constructor": "error",
    "no-unused-expressions": "error",
    "typescript/ban-ts-comment": "error",
    "typescript/no-duplicate-enum-values": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-extra-non-null-assertion": "error",
    "typescript/no-misused-new": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-asserted-optional-chain": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-this-alias": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-declaration-merging": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-wrapper-object-types": "error",
    "typescript/prefer-as-const": "error",
    "typescript/prefer-namespace-keyword": "error",
    "typescript/triple-slash-reference": "error",
  },
  "overrides": [
    {
      // typescript-eslint's eslint-recommended: rules TypeScript already enforces
      "files": ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      "rules": {
        "constructor-super": "off",
        "getter-return": "off",
        "no-class-assign": "off",
        "no-const-assign": "off",
        "no-dupe-class-members": "off",
        "no-dupe-keys": "off",
        "no-func-assign": "off",
        "no-import-assign": "off",
        "no-new-native-nonconstructor": "off",
        "no-obj-calls": "off",
        "no-redeclare": "off",
        "no-setter-return": "off",
        "no-this-before-super": "off",
        "no-unreachable": "off",
        "no-unsafe-negation": "off",
        "no-with": "off",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
      },
    },
    {
      // oxlint only sees frontmatter + <script>, so template-only usages look unused.
      "files": ["**/*.astro"],
      "env": { "astro": true, "node": true },
      "globals": { "Fragment": "readonly" },
      "rules": { "no-unused-vars": "off" },
    },
    {
      "files": ["*.config.{js,mjs,cjs,ts,mts,cts}"],
      "env": { "node": true },
    },
  ],
}
```

`.oxlintrc.json` accepts comments, as the oxc docs' own `jsonc` examples show. If plain JSON is preferred, delete the comments.

**Shorter alternative, not trialed for parity:** drop the explicit rule list and use `"categories": { "correctness": "error" }` with the default plugins. That's oxlint's own default set. It is close to ESLint's recommended set but not the same, so check its output before using it.

### `.oxfmtrc.json`

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "singleQuote": true,
  "semi": false,
  "printWidth": 80,
  "sortPackageJson": false,
  "astro": true,
  "sortTailwindcss": {
    "stylesheet": "./src/styles/global.css"
  },
  "ignorePatterns": [
    ".astro",
    "bun.lock",
    "bun.lockb",
    "dist",
    "public/assets",
    "public/favicon.ico",
    ".agents",
    ".claude",
    ".cursor",
    ".mcp.json"
  ]
}
```

Options that match oxfmt defaults are left out (see 2.6). To limit the first diff to 2 files, drop `stylesheet`, but then custom tokens stay mis-sorted, as they are now.

### `package.json`

```diff
   "scripts": {
-    "lint": "eslint \"**/*.{js,mjs,cjs,jsx,ts,tsx,astro}\"",
-    "lint:fix": "eslint \"**/*.{js,mjs,cjs,jsx,ts,tsx,astro}\" --fix",
-    "format": "prettier . --write",
-    "format:check": "prettier . --check"
+    "lint": "oxlint",
+    "lint:fix": "oxlint --fix",
+    "format": "oxfmt",
+    "format:check": "oxfmt --check"
   },
```

- **Remove (9):** `@eslint/js`, `eslint`, `eslint-config-prettier`, `eslint-plugin-astro`, `globals`, `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `typescript-eslint`. Nothing in `src/` imports any of them. `@astrojs/language-server` lists `prettier` and `prettier-plugin-astro` only as optional peers (`bun.lock`).
- **Add (3):** `oxlint`, `oxfmt`, `@astrojs/compiler-rs` (`^0.5.2`, to match what `astro` already pulls in).
- **Keep:** `typescript`, which `astro check` uses.
- **Delete files:** `eslint.config.js`, `.prettierrc`, `.prettierignore`.
- **Install note:** with the local 24-hour release-age rule, install `oxlint@1.89.0` and `oxfmt@0.74.0` today, or wait a day for 1.90.0 and 0.75.0.

### Order of steps

1. `bun add -d oxlint oxfmt @astrojs/compiler-rs`.
2. Optionally run `bun add -d @oxlint/migrate && ./node_modules/.bin/migrate` and `bunx oxfmt --migrate prettier`, then apply the cleanups above. Or paste the configs above directly.
3. Swap the scripts, remove the old dependencies and config files, and run `bun install`.
4. `bun run format`, then commit the reformat as its own commit and add its SHA to `.git-blame-ignore-revs` ([migrate guide](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html#update-git-blame-ignore-revs)).
5. Run the `AGENTS.md` gates: `astro:check`, `lint`, `format:check`, `build`.

## 4. Gaps and risks

1. **9 `eslint-plugin-astro` rules are lost.** The deprecated-API checks (`Astro.canonicalURL`, `Astro.fetchContent`, `Astro.resolve`, `getEntryBySlug`) target APIs that are gone in Astro 7. The template checks (`no-conflict-set-directives`, `missing-client-only-directive-value`) and `no-exports-from-components` / `no-prerender-export-outside-pages` have no oxlint equivalent. Whether `astro check` catches any of these is **unverified**. None of them fire on the repo today.
2. **No template linting.** Undefined identifiers inside `{…}` in templates were caught by ESLint's `no-undef`. `astro check` likely catches them through TypeScript (**unverified**).
3. **`no-unused-vars` no longer runs in `.astro` `<script>` blocks** (2.4). It's a small loss, and `astro check` may report unused locals depending on tsconfig (**unverified**; `astro/tsconfigs/strict` doesn't obviously set `noUnusedLocals`).
4. **oxfmt is beta (0.x)**, and Astro support has existed for only two weeks (since 0.73.0). Astro formatting goes through Prettier 3.9.10 and prettier-plugin-astro 1.1.1 inside oxfmt, so plugin updates arrive only when oxfmt updates, not when you bump them yourself. 0.73.0 included a breaking change to `--migrate prettier` ([CHANGELOG](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md)), so expect more config changes before 1.0.
5. **`@astrojs/compiler-rs` must resolve from the project.** If it's missing, `.astro` formatting fails (schema note). Today it resolves only because bun hoists it from `astro`; add it directly.
6. **One-time formatting churn:** 12 `.astro` files with Tailwind order changes only (2 without `stylesheet`). Both sets are listed in the trial notes in 2.3.
7. **JS plugins are alpha** ([docs](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)). This only matters if JS plugins are added later; the proposed config uses none.
8. **`@oxlint/migrate` output isn't usable as-is** (2.5). Rerunning it later will bring back the broken `eslint-plugin-prettier` override.

## 5. Repo files that would need updating

| File                                                 | Reference                                                                                                                           | Change                                                                                                                                                                                |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                       | scripts and devDeps                                                                                                                 | See §3                                                                                                                                                                                |
| `eslint.config.js`, `.prettierrc`, `.prettierignore` | configs                                                                                                                             | Delete; add `.oxlintrc.json` and `.oxfmtrc.json`                                                                                                                                      |
| `.claude/settings.json`                              | PostToolUse hook: `bunx --bun prettier --write --log-level warn --ignore-unknown "${file}"` and `bunx --bun eslint --fix "${file}"` | `bunx --bun oxfmt --no-error-on-unmatched-pattern "${file}"` and `… bunx --bun oxlint --fix "${file}"`, keeping the extension `case` filter. Both work under `bunx --bun` **[trial]** |
| `docs/agents/tooling.md`                             | "ESLint intentionally disables unused import and variable checks inside `.astro` files."                                            | Say oxlint, and give the reason: only frontmatter and `<script>` are parsed                                                                                                           |
| `.claude/skills/verify-before-done/SKILL.md`         | lines 10–11 ("ESLint", "Prettier"), line 18 ("ran Prettier+ESLint")                                                                 | oxlint / oxfmt                                                                                                                                                                        |
| `.claude/skills/pre-deploy/SKILL.md`                 | lines 10–11                                                                                                                         | oxlint / oxfmt                                                                                                                                                                        |
| `.claude/agents/astro-tailwind-reviewer.md`          | line 32: "Class-order issues that `prettier-plugin-tailwindcss` should auto-fix"                                                    | oxfmt `sortTailwindcss`                                                                                                                                                               |
| `README.md`                                          | lines 14–15 (features), 35–36 (tech stack table), 85 ("Rewrite files with Prettier")                                                | oxlint / oxfmt                                                                                                                                                                        |
| `AGENTS.md` / `CLAUDE.md` (symlink)                  | Gate commands only, no tool names                                                                                                   | No change                                                                                                                                                                             |

`.agents/`, `.cursor/`, `.codex/`, `docs/agents/{architecture,components,styling}.md`, and `src/` don't mention ESLint or Prettier (`grep -rniE "eslint|prettier"`).

## 6. Sources

**oxc docs**

- https://oxc.rs/docs/guide/usage/formatter.html
- https://oxc.rs/docs/guide/usage/formatter/language-support.html
- https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html
- https://oxc.rs/docs/guide/usage/formatter/sorting.html
- https://oxc.rs/docs/guide/usage/formatter/ignore-files.html
- https://oxc.rs/docs/guide/usage/formatter/editors.html
- https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html
- https://oxc.rs/compatibility.html
- https://oxc.rs/docs/guide/usage/linter/js-plugins.html
- https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html
- https://oxc.rs/docs/guide/usage/linter/type-aware.html
- https://oxc.rs/docs/guide/usage/linter/plugins.html

**oxc blog**

- https://oxc.rs/blog/2025-06-10-oxlint-stable
- https://oxc.rs/blog/2026-02-24-oxfmt-beta
- https://oxc.rs/blog/2026-07-22-type-aware-linting-stable

**oxc source, changelogs, issues**

- https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md
- https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/loader/partial_loader/astro.rs
- https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/loader/partial_loader/mod.rs
- https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter/DIVERGENCES.md
- https://github.com/oxc-project/oxc/pull/27386
- https://github.com/oxc-project/oxc/issues/19715
- https://github.com/oxc-project/oxc/issues/15761
- https://github.com/oxc-project/oxc/issues/21954
- https://github.com/oxc-project/oxlint-migrate
- https://github.com/oxc-project/eslint-plugin-oxlint

**Upstream plugins**

- https://github.com/tailwindlabs/prettier-plugin-tailwindcss/pull/473
- https://github.com/withastro/prettier-plugin-astro/issues/483
- https://github.com/ota-meshi/eslint-plugin-astro

**npm**

- https://www.npmjs.com/package/oxlint
- https://www.npmjs.com/package/oxfmt
- https://www.npmjs.com/package/@oxlint/migrate
- https://www.npmjs.com/package/eslint-plugin-oxlint
- https://www.npmjs.com/package/oxlint-tsgolint
- https://www.npmjs.com/package/@astrojs/compiler-rs
- https://www.npmjs.com/package/prettier-plugin-tailwindcss

**Package contents read locally (npm tarballs, not installed in the repo)**

- `oxfmt@0.74.0`: `configuration_schema.json`, `dist/migrate-prettier-*.js`, the bundled `prettier-plugin-astro@1.1.1`, `prettier@3.9.10`, and its Tailwind sorter
- `oxlint@1.89.0`: `configuration_schema.json`
- `eslint-plugin-oxlint@1.89.0`: README
- `eslint-plugin-astro@3.2.1`: `lib/index.mjs`
- `@typescript-eslint/eslint-plugin@8.72.1`: `dist/configs/eslint-recommended-raw.js`
