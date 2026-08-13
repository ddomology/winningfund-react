import { createElement } from 'react'

const routeRowStyle = {
  minHeight: 0,
  margin: 0,
  padding: 0,
  width: 'fit-content',
  maxWidth: '100%',
  gridTemplateColumns: 'minmax(0, 1fr)',
  overflow: 'visible',
  border: 0,
}

const routeSlotStyle = {
  gridColumn: 1,
  width: 'fit-content',
  maxWidth: '100%',
  minWidth: 0,
  margin: 0,
  padding: 0,
  overflow: 'visible',
}

export function RouteHeroTitle({
  id,
  className = '',
  title,
  alignment = 'center',
}) {
  if (!title) {
    throw new Error('RouteHeroTitle requires title.')
  }

  return createElement(
    'h1',
    {
      id,
      className:
        `wf-route-hero-title wf-route-hero-title--${alignment} ${className}`.trim(),
      'aria-label': title,
    },
    createElement(
      'span',
      {
        className: 'wf-route-hero-title__slot',
        'aria-hidden': 'true',
      },
      createElement(
        'span',
        {
          className:
            'wf-home-kinetic-row wf-home-kinetic-row--1',
          style: routeRowStyle,
        },
        createElement(
          'span',
          {
            className: 'wf-home-kinetic-row__text-slot',
            style: routeSlotStyle,
          },
          createElement(
            'span',
            {
              className: 'wf-home-kinetic-row__ghost',
            },
            title,
          ),
          createElement(
            'span',
            {
              className: 'wf-home-kinetic-row__reveal',
            },
            createElement(
              'span',
              {
                className: 'wf-home-kinetic-row__reveal-word',
              },
              title,
            ),
          ),
        ),
      ),
    ),
  )
}

export function RouteHeroWave({
  waveId,
  surface = 'white',
}) {
  if (!waveId) {
    throw new Error('RouteHeroWave requires waveId.')
  }

  return createElement(
    'div',
    {
      className:
        `wf-route-hero-wave wf-route-hero-wave--${surface}`,
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        className: 'wf-route-hero-wave__svg',
        viewBox: '0 24 150 28',
        preserveAspectRatio: 'none',
        shapeRendering: 'auto',
        focusable: 'false',
      },
      createElement(
        'defs',
        null,
        createElement('path', {
          id: waveId,
          d: 'M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z',
        }),
      ),
      createElement(
        'g',
        {
          className: 'wf-route-hero-wave__parallax',
        },
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 0,
          fill: 'var(--wf-route-wave-layer-1)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 3,
          fill: 'var(--wf-route-wave-layer-2)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 5,
          fill: 'var(--wf-route-wave-layer-3)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 7,
          fill: 'var(--wf-route-wave-layer-4)',
        }),
      ),
    ),
  )
}
