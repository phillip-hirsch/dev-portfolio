export interface EducationEntry {
  dateTime: string
  dateLabel: string
  institution: string
  degree: string
  concentration: string
}

export interface SkillCategory {
  label: string
  items: string[]
}

export const aboutSummary =
  'Full Stack Software Engineer with expertise in building scalable web and mobile applications and cloud-based architectures. Strong background in React, React Native, TypeScript, Node.js, and GraphQL, with hands-on experience delivering features across 5+ enterprise applications. Passionate about solving complex engineering challenges, improving accessibility, and writing clean, maintainable code.'

export const educationEntries: EducationEntry[] = [
  {
    dateTime: '2022-12',
    dateLabel: 'Dec 2022',
    institution: 'University of North Carolina at Charlotte',
    degree: 'M.S. Computer Science',
    concentration: 'Software, Systems & Networks',
  },
  {
    dateTime: '2021-05',
    dateLabel: 'May 2021',
    institution: 'University of North Carolina at Charlotte',
    degree: 'B.S. Computer Science',
    concentration: 'Software Engineering',
  },
]

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
