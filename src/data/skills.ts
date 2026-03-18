export interface SkillCategory {
  label: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL', 'NoSQL'],
  },
  {
    label: 'Front-End',
    items: ['React', 'React Native', 'Remix', 'Astro', 'Next.js'],
  },
  {
    label: 'Back-End & APIs',
    items: [
      'Node.js',
      'Express.js',
      'NestJS',
      'GraphQL',
      'Bun',
      'RESTful APIs',
    ],
  },
  {
    label: 'Cloud & DevOps',
    items: ['AWS', 'Docker', 'GitHub Actions'],
  },
  {
    label: 'Testing & Security',
    items: [
      'Jest',
      'Cypress',
      'Authentication Security',
      'OWASP',
      'Secure API Development',
    ],
  },
  {
    label: 'AI Tooling',
    items: ['GitHub Copilot', 'Claude Code', 'Claude', 'ChatGPT'],
  },
]
