import type { Icon as PhosphorIconType } from '@phosphor-icons/react'
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  ListIcon,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

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
const isCurrentPage = (href: string, pathname: string): boolean => {
  let p = pathname
  if (!p.startsWith('/')) p = `/${p}`
  if (!p.endsWith('/')) p += '/'
  return p === href || (href !== '/' && p.startsWith(href))
}

// ─── Sub-components ──────────────────────────────────────────────────

const NavLinks = ({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) => {
  return (
    <ul className="m-0 flex flex-col list-none py-2 bg-gray-999/95 border-b border-gray-800/50 lg:flex-row lg:bg-transparent lg:border-0 lg:py-0 lg:gap-0.5">
      {textLinks.map(({ label, href }) => {
        const current = isCurrentPage(href, pathname)
        return (
          <li
            key={href}
            className="border-b border-gray-800/40 last:border-0 lg:border-0"
          >
            <a
              aria-current={current ? 'page' : undefined}
              href={href}
              onClick={onNavigate}
              className={[
                'group relative inline-flex items-center no-underline font-medium',
                'w-full px-5 py-4 text-md transition-colors duration-200 border-l-2',
                'lg:w-auto lg:px-5 lg:py-2 lg:text-sm lg:border-l-0 lg:rounded',
                'lg:hover:bg-accent-subtle-overlay',
                'forced-colors:aria-[current=page]:text-[SelectedItem]',
                current
                  ? 'text-gray-0 border-accent-regular lg:hover:text-gray-0'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600 lg:hover:text-gray-0',
              ].join(' ')}
            >
              {label}
              {/* Desktop: sliding underline for active / hover */}
              <span
                aria-hidden="true"
                className={`hidden lg:block absolute bottom-1 left-5 right-5 h-px bg-accent-regular transition-transform duration-200 ease-out origin-center ${current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function SocialLinks() {
  return (
    <div className="flex gap-1 text-xl lg:hidden xl:flex xl:justify-end xl:gap-0">
      {iconLinks.map(({ href, icon: SocialIcon, label }) => (
        <a
          key={label}
          href={href}
          className="flex p-2 no-underline text-gray-400 transition-colors duration-200 hover:text-accent-regular"
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
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

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
      menuButtonRef.current?.focus()
    }
  }, [closing])

  const onNavigate = useCallback(() => {
    if (!isDesktop && menuOpen && !closing) {
      setClosing(true)
    }
  }, [isDesktop, menuOpen, closing])

  const menuVisible = menuOpen || closing

  useEffect(() => {
    if (isDesktop || !menuOpen || closing) {
      return
    }

    const firstLink =
      menuContainerRef.current?.querySelector<HTMLAnchorElement>('a[href]')
    firstLink?.focus()
  }, [isDesktop, menuOpen, closing])

  useEffect(() => {
    if (isDesktop || !menuVisible) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setClosing(true)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isDesktop, menuVisible])

  const menuClasses = [
    'absolute inset-x-0 origin-top overflow-hidden lg:[display:contents] lg:![animation:none] lg:!transform-none lg:!opacity-100 lg:overflow-visible',
    menuOpen && !closing ? '[animation:var(--animate-menu-slide-down)]' : '',
    closing ? '[animation:var(--animate-menu-slide-up)]' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav className="sticky top-0 z-9999 font-brand font-medium mb-14 border-b border-gray-800/50 bg-gray-999/85 backdrop-blur-md lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-16 lg:py-5 lg:gap-8">
      <div className="flex justify-between items-center gap-2 px-5 py-4 lg:p-0">
        <a
          href="/"
          className="flex gap-2 items-center leading-tight no-underline lg:text-lg"
        >
          <span className="text-gray-0">
            Phillip{' '}
            <span
              style={{
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Hirsch
            </span>
          </span>
        </a>

        {/* Menu toggle — hidden on desktop */}
        {!isDesktop && (
          <button
            ref={menuButtonRef}
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-transparent text-gray-400 cursor-pointer transition-[color,border-color] duration-200 hover:text-gray-0 hover:border-gray-600 aria-expanded:text-accent-regular aria-expanded:border-accent-regular"
            aria-expanded={menuOpen && !closing}
            aria-controls={menuId}
            onClick={toggleMenu}
          >
            <span className="sr-only">Menu</span>
            <ListIcon size={18} />
          </button>
        )}
      </div>

      {/* Menu content — always rendered on desktop, toggled on mobile */}
      {menuVisible && (
        <div
          id={menuId}
          ref={menuContainerRef}
          className={menuClasses}
          onAnimationEnd={onAnimationEnd}
        >
          <NavLinks pathname={pathname} onNavigate={onNavigate} />
          <div className="flex justify-between items-center gap-3 px-5 py-4 bg-gray-999/95 shadow-md lg:justify-self-end lg:p-0 lg:bg-transparent lg:shadow-none">
            <SocialLinks />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
