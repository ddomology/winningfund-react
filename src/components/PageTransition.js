import { createElement } from 'react'

export default function PageTransition({
  routeKey,
  phase = 'idle',
  routeEnter = 'run',
  reducedMotion = false,
  children,
}) {
  return createElement(
    'div',
    {
      className: 'wf-page-transition',
      'data-route-key': routeKey,
      'data-phase': phase,
      'data-route-enter': routeEnter,
      'data-reduced-motion': reducedMotion ? 'true' : 'false',
    },
    children,
  )
}
