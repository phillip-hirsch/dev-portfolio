/**
 * Canonical site identity — the single source of truth for machine-readable
 * surfaces (JSON-LD, llms.txt, index.md, sitemap.xml) and trust pages.
 * Human-facing section content still lives in the other data modules.
 */

export const site = {
  /** Canonical origin, no trailing slash. Matches `site` in astro.config.mjs. */
  url: 'https://www.philliphirsch.com',
  name: 'Phillip Hirsch',
  jobTitle: 'Software Engineer',
  description:
    'Software engineer building accessible, performant web and mobile products with React, TypeScript, and modern architecture.',
  summary:
    'I turn complex requirements into clean, scalable products — specializing in React, TypeScript, and the full stack between design and deployment.',
  location: {
    city: 'Charlotte',
    region: 'NC',
    country: 'US',
  },
  /** Public profiles — keep aligned with `iconLinks` in src/data/nav.ts. */
  sameAs: [
    'https://www.linkedin.com/in/phillip-hirsch',
    'https://github.com/phillip-hirsch',
  ],
  resumePath: '/assets/Phillip_Hirsch.pdf',
} as const

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string): string =>
  new URL(path, `${site.url}/`).toString()
