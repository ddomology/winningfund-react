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

  if (items.length === 0) return null

  function onPanelKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu({ restoreFocus: true })
    }
  }

  return createElement(
    'div',
    { className: 'wf-mobile-nav' },
    createElement(
      'button',
      {
        ref: triggerRef,
        type: 'button',
        className: 'wf-mobile-nav__trigger',
        'aria-expanded': menuOpen,
        'aria-controls': 'wf-mobile-navigation-panel',
        onClick: () => setMenuOpen((current) => !current),
      },
      createElement(
        'span',
        { className: 'wf-mobile-nav__trigger-label' },
        menuOpen ? 'CLOSE' : 'MENU',
      ),
      createElement('span', {
        className: 'wf-mobile-nav__trigger-mark',
        'aria-hidden': 'true',
      }),
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
                    { className: 'wf-mobile-nav__index' },
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
