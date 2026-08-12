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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
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
    createElement(
      'div',
      {
        className: 'wf-home-rail__track',
        'aria-hidden': 'true',
      },
      createElement('span', {
        className: 'wf-home-rail__progress',
      }),
    ),
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
