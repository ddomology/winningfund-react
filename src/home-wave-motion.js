const SVG_NS = 'http://www.w3.org/2000/svg'

const HOME_WAVE_TIMINGS = Object.freeze([
  { duration: '7s', begin: '-2s' },
  { duration: '10s', begin: '-3s' },
  { duration: '13s', begin: '-4s' },
  { duration: '20s', begin: '-5s' },
])

function hasNativeWaveAnimation(useElement) {
  return Array.from(useElement.children).some(
    (child) =>
      child.localName === 'animate' &&
      child.getAttribute('data-wf-home-wave-native') === 'true',
  )
}

function attachNativeWaveAnimation(useElement, index) {
  if (hasNativeWaveAnimation(useElement)) return

  const timing = HOME_WAVE_TIMINGS[index % HOME_WAVE_TIMINGS.length]

  // Goodkatz reference geometry: x=48 with transform -90 -> 85.
  // Moving SVG x from -42 -> 133 is exactly the same horizontal travel,
  // but it cannot be cancelled by a CSS transform override.
  useElement.setAttribute('x', '48')

  const animation = document.createElementNS(SVG_NS, 'animate')
  animation.setAttribute('data-wf-home-wave-native', 'true')
  animation.setAttribute('attributeName', 'x')
  animation.setAttribute('values', '-42;133')
  animation.setAttribute('dur', timing.duration)
  animation.setAttribute('begin', timing.begin)
  animation.setAttribute('repeatCount', 'indefinite')
  animation.setAttribute('calcMode', 'spline')
  animation.setAttribute('keyTimes', '0;1')
  animation.setAttribute('keySplines', '.55 .5 .45 .5')

  useElement.appendChild(animation)
}

function hydrateHomeWaves(root = document) {
  const layers = root.querySelectorAll?.('.wf-home-wave__parallax > use')
  if (!layers?.length) return

  layers.forEach((useElement, index) => {
    attachNativeWaveAnimation(useElement, index % 4)
  })
}

function startHomeWaveMotion() {
  hydrateHomeWaves()

  const observer = new MutationObserver(() => {
    hydrateHomeWaves()
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHomeWaveMotion, {
    once: true,
  })
} else {
  startHomeWaveMotion()
}
