import { ImageResponse } from '@vercel/og'
import type { APIContext } from 'astro'
import { type CSSProperties, createElement, type ReactElement } from 'react'

export const prerender = false

// Catppuccin Mocha — mirrors the `.dark` palette in src/styles/global.css.
const C = {
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
  surface0: '#313244',
  surface2: '#585b70',
  overlay1: '#7f849c',
  subtext1: '#bac2de',
  text: '#cdd6f4',
  red: '#f38ba8',
  peach: '#fab387',
  green: '#a6e3a1',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  mauve: '#cba6f7',
} as const

// Curated subset of src/data/skills.ts — 12 items in 3 rows of 4.
const STACK = [
  ['TypeScript', 'React', 'React Native', 'Contentful'],
  ['Astro', 'Node.js', 'GraphQL', 'Bun', 'Docker'],
  ['Vercel', 'Netlify', 'Claude Code', 'Codex'],
]

// Satori requires ttf/otf; it can't parse woff2. Google Fonts serves TTF
// when the User-Agent isn't a modern browser — the standard @vercel/og
// pattern. See https://github.com/vercel/satori#fonts.
const loadGoogleFont = async (
  family: string,
  weight: number,
): Promise<ArrayBuffer> => {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${weight}`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' } },
  ).then((r) => r.text())
  const match = css.match(
    /src:\s*url\((https:\/\/[^)]+)\)\s*format\('(truetype|opentype)'\)/,
  )
  if (!match) throw new Error(`TTF URL missing for ${family}@${weight}`)
  return fetch(match[1]).then((r) => r.arrayBuffer())
}

// Lazy + memoized: the fetch starts on the first request, not at module
// import time, so build/import in offline environments can't be broken by
// a Google Fonts hiccup. If the fetch rejects, the cache is cleared so the
// next request retries instead of the function being broken until the
// serverless container is recycled.
let fontsPromise: Promise<[ArrayBuffer, ArrayBuffer]> | undefined

const getFonts = (): Promise<[ArrayBuffer, ArrayBuffer]> => {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont('JetBrains Mono', 400),
      loadGoogleFont('JetBrains Mono', 700),
    ])
    fontsPromise.catch(() => {
      fontsPromise = undefined
    })
  }
  return fontsPromise
}

const span = (
  color: string,
  text: string,
  extra: CSSProperties = {},
): ReactElement => {
  // `whiteSpace: pre` preserves spaces — Satori collapses them otherwise,
  // which breaks both indentation and the spaces between keywords.
  return createElement(
    'span',
    { style: { color, whiteSpace: 'pre', ...extra } },
    text,
  )
}

const codeLine = (num: number, tokens: ReactElement[]): ReactElement =>
  createElement(
    'div',
    {
      key: `l${num}`,
      style: {
        display: 'flex',
        fontFamily: 'JetBrains Mono',
        fontSize: 28,
        lineHeight: 1.55,
      },
    },
    createElement(
      'div',
      {
        style: {
          width: 72,
          paddingRight: 24,
          textAlign: 'right',
          color: C.surface2,
          flexShrink: 0,
        },
      },
      String(num),
    ),
    createElement(
      'div',
      { style: { display: 'flex', color: C.text, whiteSpace: 'pre' } },
      ...tokens,
    ),
  )

const truncate = (s: string, max: number): string =>
  s.length > max ? `${s.slice(0, max - 1)}…` : s

const dot = (background: string, size = 16): ReactElement =>
  createElement('div', {
    style: { width: size, height: size, borderRadius: 999, background },
  })

export const GET = async ({ url }: APIContext): Promise<Response> => {
  const [monoRegular, monoBold] = await getFonts()

  const title = url.searchParams.get('title') || 'Phillip Hirsch'
  const description = url.searchParams.get('description') || 'Software Engineer'

  // Build the code block with a running counter so line numbers stay in sync.
  let n = 0
  const line = (tokens: ReactElement[]): ReactElement => codeLine(++n, tokens)

  const lines: ReactElement[] = [
    line([span(C.overlay1, '// philliphirsch.com')]),
    line([span(C.overlay1, `// ${truncate(description, 58)}`)]),
    line([]),
    line([
      span(C.mauve, 'export', { fontWeight: 700 }),
      span(C.text, ' '),
      span(C.mauve, 'const', { fontWeight: 700 }),
      span(C.text, ' '),
      span(C.blue, 'engineer'),
      span(C.text, ' = {'),
    ]),
    line([
      span(C.text, '  '),
      span(C.sapphire, 'name'),
      span(C.text, ': '),
      span(C.green, `"${truncate(title, 36)}"`),
      span(C.text, ','),
    ]),
    line([span(C.text, '  '), span(C.sapphire, 'stack'), span(C.text, ': [')]),
    ...STACK.map((row, i) =>
      line([
        span(C.text, '    '),
        ...row.flatMap((skill, j) => {
          const isLast = i === STACK.length - 1 && j === row.length - 1
          const tokens = [span(C.green, `"${skill}"`)]
          if (!isLast) tokens.push(span(C.text, ', '))
          return tokens
        }),
      ]),
    ),
    line([span(C.text, '  ],')]),
    line([
      span(C.text, '} '),
      span(C.mauve, 'as', { fontWeight: 700 }),
      span(C.text, ' '),
      span(C.mauve, 'const', { fontWeight: 700 }),
    ]),
  ]

  const element: ReactElement = createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: C.crust,
      },
    },
    // Window titlebar: traffic-lights + centered filename tab
    createElement(
      'div',
      {
        key: 'titlebar',
        style: {
          display: 'flex',
          alignItems: 'center',
          height: 56,
          paddingLeft: 24,
          paddingRight: 24,
          background: C.mantle,
          borderBottom: `1px solid ${C.surface0}`,
        },
      },
      createElement(
        'div',
        { style: { display: 'flex', gap: 10 } },
        dot(C.red),
        dot(C.peach),
        dot(C.green),
      ),
      createElement(
        'div',
        {
          style: {
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 18px',
            borderRadius: 8,
            background: C.surface0,
            color: C.subtext1,
            fontFamily: 'JetBrains Mono',
            fontSize: 20,
          },
        },
        createElement('div', {
          style: { width: 10, height: 10, borderRadius: 2, background: C.blue },
        }),
        createElement('span', null, 'philliphirsch.ts'),
      ),
      // Spacer to balance the left-side dots so the tab stays truly centered.
      createElement('div', { style: { display: 'flex', width: 68 } }),
    ),
    // Editor body
    createElement(
      'div',
      {
        key: 'editor',
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '28px 40px',
          background: C.base,
        },
      },
      ...lines,
    ),
    // Status bar — completes the editor illusion, ties to the brand accent.
    createElement(
      'div',
      {
        key: 'statusbar',
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 36,
          paddingLeft: 24,
          paddingRight: 24,
          background: C.mantle,
          borderTop: `1px solid ${C.surface0}`,
          fontFamily: 'JetBrains Mono',
          fontSize: 16,
          color: C.overlay1,
        },
      },
      createElement('span', null, 'TypeScript · UTF-8 · LF'),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: C.mauve,
          },
        },
        dot(C.mauve, 8),
        createElement('span', null, 'philliphirsch.com'),
      ),
    ),
  )

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'JetBrains Mono',
        data: monoRegular,
        weight: 400,
        style: 'normal',
      },
      { name: 'JetBrains Mono', data: monoBold, weight: 700, style: 'normal' },
    ],
  })
}
