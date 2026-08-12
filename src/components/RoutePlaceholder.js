import { createElement } from 'react'

export default function RoutePlaceholder({
  index,
  title,
  pathname,
}) {
  return createElement(
    'section',
    {
      className: 'wf-route-placeholder',
      'aria-labelledby': `route-placeholder-${index}`,
    },
    createElement(
      'div',
      { className: 'wf-route-placeholder__index-row' },
      createElement(
        'span',
        {
          className: 'wf-route-placeholder__index',
          'aria-hidden': 'true',
        },
        index,
      ),
      createElement('span', {
        className: 'wf-route-placeholder__rule',
        'aria-hidden': 'true',
      }),
    ),
    createElement(
      'p',
      { className: 'wf-route-placeholder__eyebrow' },
      'ROUTE PLACEHOLDER / STEP 02',
    ),
    createElement(
      'h1',
      {
        id: `route-placeholder-${index}`,
        className: 'wf-route-placeholder__title',
      },
      title,
    ),
    createElement(
      'p',
      { className: 'wf-route-placeholder__path' },
      pathname,
    ),
    createElement(
      'p',
      { className: 'wf-route-placeholder__note' },
      'Business page content is intentionally deferred to a later implementation stage.',
    ),
  )
}
