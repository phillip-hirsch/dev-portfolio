export interface SkillCategory {
  label: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Swift', 'Kotlin'],
  },
  {
    label: 'Frontend',
    items: [
      'React',
      'React Native',
      'Astro',
      'Tailwind CSS',
      'Vite',
      'React Router',
      'React Navigation',
      'React Reanimated',
      'Zustand',
      'TanStack React Query',
      'XState',
      'LaunchDarkly',
    ],
  },
  {
    label: 'Data & API',
    items: ['GraphQL', 'REST APIs', 'Contentful (headless CMS)'],
  },
  {
    label: 'Testing',
    items: ['Jest', 'Cypress'],
  },
  {
    label: 'CI/CD',
    items: ['GitHub Actions', 'Docker', 'Vercel', 'Netlify', 'Cloudflare'],
  },
  {
    label: 'Monitoring',
    items: ['Dynatrace'],
  },
  {
    label: 'AI Tools',
    items: ['Claude Code', 'Codex', 'OpenCode', 'Pi'],
  },
]
