// @ts-check
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      name: 'Public Sans',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
    },
    {
      name: 'Rubik',
      cssVariable: '--font-brand',
      provider: fontProviders.google(),
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
})
