import { textLinks } from '../../../data/nav'

export const NavLinks = ({
  activeSection,
  onNavigate,
}: {
  activeSection: string
  onNavigate?: (restoreFocus?: boolean) => void
}) => {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href === '/') {
      e.preventDefault()
      history.pushState(null, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Hash links: let the browser handle scrolling, just close the menu
    onNavigate?.(false)
  }

  return (
    <ul className="m-0 flex flex-col list-none py-2 bg-gray-999/95 border-b border-gray-800/50 lg:flex-row lg:bg-transparent lg:border-0 lg:py-0 lg:gap-0.5">
      {textLinks.map(({ label, href, section }) => {
        const current = activeSection === section
        const isExternal = href.startsWith('http')
        return (
          <li
            key={href}
            className="border-b border-gray-800/40 last:border-0 lg:border-0"
          >
            <a
              aria-current={current ? 'page' : undefined}
              href={href}
              onClick={isExternal ? undefined : (e) => handleClick(e, href)}
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
