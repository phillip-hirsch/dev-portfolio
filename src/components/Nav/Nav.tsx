import type { Icon as PhosphorIconType } from '@phosphor-icons/react'
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  ListIcon,
  TerminalWindowIcon,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GradientIcon } from '../GradientIcon/GradientIcon'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

/** Main menu items */
const textLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Experience', href: '/experience/' },
]

/** Icon links to social media */
const iconLinks: {
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

/** Check if a link points to the current page. */
function isCurrentPage(href: string, pathname: string): boolean {
  let p = pathname
  if (!p.startsWith('/')) p = '/' + p
  if (!p.endsWith('/')) p += '/'
  return p === href || (href !== '/' && p.startsWith(href))
}

// ─── Sub-components ──────────────────────────────────────────────────

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <ul className="m-0 flex flex-col gap-4 text-md leading-tight list-none p-8 bg-gray-999 border-b border-gray-800 lg:relative lg:flex-row lg:text-sm lg:rounded-full lg:border-0 lg:px-2 lg:py-2 lg:bg-[radial-gradient(var(--color-gray-900),var(--color-gray-800)_150%)] lg:shadow-md lg:before:absolute lg:before:-inset-px lg:before:content-[''] lg:before:bg-(image:--gradient-stroke) lg:before:rounded-full lg:before:-z-10">
      {textLinks.map(({ label, href }) => (
        <li key={href}>
          <a
            aria-current={isCurrentPage(href, pathname) ? 'page' : undefined}
            className="inline-block text-gray-300 no-underline aria-[current=page]:text-gray-0 lg:px-4 lg:py-2 lg:rounded-full lg:transition-colors lg:duration-200 lg:hover:text-gray-100 lg:hover:bg-accent-subtle-overlay lg:aria-[current=page]:text-accent-text-over lg:aria-[current=page]:bg-accent-regular forced-colors:aria-[current=page]:text-[SelectedItem]"
            href={href}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2.5 text-xl lg:hidden xl:flex xl:justify-end xl:gap-0">
      {iconLinks.map(({ href, icon: SocialIcon, label }) => (
        <a
          key={label}
          href={href}
          className="flex p-2 no-underline text-accent-dark transition-colors duration-200 hover:text-accent-text-over"
        >
          <span className="sr-only">{label}</span>
          <SocialIcon />
        </a>
      ))}
    </div>
  )
}

// ─── Main Nav component ──────────────────────────────────────────────

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [closing, setClosing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Read pathname client-side so it works with Astro's static builds.
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/'

  // Track viewport breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 50em)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches)
      if (e.matches) {
        setMenuOpen(true)
        setClosing(false)
      } else {
        setMenuOpen(false)
      }
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleMenu = useCallback(() => {
    if (menuOpen && !closing) {
      // Start close animation
      setClosing(true)
    } else {
      setMenuOpen(true)
      setClosing(false)
    }
  }, [menuOpen, closing])

  const onAnimationEnd = useCallback(() => {
    if (closing) {
      setMenuOpen(false)
      setClosing(false)
    }
  }, [closing])

  const menuVisible = menuOpen || closing
  const menuClasses = [
    'absolute inset-x-0 origin-top overflow-hidden lg:[display:contents] lg:![animation:none] lg:!transform-none lg:!opacity-100 lg:overflow-visible',
    menuOpen && !closing ? '[animation:var(--animate-menu-slide-down)]' : '',
    closing ? '[animation:var(--animate-menu-slide-up)]' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav className="z-9999 relative font-brand font-medium mb-14 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-20 lg:py-10 lg:gap-4">
      <div className="flex justify-between gap-2 p-6 lg:p-0">
        <a
          href="/"
          className="flex gap-2 items-center leading-tight text-gray-0 no-underline lg:text-lg"
        >
          <GradientIcon icon={TerminalWindowIcon} size="1.6em" />
          Phillip Hirsch
        </a>

        {/* Menu toggle — hidden on desktop */}
        {!isDesktop && (
          <button
            type="button"
            className="relative flex border-0 rounded-full p-2 text-2xl text-gray-300 bg-[radial-gradient(var(--color-gray-900),var(--color-gray-800)_150%)] shadow-md before:absolute before:-inset-px before:content-[''] before:bg-(image:--gradient-stroke) before:rounded-full before:-z-10 aria-expanded:text-gray-0 aria-expanded:bg-[linear-gradient(180deg,var(--color-gray-600),transparent),radial-gradient(var(--color-gray-900),var(--color-gray-800)_150%)]"
            aria-expanded={menuOpen && !closing}
            onClick={toggleMenu}
          >
            <span className="sr-only">Menu</span>
            <ListIcon />
          </button>
        )}
      </div>

      {/* Menu content — always rendered on desktop, toggled on mobile */}
      {menuVisible && (
        <div
          ref={menuRef}
          className={menuClasses}
          onAnimationEnd={onAnimationEnd}
        >
          <NavLinks pathname={pathname} />
          <div className="flex justify-between gap-3 py-6 px-8 bg-gray-999 rounded-b-xl shadow-lg lg:justify-self-end lg:items-center lg:p-0 lg:bg-transparent lg:shadow-none">
            <SocialLinks />
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
