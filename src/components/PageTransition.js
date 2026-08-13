import { createElement } from 'react'

export default function PageTransition({
  routeKey,
  phase = 'idle',
  routeEnter = 'run',
  snapCover = false,
  reducedMotion = false,
  onWipeTransitionEnd,
  children,
}) {
  return createElement(
    'div',
    {
      className: 'wf-page-transition',
      'data-route-key': routeKey,
      'data-phase': phase,
      'data-route-enter': routeEnter,
      'data-snap-cover': snapCover ? 'true' : 'false',
      'data-reduced-motion': reducedMotion ? 'true' : 'false',
    },
    children,
    createElement('div', {
      className: 'wf-page-transition__wipe',
      'aria-hidden': 'true',
      onTransitionEnd: onWipeTransitionEnd,
    }),
  )
}
