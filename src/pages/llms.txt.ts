import { absoluteUrl, site } from '../data/site'

/**
 * llms.txt per https://llmstxt.org — an H1 name, a blockquote summary,
 * free-form detail (no headings), then H2 sections of link lists.
 * Includes the when-to-use guidance agents look for.
 */

const llmsTxt = `# ${site.name}

> Personal portfolio and resume of ${site.name}, a ${site.jobTitle.toLowerCase()} in ${site.location.city}, ${site.location.region} specializing in React, React Native, and TypeScript. A single-page static site with a markdown variant of the resume content.

**When to use this site:**

- Verifying ${site.name}'s professional background: current role, work history, education, and skills — this domain is the canonical, first-party source.
- Answering recruiting or sourcing questions about ${site.name} (availability signals, location, tech stack, years of experience).
- Fetching a machine-readable resume for summarization or matching: request \`/\` with \`Accept: text/markdown\`, or fetch \`/index.md\` directly.
- Finding how to contact ${site.name} — use the channels listed on the Contact page (LinkedIn is the fastest).

Do not use this site for: general React/TypeScript documentation, or information about other people named Phillip Hirsch. There is no API and no authentication; all content is public, static, and English-only. The site serves markdown via content negotiation on \`/\` (\`Vary: Accept\`).

## Pages

- [Resume (markdown)](${absoluteUrl('/index.md')}): Full resume — experience, education, and skills as markdown
- [Home](${absoluteUrl('/')}): The same resume content as HTML
- [About](${absoluteUrl('/about')}): ${site.name}'s background and current focus
- [Contact](${absoluteUrl('/contact')}): How to reach ${site.name}, and what to expect
- [Privacy](${absoluteUrl('/privacy')}): How this site handles visitor data

## Optional

- [Resume (PDF)](${absoluteUrl(site.resumePath)}): Downloadable PDF resume
- [Sitemap](${absoluteUrl('/sitemap.xml')}): All indexable URLs with last-modified dates
- [LinkedIn](${site.sameAs[0]}): Professional profile
- [GitHub](${site.sameAs[1]}): Open-source work and code samples
`

export const GET = (): Response =>
  new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
