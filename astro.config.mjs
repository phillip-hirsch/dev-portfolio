// @ts-check

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.philliphirsch.com',
  adapter: vercel(),

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
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.message.includes('externalized for browser compatibility')
          )
            return
          defaultHandler(warning)
        },
      },
    },
  },

  integrations: [react()],
})
