import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router'
import { ROUTE_META } from '../app/routeMeta.js'

const WATCHDOG_MS = 1400
const APP_BASE_PATH =
  import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/+$/, '')

function normalizePathname(pathname) {
  if (!pathname) return '/'
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
}

function toRouterPathname(pathname) {
  const normalized = normalizePathname(pathname)

  if (!APP_BASE_PATH) return normalized
  if (normalized === APP_BASE_PATH) return '/'

  if (normalized.startsWith(`${APP_BASE_PATH}/`)) {
    return normalized.slice(APP_BASE_PATH.length) || '/'
  }

  return normalized
}

function resolveRouteMeta(pathname) {
  const normalized = normalizePathname(
    toRouterPathname(pathname),
  )
  const index = ROUTE_META.findIndex(
    (entry) => normalizePathname(entry.path) === normalized,
  )

  if (index === -1) {
    return {
      index: '--',
      label: 'PAGE',
    }
  }

  return {
    index: String(index + 1).padStart(2, '0'),
    label: ROUTE_META[index].label,
  }
}

function isModifiedClick(event) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  )
}

function isInternalAnchor(anchor) {
  if (!anchor?.href) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false

  const url = new URL(anchor.href, document.URL)
  return url.origin === window.location.origin
}

function routeIdentity(url) {
  return normalizePathname(
    toRouterPathname(url.pathname),
  )
}

export default function PageTransition({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const [phase, setPhase] = useState('idle')
  const [routeEnter, setRouteEnter] = useState('run')
  const [snapCover, setSnapCover] = useState(false)
  const [marker, setMarker] = useState(() =>
    resolveRouteMeta(location.pathname),
  )
  const [reducedMotion, setReducedMotion] = useState(false)

  const pendingRef = useRef(null)
  const transitionOwnedNavigationRef = useRef(false)
  const previousLocationRef = useRef(location)
  const firstLocationEffectRef = useRef(true)
  const watchdogRef = useRef(null)
  const phaseRef = useRef(phase)

  phaseRef.current = phase

  const routeKey = `${location.pathname}${location.hash}`

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  function clearWatchdog() {
    if (watchdogRef.current) {
      window.clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }

  function finishTransition() {
    clearWatchdog()
    pendingRef.current = null
    transitionOwnedNavigationRef.current = false
    setSnapCover(false)
    setRouteEnter('run')
    setPhase('idle')
  }

  function beginWatchdog() {
    clearWatchdog()

    watchdogRef.current = window.setTimeout(() => {
      const pending = pendingRef.current

      if (pending && !transitionOwnedNavigationRef.current) {
        transitionOwnedNavigationRef.current = true
        navigate(pending.to)
      }

      finishTransition()
    }, WATCHDOG_MS)
  }

  useEffect(() => clearWatchdog, [])

  useLayoutEffect(() => {
    if (firstLocationEffectRef.current) {
      firstLocationEffectRef.current = false
      previousLocationRef.current = location
      return
    }

    const previous = previousLocationRef.current
    previousLocationRef.current = location

    if (transitionOwnedNavigationRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (phaseRef.current === 'covered') {
            setPhase('revealing')
          }
        })
      })
      return
    }

    if (
      navigationType === 'POP' &&
      normalizePathname(previous.pathname) !==
        normalizePathname(location.pathname)
    ) {
      if (reducedMotion) {
        setRouteEnter('run')
        return
      }

      setMarker(resolveRouteMeta(location.pathname))
      setRouteEnter('hold')
      setSnapCover(true)
      setPhase('covered')
      beginWatchdog()

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSnapCover(false)
          setPhase('revealing')
        })
      })
    }
  }, [location, navigationType, reducedMotion])

  useEffect(() => {
    function onDocumentClick(event) {
      if (event.defaultPrevented || isModifiedClick(event)) return

      const anchor = event.target.closest?.('a[href]')
      if (!anchor || !isInternalAnchor(anchor)) return

      const target = new URL(anchor.href, document.URL)
      const current = new URL(document.URL)

      const samePath =
        routeIdentity(target) === routeIdentity(current)

      if (samePath) {
        if (
          target.hash &&
          target.hash !== current.hash
        ) {
          return
        }

        if (target.hash === current.hash) {
          event.preventDefault()
        }
        return
      }

      if (phaseRef.current !== 'idle') {
        event.preventDefault()
        return
      }

      if (reducedMotion) return

      event.preventDefault()

      const pathname = toRouterPathname(target.pathname)
      const to = `${pathname}${target.search}${target.hash}`
      pendingRef.current = { to }
      setMarker(resolveRouteMeta(pathname))
      setPhase('covering')
      beginWatchdog()
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => {
      document.removeEventListener('click', onDocumentClick, true)
    }
  }, [navigate, reducedMotion])

  function commitPendingNavigation() {
    const pending = pendingRef.current
    if (!pending) return

    transitionOwnedNavigationRef.current = true
    setRouteEnter('hold')
    setPhase('covered')

    const target = new URL(pending.to, window.location.origin)
    if (!target.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    navigate(pending.to)
  }

  function onCurtainTransitionEnd(event) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform'
    ) {
      return
    }

    if (phaseRef.current === 'covering') {
      commitPendingNavigation()
      return
    }

    if (phaseRef.current === 'revealing') {
      finishTransition()
    }
  }

  const rootProps = useMemo(
    () => ({
      className: 'wf-page-transition',
      'data-route-key': routeKey,
      'data-phase': phase,
      'data-route-enter': routeEnter,
      'data-snap-cover': snapCover ? 'true' : 'false',
      'data-reduced-motion': reducedMotion ? 'true' : 'false',
    }),
    [phase, reducedMotion, routeEnter, routeKey, snapCover],
  )

  return createElement(
    'div',
    rootProps,
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
