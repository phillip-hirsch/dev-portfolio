/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { educationEntries } from '../src/data/education'
import { experiences } from '../src/data/experience'
import { site } from '../src/data/site'
import { skillCategories } from '../src/data/skills'

/**
 * Verifies the agent-readiness surfaces of the built site: JSON-LD, llms.txt,
 * index.md, sitemap.xml, trust pages, the 404 recovery links, and the
 * markdown content negotiation config. Run `bun run build` first — these
 * tests assert on the Vercel build output.
 */

const outDir = join(import.meta.dir, '..', '.vercel', 'output', 'static')

const readOutput = (relativePath: string): string => {
  const path = join(outDir, relativePath)
  if (!existsSync(path)) {
    throw new Error(
      `Missing build output file: ${path}. Run \`bun run build\` before \`bun test\`.`,
    )
  }
  return readFileSync(path, 'utf-8')
}

/** Visible text of an HTML document — tags, scripts, and styles stripped. */
const visibleText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

describe('JSON-LD structured data (homepage)', () => {
  const html = readOutput('index.html')
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ]

  test('homepage embeds exactly one JSON-LD script', () => {
    expect(blocks.length).toBe(1)
  })

  const graph = JSON.parse(blocks[0]![1]!) as {
    '@context': string
    '@graph': Record<string, unknown>[]
  }
  const person = graph['@graph'].find((node) => node['@type'] === 'Person')
  const website = graph['@graph'].find((node) => node['@type'] === 'WebSite')

  test('Person node carries identity, address, contact, and profiles', () => {
    expect(graph['@context']).toBe('https://schema.org')
    expect(person).toBeDefined()
    expect(person?.name).toBe(site.name)
    expect(person?.url).toBe(`${site.url}/`)
    expect(person?.jobTitle).toBe(site.jobTitle)
    expect(person?.description).toBe(site.description)
    expect(person?.address).toMatchObject({
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    })
    expect(person?.contactPoint).toMatchObject({
      '@type': 'ContactPoint',
      contactType: 'professional inquiries',
    })
    expect(person?.sameAs).toEqual([...site.sameAs])
    expect(person?.knowsAbout).toEqual(
      skillCategories.flatMap((category) => category.items),
    )
  })

  test('WebSite node links back to the Person as publisher', () => {
    expect(website).toBeDefined()
    expect(website?.url).toBe(`${site.url}/`)
    expect(website?.publisher).toEqual({ '@id': `${site.url}/#person` })
  })
})

describe('content without JavaScript (homepage HTML)', () => {
  const html = readOutput('index.html')

  test('raw HTML contains a single h1 and 500+ chars of visible text', () => {
    expect([...html.matchAll(/<h1[\s>]/g)].length).toBe(1)
    expect(visibleText(html).length).toBeGreaterThanOrEqual(500)
  })

  test('heading structure is hierarchical, not flat', () => {
    const levels = [...html.matchAll(/<h([1-4])[\s>]/g)].map((match) =>
      Number(match[1]),
    )
    expect(levels[0]).toBe(1)
    // Sections (h2), entries (h3), and accomplishment groups (h4) all appear.
    expect(levels).toContain(2)
    expect(levels).toContain(3)
    expect(levels).toContain(4)
    // No heading level is skipped on the way down.
    levels.reduce((previous, current) => {
      expect(current).toBeLessThanOrEqual(previous + 1)
      return current
    })
  })
})

describe('markdown homepage (/index.md)', () => {
  const markdown = readOutput('index.md')

  test('mirrors the resume data as structured markdown', () => {
    expect(markdown.startsWith(`# ${site.name}`)).toBe(true)
    expect(markdown).toContain('## Experience')
    expect(markdown).toContain('## Education')
    expect(markdown).toContain('## Skills')
    expect(markdown.length).toBeGreaterThanOrEqual(500)
    for (const experience of experiences) {
      expect(markdown).toContain(experience.title)
      expect(markdown).toContain(experience.company)
    }
    for (const entry of educationEntries) {
      expect(markdown).toContain(entry.degree)
    }
    for (const category of skillCategories) {
      expect(markdown).toContain(`**${category.label}:**`)
    }
  })
})

describe('llms.txt', () => {
  const llmsTxt = readOutput('llms.txt')
  const lines = llmsTxt.split('\n')

  test('follows the llmstxt.org format', () => {
    expect(lines[0]).toBe(`# ${site.name}`)
    expect(lines.some((line) => line.startsWith('> '))).toBe(true)
    expect(lines.some((line) => line.startsWith('## '))).toBe(true)
    // H2 sections contain markdown link lists.
    expect(llmsTxt).toMatch(/- \[[^\]]+\]\(https:\/\/[^)]+\): /)
  })

  test('includes when-to-use guidance and the markdown entry points', () => {
    expect(llmsTxt.toLowerCase()).toContain('when to use')
    expect(llmsTxt).toContain('Accept: text/markdown')
    expect(llmsTxt).toContain(`${site.url}/index.md`)
    expect(llmsTxt).toContain(`${site.url}/sitemap.xml`)
  })
})

describe('sitemap.xml', () => {
  const sitemap = readOutput('sitemap.xml')

  test('lists every indexable page with a lastmod date', () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true,
    )
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    )
    for (const path of ['/', '/about', '/contact', '/privacy']) {
      expect(sitemap).toContain(`<loc>${new URL(path, site.url).href}</loc>`)
    }
    const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)]
    expect(lastmods.length).toBe(4)
    for (const [, date] of lastmods) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  test('robots.txt advertises the sitemap', () => {
    expect(readOutput('robots.txt')).toContain(
      `Sitemap: ${site.url}/sitemap.xml`,
    )
  })
})

describe('trust anchor pages', () => {
  test.each(['about', 'contact', 'privacy'])(
    '/%s serves 500+ chars of visible content',
    (page) => {
      const html = readOutput(join(page, 'index.html'))
      expect(visibleText(html).length).toBeGreaterThanOrEqual(500)
      expect(html).toMatch(/<h1[\s>]/)
    },
  )
})

describe('404 page', () => {
  const html = readOutput('404.html')

  test('points agents at the recovery surfaces', () => {
    for (const href of ['/', '/sitemap.xml', '/llms.txt', '/index.md']) {
      expect(html).toContain(`href="${href}"`)
    }
  })
})

describe('markdown content negotiation (vercel.json)', () => {
  const config = JSON.parse(
    readFileSync(join(import.meta.dir, '..', 'vercel.json'), 'utf-8'),
  ) as {
    rewrites?: {
      source: string
      destination: string
      has?: { type: string; key: string; value?: string }[]
    }[]
    headers?: {
      source: string
      has?: { type: string; key: string; value?: string }[]
      headers: { key: string; value: string }[]
    }[]
  }

  test('rewrites / to /index.md when Accept requests text/markdown', () => {
    const rewrite = config.rewrites?.find(
      (rule) => rule.source === '/' && rule.destination === '/index.md',
    )
    expect(rewrite).toBeDefined()
    const condition = rewrite?.has?.find(
      (has) => has.type === 'header' && has.key === 'accept',
    )
    expect(condition?.value).toContain('text/markdown')
  })

  test('negotiated responses set Vary: Accept and the markdown content type', () => {
    const varyRules = config.headers?.filter((rule) =>
      rule.headers.some(
        (header) => header.key === 'Vary' && header.value.includes('Accept'),
      ),
    )
    expect(varyRules?.map((rule) => rule.source)).toEqual(
      expect.arrayContaining(['/', '/index.md']),
    )
    const negotiatedContentType = config.headers?.find(
      (rule) =>
        rule.source === '/' &&
        rule.has?.some(
          (has) => has.key === 'accept' && has.value?.includes('text/markdown'),
        ) &&
        rule.headers.some(
          (header) =>
            header.key === 'Content-Type' &&
            header.value.startsWith('text/markdown'),
        ),
    )
    expect(negotiatedContentType).toBeDefined()
  })
})
