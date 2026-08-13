import {
  createElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  NavLink,
  useLocation,
} from 'react-router'

const DESKTOP_QUERY = '(min-width: 60rem)'

function navClassName({ isActive }) {
  return isActive
    ? 'wf-mobile-nav__link wf-mobile-nav__link--active'
    : 'wf-mobile-nav__link'
}

function MenuMorphIcon({ open }) {
  return createElement(
    'svg',
    {
      className: 'wf-mobile-nav__icon',
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': 'true',
      focusable: 'false',
      'data-open': open ? 'true' : 'false',
    },
    createElement('path', {
      className:
        'wf-mobile-nav__icon-path wf-mobile-nav__icon-path--1',
      d: 'M0 40h62c13 0 6 28-4 18L35 35',
    }),
    createElement('path', {
      className:
        'wf-mobile-nav__icon-path wf-mobile-nav__icon-path--2',
      d: 'M0 50h70',
    }),
    createElement('path', {
      className:
        'wf-mobile-nav__icon-path wf-mobile-nav__icon-path--3',
      d: 'M0 60h62c13 0 6-28-4-18L35 65',
    }),
  )
}

export default function MobileNav({ items = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  function closeMenu({ restoreFocus = false } = {}) {
    const shouldRestore =
      restoreFocus &&
      panelRef.current?.contains(document.activeElement)

    setMenuOpen(false)

    if (shouldRestore) {
      queueMicrotask(() => {
        triggerRef.current?.focus()
      })
    }
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)

    function onViewportChange(event) {
      if (event.matches) setMenuOpen(false)
    }

    media.addEventListener('change', onViewportChange)

    return () => {
      media.removeEventListener('change', onViewportChange)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined

    const root = document.documentElement
    const previousOverflow = root.style.overflow

    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow
    }
  }, [menuOpen])

  if (items.length === 0) return null

  function onPanelKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu({ restoreFocus: true })
    }
  }

  function onPanelClick(event) {
    if (event.target === event.currentTarget) {
      closeMenu({ restoreFocus: true })
    }
  }

  return createElement(
    'div',
    {
      className: 'wf-mobile-nav',
      'data-open': menuOpen ? 'true' : 'false',
    },
    createElement(
      'button',
      {
        ref: triggerRef,
        type: 'button',
        className: 'wf-mobile-nav__trigger',
        'aria-expanded': menuOpen,
        'aria-controls': 'wf-mobile-navigation-panel',
        'aria-label': menuOpen
          ? 'Close navigation menu'
          : 'Open navigation menu',
        onClick: () => setMenuOpen((current) => !current),
      },
      createElement(
        'span',
        { className: 'wf-mobile-nav__trigger-label' },
        menuOpen ? 'CLOSE' : 'MENU',
      ),
      createElement(MenuMorphIcon, { open: menuOpen }),
    ),
    menuOpen
      ? createElement(
          'nav',
          {
            ref: panelRef,
            id: 'wf-mobile-navigation-panel',
            className: 'wf-mobile-nav__panel',
            'aria-label': 'Primary navigation',
            onKeyDown: onPanelKeyDown,
            onClick: onPanelClick,
          },
          createElement(
            'ul',
            { className: 'wf-mobile-nav__list' },
            ...items.map((item, index) =>
              createElement(
                'li',
                {
                  key: item.id,
                  className: 'wf-mobile-nav__item',
                  style: {
                    '--wf-mobile-nav-order': String(index),
                  },
                },
                createElement(
                  NavLink,
                  {
                    to: item.path,
                    end: item.path === '/',
                    className: navClassName,
                    onClick: () => closeMenu(),
                  },
                  createElement(
                    'span',
                    {
                      className: 'wf-mobile-nav__index',
                      'aria-hidden': 'true',
                    },
                    String(index + 1).padStart(2, '0'),
                  ),
                  createElement(
                    'span',
                    { className: 'wf-mobile-nav__label' },
                    item.label,
                  ),
                ),
              ),
            ),
          ),
        )
      : null,
  )
}
