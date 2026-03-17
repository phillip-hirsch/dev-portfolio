import { ImageResponse } from '@vercel/og'
import type { APIContext } from 'astro'
import type { ReactElement } from 'react'

export const prerender = false

export async function GET({ url }: APIContext) {
  const title = url.searchParams.get('title') || 'Phillip Hirsch'
  const description = url.searchParams.get('description') || 'Software Engineer'

  const element = {
    type: 'div',
    key: null,
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
        background:
          'linear-gradient(135deg, #0a0f19 0%, #0e2035 50%, #0c4a6e 100%)',
        color: '#e8f4fd',
      },
      children: [
        {
          type: 'div',
          key: 'badge',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'div',
                key: 'dot',
                props: {
                  style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9, #7dd3fc)',
                    flexShrink: 0,
                  },
                },
              },
              {
                type: 'span',
                key: 'url',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#7dd3fc',
                    letterSpacing: '0.05em',
                  },
                  children: 'philliphirsch.com',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          key: 'content',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
            children: [
              {
                type: 'div',
                key: 'title',
                props: {
                  style: {
                    fontSize: title.length > 30 ? '56px' : '72px',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #e8f4fd, #7dd3fc)',
                    backgroundClip: 'text',
                    color: 'transparent',
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                key: 'desc',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: '#b0d4ed',
                    maxWidth: '700px',
                  },
                  children: description,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          key: 'glow',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '0',
              right: '0',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, hsla(199, 90%, 55%, 0.15) 0%, transparent 70%)',
            },
          },
        },
      ],
    },
  } satisfies ReactElement

  return new ImageResponse(element, { width: 1200, height: 630 })
}
