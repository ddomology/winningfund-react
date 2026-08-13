import { createElement } from 'react'
import {
  selectAboutPageData,
  siteContentBundle,
} from '../content/index.js'

const aboutData =
  selectAboutPageData(siteContentBundle)

function AboutWave() {
  return createElement(
    'div',
    {
      className: 'wf-about-wave',
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        viewBox: '0 0 1440 120',
        preserveAspectRatio: 'none',
        focusable: 'false',
      },
      createElement('path', {
        d: 'M0,74 C220,18 420,118 690,68 C920,26 1120,14 1440,72 L1440,120 L0,120 Z',
        fill: '#f7faff',
      }),
      createElement('path', {
        d: 'M0,90 C260,46 470,118 760,76 C1030,37 1210,42 1440,82 L1440,120 L0,120 Z',
        fill: 'rgba(247,250,255,0.62)',
      }),
    ),
  )
}

function SectionIntro({
  index,
  eyebrow,
  title,
  copy,
  id,
}) {
  return createElement(
    'header',
    {
      className: 'wf-about-section-head',
    },
    createElement(
      'div',
      {
        className: 'wf-about-section-head__meta',
      },
      createElement(
        'span',
        {
          className: 'wf-about-section-head__index',
          'aria-hidden': 'true',
        },
        index,
      ),
      createElement(
        'span',
        {
          className: 'wf-about-section-head__eyebrow',
        },
        eyebrow,
      ),
    ),
    createElement(
      'h2',
      {
        id,
        className: 'wf-about-section-head__title',
      },
      title,
    ),
    copy
      ? createElement(
          'p',
          {
            className: 'wf-about-section-head__copy',
          },
          copy,
        )
      : null,
  )
}

function OrganizationChart({ record }) {
  const nodes = [...(record?.nodes ?? [])].sort(
    (a, b) => a.order - b.order,
  )

  const leaders = nodes.filter(
    (node) => node.tier === 'LEADERSHIP',
  )

  const officers = nodes.filter(
    (node) => node.tier === 'OFFICER',
  )

  return createElement(
    'div',
    {
      className: 'wf-about-org',
    },

    createElement(
      'ol',
      {
        className: 'wf-about-org__leaders',
        'aria-label': '위닝펀드 운영진',
      },
      ...leaders.map((node) =>
        createElement(
          'li',
          {
            key: node.id,
            className: 'wf-about-org__leader',
          },
          createElement(
            'span',
            {
              className: 'wf-about-org__leader-label',
            },
            node.role,
          ),
          createElement(
            'p',
            null,
            node.description,
          ),
        ),
      ),
    ),

    createElement(
      'div',
      {
        className: 'wf-about-org__branch',
        'aria-hidden': 'true',
      },
    ),

    createElement(
      'ul',
      {
        className: 'wf-about-org__officers',
      },
      ...officers.map((node) =>
        createElement(
          'li',
          {
            key: node.id,
            className: 'wf-about-org__officer',
          },
          createElement(
            'span',
            {
              className: 'wf-about-org__officer-number',
              'aria-hidden': 'true',
            },
            String(node.order - 2).padStart(2, '0'),
          ),
          createElement(
            'h3',
            null,
            node.role,
          ),
          createElement(
            'p',
            null,
            node.description,
          ),
        ),
      ),
    ),

    record?.note
      ? createElement(
          'p',
          {
            className: 'wf-about-org__note',
          },
          record.note,
        )
      : null,
  )
}

function ExternalActivityList({ record }) {
  return createElement(
    'ol',
    {
      className: 'wf-about-external__list',
    },
    ...(record?.items ?? []).map((item, index) =>
      createElement(
        'li',
        {
          key: item.id,
          className: 'wf-about-external__item',
        },
        createElement(
          'span',
          {
            className: 'wf-about-external__number',
            'aria-hidden': 'true',
          },
          String(index + 1).padStart(2, '0'),
        ),
        createElement(
          'strong',
          {
            className: 'wf-about-external__label',
          },
          item.label,
        ),
        createElement(
          'p',
          {
            className: 'wf-about-external__description',
          },
          item.description,
        ),
      ),
    ),
  )
}

function SocialLinks({ record }) {
  return createElement(
    'div',
    {
      className: 'wf-about-social__grid',
    },
    ...(record?.items ?? []).map((item, index) =>
      createElement(
        'a',
        {
          key: item.id,
          className: 'wf-about-social__link',
          href: item.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        createElement(
          'span',
          {
            className: 'wf-about-social__number',
            'aria-hidden': 'true',
          },
          String(index + 1).padStart(2, '0'),
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__label',
          },
          item.label,
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__handle',
          },
          item.handle,
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__arrow',
            'aria-hidden': 'true',
          },
          '↗',
        ),
      ),
    ),
  )
}

export default function AboutPage() {
  const {
    aboutContent,
    organization,
    externalActivities,
    socialLinks,
  } = aboutData

  const hero = aboutContent?.hero ?? {}

  return createElement(
    'main',
    {
      className: 'wf-about',
    },

    createElement(
      'section',
      {
        className: 'wf-about-hero',
        'aria-labelledby': 'wf-about-title',
      },

      createElement(
        'div',
        {
          className: 'wf-about-hero__inner',
        },

        createElement(
          'p',
          {
            className: 'wf-about-hero__eyebrow',
          },
          hero.eyebrow ?? 'WINNINGFUND',
        ),

        createElement(
          'h1',
          {
            id: 'wf-about-title',
            className: 'wf-about-hero__title',
          },
          hero.title ?? 'ABOUT',
        ),

        createElement(
          'p',
          {
            className: 'wf-about-hero__summary',
          },
          hero.summary,
        ),

        createElement(
          'dl',
          {
            className: 'wf-about-hero__facts',
          },
          ...(aboutContent?.facts ?? []).map((fact) =>
            createElement(
              'div',
              {
                key: fact.id,
                className: 'wf-about-hero__fact',
              },
              createElement(
                'dt',
                null,
                fact.label,
              ),
              createElement(
                'dd',
                null,
                fact.value,
              ),
            ),
          ),
        ),
      ),

      createElement(AboutWave),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--intro',
        'aria-labelledby': 'wf-about-introduction-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '01',
          eyebrow: 'INTRODUCTION',
          title:
            aboutContent?.introductionTitle ??
            'Introduction',
          copy: aboutContent?.detailedIntroduction,
          id: 'wf-about-introduction-title',
        }),

        createElement(
          'div',
          {
            className: 'wf-about-org-heading',
          },
          createElement(
            'span',
            null,
            'ORGANIZATION',
          ),
          createElement(
            'strong',
            null,
            '운영 조직',
          ),
        ),

        createElement(OrganizationChart, {
          record: organization,
        }),
      ),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--external',
        'aria-labelledby': 'wf-about-external-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '02',
          eyebrow: 'NETWORK',
          title:
            externalActivities?.title ??
            '외부 활동 & 연계',
          copy: externalActivities?.introduction,
          id: 'wf-about-external-title',
        }),

        createElement(ExternalActivityList, {
          record: externalActivities,
        }),
      ),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--social',
        'aria-labelledby': 'wf-about-social-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '03',
          eyebrow: 'CONNECT',
          title:
            socialLinks?.title ??
            'SNS',
          copy: socialLinks?.introduction,
          id: 'wf-about-social-title',
        }),

        createElement(SocialLinks, {
          record: socialLinks,
        }),
      ),
    ),
  )
}