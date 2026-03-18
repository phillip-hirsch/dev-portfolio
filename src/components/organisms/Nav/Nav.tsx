import { ListIcon } from '@phosphor-icons/react'

import { ThemeToggle } from '../../molecules/ThemeToggle/ThemeToggle'
import { NavLinks } from './NavLinks'
import { SocialLinks } from './SocialLinks'
import { useActiveSection } from './useActiveSection'
import { useMobileMenu } from './useMobileMenu'

// ─── Main Nav component ──────────────────────────────────────────────

export default function Nav() {
  const activeSection = useActiveSection()
  const menu = useMobileMenu()

  const menuClasses = `absolute inset-x-0 top-full origin-top overflow-hidden lg:[display:contents] lg:![animation:none] lg:!transform-none lg:!opacity-100 lg:overflow-visible ${
    menu.closing
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

        {!menu.desktop && (
          <button
            ref={menu.buttonRef}
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-transparent text-gray-400 cursor-pointer transition-[color,border-color] duration-200 hover:text-gray-0 hover:border-gray-600 aria-expanded:text-accent-regular aria-expanded:border-accent-regular"
            aria-expanded={menu.open && !menu.closing}
            aria-controls={menu.menuId}
            onClick={menu.toggle}
          >
            <span className="sr-only">Menu</span>
            <ListIcon size={18} />
          </button>
        )}
      </div>

      {menu.visible && (
        <div
          id={menu.menuId}
          ref={menu.containerRef}
          className={menuClasses}
          onAnimationEnd={menu.onAnimationEnd}
        >
          <NavLinks
            activeSection={activeSection}
            onNavigate={menu.onNavigate}
          />
          <div className="flex justify-between items-center gap-3 px-5 py-4 bg-gray-999/95 shadow-md lg:justify-self-end lg:p-0 lg:bg-transparent lg:shadow-none">
            <SocialLinks />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
