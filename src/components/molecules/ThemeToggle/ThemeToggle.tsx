import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const getThemeSnapshot = (): Theme => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const getServerSnapshot = (): Theme | null => null

const subscribe = (onStoreChange: () => void) => {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}

export const ThemeToggle = () => {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot,
  )
  const isDark = theme === 'dark'
  const label =
    theme === null
      ? 'Toggle theme'
      : isDark
        ? 'Dark theme — click to switch'
        : 'Light theme — click to switch'
  const title =
    theme === null ? 'Toggle theme' : isDark ? 'Dark theme' : 'Light theme'

  const toggle = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark'
    document.documentElement.classList[nextTheme === 'dark' ? 'add' : 'remove'](
      'dark',
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={toggle}
      className="chip relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all duration-300 active:scale-95"
    >
      <span className="sr-only">{title}</span>

      {/* Sun — light mode */}
      <span
        aria-hidden="true"
        className="text-accent-regular absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: theme === null || theme === 'light' ? 1 : 0,
          transform:
            theme === null || theme === 'light' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <SunIcon size={16} />
      </span>

      {/* Moon — dark mode */}
      <span
        aria-hidden="true"
        className="text-accent-dark absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <MoonStarsIcon size={16} />
      </span>
    </button>
  )
}
