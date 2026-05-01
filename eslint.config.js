import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import astro from 'eslint-plugin-astro'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const reactFiles = ['**/*.{jsx,tsx}']
const configFiles = ['*.config.{js,mjs,cjs,ts,mts,cts}', 'eslint.config.js']

export default defineConfig([
  globalIgnores(['.astro/**', '.vercel/**', 'dist/**', 'node_modules/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: reactFiles,
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
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
