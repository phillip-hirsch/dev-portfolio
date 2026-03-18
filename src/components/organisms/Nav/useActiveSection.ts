import { useEffect, useState } from 'react'
import { textLinks } from '../../../data/nav'

/** Track which section is currently scrolled into view. */
export const useActiveSection = (): string => {
  const [active, setActive] = useState('')

  useEffect(() => {
    // Derive section IDs from nav data — single source of truth
    const sectionIds = textLinks.map((l) => l.section).filter(Boolean)

    // Map of sectionId → top position in viewport (updated on each IO callback)
    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top)
          } else {
            visible.delete(entry.target.id)
          }
        }
        if (visible.size === 0) {
          setActive('')
          return
        }
        // Pick the section closest to (but below) the top of the viewport
        let best = ''
        let bestTop = Number.POSITIVE_INFINITY
        for (const [id, top] of visible) {
          if (top < bestTop) {
            bestTop = top
            best = id
          }
        }
        setActive(best)
      },
      { rootMargin: '-80px 0px -35% 0px' },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return active
}
