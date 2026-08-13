import { createElement } from 'react'

const ROUTE_COUNT = 5
const SLOT_WIDTH = 160
const TOTAL_WIDTH = ROUTE_COUNT * SLOT_WIDTH
const WAVE_HEIGHT = 52
const OVERSCAN = 72
const SAMPLE_STEP = 3

const LAYERS = Object.freeze([
  {
    className: 'wf-desktop-continuous-wave__layer--1',
    baseY: 30,
    amplitudeA: 7.2,
    amplitudeB: 3.4,
    wavelengthA: 132,
    wavelengthB: 318,
    phaseA: 0.45,
    phaseB: 1.7,
  },
  {
    className: 'wf-desktop-continuous-wave__layer--2',
    baseY: 33,
    amplitudeA: 8.4,
    amplitudeB: 4.2,
    wavelengthA: 168,
    wavelengthB: 372,
    phaseA: 1.25,
    phaseB: 0.2,
  },
  {
    className: 'wf-desktop-continuous-wave__layer--3',
    baseY: 36,
    amplitudeA: 9.4,
    amplitudeB: 4.8,
    wavelengthA: 206,
    wavelengthB: 446,
    phaseA: 2.2,
    phaseB: 1.05,
  },
  {
    className: 'wf-desktop-continuous-wave__layer--4',
    baseY: 39,
    amplitudeA: 10.2,
    amplitudeB: 5.2,
    wavelengthA: 252,
    wavelengthB: 522,
    phaseA: 0.8,
    phaseB: 2.35,
  },
])

function waveY(x, layer) {
  return (
    layer.baseY +
    Math.sin((x / layer.wavelengthA) * Math.PI * 2 + layer.phaseA) *
      layer.amplitudeA +
    Math.sin((x / layer.wavelengthB) * Math.PI * 2 + layer.phaseB) *
      layer.amplitudeB
  )
}

function buildWavePath(layer) {
  const startX = -OVERSCAN
  const endX = TOTAL_WIDTH + OVERSCAN
  const points = []

  for (let x = startX; x <= endX; x += SAMPLE_STEP) {
    points.push(`${x.toFixed(2)} ${waveY(x, layer).toFixed(2)}`)
  }

  if ((endX - startX) % SAMPLE_STEP !== 0) {
    points.push(`${endX.toFixed(2)} ${waveY(endX, layer).toFixed(2)}`)
  }

  return [
    `M ${points[0]}`,
    ...points.slice(1).map((point) => `L ${point}`),
    `L ${endX} ${WAVE_HEIGHT}`,
    `L ${startX} ${WAVE_HEIGHT}`,
    'Z',
  ].join(' ')
}

const WAVE_PATHS = LAYERS.map((layer) => ({
  ...layer,
  d: buildWavePath(layer),
}))

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
          viewBox: `0 0 ${TOTAL_WIDTH} ${WAVE_HEIGHT}`,
          preserveAspectRatio: 'none',
          shapeRendering: 'geometricPrecision',
          focusable: 'false',
        },
        ...WAVE_PATHS.map((layer, index) =>
          createElement(
            'g',
            {
              key: layer.className,
              className:
                `wf-desktop-continuous-wave__layer ${layer.className}`,
            },
            createElement('path', {
              d: layer.d,
              fill: `var(--wf-desktop-wave-layer-${index + 1})`,
            }),
          ),
        ),
      ),
    ),
  )
}
