import { useEffect, useId, useReducer, useRef } from 'react'

// ── Menu reducer ─────────────────────────────────────────────────────

interface MenuState {
  open: boolean
  desktop: boolean
  closing: boolean
}

type MenuAction =
  | { type: 'SET_DESKTOP'; matches: boolean }
  | { type: 'TOGGLE' }
  | { type: 'CLOSE' }
  | { type: 'ANIMATION_END' }

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'SET_DESKTOP':
      return action.matches
        ? { ...state, desktop: true, open: true, closing: false }
        : { ...state, desktop: false, open: false, closing: false }
    case 'TOGGLE':
      if (state.open && !state.closing) return { ...state, closing: true }
      return { ...state, open: true, closing: false }
    case 'CLOSE':
      if (!state.desktop && state.open && !state.closing)
        return { ...state, closing: true }
      return state
    case 'ANIMATION_END':
      if (state.closing) return { ...state, open: false, closing: false }
      return state
  }
}

/** Encapsulates all mobile-menu state, effects, and event handlers. */
export const useMobileMenu = () => {
  const [state, dispatch] = useReducer(menuReducer, {
    open: false,
    desktop: false,
    closing: false,
  })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // When a nav link closes the menu, focus should go to the link target, not back to the hamburger
  const skipFocusRestoreRef = useRef(false)
  const menuId = useId()

  const { open, desktop, closing } = state
  const visible = open || closing

  // Sync with viewport breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 50em)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      dispatch({ type: 'SET_DESKTOP', matches: e.matches })
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Focus first link when mobile menu opens
  useEffect(() => {
    if (desktop || !open || closing) return
    containerRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
  }, [desktop, open, closing])

  // Close on Escape
  useEffect(() => {
    if (desktop || !visible) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE' })
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [desktop, visible])

  const onAnimationEnd = () => {
    if (!closing) return
    dispatch({ type: 'ANIMATION_END' })
    if (!skipFocusRestoreRef.current) buttonRef.current?.focus()
    skipFocusRestoreRef.current = false
  }

  return {
    open,
    desktop,
    closing,
    visible,
    menuId,
    buttonRef,
    containerRef,
    toggle: () => dispatch({ type: 'TOGGLE' }),
    onAnimationEnd,
    onNavigate: (restoreFocus = true) => {
      if (!restoreFocus) skipFocusRestoreRef.current = true
      dispatch({ type: 'CLOSE' })
    },
  }
}
