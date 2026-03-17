---
name: new-component
description: Scaffold a new Astro or React island component with correct structure for this portfolio
---

Create a new component in src/components/<ComponentName>/. Follow these rules:

- If the component needs interactivity (event handlers, state, effects), create a `.tsx` React component
- If it's purely static/presentational, create a `.astro` component
- Use PascalCase for both the folder and filename (e.g., `src/components/MyComponent/MyComponent.astro`)
- Import Phosphor icons from `@phosphor-icons/react` in both `.tsx` and `.astro` files
- Export the component as the default export
- Do not add unnecessary comments or docstrings

Ask the user for the component name and what it should do before creating any files.
