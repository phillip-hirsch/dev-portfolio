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
      name: 'Space Grotesk',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: ['400', '500', '600', '700'],
    },
    {
      name: 'Space Grotesk',
      cssVariable: '--font-brand',
      provider: fontProviders.google(),
      weights: ['500', '600', '700'],
    },
    {
      name: 'Space Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.google(),
      weights: ['400', '700'],
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
