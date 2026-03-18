export interface EducationEntry {
  dateTime: string
  dateLabel: string
  institution: string
  degree: string
  concentration: string
}

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
