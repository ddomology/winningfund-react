import { useEffect } from 'react'

const FINE_POINTER_QUERY =
  '(pointer: fine) and (hover: hover)'

const REDUCED_MOTION_QUERY =
  '(prefers-reduced-motion: reduce)'

const WHEEL_THRESHOLD = 28
const WHEEL_RESET_MS = 130
const POST_SNAP_LOCK_MS = 80

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function easeOutQuint(progress) {
  return 1 - Math.pow(1 - progress, 5)
}

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"]',
    ),
  )
}

function getHeaderHeight() {
  const header = document.querySelector('.wf-header')

  return header
    ? Math.round(header.getBoundingClientRect().height)
    : 72
}

function getDocumentTop(element, headerHeight) {
  return Math.max(
    0,
    element.getBoundingClientRect().top
      + window.scrollY
      - headerHeight,
  )
}

export default function RouteHeroMagneticScroll({
  heroSelector,
  nextSelector,
}) {
  useEffect(() => {
    const hero = document.querySelector(heroSelector)
    const next = document.querySelector(nextSelector)

    if (!hero || !next) return undefined

    const pointerMedia =
      window.matchMedia(FINE_POINTER_QUERY)

    const reducedMotionMedia =
      window.matchMedia(REDUCED_MOTION_QUERY)

    let wheelAccumulator = 0
    let wheelResetTimer = 0
    let animationFrame = 0
    let locked = false

    function resetWheelAccumulator() {
      wheelAccumulator = 0

      if (wheelResetTimer) {
        window.clearTimeout(wheelResetTimer)
        wheelResetTimer = 0
      }
    }

    function stopAnimation() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
      }

      locked = false
    }

    function animateTo(targetTop) {
      stopAnimation()

      const startTop = window.scrollY
      const distance = targetTop - startTop

      if (Math.abs(distance) < 2) {
        window.scrollTo(0, targetTop)
        return
      }

      if (reducedMotionMedia.matches) {
        window.scrollTo(0, targetTop)
        return
      }

      const duration = clamp(
        470 + Math.abs(distance) * 0.11,
        500,
        660,
      )

      const startedAt = performance.now()
      locked = true

      function frame(now) {
        const elapsed = now - startedAt
        const progress = clamp(elapsed / duration, 0, 1)
        const eased = easeOutQuint(progress)

        window.scrollTo(
          0,
          startTop + distance * eased,
        )

        if (progress < 1) {
          animationFrame =
            window.requestAnimationFrame(frame)
          return
        }

        animationFrame = 0
        window.scrollTo(0, targetTop)

        window.setTimeout(() => {
          locked = false
        }, POST_SNAP_LOCK_MS)
      }

      animationFrame =
        window.requestAnimationFrame(frame)
    }

    function resolveTarget(direction) {
      const headerHeight = getHeaderHeight()
      const heroTop = getDocumentTop(hero, headerHeight)
      const nextTop = getDocumentTop(next, headerHeight)
      const scrollTop = window.scrollY
      const viewportHeight = Math.max(
        1,
        window.innerHeight - headerHeight,
      )

      if (direction > 0) {
        if (scrollTop >= nextTop - 2) {
          return null
        }

        const heroBottom =
          hero.getBoundingClientRect().top
          + window.scrollY
          + hero.offsetHeight

        const viewportBottom =
          window.scrollY + window.innerHeight

        const closeEnoughToHero =
          scrollTop <= heroTop + viewportHeight * 0.62
          || heroBottom - viewportBottom
            <= viewportHeight * 0.34

        return closeEnoughToHero
          ? nextTop
          : null
      }

      const returnMagnetZone = Math.max(
        120,
        viewportHeight * 0.17,
      )

      const justEnteredContent =
        scrollTop > heroTop + 2
        && scrollTop <= nextTop + returnMagnetZone

      return justEnteredContent
        ? heroTop
        : null
    }

    function onWheel(event) {
      if (!pointerMedia.matches) return
      if (event.ctrlKey || event.metaKey) return
      if (isEditableTarget(event.target)) return

      if (locked) {
        event.preventDefault()
        return
      }

      if (
        Math.abs(event.deltaX)
        > Math.abs(event.deltaY)
      ) {
        return
      }

      wheelAccumulator += event.deltaY

      if (wheelResetTimer) {
        window.clearTimeout(wheelResetTimer)
      }

      wheelResetTimer = window.setTimeout(
        resetWheelAccumulator,
        WHEEL_RESET_MS,
      )

      if (
        Math.abs(wheelAccumulator)
        < WHEEL_THRESHOLD
      ) {
        return
      }

      const direction =
        wheelAccumulator > 0 ? 1 : -1

      resetWheelAccumulator()

      const targetTop = resolveTarget(direction)

      if (targetTop === null) return

      event.preventDefault()
      animateTo(targetTop)
    }

    function onPointerModeChange(event) {
      if (!event.matches) {
        resetWheelAccumulator()
        stopAnimation()
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape' && locked) {
        stopAnimation()
      }
    }

    window.addEventListener(
      'wheel',
      onWheel,
      { passive: false },
    )

    window.addEventListener(
      'keydown',
      onKeyDown,
    )

    pointerMedia.addEventListener(
      'change',
      onPointerModeChange,
    )

    return () => {
      resetWheelAccumulator()
      stopAnimation()

      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      pointerMedia.removeEventListener(
        'change',
        onPointerModeChange,
      )
    }
  }, [heroSelector, nextSelector])

  return null
}
