import { createElement } from 'react'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return createElement(
    'section',
    {
      className: 'wf-route-placeholder wf-route-placeholder--not-found',
      'aria-labelledby': 'not-found-title',
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
        '404',
      ),
      createElement('span', {
        className: 'wf-route-placeholder__rule',
        'aria-hidden': 'true',
      }),
    ),
    createElement(
      'p',
      { className: 'wf-route-placeholder__eyebrow' },
      'ROUTE NOT FOUND',
    ),
    createElement(
      'h1',
      {
        id: 'not-found-title',
        className: 'wf-route-placeholder__title',
      },
      'NOT FOUND',
    ),
    createElement(
      'p',
      { className: 'wf-route-placeholder__note' },
      'The requested path is not a WinningFund canonical route.',
    ),
    createElement(
      Link,
      {
        to: '/',
        className: 'wf-not-found-link',
      },
      'Return to HOME',
    ),
  )
}
