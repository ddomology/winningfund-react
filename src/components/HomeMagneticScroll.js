import { useEffect } from 'react'

const HOME_SECTION_IDS = Object.freeze([
  'home-hero',
  'short-introduction',
  'program-overview',
  'mission',
  'contents-18-2',
])

const FINE_POINTER_QUERY =
  '(hover: hover) and (pointer: fine)'

const REDUCED_MOTION_QUERY =
  '(prefers-reduced-motion: reduce)'

const WHEEL_THRESHOLD = 28
const WHEEL_RESET_MS = 130
const POST_SNAP_LOCK_MS = 70

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

function getSectionTop(section, headerHeight) {
  return Math.max(
    0,
    section.getBoundingClientRect().top
      + window.scrollY
      - headerHeight,
  )
}

export default function HomeMagneticScroll() {
  useEffect(() => {
    const pointerMedia =
      window.matchMedia(FINE_POINTER_QUERY)

    const reducedMotionMedia =
      window.matchMedia(REDUCED_MOTION_QUERY)

    const sections = HOME_SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (sections.length !== HOME_SECTION_IDS.length) {
      return undefined
    }

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

    function findCurrentIndex(headerHeight) {
      const viewportTop =
        window.scrollY
        + headerHeight
        + 2

      let index = 0

      for (
        let candidate = 0;
        candidate < sections.length;
        candidate += 1
      ) {
        const sectionTop =
          sections[candidate].getBoundingClientRect().top
          + window.scrollY

        if (sectionTop <= viewportTop) {
          index = candidate
        }
      }

      return index
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
        440 + Math.abs(distance) * 0.12,
        470,
        650,
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

    function resolveSnapTarget(direction) {
      const headerHeight = getHeaderHeight()
      const viewportHeight =
        Math.max(
          1,
          window.innerHeight - headerHeight,
        )

      const currentIndex =
        findCurrentIndex(headerHeight)

      const currentSection =
        sections[currentIndex]

      const currentTop =
        getSectionTop(
          currentSection,
          headerHeight,
        )

      const distanceFromTop =
        window.scrollY - currentTop

      const sectionHeight =
        currentSection.offsetHeight

      const sectionBottom =
        currentSection.getBoundingClientRect().top
        + window.scrollY
        + sectionHeight

      const viewportBottom =
        window.scrollY
        + window.innerHeight

      const topMagnetZone =
        Math.max(
          72,
          viewportHeight * 0.14,
        )

      const bottomMagnetZone =
        Math.max(
          92,
          viewportHeight * 0.18,
        )

      const sectionFitsViewport =
        sectionHeight
        <= viewportHeight * 1.12

      if (direction > 0) {
        if (currentIndex >= sections.length - 1) {
          return null
        }

        if (currentIndex === 0) {
          return getSectionTop(
            sections[1],
            headerHeight,
          )
        }

        if (
          sectionFitsViewport
          && distanceFromTop <= topMagnetZone
        ) {
          return getSectionTop(
            sections[currentIndex + 1],
            headerHeight,
          )
        }

        const remainingToBottom =
          sectionBottom - viewportBottom

        if (remainingToBottom <= bottomMagnetZone) {
          return getSectionTop(
            sections[currentIndex + 1],
            headerHeight,
          )
        }

        return null
      }

      if (currentIndex <= 0) {
        return null
      }

      if (distanceFromTop <= topMagnetZone) {
        return getSectionTop(
          sections[currentIndex - 1],
          headerHeight,
        )
      }

      return null
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

      wheelResetTimer =
        window.setTimeout(
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

      const targetTop =
        resolveSnapTarget(direction)

      if (targetTop === null) {
        return
      }

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
      {
        passive: false,
      },
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

      window.removeEventListener(
        'wheel',
        onWheel,
      )

      window.removeEventListener(
        'keydown',
        onKeyDown,
      )

      pointerMedia.removeEventListener(
        'change',
        onPointerModeChange,
      )
    }
  }, [])

  return null
}
