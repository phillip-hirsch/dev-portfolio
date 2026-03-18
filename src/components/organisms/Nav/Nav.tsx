import type { Icon as PhosphorIconType } from '@phosphor-icons/react'
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  ListIcon,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { ThemeToggle } from '../../molecules/ThemeToggle/ThemeToggle'

/** Main menu items — section ID is '' for the top of the page. */
const textLinks: { label: string; href: string; section: string }[] = [
  { label: 'Home', href: '/', section: '' },
  { label: 'Experience', href: '#experience', section: 'experience' },
  { label: 'Education', href: '#education', section: 'education' },
  { label: 'Skills', href: '#skills', section: 'skills' },
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

/**
 * Track which section is currently scrolled into view.
 * Returns the section id string, or '' when at the top (Home active).
 */
function useActiveSection(): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sectionIds = ['experience', 'education', 'skills']
    const NAV_OFFSET = 100 // nav height + a small buffer

    const update = () => {
      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - NAV_OFFSET) {
          current = id
        }
      }
      setActive(current)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return active
}

// ─── Sub-components ──────────────────────────────────────────────────

const NavLinks = ({
  activeSection,
  onNavigate,
}: {
  activeSection: string
  onNavigate?: () => void
}) => {
  const handleHomeClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Avoid a full Astro page transition when already on the home page
      e.preventDefault()
      history.pushState(null, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      onNavigate?.()
    },
    [onNavigate],
  )

  return (
    <ul className="m-0 flex flex-col list-none py-2 bg-gray-999/95 border-b border-gray-800/50 lg:flex-row lg:bg-transparent lg:border-0 lg:py-0 lg:gap-0.5">
      {textLinks.map(({ label, href, section }) => {
        const current = activeSection === section
        return (
          <li
            key={href}
            className="border-b border-gray-800/40 last:border-0 lg:border-0"
          >
            <a
              aria-current={current ? 'page' : undefined}
              href={href}
              onClick={href === '/' ? handleHomeClick : undefined}
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

const SocialLinks = () => (
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

// ─── Main Nav component ──────────────────────────────────────────────

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [closing, setClosing] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const closedByNavRef = useRef(false)
  const menuId = useId()
  const activeSection = useActiveSection()

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
      if (!closedByNavRef.current) {
        menuButtonRef.current?.focus()
      }
      closedByNavRef.current = false
    }
  }, [closing])

  const closeByNav = useCallback(() => {
    closedByNavRef.current = true
    setClosing(true)
  }, [])

  const onNavigate = useCallback(() => {
    if (!isDesktop && menuOpen && !closing) setClosing(true)
  }, [isDesktop, menuOpen, closing])

  const menuVisible = menuOpen || closing

  // Close mobile menu after hash navigation once the smooth scroll settles.
  useEffect(() => {
    const onNav = () => {
      if (isDesktop || !menuOpen || closing) return

      let cleanup: () => void
      const done = () => {
        cleanup()
        closeByNav()
      }

      const onScrollEnd = () => done()
      window.addEventListener('scrollend', onScrollEnd, { once: true })

      // Safety cap in case scrollend never fires
      const timeout = setTimeout(done, 1000)

      cleanup = () => {
        clearTimeout(timeout)
        window.removeEventListener('scrollend', onScrollEnd)
      }
    }
    window.addEventListener('popstate', onNav)
    window.addEventListener('hashchange', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      window.removeEventListener('hashchange', onNav)
    }
  }, [isDesktop, menuOpen, closing, closeByNav])

  useEffect(() => {
    if (isDesktop || !menuOpen || closing) return
    const firstLink =
      menuContainerRef.current?.querySelector<HTMLAnchorElement>('a[href]')
    firstLink?.focus()
  }, [isDesktop, menuOpen, closing])

  useEffect(() => {
    if (isDesktop || !menuVisible) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setClosing(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isDesktop, menuVisible])

  const menuClasses = `absolute inset-x-0 top-full origin-top overflow-hidden lg:[display:contents] lg:![animation:none] lg:!transform-none lg:!opacity-100 lg:overflow-visible ${
    closing
      ? '[animation:var(--animate-menu-slide-up)]'
      : '[animation:var(--animate-menu-slide-down)]'
  }`

  return (
    <nav className="sticky top-0 z-9999 font-brand font-medium border-b border-gray-800/50 bg-gray-999/85 backdrop-blur-md lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-16 lg:py-5 lg:gap-8">
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
          <NavLinks activeSection={activeSection} onNavigate={onNavigate} />
          <div className="flex justify-between items-center gap-3 px-5 py-4 bg-gray-999/95 shadow-md lg:justify-self-end lg:p-0 lg:bg-transparent lg:shadow-none">
            <SocialLinks />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
