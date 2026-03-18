import { CircleHalfIcon, MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

type ThemePref = 'system' | 'light' | 'dark'

const CYCLE: ThemePref[] = ['system', 'light', 'dark']

const LABELS: Record<ThemePref, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
}

const applyTheme = (pref: ThemePref): void => {
  if (pref === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (pref === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    document.documentElement.classList[prefersDark ? 'add' : 'remove']('dark')
  }
}

export const ThemeToggle = () => {
  const [pref, setPref] = useState<ThemePref>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemePref | null
    const initial: ThemePref = stored ?? 'system'
    setPref(initial)
    applyTheme(initial)

    // Keep system mode in sync when OS preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      if ((localStorage.getItem('theme') ?? 'system') === 'system') {
        applyTheme('system')
      }
    }
    mq.addEventListener('change', handleSystemChange)
    return () => mq.removeEventListener('change', handleSystemChange)
  }, [])

  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(pref) + 1) % CYCLE.length]
    setPref(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      aria-label={`${LABELS[pref]} — click to switch`}
      title={LABELS[pref]}
      onClick={cycle}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-800 bg-(--color-gray-999) cursor-pointer overflow-hidden transition-[border-color,transform] duration-200 hover:border-accent-regular active:scale-95"
    >
      <span className="sr-only">{LABELS[pref]}</span>

      {/* Sun — light mode */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-accent-regular transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: pref === 'light' ? 1 : 0,
          transform: pref === 'light' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <SunIcon size={16} />
      </span>

      {/* Moon — dark mode */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-accent-dark transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: pref === 'dark' ? 1 : 0,
          transform: pref === 'dark' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <MoonStarsIcon size={16} />
      </span>

      {/* Half circle — system/auto mode */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-gray-400 transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: pref === 'system' ? 1 : 0,
          transform: pref === 'system' ? 'scale(1)' : 'scale(0.35)',
        }}
      >
        <CircleHalfIcon size={16} />
      </span>
    </button>
  )
}
