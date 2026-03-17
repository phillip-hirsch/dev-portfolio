export interface ExperienceCategory {
  label: string
  bullets: string[]
}

export interface ExperienceEntry {
  title: string
  employmentType: string
  company: string
  via?: string
  period: string
  location: string
  categories: ExperienceCategory[]
  technologies: string[]
}

export const experiences: ExperienceEntry[] = [
  {
    title: 'Software Engineer',
    employmentType: 'Contract',
    company: 'Ally Financial',
    via: 'Brooksource',
    period: 'March 2023 - Present',
    location: 'Charlotte, NC',
    categories: [
      {
        label: 'Performance & Architecture',
        bullets: [
          "Optimized Ally's mobile banking app, cutting load times by 15% and improving rendering efficiency by 30% through state management optimization and component refactoring.",
          'Optimized API interactions, improving data-fetching strategies and implementing efficient caching mechanisms to enhance responsiveness.',
        ],
      },
      {
        label: 'Development & Delivery',
        bullets: [
          'Developed & maintained reusable UI components in React, React Native, and TypeScript, improving developer productivity across 5+ enterprise applications.',
          'Implemented API integrations with Contentful, automating content delivery and reducing manual updates by 40%, increasing operational efficiency.',
          'Improved accessibility compliance (WCAG 2.1), enhancing inclusivity and user experience.',
        ],
      },
      {
        label: 'Leadership & Quality',
        bullets: [
          'Mentored junior engineers, reducing onboarding time by 20% and fostering a culture of collaboration.',
          'Strengthened authentication security and ensured adherence to secure coding best practices.',
          'Refactored legacy codebase, improving maintainability and reducing technical debt for long-term scalability.',
        ],
      },
    ],
    technologies: [
      'React',
      'React Native',
      'TypeScript',
      'Contentful',
      'WCAG 2.1',
    ],
  },
]
