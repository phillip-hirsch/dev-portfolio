import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const configFiles = ['*.config.{js,mjs,cjs,ts,mts,cts}', 'eslint.config.js']

export default defineConfig([
  globalIgnores(['.astro/**', '.vercel/**', 'dist/**', 'node_modules/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Astro's recommended flat config provides browser globals for embedded
  // client-side scripts. We intentionally avoid applying `globals.browser`
  // repo-wide so server files like `src/pages/og.png.ts` don't silently gain
  // browser-only globals.
  ...astro.configs['flat/recommended'],
  {
    files: configFiles,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  eslintConfigPrettier,
])
