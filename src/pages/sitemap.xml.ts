import { absoluteUrl } from '../data/site'

/**
 * XML sitemap per https://www.sitemaps.org/protocol.html. The route is
 * prerendered, so lastmod reflects the build date — the site only changes
 * when it is rebuilt and redeployed.
 */

const lastmod = new Date().toISOString().slice(0, 10)

const paths = ['/', '/about', '/contact', '/privacy']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`

export const GET = (): Response =>
  new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
