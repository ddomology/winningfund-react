import { createElement } from 'react'
import {
  Link,
  useLocation,
} from 'react-router'

export default function InternalSectionNav({
  items = [],
  activeSectionId,
  ariaLabel = 'Page sections',
}) {
  const location = useLocation()

  if (items.length === 0) return null

  return createElement(
    'nav',
    {
      className: 'wf-internal-section-nav',
      'aria-label': ariaLabel,
    },
    createElement(
      'ul',
      { className: 'wf-internal-section-nav__list' },
      ...items.map((item) => {
        const active = activeSectionId === item.id

        return createElement(
          'li',
          {
            key: item.id,
            className: 'wf-internal-section-nav__item',
          },
          createElement(
            Link,
            {
              className:
                active
                  ? 'wf-internal-section-nav__link wf-internal-section-nav__link--active'
                  : 'wf-internal-section-nav__link',
              to: {
                pathname: location.pathname,
                hash: `#${item.id}`,
              },
              'aria-current': active ? 'location' : undefined,
            },
            item.label,
          ),
        )
      }),
    ),
  )
}
