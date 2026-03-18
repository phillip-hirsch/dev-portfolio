import type { Icon as PhosphorIconType } from '@phosphor-icons/react'
import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'

/** Main menu items — section ID is '' for the top of the page. */
export const textLinks: { label: string; href: string; section: string }[] = [
  { label: 'Home', href: '/', section: '' },
  { label: 'Experience', href: '#experience', section: 'experience' },
  { label: 'Education', href: '#education', section: 'education' },
  { label: 'Skills', href: '#skills', section: 'skills' },
]

/** Icon links to social media */
export const iconLinks: {
  label: string
  href: string
  icon: PhosphorIconType
}[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/phillip-hirsch',
    icon: LinkedinLogoIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/phillip-hirsch',
    icon: GithubLogoIcon,
  },
]
