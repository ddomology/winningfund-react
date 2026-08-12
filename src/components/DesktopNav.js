import { createElement } from 'react'
import { NavLink } from 'react-router'

function navClassName({ isActive }) {
  return isActive
    ? 'wf-nav-link wf-nav-link--active'
    : 'wf-nav-link'
}

export default function DesktopNav({ items = [] }) {
  if (items.length === 0) return null

  return createElement(
    'nav',
    {
      className: 'wf-desktop-nav',
      'aria-label': 'Primary navigation',
    },
    createElement(
      'ul',
      { className: 'wf-desktop-nav__list' },
      ...items.map((item) =>
        createElement(
          'li',
          {
            key: item.id,
            className: 'wf-desktop-nav__item',
          },
          createElement(
            NavLink,
            {
              to: item.path,
              end: item.path === '/',
              className: navClassName,
              'aria-current': undefined,
            },
            item.label,
          ),
        ),
      ),
    ),
  )
}
