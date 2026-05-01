# Components

## PageHeader

- The reusable page header pattern renders a title, optional tagline, and accent underline.
- Props:
- `title`
- `tagline?`
- `align?` with `'center'` as the default and `'start'` as the alternative.

## Navigation

- Navigation links and social links are data-driven.
- Adding or removing nav items should start with the shared nav data, not duplicated markup.
- The nav is composed from smaller subcomponents:
- `BrandLink`
- `NavLinks`
- `SocialLinks`
- `MobileMenuToggle`
- Mobile menu state is driven by the `data-menu-state` attribute with `closed`, `open`, and `closing`.
- The open and close behavior is handled inline with the component, not through a separate client-side app shell.

## Icons

- Import Phosphor icons from `@phosphor-icons/react` in `.astro` files and data modules.
- Do not switch to the `/ssr` variant; Astro already handles server-side React rendering here.
