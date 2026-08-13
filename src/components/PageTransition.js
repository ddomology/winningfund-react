import { createElement } from 'react'

export default function PageTransition({
  routeKey,
  phase = 'idle',
  routeEnter = 'run',
  snapCover = false,
  reducedMotion = false,
  marker = { index: '--', label: 'PAGE' },
  onCurtainTransitionEnd,
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
    createElement(
      'div',
      {
        className: 'wf-page-transition__curtain',
        'aria-hidden': 'true',
        onTransitionEnd: onCurtainTransitionEnd,
      },
      createElement('div', {
        className: 'wf-page-transition__slit',
      }),
      createElement(
        'p',
        {
          className: 'wf-page-transition__marker',
        },
        createElement(
          'span',
          {
            className: 'wf-page-transition__marker-index',
          },
          marker.index,
        ),
        createElement(
          'span',
          {
            className: 'wf-page-transition__marker-label',
          },
          marker.label,
        ),
      ),
    ),
  )
}
