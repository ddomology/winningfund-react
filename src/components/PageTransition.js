import { createElement } from 'react'

const MOBILE_HALO_DOTS = 12

export default function PageTransition({
  routeKey,
  phase = 'idle',
  routeEnter = 'run',
  reducedMotion = false,
  brandLogoUrl,
  onMobileCurtainTransitionEnd,
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
    createElement(
      'div',
      {
        className: 'wf-mobile-route-curtain',
        'aria-hidden': 'true',
        onTransitionEnd: onMobileCurtainTransitionEnd,
      },
      createElement(
        'div',
        {
          className: 'wf-mobile-route-curtain__brand-stage',
        },
        createElement(
          'div',
          {
            className: 'wf-mobile-route-curtain__halo',
          },
          ...Array.from({ length: MOBILE_HALO_DOTS }, (_, index) =>
            createElement('span', {
              key: `halo-dot-${index}`,
              className: 'wf-mobile-route-curtain__dot',
              style: {
                '--wf-mobile-dot-index': index,
                '--wf-mobile-dot-angle': `${index * 30}deg`,
              },
            }),
          ),
        ),
        brandLogoUrl
          ? createElement('img', {
              className: 'wf-mobile-route-curtain__logo',
              src: brandLogoUrl,
              alt: '',
              draggable: false,
            })
          : createElement(
              'span',
              {
                className: 'wf-mobile-route-curtain__wordmark',
              },
              'WINNING FUND',
            ),
      ),
    ),
  )
}
