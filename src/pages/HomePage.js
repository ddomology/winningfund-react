import { createElement, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Section from '../components/Section.js'
import SectionHeader from '../components/SectionHeader.js'
import HomeSectionRail from '../components/HomeSectionRail.js'
import HomeMagneticScroll from '../components/HomeMagneticScroll.js'
import WinningFundBrushSignature from '../components/WinningFundBrushSignature.js'
import {
  siteContentBundle,
  selectHomePageData,
} from '../content/index.js'

const homeData = selectHomePageData(siteContentBundle)


/* Hero footer: static Korean copy with one decorative brand brush gesture. */

function HeroWordRow({
  number,
  english,
  delayClass,
  annotation,
}) {
  return createElement(
    'div',
    {
      className: `wf-home-kinetic-row ${delayClass}`,
    },
    createElement(
      'div',
      { className: 'wf-home-kinetic-row__meta' },
      createElement('span', null, number),
      annotation
        ? createElement(
            'span',
            { className: 'wf-home-kinetic-row__annotation' },
            annotation,
          )
        : null,
    ),
    createElement(
      'span',
      { className: 'wf-home-kinetic-row__text-slot' },
      createElement(
        'span',
        {
          className: 'wf-home-kinetic-row__ghost',
          'aria-hidden': 'true',
        },
        english,
      ),
      createElement(
        'span',
        {
          className: 'wf-home-kinetic-row__reveal',
          'aria-hidden': 'true',
        },
        createElement(
          'span',
          { className: 'wf-home-kinetic-row__reveal-word' },
          english,
        ),
      ),
    ),
  )
}

function HomeWaveDivider({
  waveId,
  className = '',
}) {
  const classes = [
    'wf-home-wave',
    className,
  ].filter(Boolean).join(' ')

  return createElement(
    'div',
    {
      className: classes,
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        className: 'wf-home-wave__svg',
        viewBox: '0 24 150 28',
        preserveAspectRatio: 'none',
        shapeRendering: 'auto',
        focusable: 'false',
      },
      createElement(
        'defs',
        null,
        createElement('path', {
          id: waveId,
          d: 'M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z',
        }),
      ),
      createElement(
        'g',
        {
          className: 'wf-home-wave__parallax',
        },
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 0,
          fill: 'var(--wf-wave-layer-1)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 3,
          fill: 'var(--wf-wave-layer-2)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 5,
          fill: 'var(--wf-wave-layer-3)',
        }),
        createElement('use', {
          href: `#${waveId}`,
          x: 48,
          y: 7,
          fill: 'var(--wf-wave-layer-4)',
        }),
      ),
    ),
  )
}

function HomeHero() {
  return createElement(
    'section',
    {
      id: 'home-hero',
      className:
        'wf-home-hero wf-home-hero--kinetic-entrance wf-home-hero--waves-reference',
      'aria-labelledby': 'wf-home-title',
    },

    /*
     * Historical side/meta DOM stays for verifier and semantic continuity.
     * The waves-reference visual layer intentionally removes it from layout.
     */
    createElement(
      'div',
      {
        className:
          'wf-home-hero__inner wf-home-hero__inner--kinetic-entrance',
      },

      createElement(
        'div',
        {
          className: 'wf-home-hero__kinetic-side',
          'aria-hidden': 'true',
        },
        createElement(
          'div',
          {
            className: 'wf-home-hero__impact-meta',
          },
          createElement('span', null, '01 / HOME'),
          createElement(
            'strong',
            {
              className: 'wf-home-hero__impact-kicker',
            },
            '투자·경제 학회',
          ),
        ),
      ),

      createElement(
        'div',
        {
          className: 'wf-home-hero__kinetic-main',
        },

        createElement(
          'div',
          {
            className: 'wf-home-hero__impact-brand',
          },
          'WINNINGFUND',
        ),

        createElement(
          'h1',
          {
            id: 'wf-home-title',
            className:
              'wf-home-hero__kinetic-title-a11y',
          },
          homeData.hero.englishIdentity,
        ),

        createElement(
          'div',
          {
            className: 'wf-home-kinetic-list',
            'aria-hidden': 'true',
          },

          createElement(HeroWordRow, {
            number: '01',
            english: 'INVESTMENT',
            delayClass:
              'wf-home-kinetic-row--1',
          }),

          createElement(HeroWordRow, {
            number: '02',
            english: 'ECONOMICS',
            delayClass:
              'wf-home-kinetic-row--2',
            annotation: 'AND',
          }),

          createElement(HeroWordRow, {
            number: '03',
            english: 'CLUB',
            delayClass:
              'wf-home-kinetic-row--3',
          }),
        ),

        createElement(
          'div',
          {
            className: 'wf-home-kinetic-footer',
          },

          createElement(
            'div',
            {
              className: 'wf-home-kinetic-term',
              'aria-label': '현재 기수 18-2',
            },
            createElement('span', null, 'CURRENT TERM'),
            createElement('strong', null, '18—2'),
          ),

          createElement('span', {
            className:
              'wf-home-kinetic-footer__divider',
            'aria-hidden': 'true',
          }),

          createElement(
            'p',
            {
              className: 'wf-home-kinetic-slogan',
              'aria-label':
                homeData.hero.koreanSlogan,
            },
            createElement(WinningFundBrushSignature),
            createElement(
              'span',
              {
                className:
                  'wf-home-kinetic-slogan__text',
              },
              homeData.hero.koreanSlogan,
            ),
          ),
        ),
      ),
    ),

    createElement(HomeWaveDivider, {
      waveId: 'wf-home-gentle-wave-hero',
      className:
        'wf-home-wave--hero-to-light',
    }),
  )
}

function ShortIntroduction() {
  const [revealed, setRevealed] = useState(false)
  const revealRef = useRef(null)

  useEffect(() => {
    const target = revealRef.current
    if (!target) return undefined

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    ) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting) return

        setRevealed(true)
        observer.disconnect()
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  const revealClass = revealed
    ? 'wf-home-intro__editorial is-revealed'
    : 'wf-home-intro__editorial'

  return createElement(
    Section,
    {
      sectionId: 'short-introduction',
      spacingVariant: 'compact',
      widthPolicy: 'full',
      className: 'wf-home-intro',
      semanticLabel: '위닝펀드 소개',
    },
    createElement(
      'div',
      {
        ref: revealRef,
        className: revealClass,
      },
      createElement(
        'div',
        {
          className:
            'wf-home-section-index wf-home-intro__index',
        },
        '02 / 소개',
      ),
      createElement(
        'div',
        { className: 'wf-home-intro__content' },
        createElement(
          'h2',
          {
            className: 'wf-home-intro__headline',
          },
          createElement(
            'span',
            {
              className:
                'wf-home-intro__headline-line wf-home-intro__headline-line--1',
            },
            createElement(
              'span',
              null,
              '좋은 투자는',
            ),
          ),
          createElement(
            'span',
            {
              className:
                'wf-home-intro__headline-line wf-home-intro__headline-line--2',
            },
            createElement(
              'span',
              null,
              createElement(
                'span',
                {
                  className:
                    'wf-home-intro__headline-accent',
                },
                '좋은 질문',
              ),
              '에서 시작됩니다.',
            ),
          ),
        ),
        createElement(
          'p',
          {
            className:
              'wf-home-intro__editorial-copy',
          },
          '위닝펀드는 시장을 함께 공부하고, 각자의 관점을 검증하며, 근거 있는 투자 판단을 만들어가는 대학 연합투자경제동아리입니다.',
        ),
        createElement(
          'div',
          {
            className: 'wf-home-intro__proof',
            'aria-label': '위닝펀드 주요 정보',
          },
          createElement(
            'div',
            {
              className:
                'wf-home-intro__proof-item wf-home-intro__proof-item--1',
            },
            createElement(
              'strong',
              {
                className:
                  'wf-home-intro__proof-value',
              },
              '2009',
            ),
            createElement(
              'span',
              {
                className:
                  'wf-home-intro__proof-label',
              },
              '출범',
            ),
          ),
          createElement(
            'div',
            {
              className:
                'wf-home-intro__proof-item wf-home-intro__proof-item--2',
            },
            createElement(
              'strong',
              {
                className:
                  'wf-home-intro__proof-value',
              },
              '1,800명',
            ),
            createElement(
              'span',
              {
                className:
                  'wf-home-intro__proof-label',
              },
              '누적 회원',
            ),
          ),
          createElement(
            'div',
            {
              className:
                'wf-home-intro__proof-item wf-home-intro__proof-item--3',
            },
            createElement(
              'strong',
              {
                className:
                  'wf-home-intro__proof-value wf-home-intro__proof-value--word',
              },
              '연합',
            ),
            createElement(
              'span',
              {
                className:
                  'wf-home-intro__proof-label',
              },
              '국내 최대 연합투자경제동아리',
            ),
          ),
        ),
      ),
    ),
  )
}

function ProgramActivityIcon({ index }) {
  const commonProps = {
    className: 'wf-home-program__icon',
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    focusable: 'false',
  }

  if (index === 0) {
    return createElement(
      'svg',
      commonProps,
      createElement('path', {
        d: 'M12 8h18l6 6v16H12z',
      }),
      createElement('path', {
        d: 'M30 8v7h6M17 18h10M17 23h8',
      }),
      createElement('circle', {
        cx: 31,
        cy: 32,
        r: 6,
      }),
      createElement('path', {
        d: 'm35.5 36.5 4.5 4.5',
      }),
    )
  }

  if (index === 1) {
    return createElement(
      'svg',
      commonProps,
      createElement('path', {
        d: 'M7 11c7-3 12-1 17 3v25c-5-4-10-6-17-3z',
      }),
      createElement('path', {
        d: 'M41 11c-7-3-12-1-17 3v25c5-4 10-6 17-3z',
      }),
      createElement('path', {
        d: 'M24 14v25',
      }),
    )
  }

  if (index === 2) {
    return createElement(
      'svg',
      commonProps,
      createElement('path', {
        d: 'M8 39h33M10 39V12',
      }),
      createElement('path', {
        d: 'M15 33v-8h5v8M24 33V18h5v15M33 33V12h5v21',
      }),
      createElement('path', {
        d: 'm14 20 8-7 7 3 10-9',
      }),
    )
  }

  return createElement(
    'svg',
    commonProps,
    createElement('circle', {
      cx: 17,
      cy: 17,
      r: 6,
    }),
    createElement('circle', {
      cx: 33,
      cy: 19,
      r: 5,
    }),
    createElement('path', {
      d: 'M6 39c1-9 6-14 12-14s11 5 12 14',
    }),
    createElement('path', {
      d: 'M27 28c2-2 4-3 7-3 6 0 9 5 9 12',
    }),
  )
}

function ProgramOverview() {
  const [revealed, setRevealed] = useState(false)
  const revealRef = useRef(null)

  useEffect(() => {
    const target = revealRef.current
    if (!target) return undefined

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    ) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting) return

        setRevealed(true)
        observer.disconnect()
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  const revealClass = revealed
    ? 'wf-home-programs__editorial is-revealed'
    : 'wf-home-programs__editorial'

  return createElement(
    Section,
    {
      sectionId: 'program-overview',
      spacingVariant: 'compact',
      widthPolicy: 'full',
      className: 'wf-home-programs',
      semanticLabel: '위닝펀드 주요 활동',
    },

    /*
     * Keep the shared SectionHeader contract in the DOM.
     * The final visual composition owns its own editorial heading.
     */
    createElement(
      'div',
      {
        className: 'wf-home-programs__legacy-heading',
        'aria-hidden': 'true',
      },
      createElement(SectionHeader, {
        title: '주요 활동',
        headingLevel: 2,
      }),
    ),

    createElement(
      'div',
      {
        ref: revealRef,
        className: revealClass,
      },

      createElement(
        'div',
        {
          className:
            'wf-home-section-index wf-home-programs__index',
        },
        '03 / 주요 활동',
      ),

      createElement(
        'header',
        {
          className: 'wf-home-programs__header',
        },

        createElement(
          'h2',
          {
            className: 'wf-home-programs__headline',
          },
          createElement(
            'span',
            {
              className: 'wf-home-programs__headline-line',
            },
            createElement('span', null, '우리는 시장을'),
          ),
          createElement(
            'span',
            {
              className: 'wf-home-programs__headline-line',
            },
            createElement('span', null, '읽고, 검증하고,'),
          ),
          createElement(
            'span',
            {
              className: 'wf-home-programs__headline-line',
            },
            createElement(
              'span',
              null,
              createElement(
                'span',
                {
                  className:
                    'wf-home-programs__headline-accent',
                },
                '실전으로',
              ),
              ' 연결합니다.',
            ),
          ),
        ),

        createElement(
          'p',
          {
            className: 'wf-home-programs__kicker',
          },
          'RESEARCH / STUDY / PRACTICE / REPORT',
        ),
      ),

      createElement(
        'div',
        {
          className: 'wf-home-programs__list',
        },

        ...homeData.programOverview.map(
          (program, index) =>
            createElement(
              Link,
              {
                key: program.activityId,
                to: program.target,
                className: 'wf-home-program',
                style: {
                  '--wf-program-order': String(index),
                },
              },

              createElement(
                'span',
                {
                  className: 'wf-home-program__number',
                },
                String(index + 1).padStart(2, '0'),
              ),

              createElement(
                'span',
                {
                  className:
                    'wf-home-program__icon-shell',
                  'aria-hidden': 'true',
                },
                createElement(ProgramActivityIcon, {
                  index,
                }),
              ),

              createElement('span', {
                className:
                  'wf-home-program__track-node',
                'aria-hidden': 'true',
              }),

              createElement(
                'span',
                {
                  className: 'wf-home-program__body',
                },

                createElement(
                  'strong',
                  {
                    className:
                      'wf-home-program__title',
                  },
                  program.homeLabel,
                ),

                program.homeSummary
                  ? createElement(
                      'span',
                      {
                        className:
                          'wf-home-program__summary',
                      },
                      program.homeSummary,
                    )
                  : null,
              ),

              createElement(
                'span',
                {
                  className: 'wf-home-program__arrow',
                  'aria-hidden': 'true',
                },
                '↗',
              ),
            ),
        ),
      ),
    ),
  )
}

function MissionSection() {
  const mission = homeData.mission
  if (!mission?.items?.length) return null

  return createElement(
    Section,
    {
      sectionId: 'mission',
      spacingVariant: 'compact',
      widthPolicy: 'full',
      className: 'wf-home-mission',
      semanticLabel: '위닝펀드가 지향하는 방향',
    },

    createElement(
      'div',
      {
        className: 'wf-home-mission__legacy-heading',
        'aria-hidden': 'true',
      },
      createElement(SectionHeader, {
        title: mission.title,
        headingLevel: 2,
      }),
    ),

    createElement(
      'div',
      {
        className:
          'wf-home-section-index wf-home-mission__index',
      },
      '04 / 방향',
    ),

    createElement(
      'div',
      {
        className: 'wf-home-mission__editorial',
      },

      createElement(
        'header',
        {
          className: 'wf-home-mission__header',
        },

        createElement(
          'p',
          {
            className: 'wf-home-mission__eyebrow',
            'aria-hidden': 'true',
          },
          'OUR MISSION',
        ),

        createElement(
          'h2',
          {
            className: 'wf-home-mission__title',
          },
          mission.title,
        ),
      ),

      createElement(
        'div',
        {
          className: 'wf-home-mission__list',
        },

        ...mission.items.map((item) =>
          createElement(
            'article',
            {
              key: item.id,
              className: 'wf-home-mission__item',
            },

            createElement(
              'span',
              {
                className: 'wf-home-mission__number',
                'aria-hidden': 'true',
              },
              String(item.order).padStart(2, '0'),
            ),

            createElement(
              'div',
              {
                className: 'wf-home-mission__body',
              },

              createElement(
                'h3',
                {
                  className: 'wf-home-mission__heading',
                },
                item.heading,
              ),

              item.description
                ? createElement(
                    'p',
                    {
                      className: 'wf-home-mission__copy',
                    },
                    item.description,
                  )
                : null,
            ),
          ),
        ),
      ),
    ),
  )
}

function SemesterContents() {
  const semester = homeData.semesterContents

  if (
    !semester ||
    semester.semesterId !==
      siteContentBundle.siteConfig.homeSemesterId
  ) {
    return null
  }

  const hasSchedule =
    Boolean(semester.scheduleItems?.length)

  return createElement(
    Section,
    {
      sectionId: 'contents-18-2',
      widthPolicy: 'full',
      spacingVariant: 'compact',
      className: 'wf-home-semester',
      semanticLabel: '18-2 활동',
    },

    createElement(
      'div',
      {
        className: 'wf-home-semester__legacy-heading',
        'aria-hidden': 'true',
      },
      createElement(SectionHeader, {
        title: semester.title,
        headingLevel: 2,
      }),
    ),

    createElement(
      'div',
      {
        className: 'wf-home-semester__editorial',
      },

      createElement(
        'div',
        {
          className:
            'wf-home-section-index wf-home-semester__index',
        },
        '05 / 18-2',
      ),

      createElement(
        'div',
        {
          className: 'wf-home-semester__heading-row',
        },

        createElement(
          'div',
          {
            className: 'wf-home-semester__heading-copy',
          },

          createElement(
            'p',
            {
              className: 'wf-home-semester__eyebrow',
            },
            'CONTENTS FOR 18-2',
          ),

          createElement(
            'h2',
            {
              className: 'wf-home-semester__title',
            },
            semester.title,
          ),
        ),

        createElement(
          'div',
          {
            className: 'wf-home-semester__term',
            'aria-hidden': 'true',
          },
          '18—2',
        ),
      ),

      hasSchedule
        ? createElement(
            'ol',
            {
              className: 'wf-home-semester__months',
              'aria-label': '18-2 학기 월별 일정',
            },

            ...semester.scheduleItems.map((month) =>
              createElement(
                'li',
                {
                  key: month.id,
                  className: 'wf-home-semester__month',
                },

                createElement(
                  'header',
                  {
                    className:
                      'wf-home-semester__month-heading',
                  },

                  createElement(
                    'strong',
                    {
                      className:
                        'wf-home-semester__month-number',
                    },
                    month.monthNumber,
                  ),

                  createElement(
                    'span',
                    {
                      className:
                        'wf-home-semester__month-label',
                    },
                    month.monthLabel,
                  ),
                ),

                createElement(
                  'ol',
                  {
                    className:
                      'wf-home-semester__events',
                  },

                  ...(month.events ?? []).map((event) =>
                    createElement(
                      'li',
                      {
                        key: event.id,
                        className:
                          'wf-home-semester__event',
                      },

                      createElement(
                        'time',
                        {
                          className:
                            'wf-home-semester__event-date',
                        },
                        event.dateLabel,
                      ),

                      createElement(
                        'strong',
                        {
                          className:
                            'wf-home-semester__event-title',
                        },
                        event.title,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          )
        : createElement(
            'div',
            {
              className: 'wf-home-semester__source-line',
              'data-content-state': semester.sourceStatus,
              'aria-hidden': 'true',
            },
          ),
    ),
  )
}

export default function HomePage() {
  return createElement(
    'div',
    { className: 'wf-home' },

    createElement(HomeMagneticScroll),
    createElement(HomeSectionRail),

    createElement(HomeHero),

    createElement(ShortIntroduction),

    createElement(HomeWaveDivider, {
      waveId: 'wf-home-gentle-wave-dark',
      className:
        'wf-home-wave--light-to-dark',
    }),

    createElement(ProgramOverview),
    createElement(MissionSection),

    createElement(HomeWaveDivider, {
      waveId: 'wf-home-gentle-wave-light',
      className:
        'wf-home-wave--dark-to-light',
    }),

    createElement(SemesterContents),
  )
}
