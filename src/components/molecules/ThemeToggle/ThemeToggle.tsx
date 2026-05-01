import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const getInitialTheme = (): Theme => {
  if (typeof document === 'undefined') {
    return 'light'
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export const ThemeToggle = () => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
  }

  return (
    <button
      type="button"
      aria-label={
        theme === 'dark'
          ? 'Dark theme — click to switch'
          : 'Light theme — click to switch'
      }
      title={theme === 'dark' ? 'Dark theme' : 'Light theme'}
      onClick={toggle}
      className="chip relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all duration-300 active:scale-95"
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Dark theme' : 'Light theme'}
      </span>

      {/* Sun — light mode */}
      <span
        aria-hidden="true"
        className="text-accent-regular absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: theme === 'light' ? 1 : 0,
          transform: theme === 'light' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <SunIcon size={16} />
      </span>

      {/* Moon — dark mode */}
      <span
        aria-hidden="true"
        className="text-accent-dark absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: theme === 'dark' ? 1 : 0,
          transform: theme === 'dark' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <MoonStarsIcon size={16} />
      </span>
    </button>
  )
}
