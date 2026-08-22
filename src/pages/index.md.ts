import { educationEntries } from '../data/education'
import { experiences } from '../data/experience'
import { absoluteUrl, site } from '../data/site'
import { skillCategories } from '../data/skills'

/**
 * Markdown variant of the homepage, generated from the same data modules the
 * HTML sections render from. Served directly at /index.md, and at / for
 * clients that send `Accept: text/markdown` (rewrite in vercel.json).
 */

const experienceSection = experiences
  .map((experience) => {
    const via = experience.via ? ` via ${experience.via}` : ''
    const heading = `### ${experience.title} — ${experience.company}${via} (${experience.employmentType})`
    const meta = `${experience.period} · ${experience.location}`
    const technologies =
      experience.technologies.length > 0
        ? `Technologies: ${experience.technologies.join(' · ')}`
        : undefined
    const categories = experience.categories.map(
      (category) =>
        `#### ${category.label}\n\n${category.bullets
          .map((bullet) => `- ${bullet}`)
          .join('\n')}`,
    )
    return [heading, meta, technologies, ...categories]
      .filter(Boolean)
      .join('\n\n')
  })
  .join('\n\n')

const educationSection = educationEntries
  .map(
    (entry) =>
      `### ${entry.degree} — ${entry.institution} (${entry.dateLabel})\n\nConcentration: ${entry.concentration}`,
  )
  .join('\n\n')

const skillsSection = skillCategories
  .map((category) => `- **${category.label}:** ${category.items.join(' · ')}`)
  .join('\n')

const markdown = `# ${site.name}

${site.jobTitle} · ${site.location.city}, ${site.location.region} · 3+ Years

${site.summary}

- Resume (PDF): ${absoluteUrl(site.resumePath)}
- LinkedIn: ${site.sameAs[0]}
- GitHub: ${site.sameAs[1]}

## Experience

${experienceSection}

## Education

${educationSection}

## Skills

${skillsSection}

## More

- [About](${absoluteUrl('/about')}): Phillip Hirsch's background and current focus
- [Contact](${absoluteUrl('/contact')}): How to reach Phillip Hirsch
- [Privacy](${absoluteUrl('/privacy')}): How this site handles data
- [llms.txt](${absoluteUrl('/llms.txt')}): Guidance for AI agents
- [Sitemap](${absoluteUrl('/sitemap.xml')}): All indexable URLs
`

export const GET = (): Response =>
  new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
