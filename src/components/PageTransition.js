import { createElement } from 'react'

export default function PageTransition({
  routeKey,
  reducedMotion = false,
  children,
}) {
  return createElement(
    'div',
    {
      className: 'wf-page-transition',
      'data-route-key': routeKey,
      'data-reduced-motion': reducedMotion ? 'true' : 'false',
    },
    children,
  )
}
