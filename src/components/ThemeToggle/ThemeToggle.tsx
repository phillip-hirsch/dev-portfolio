import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const [dark, setDark] = useState(false)

  // Sync initial state from the DOM on mount (server may have set .dark already).
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList[next ? 'add' : 'remove']('dark')
    setDark(next)
  }

  return (
    <button
      type="button"
      aria-pressed={dark}
      onClick={toggle}
      className="flex border-0 rounded-full p-0 bg-gray-999 shadow-[inset_0_0_0_1px_var(--color-accent-overlay)] cursor-pointer"
    >
      <span className="sr-only">Dark theme</span>
      <span className="relative z-10 flex p-2 w-8 h-8 text-base text-accent-text-over dark:text-accent-overlay before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-accent-regular before:rounded-full motion-safe:before:transition-transform motion-safe:before:duration-200 motion-safe:before:ease-in-out motion-safe:transition-colors motion-safe:duration-200 dark:before:translate-x-full forced-colors:before:bg-[SelectedItem]">
        <SunIcon />
      </span>
      <span className="relative z-10 flex p-2 w-8 h-8 text-base text-accent-overlay dark:text-accent-text-over motion-safe:transition-colors motion-safe:duration-200">
        <MoonStarsIcon />
      </span>
    </button>
  )
}
