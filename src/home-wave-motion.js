const HOME_WAVE_TIMINGS = Object.freeze([
  { duration: 7000, phase: 2000 },
  { duration: 10000, phase: 3000 },
  { duration: 13000, phase: 4000 },
  { duration: 20000, phase: 5000 },
])

const START_X = -42
const END_X = 133
const WAVE_SELECTOR = '.wf-home-wave__parallax > use'
const activeLayers = new Map()

let animationOrigin = 0
let frameRequest = 0

function cubicBezierCoordinate(t, p1, p2) {
  const oneMinusT = 1 - t
  return 3 * oneMinusT * oneMinusT * t * p1 + 3 * oneMinusT * t * t * p2 + t * t * t
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

function syncHomeWaveLayers() {
  const layers = document.querySelectorAll(WAVE_SELECTOR)

  layers.forEach((useElement, index) => {
    if (activeLayers.has(useElement)) return
    activeLayers.set(useElement, { ...HOME_WAVE_TIMINGS[index % 4] })
    useElement.setAttribute('x', '48')
  })

  for (const useElement of activeLayers.keys()) {
    if (!useElement.isConnected) activeLayers.delete(useElement)
  }
}

function renderHomeWaveFrame(now) {
  if (!animationOrigin) animationOrigin = now
  const elapsed = now - animationOrigin

  for (const [useElement, timing] of activeLayers.entries()) {
    const cycle = ((elapsed + timing.phase) % timing.duration) / timing.duration
    const eased = referenceEase(cycle)
    const x = START_X + (END_X - START_X) * eased
    useElement.setAttribute('x', x.toFixed(3))
  }

  frameRequest = requestAnimationFrame(renderHomeWaveFrame)
}

function startHomeWaveMotion() {
  syncHomeWaveLayers()

  const observer = new MutationObserver(syncHomeWaveLayers)
  observer.observe(document.documentElement, { childList: true, subtree: true })

  if (!frameRequest) frameRequest = requestAnimationFrame(renderHomeWaveFrame)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHomeWaveMotion, { once: true })
} else {
  startHomeWaveMotion()
}
