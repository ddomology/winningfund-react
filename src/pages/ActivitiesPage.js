import {
  createElement,
  useEffect,
  useState,
} from 'react'
import InternalSectionNav from '../components/InternalSectionNav.js'
import {
  selectActivitiesPageData,
  siteContentBundle,
} from '../content/index.js'

const activitiesData =
  selectActivitiesPageData(siteContentBundle)

function ActivitiesWave() {
  return createElement(
    'div',
    {
      className: 'wf-activities-wave',
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        viewBox: '0 0 1440 118',
        preserveAspectRatio: 'none',
        focusable: 'false',
      },
      createElement('path', {
        d: 'M0,70 C240,15 450,118 720,68 C990,18 1180,26 1440,76 L1440,118 L0,118 Z',
        fill: '#ffffff',
      }),
      createElement('path', {
        d: 'M0,88 C260,47 500,112 800,76 C1060,44 1220,44 1440,84 L1440,118 L0,118 Z',
        fill: 'rgba(255,255,255,0.64)',
      }),
    ),
  )
}

function ProgramHeading({ activity }) {
  return createElement(
    'header',
    {
      className: 'wf-activities-program__heading',
    },

    createElement(
      'div',
      {
        className: 'wf-activities-program__number',
      },
      `PROGRAM ${activity.programNumber}`,
    ),

    createElement(
      'h2',
      null,
      activity.pageTitle ?? activity.title,
    ),

    createElement(
      'p',
      null,
      activity.pageSummary ?? activity.homeSummary,
    ),
  )
}

function SectorProgram({ activity }) {
  return createElement(
    'ol',
    {
      className: 'wf-activities-detail-grid',
    },
    ...(activity.pageDetails ?? []).map(
      (detail, index) =>
        createElement(
          'li',
          {
            key: detail.id,
          },
          createElement(
            'span',
            {
              className:
                'wf-activities-detail-grid__index',
              'aria-hidden': 'true',
            },
            String(index + 1).padStart(2, '0'),
          ),
          createElement(
            'h3',
            null,
            detail.title,
          ),
          createElement(
            'p',
            null,
            detail.description,
          ),
        ),
    ),
  )
}

function ClassesProgram({ activity }) {
  return createElement(
    'div',
    {
      className: 'wf-activities-class-grid',
    },
    ...(activity.tracks ?? []).map((track) =>
      createElement(
        'section',
        {
          key: track.id,
          className: 'wf-activities-class',
        },
        createElement(
          'span',
          {
            className:
              'wf-activities-class__english',
          },
          track.englishLabel,
        ),
        createElement(
          'h3',
          null,
          track.label,
        ),
        createElement(
          'ol',
          null,
          ...track.curriculum.map((item) =>
            createElement(
              'li',
              {
                key: item,
              },
              item,
            ),
          ),
        ),
      ),
    ),
  )
}

function MockProgram({ activity }) {
  const fm = activity.fmTeam

  return createElement(
    'div',
    {
      className: 'wf-activities-investment',
    },

    createElement(
      'div',
      {
        className:
          'wf-activities-investment__mock-grid',
      },
      ...(activity.mockGroups ?? []).map((group) =>
        createElement(
          'section',
          {
            key: group.id,
            className:
              'wf-activities-investment__mock',
          },
          createElement(
            'span',
            {
              className:
                'wf-activities-investment__capital',
            },
            group.capital,
          ),
          createElement(
            'h3',
            null,
            group.label,
          ),
          createElement(
            'ul',
            null,
            ...group.points.map((point) =>
              createElement(
                'li',
                {
                  key: point,
                },
                point,
              ),
            ),
          ),
        ),
      ),
    ),

    fm
      ? createElement(
          'section',
          {
            className: 'wf-activities-fm',
          },

          createElement(
            'div',
            {
              className: 'wf-activities-fm__lead',
            },
            createElement(
              'span',
              null,
              'FUND MANAGEMENT',
            ),
            createElement(
              'h3',
              null,
              fm.label,
            ),
            createElement(
              'strong',
              null,
              fm.participation,
            ),
            createElement(
              'p',
              null,
              fm.aum,
            ),
          ),

          createElement(
            'div',
            {
              className:
                'wf-activities-fm__approaches',
            },
            ...fm.approaches.map((approach) =>
              createElement(
                'div',
                {
                  key: approach.label,
                },
                createElement(
                  'strong',
                  null,
                  approach.label,
                ),
                createElement(
                  'p',
                  null,
                  approach.description,
                ),
              ),
            ),
          ),

          createElement(
            'div',
            {
              className:
                'wf-activities-fm__operations',
            },
            ...fm.operations.map((operation) =>
              createElement(
                'div',
                {
                  key: operation.title,
                },
                createElement(
                  'strong',
                  null,
                  operation.title,
                ),
                createElement(
                  'p',
                  null,
                  operation.description,
                ),
              ),
            ),
          ),
        )
      : null,
  )
}

function ReportsProgram({ activity }) {
  return createElement(
    'div',
    {
      className: 'wf-activities-reports',
    },

    createElement(
      'section',
      {
        className: 'wf-activities-reports__team',
      },
      createElement(
        'span',
        null,
        'TEAM REPORT',
      ),
      createElement(
        'h3',
        null,
        activity.teamReport?.label,
      ),
      createElement(
        'ul',
        null,
        ...(activity.teamReport?.points ?? []).map(
          (point) =>
            createElement(
              'li',
              {
                key: point,
              },
              point,
            ),
        ),
      ),
    ),

    createElement(
      'div',
      {
        className:
          'wf-activities-reports__personal',
      },
      createElement(
        'div',
        {
          className:
            'wf-activities-reports__personal-head',
        },
        createElement(
          'span',
          null,
          'PERSONAL REPORT',
        ),
        createElement(
          'strong',
          null,
          '개인리포트',
        ),
      ),
      ...(activity.personalReports ?? []).map(
        (report, index) =>
          createElement(
            'section',
            {
              key: report.id,
              className:
                'wf-activities-reports__personal-item',
            },
            createElement(
              'span',
              {
                'aria-hidden': 'true',
              },
              String(index + 1).padStart(2, '0'),
            ),
            createElement(
              'h3',
              null,
              report.label,
            ),
            createElement(
              'p',
              null,
              report.description,
            ),
          ),
      ),
    ),
  )
}

function ProgramBody({ activity }) {
  switch (activity.activityId) {
    case 'sector-followup':
      return createElement(SectorProgram, {
        activity,
      })

    case 'classes':
      return createElement(ClassesProgram, {
        activity,
      })

    case 'mock-investment-fm':
      return createElement(MockProgram, {
        activity,
      })

    case 'reports':
      return createElement(ReportsProgram, {
        activity,
      })

    default:
      return null
  }
}

function ProgramSection({ activity }) {
  return createElement(
    'section',
    {
      id: activity.activityId,
      className:
        `wf-activities-program wf-activities-program--${activity.programNumber}`,
      'data-activities-section': activity.activityId,
      'aria-labelledby':
        `wf-activities-${activity.activityId}-title`,
    },

    createElement(
      'div',
      {
        className: 'wf-activities-section__inner',
      },

      createElement(
        'div',
        {
          id: `wf-activities-${activity.activityId}-title`,
        },
        createElement(ProgramHeading, {
          activity,
        }),
      ),

      createElement(ProgramBody, {
        activity,
      }),
    ),
  )
}

function OtherAcademic({ items }) {
  return createElement(
    'section',
    {
      id: 'other-academic',
      className:
        'wf-activities-chapter wf-activities-chapter--academic',
      'data-activities-section':
        'other-academic',
      'aria-labelledby':
        'wf-activities-other-academic-title',
    },

    createElement(
      'div',
      {
        className: 'wf-activities-section__inner',
      },

      createElement(
        'header',
        {
          className:
            'wf-activities-chapter__heading',
        },
        createElement(
          'span',
          null,
          '05 / MORE ACADEMIC',
        ),
        createElement(
          'h2',
          {
            id:
              'wf-activities-other-academic-title',
          },
          '그 외 학술활동',
        ),
      ),

      createElement(
        'div',
        {
          className:
            'wf-activities-academic-list',
        },
        ...items.map((item, index) =>
          createElement(
            'article',
            {
              key: item.id,
            },
            createElement(
              'span',
              {
                'aria-hidden': 'true',
              },
              String(index + 1).padStart(2, '0'),
            ),
            createElement(
              'h3',
              null,
              item.title,
            ),
            createElement(
              'p',
              null,
              item.description,
            ),
          ),
        ),
      ),
    ),
  )
}

function SmallGroups({
  clubs,
  title,
  introduction,
}) {
  return createElement(
    'section',
    {
      id: 'small-groups',
      className:
        'wf-activities-chapter wf-activities-chapter--clubs',
      'data-activities-section':
        'small-groups',
      'aria-labelledby':
        'wf-activities-clubs-title',
    },

    createElement(
      'div',
      {
        className: 'wf-activities-section__inner',
      },

      createElement(
        'header',
        {
          className:
            'wf-activities-clubs__heading',
        },
        createElement(
          'div',
          null,
          createElement(
            'span',
            null,
            '06 / SMALL GROUPS',
          ),
          createElement(
            'h2',
            {
              id: 'wf-activities-clubs-title',
            },
            title,
          ),
        ),
        createElement(
          'p',
          null,
          introduction,
        ),
      ),

      createElement(
        'div',
        {
          className: 'wf-activities-clubs__grid',
        },
        ...clubs.map((club, index) =>
          createElement(
            'article',
            {
              key: club.clubId,
              className: 'wf-activities-club',
            },
            createElement(
              'span',
              {
                className:
                  'wf-activities-club__number',
                'aria-hidden': 'true',
              },
              String(index + 1).padStart(2, '0'),
            ),
            createElement(
              'span',
              {
                className:
                  'wf-activities-club__category',
              },
              club.categoryLabel,
            ),
            createElement(
              'h3',
              null,
              club.officialName,
            ),
            createElement(
              'p',
              null,
              club.description,
            ),
          ),
        ),
      ),
    ),
  )
}

export default function ActivitiesPage() {
  const {
    activitiesPage,
    activitySections,
    otherAcademicActivities,
    clubs,
  } = activitiesData

  const programs = [...activitySections].sort(
    (a, b) => a.order - b.order,
  )

  const navItems = [
    ...programs.map((activity) => ({
      id: activity.activityId,
      label: activity.programNumber,
    })),
    {
      id: 'other-academic',
      label: '학술활동',
    },
    {
      id: 'small-groups',
      label: '소모임',
    },
  ]

  const [activeSectionId, setActiveSectionId] =
    useState(programs[0]?.activityId)

  useEffect(() => {
    const elements = [
      ...document.querySelectorAll(
        '[data-activities-section]',
      ),
    ]

    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio,
          )

        if (visible[0]?.target?.id) {
          setActiveSectionId(
            visible[0].target.id,
          )
        }
      },
      {
        rootMargin: '-24% 0px -58% 0px',
        threshold: [
          0,
          0.1,
          0.25,
          0.5,
        ],
      },
    )

    elements.forEach((element) =>
      observer.observe(element),
    )

    return () => observer.disconnect()
  }, [])

  return createElement(
    'main',
    {
      className: 'wf-activities',
    },

    createElement(
      'section',
      {
        className: 'wf-activities-hero',
        'aria-labelledby':
          'wf-activities-title',
      },

      createElement(
        'div',
        {
          className:
            'wf-activities-hero__inner',
        },

        createElement(
          'p',
          {
            className:
              'wf-activities-hero__eyebrow',
          },
          'WINNINGFUND',
        ),

        createElement(
          'h1',
          {
            id: 'wf-activities-title',
            className:
              'wf-activities-hero__title',
          },
          'ACTIVITIES',
        ),

        createElement(
          'p',
          {
            className:
              'wf-activities-hero__copy',
          },
          activitiesPage?.heroSummary,
        ),
      ),

      createElement(ActivitiesWave),
    ),

    createElement(
      'section',
      {
        className:
          'wf-activities-intro',
      },

      createElement(
        'div',
        {
          className:
            'wf-activities-section__inner',
        },

        createElement(
          'div',
          {
            className:
              'wf-activities-intro__index',
          },
          'ACTIVITY SYSTEM',
        ),

        createElement(
          'h2',
          null,
          activitiesPage?.introHeadline,
        ),

        createElement(
          'div',
          {
            className:
              'wf-activities-intro__copy',
          },
          ...(activitiesPage?.introParagraphs ??
            []).map((paragraph) =>
            createElement(
              'p',
              {
                key: paragraph,
              },
              paragraph,
            ),
          ),
        ),
      ),
    ),

    createElement(
      'div',
      {
        className:
          'wf-activities-internal-nav',
      },
      createElement(InternalSectionNav, {
        items: navItems,
        activeSectionId,
        ariaLabel: '활동 페이지 목차',
      }),
    ),

    ...programs.map((activity) =>
      createElement(ProgramSection, {
        key: activity.activityId,
        activity,
      }),
    ),

    createElement(OtherAcademic, {
      items: otherAcademicActivities,
    }),

    createElement(SmallGroups, {
      clubs,
      title:
        activitiesPage?.clubsTitle ??
        '소모임',
      introduction:
        activitiesPage?.clubsIntroduction,
    }),
  )
}
