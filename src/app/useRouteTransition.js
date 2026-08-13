import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router'

const WATCHDOG_MS = 1000
const MOBILE_QUERY = '(max-width: 48rem)'
const MOBILE_LONG_SCROLL_PX = 600
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
  if (url.origin !== window.location.origin) return false

  if (APP_BASE_PATH) {
    const pathname = normalizePathname(url.pathname)
    if (
      pathname !== APP_BASE_PATH &&
      !pathname.startsWith(`${APP_BASE_PATH}/`)
    ) {
      return false
    }
  }

  return true
}

function routeIdentity(url) {
  return normalizePathname(
    toRouterPathname(url.pathname),
  )
}

function easeOutCubic(progress) {
  return 1 - ((1 - progress) ** 3)
}

export default function useRouteTransition() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const [phase, setPhase] = useState('idle')
  const [routeEnter, setRouteEnter] = useState('run')
  const [snapCover, setSnapCover] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const pendingRef = useRef(null)
  const transitionOwnedNavigationRef = useRef(false)
  const previousLocationRef = useRef(location)
  const firstLocationEffectRef = useRef(true)
  const watchdogRef = useRef(null)
  const scrollFrameRef = useRef(null)
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

  function cancelScrollMotion() {
    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current)
      scrollFrameRef.current = null
    }
  }

  function animateCurrentPageTowardTop() {
    cancelScrollMotion()

    const startY = window.scrollY
    if (startY <= 1) return

    const mobile = window.matchMedia(MOBILE_QUERY).matches
    const longMobile =
      mobile && startY > MOBILE_LONG_SCROLL_PX

    const duration = longMobile
      ? 110
      : mobile
        ? 145
        : 210

    /*
     * On a long mobile page, only show a short upward pull. The fully opaque
     * wipe hides the final snap to zero so the browser chrome does not spend
     * hundreds of milliseconds chasing a huge smooth-scroll distance.
     */
    const endY = longMobile
      ? Math.max(
          0,
          startY - Math.min(520, Math.max(180, startY * 0.22)),
        )
      : 0

    const startedAt = performance.now()

    function frame(now) {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = easeOutCubic(progress)
      const nextY = startY + ((endY - startY) * eased)

      window.scrollTo(0, nextY)

      if (progress < 1) {
        scrollFrameRef.current = window.requestAnimationFrame(frame)
      } else {
        scrollFrameRef.current = null
      }
    }

    scrollFrameRef.current = window.requestAnimationFrame(frame)
  }

  function finishTransition() {
    clearWatchdog()
    cancelScrollMotion()
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

      cancelScrollMotion()

      if (pending && !transitionOwnedNavigationRef.current) {
        transitionOwnedNavigationRef.current = true

        const target = new URL(pending.to, window.location.origin)
        if (!target.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }

        navigate(pending.to)
      }

      finishTransition()
    }, WATCHDOG_MS)
  }

  useEffect(
    () => () => {
      clearWatchdog()
      cancelScrollMotion()
    },
    [],
  )

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
        if (target.hash && target.hash !== current.hash) return

        if (target.hash === current.hash) {
          event.preventDefault()
        }
        return
      }

      if (phaseRef.current !== 'idle') {
        event.preventDefault()
        return
      }

      const pathname = toRouterPathname(target.pathname)
      const to = `${pathname}${target.search}${target.hash}`

      if (reducedMotion) {
        event.preventDefault()

        if (!target.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }

        navigate(to)
        return
      }

      event.preventDefault()

      pendingRef.current = { to }
      animateCurrentPageTowardTop()
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

    cancelScrollMotion()
    transitionOwnedNavigationRef.current = true
    setRouteEnter('hold')
    setPhase('covered')

    const target = new URL(pending.to, window.location.origin)
    if (!target.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    navigate(pending.to)
  }

  function onWipeTransitionEnd(event) {
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

  return {
    routeKey,
    phase,
    routeEnter,
    snapCover,
    reducedMotion,
    onWipeTransitionEnd,
  }
}
