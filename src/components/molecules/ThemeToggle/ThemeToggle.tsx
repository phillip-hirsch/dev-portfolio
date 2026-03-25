import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const ThemeToggle = () => {
  const [theme, setThemeState] = useState<Theme>('light')
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setThemeState(isDarkMode ? 'dark' : 'light')
  }, [])

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
    document.documentElement.classList[next === 'dark' ? 'add' : 'remove'](
      'dark',
    )
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
      className="theme-toggle relative flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 active:scale-95"
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Dark theme' : 'Light theme'}
      </span>

      {/* Sun — light mode */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-accent-regular transition-[opacity,transform] duration-200 ease-out"
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
        className="absolute inset-0 flex items-center justify-center text-accent-dark transition-[opacity,transform] duration-200 ease-out"
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
