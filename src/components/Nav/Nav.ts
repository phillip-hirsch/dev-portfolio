/** biome-ignore-all lint/style/noNonNullAssertion: linting error */

class MenuButton extends HTMLElement {
  constructor() {
    super()

    // Inject menu toggle button when JS runs.
    this.appendChild(this.querySelector('template')!.content.cloneNode(true))
    const btn = this.querySelector('button')!

    // Hide menu (shown by default to support no-JS browsers).
    const menu = document.getElementById('menu-content')!
    menu.hidden = true
    // Add "menu-content" class in JS to avoid covering content in non-JS browsers.
    menu.classList.add('menu-content')

    /** Set whether the menu is currently expanded or collapsed. */
    const setExpanded = (expand: boolean) => {
      btn.setAttribute('aria-expanded', expand ? 'true' : 'false')

      if (expand) {
        menu.hidden = false
        // Force a reflow so the opening animation plays from the start.
        menu.offsetHeight
        menu.classList.remove('is-closing')
        menu.classList.add('is-open')
      } else if (menu.classList.contains('is-open')) {
        // Only animate closed if the menu is actually visible.
        menu.classList.remove('is-open')
        menu.classList.add('is-closing')
        menu.addEventListener(
          'animationend',
          () => {
            menu.classList.remove('is-closing')
            menu.hidden = true
          },
          { once: true },
        )
      } else {
        // Menu is already hidden — just ensure a clean state with no stale classes.
        menu.classList.remove('is-open', 'is-closing')
        menu.hidden = true
      }
    }

    // Toggle menu visibility when the menu button is clicked.
    btn.addEventListener('click', () =>
      setExpanded(menu.hidden || menu.classList.contains('is-closing')),
    )

    // Hide menu button for large screens.
    const handleViewports = (e: MediaQueryList | MediaQueryListEvent) => {
      setExpanded(e.matches)
      btn.hidden = e.matches
    }
    const mediaQueries = window.matchMedia('(min-width: 50em)')
    handleViewports(mediaQueries)
    mediaQueries.addEventListener('change', handleViewports)
  }
}

customElements.define('menu-button', MenuButton)
