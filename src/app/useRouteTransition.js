import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import {
  useLocation,
  useNavigate,
} from 'react-router'

const MOBILE_QUERY = '(max-width: 48rem)'
const MOBILE_WATCHDOG_MS = 2400
const MOBILE_BRAND_HOLD_MS = 140
const DESKTOP_TRANSITION_MS = 820
const ROUTE_ORDER = Object.freeze([
  '/',
  '/about',
  '/members',
  '/activities',
  '/recruitment',
])
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

function getRouteIndex(pathname) {
  return ROUTE_ORDER.indexOf(
    normalizePathname(toRouterPathname(pathname)),
  )
}

function getRouteDirection(currentPathname, targetPathname) {
  const currentIndex = getRouteIndex(currentPathname)
  const targetIndex = getRouteIndex(targetPathname)

  if (currentIndex < 0 || targetIndex < 0) return 'forward'
  return targetIndex >= currentIndex ? 'forward' : 'backward'
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

function scrollToRouteTarget(target) {
  if (!target.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return
  }

  const id = decodeURIComponent(target.hash.slice(1))
  const element = document.getElementById(id)

  if (element) {
    element.scrollIntoView({ block: 'start', behavior: 'auto' })
  }
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches
}

export default function useRouteTransition() {
  const location = useLocation()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle')
  const [routeEnter, setRouteEnter] = useState('run')
  const [routeDirection, setRouteDirection] = useState('forward')
  const [reducedMotion, setReducedMotion] = useState(false)

  const phaseRef = useRef('idle')
  const scrollFrameRef = useRef(null)
  const transitionRef = useRef(null)
  const pendingMobileRef = useRef(null)
  const mobileWatchdogRef = useRef(null)
  const mobileHoldRef = useRef(null)

  const routeKey = `${location.pathname}${location.hash}`
  const routeIndex = getRouteIndex(location.pathname)

  function setTransitionPhase(nextPhase) {
    phaseRef.current = nextPhase
    setPhase(nextPhase)
  }

  function setDesktopDirection(nextDirection) {
    setRouteDirection(nextDirection)
    document.documentElement.dataset.wfRouteDirection = nextDirection
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)

    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  function cancelScrollMotion() {
    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current)
      scrollFrameRef.current = null
    }
  }

  function clearMobileWatchdog() {
    if (mobileWatchdogRef.current) {
      window.clearTimeout(mobileWatchdogRef.current)
      mobileWatchdogRef.current = null
    }
  }

  function clearMobileHold() {
    if (mobileHoldRef.current) {
      window.clearTimeout(mobileHoldRef.current)
      mobileHoldRef.current = null
    }
  }

  function pullCurrentScreenToTop() {
    cancelScrollMotion()

    const startY = window.scrollY
    if (startY <= 1) return Promise.resolve()

    const duration = isMobileViewport() ? 170 : 220
    const startedAt = performance.now()

    return new Promise((resolve) => {
      function frame(now) {
        const progress = Math.min(1, (now - startedAt) / duration)
        const eased = easeOutCubic(progress)
        const nextY = startY * (1 - eased)

        window.scrollTo(0, nextY)

        if (progress < 1) {
          scrollFrameRef.current = window.requestAnimationFrame(frame)
          return
        }

        scrollFrameRef.current = null
        window.scrollTo(0, 0)
        resolve()
      }

      scrollFrameRef.current = window.requestAnimationFrame(frame)
    })
  }

  function finishTransition() {
    clearMobileWatchdog()
    clearMobileHold()
    pendingMobileRef.current = null
    transitionRef.current = null
    delete document.documentElement.dataset.wfRouteDirection
    setRouteEnter('run')
    setTransitionPhase('idle')
  }

  function commitRoute(to) {
    const target = new URL(to, window.location.origin)

    flushSync(() => {
      setRouteEnter('hold')
      navigate(to)
    })

    scrollToRouteTarget(target)
  }

  function swapDesktopScreens(to) {
    setTransitionPhase('swapping')

    if (typeof document.startViewTransition !== 'function') {
      commitRoute(to)
      window.setTimeout(finishTransition, DESKTOP_TRANSITION_MS)
      return
    }

    const transition = document.startViewTransition(() => {
      commitRoute(to)
    })

    transitionRef.current = transition

    transition.finished
      .catch(() => undefined)
      .finally(() => {
        if (transitionRef.current === transition) {
          finishTransition()
        }
      })
  }

  function beginMobileCurtain(to) {
    pendingMobileRef.current = { to, committed: false }
    setTransitionPhase('mobile-covering')

    clearMobileWatchdog()
    mobileWatchdogRef.current = window.setTimeout(() => {
      const pending = pendingMobileRef.current

      if (pending && !pending.committed) {
        pending.committed = true
        commitRoute(pending.to)
      }

      finishTransition()
    }, MOBILE_WATCHDOG_MS)
  }

  function onMobileCurtainTransitionEnd(event) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform'
    ) {
      return
    }

    if (phaseRef.current === 'mobile-covering') {
      const pending = pendingMobileRef.current
      if (!pending) {
        finishTransition()
        return
      }

      pending.committed = true
      commitRoute(pending.to)
      setTransitionPhase('mobile-covered')

      clearMobileHold()
      mobileHoldRef.current = window.setTimeout(() => {
        mobileHoldRef.current = null

        if (phaseRef.current === 'mobile-covered') {
          setTransitionPhase('mobile-revealing')
        }
      }, MOBILE_BRAND_HOLD_MS)
      return
    }

    if (phaseRef.current === 'mobile-revealing') {
      finishTransition()
    }
  }

  useEffect(
    () => () => {
      cancelScrollMotion()
      clearMobileWatchdog()
      clearMobileHold()
      transitionRef.current = null
      pendingMobileRef.current = null
      delete document.documentElement.dataset.wfRouteDirection
    },
    [],
  )

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
      const direction = getRouteDirection(
        routeIdentity(current),
        pathname,
      )

      event.preventDefault()

      if (reducedMotion) {
        commitRoute(to)
        finishTransition()
        return
      }

      if (!isMobileViewport()) {
        setDesktopDirection(direction)
      } else {
        setRouteDirection(direction)
      }

      setTransitionPhase('pulling')

      pullCurrentScreenToTop()
        .then(() => {
          if (phaseRef.current !== 'pulling') return

          if (isMobileViewport()) {
            beginMobileCurtain(to)
          } else {
            swapDesktopScreens(to)
          }
        })
        .catch(() => {
          commitRoute(to)
          finishTransition()
        })
    }

    document.addEventListener('click', onDocumentClick, true)

    return () => {
      document.removeEventListener('click', onDocumentClick, true)
    }
  }, [navigate, reducedMotion])

  return {
    routeKey,
    routeIndex,
    routeDirection,
    phase,
    routeEnter,
    reducedMotion,
    onMobileCurtainTransitionEnd,
  }
}
