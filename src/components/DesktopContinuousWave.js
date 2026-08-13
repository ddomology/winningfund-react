import { createElement } from 'react'

const ROUTE_COUNT = 5
const SLOT_WIDTH = 150
const TOTAL_WIDTH = ROUTE_COUNT * SLOT_WIDTH
const WAVE_HEIGHT = 28

const LAYERS = Object.freeze([
  { className: 'wf-desktop-continuous-wave__layer--1', y: 0 },
  { className: 'wf-desktop-continuous-wave__layer--2', y: 3 },
  { className: 'wf-desktop-continuous-wave__layer--3', y: 5 },
  { className: 'wf-desktop-continuous-wave__layer--4', y: 7 },
])

function buildReferenceWavePath() {
  const startX = -352
  const startY = 44
  const halfWave = 88
  const segmentCount = 17

  const segments = [
    `M${startX} ${startY}`,
    `c30 0 58 -18 ${halfWave} -18`,
  ]

  for (let index = 0; index < segmentCount; index += 1) {
    const deltaY = index % 2 === 0 ? 18 : -18
    segments.push(`s58 ${deltaY} ${halfWave} ${deltaY}`)
  }

  const endX = startX + halfWave * (segmentCount + 1)
  segments.push(`v44h-${endX - startX}z`)

  return segments.join(' ')
}

const REFERENCE_WAVE_PATH = buildReferenceWavePath()

export default function DesktopContinuousWave({ routeIndex = -1 }) {
  if (routeIndex < 0 || routeIndex >= ROUTE_COUNT) return null

  return createElement(
    'div',
    {
      className: 'wf-desktop-continuous-wave',
      'aria-hidden': 'true',
    },
    createElement(
      'div',
      {
        className: 'wf-desktop-continuous-wave__track',
        style: {
          '--wf-desktop-wave-offset': `${routeIndex * -100}vw`,
        },
      },
      createElement(
        'svg',
        {
          className: 'wf-desktop-continuous-wave__svg',
          viewBox: `0 24 ${TOTAL_WIDTH} ${WAVE_HEIGHT}`,
          preserveAspectRatio: 'none',
          shapeRendering: 'auto',
          focusable: 'false',
        },
        createElement(
          'defs',
          null,
          createElement('path', {
            id: 'wf-desktop-gentle-wave',
            d: REFERENCE_WAVE_PATH,
          }),
        ),
        ...LAYERS.map((layer, index) =>
          createElement('use', {
            key: layer.className,
            href: '#wf-desktop-gentle-wave',
            x: 48,
            y: layer.y,
            className:
              `wf-desktop-continuous-wave__layer ${layer.className}`,
            fill: `var(--wf-desktop-wave-layer-${index + 1})`,
          }),
        ),
      ),
    ),
  )
}
