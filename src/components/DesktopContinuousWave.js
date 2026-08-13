import { createElement } from 'react'

const ROUTE_COUNT = 5
const GENTLE_WAVE_PATH =
  'M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'

const LAYERS = Object.freeze([
  { y: 0, fill: 'var(--wf-desktop-wave-layer-1)' },
  { y: 3, fill: 'var(--wf-desktop-wave-layer-2)' },
  { y: 5, fill: 'var(--wf-desktop-wave-layer-3)' },
  { y: 7, fill: 'var(--wf-desktop-wave-layer-4)' },
])

function ReferenceWaveSlot({ slotIndex }) {
  const waveId = `wf-desktop-gentle-wave-${slotIndex}`

  return createElement(
    'svg',
    {
      className:
        'wf-desktop-continuous-wave__svg wf-desktop-continuous-wave__slot',
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
        d: GENTLE_WAVE_PATH,
      }),
    ),
    createElement(
      'g',
      { className: 'wf-desktop-continuous-wave__parallax' },
      ...LAYERS.map((layer, index) =>
        createElement('use', {
          key: `${slotIndex}-${index}`,
          href: `#${waveId}`,
          x: 48,
          y: layer.y,
          className:
            `wf-desktop-continuous-wave__layer ` +
            `wf-desktop-continuous-wave__layer--${index + 1}`,
          fill: layer.fill,
        }),
      ),
    ),
  )
}

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
      ...Array.from({ length: ROUTE_COUNT }, (_, slotIndex) =>
        createElement(ReferenceWaveSlot, {
          key: slotIndex,
          slotIndex,
        }),
      ),
    ),
  )
}
