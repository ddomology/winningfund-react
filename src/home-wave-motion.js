const WAVE_TIMINGS = Object.freeze([
  { duration: 7000, phase: 2000 },
  { duration: 10000, phase: 3000 },
  { duration: 13000, phase: 4000 },
  { duration: 20000, phase: 5000 },
])

const START_X = -90
const END_X = 85
const SELECTORS = Object.freeze([
  '.wf-home-wave__parallax > use',
  '.wf-desktop-continuous-wave__layer',
])

const activeLayers = new Map()

let animationOrigin = 0
let frameRequest = 0

function cubicBezierCoordinate(t, p1, p2) {
  const oneMinusT = 1 - t
  return (
    3 * oneMinusT * oneMinusT * t * p1 +
    3 * oneMinusT * t * t * p2 +
    t * t * t
  )
}

function referenceEase(progress) {
  let low = 0
  let high = 1
  let t = progress

  for (let index = 0; index < 12; index += 1) {
    const x = cubicBezierCoordinate(t, 0.55, 0.45)
    if (x < progress) low = t
    else high = t
    t = (low + high) / 2
  }

  return cubicBezierCoordinate(t, 0.5, 0.5)
}

function registerSelector(selector) {
  const layers = document.querySelectorAll(selector)

  layers.forEach((element, index) => {
    if (activeLayers.has(element)) return

    activeLayers.set(element, {
      ...WAVE_TIMINGS[index % WAVE_TIMINGS.length],
    })

    element.style.setProperty('animation', 'none', 'important')
    element.style.setProperty('translate', 'none', 'important')
    element.style.setProperty('will-change', 'transform')
  })
}

function syncWaveLayers() {
  SELECTORS.forEach(registerSelector)

  for (const element of activeLayers.keys()) {
    if (!element.isConnected) activeLayers.delete(element)
  }
}

function renderWaveFrame(now) {
  if (!animationOrigin) animationOrigin = now
  const elapsed = now - animationOrigin

  for (const [element, timing] of activeLayers.entries()) {
    const cycle =
      ((elapsed + timing.phase) % timing.duration) /
      timing.duration

    const eased = referenceEase(cycle)
    const offset = START_X + (END_X - START_X) * eased

    element.style.setProperty(
      'transform',
      `translate3d(${offset.toFixed(3)}px, 0, 0)`,
      'important',
    )
  }

  frameRequest = requestAnimationFrame(renderWaveFrame)
}

function startWaveMotion() {
  syncWaveLayers()

  const observer = new MutationObserver(syncWaveLayers)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  if (!frameRequest) {
    frameRequest = requestAnimationFrame(renderWaveFrame)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startWaveMotion, {
    once: true,
  })
} else {
  startWaveMotion()
}
