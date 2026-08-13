import {
  createElement,
  useEffect,
  useState,
} from 'react'

const HOME_SECTIONS = Object.freeze([
  Object.freeze({ id: 'home-hero', number: '01', label: '홈' }),
  Object.freeze({ id: 'short-introduction', number: '02', label: '소개' }),
  Object.freeze({ id: 'program-overview', number: '03', label: '주요 활동' }),
  Object.freeze({ id: 'mission', number: '04', label: '방향' }),
  Object.freeze({ id: 'contents-18-2', number: '05', label: '18-2 활동' }),
])

const VERTICAL_VIEWBOX = Object.freeze({
  width: 40,
  height: 380,
})

const HORIZONTAL_VIEWBOX = Object.freeze({
  width: 240,
  height: 32,
})

const VERTICAL_NODE_CENTERS = Object.freeze([
  Object.freeze({ x: 20, y: 38 }),
  Object.freeze({ x: 20, y: 114 }),
  Object.freeze({ x: 20, y: 190 }),
  Object.freeze({ x: 20, y: 266 }),
  Object.freeze({ x: 20, y: 342 }),
])

const HORIZONTAL_NODE_CENTERS = Object.freeze([
  Object.freeze({ x: 24, y: 16 }),
  Object.freeze({ x: 72, y: 16 }),
  Object.freeze({ x: 120, y: 16 }),
  Object.freeze({ x: 168, y: 16 }),
  Object.freeze({ x: 216, y: 16 }),
])

/*
 * One visual track.
 *
 * The straight segments stop exactly at the circle stroke geometry.
 * The circle outlines are therefore part of the track itself rather
 * than decorative nodes sitting on top of a separate line.
 */
const VERTICAL_TRACK_PATH = [
  'M20 10V31',
  'M20 45V107',
  'M20 121V183',
  'M20 197V259',
  'M20 273V335',
  'M20 349V370',

  'M20 31a7 7 0 1 1 0 14a7 7 0 1 1 0-14',
  'M20 107a7 7 0 1 1 0 14a7 7 0 1 1 0-14',
  'M20 183a7 7 0 1 1 0 14a7 7 0 1 1 0-14',
  'M20 259a7 7 0 1 1 0 14a7 7 0 1 1 0-14',
  'M20 335a7 7 0 1 1 0 14a7 7 0 1 1 0-14',
].join(' ')

const HORIZONTAL_TRACK_PATH = [
  'M4 16H17.5',
  'M30.5 16H65.5',
  'M78.5 16H113.5',
  'M126.5 16H161.5',
  'M174.5 16H209.5',
  'M222.5 16H236',

  'M17.5 16a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0',
  'M65.5 16a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0',
  'M113.5 16a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0',
  'M161.5 16a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0',
  'M209.5 16a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0',
].join(' ')

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function RailVector({
  orientation,
  progress,
  activeIndex,
}) {
  const vertical = orientation === 'vertical'

  const viewBox = vertical
    ? VERTICAL_VIEWBOX
    : HORIZONTAL_VIEWBOX

  const centers = vertical
    ? VERTICAL_NODE_CENTERS
    : HORIZONTAL_NODE_CENTERS

  const pathData = vertical
    ? VERTICAL_TRACK_PATH
    : HORIZONTAL_TRACK_PATH

  const clipId = vertical
    ? 'wf-home-rail-paint-clip-vertical'
    : 'wf-home-rail-paint-clip-horizontal'

  const gradientId = vertical
    ? 'wf-home-rail-paint-gradient-vertical'
    : 'wf-home-rail-paint-gradient-horizontal'

  const activeCenter =
    centers[
      clamp(
        activeIndex,
        0,
        centers.length - 1,
      )
    ]

  const paintRect = vertical
    ? {
        x: 0,
        y: 0,
        width: viewBox.width,
        height: viewBox.height * progress,
      }
    : {
        x: 0,
        y: 0,
        width: viewBox.width * progress,
        height: viewBox.height,
      }

  return createElement(
    'svg',
    {
      className:
        `wf-home-rail__svg wf-home-rail__svg--${orientation}`,
      viewBox:
        `0 0 ${viewBox.width} ${viewBox.height}`,
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
      focusable: 'false',
    },

    createElement(
      'defs',
      null,

      createElement(
        'linearGradient',
        vertical
          ? {
              id: gradientId,
              x1: '0%',
              y1: '0%',
              x2: '0%',
              y2: '100%',
            }
          : {
              id: gradientId,
              x1: '0%',
              y1: '0%',
              x2: '100%',
              y2: '0%',
            },

        createElement('stop', {
          offset: '0%',
          stopColor: '#9fe5fd',
        }),

        createElement('stop', {
          offset: '52%',
          stopColor: '#168cf4',
        }),

        createElement('stop', {
          offset: '100%',
          stopColor: '#193fd7',
        }),
      ),

      createElement(
        'clipPath',
        {
          id: clipId,
          clipPathUnits: 'userSpaceOnUse',
        },

        createElement('rect', paintRect),
      ),
    ),

    createElement('path', {
      className: 'wf-home-rail__svg-base',
      d: pathData,
      pathLength: 100,
    }),

    createElement('path', {
      className: 'wf-home-rail__svg-paint',
      d: pathData,
      pathLength: 100,
      stroke: `url(#${gradientId})`,
      clipPath: `url(#${clipId})`,
    }),

    createElement('circle', {
      className: 'wf-home-rail__svg-active-dot',
      cx: activeCenter.x,
      cy: activeCenter.y,
      r: vertical ? 2.25 : 2,
    }),
  )
}

export default function HomeSectionRail() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = HOME_SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter(Boolean)

    if (sections.length !== HOME_SECTIONS.length) return undefined

    let frameId = 0

    function update() {
      frameId = 0

      const marker = window.scrollY + window.innerHeight * 0.34
      let nextActiveIndex = 0

      for (let index = 0; index < sections.length; index += 1) {
        if (sections[index].offsetTop <= marker) {
          nextActiveIndex = index
        }
      }

      setActiveIndex(nextActiveIndex)

      const first = sections[0]
      const last = sections[sections.length - 1]
      const start = first.offsetTop
      const end = Math.max(
        start + 1,
        last.offsetTop + last.offsetHeight - window.innerHeight,
      )

      setProgress(
        clamp((window.scrollY - start) / (end - start), 0, 1),
      )
    }

    function scheduleUpdate() {
      if (frameId) return
      frameId = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return createElement(
    'nav',
    {
      className: 'wf-home-rail',
      'aria-label': '홈 섹션',
      style: {
        '--wf-home-rail-progress': String(progress),
      },
    },

    createElement(RailVector, {
      orientation: 'vertical',
      progress,
      activeIndex,
    }),

    createElement(RailVector, {
      orientation: 'horizontal',
      progress,
      activeIndex,
    }),

    createElement(
      'ol',
      { className: 'wf-home-rail__list' },

      ...HOME_SECTIONS.map((section, index) => {
        const state =
          index === activeIndex
            ? 'current'
            : index < activeIndex
              ? 'visited'
              : 'upcoming'

        return createElement(
          'li',
          {
            key: section.id,
            className: 'wf-home-rail__item',
          },

          createElement(
            'a',
            {
              className: 'wf-home-rail__link',
              href: `#${section.id}`,
              'data-state': state,
              'aria-current':
                state === 'current' ? 'location' : undefined,
              'aria-label': `${section.number} ${section.label}`,
            },

            createElement(
              'span',
              { className: 'wf-home-rail__number' },
              section.number,
            ),

            createElement(
              'span',
              { className: 'wf-home-rail__label' },
              section.label,
            ),

            createElement('span', {
              className: 'wf-home-rail__tick',
              'aria-hidden': 'true',
            }),
          ),
        )
      }),
    ),
  )
}
