# Architecture

## Stack

- Astro 6 with React 19 for server-rendered integrations.
- Tailwind CSS v4 for styling.
- Deployed to Vercel in hybrid mode.
- Fonts are loaded through the Astro Fonts API: Space Grotesk for body and brand text, Space Mono for monospace text.

## Page Model

- This is a single-page portfolio, not a multi-route app.
- Navigation is in-page and anchored to the main resume-style sections: experience, education, and skills.
- The site includes a not-found page and a dynamic Open Graph image endpoint.
- The OG image endpoint is the main server-rendered exception in an otherwise mostly static site.

## Layout

- Pages share one base layout.
- The layout owns document metadata, navigation, theme bootstrapping, reveal-on-scroll behavior, and the global page background.
- Prefer extending the existing layout flow instead of introducing page-specific wrappers unless the design clearly requires it.

## Component Structure

- Components follow atomic design with atom, molecule, and organism layers.
- Prefer static `.astro` components by default.
- There are currently no hydrated React islands.
- React is still used for server-rendered integrations such as icons and the OG image endpoint.

## Content And Assets

- Resume content is data-driven rather than embedded directly in section markup.
- Navigation labels and section IDs should stay aligned with the rendered sections.
- Images that should be optimized by Astro belong with source assets; files that should be served as-is belong with static assets.

## Metadata And OG Images

- The shared head component generates the default OG image URL automatically.
- Pages can still override canonical URL, image, and Open Graph type when needed.
