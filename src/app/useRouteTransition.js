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

export default function useRouteTransition() {
  const location = useLocation()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle')
  const [routeEnter, setRouteEnter] = useState('run')
  const [reducedMotion, setReducedMotion] = useState(false)

  const phaseRef = useRef('idle')
  const scrollFrameRef = useRef(null)
  const transitionRef = useRef(null)

  const routeKey = `${location.pathname}${location.hash}`

  function setTransitionPhase(nextPhase) {
    phaseRef.current = nextPhase
    setPhase(nextPhase)
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

  function pullCurrentScreenToTop() {
    cancelScrollMotion()

    const startY = window.scrollY
    if (startY <= 1) return Promise.resolve()

    const mobile = window.matchMedia(MOBILE_QUERY).matches
    const duration = mobile ? 110 : 160
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
    transitionRef.current = null
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

  function swapScreens(to) {
    setTransitionPhase('swapping')

    if (typeof document.startViewTransition !== 'function') {
      commitRoute(to)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(finishTransition)
      })
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

  useEffect(
    () => () => {
      cancelScrollMotion()
      transitionRef.current = null
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

      event.preventDefault()

      if (reducedMotion) {
        commitRoute(to)
        finishTransition()
        return
      }

      setTransitionPhase('pulling')

      pullCurrentScreenToTop()
        .then(() => {
          if (phaseRef.current !== 'pulling') return
          swapScreens(to)
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
    phase,
    routeEnter,
    reducedMotion,
  }
}
