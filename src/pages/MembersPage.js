import { createElement } from 'react'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import Accordion from '../components/Accordion.js'
import MemberGrid from '../components/MemberGrid.js'
import {
  selectAssetById,
  selectMembersPageData,
  siteContentBundle,
} from '../content/index.js'

const membersData =
  selectMembersPageData(siteContentBundle)

function HistoricalMembers({ term }) {
  if (term.dataStatus !== 'AVAILABLE') {
    return createElement(
      'p',
      {
        className: 'wf-members-history__unavailable',
      },
      '현재 보유 데이터에 명단이 없습니다.',
    )
  }

  return createElement(
    'ul',
    {
      className: 'wf-members-history__names',
    },
    ...term.members.map((member) =>
      createElement(
        'li',
        {
          key: member.memberId,
        },
        member.name,
      ),
    ),
  )
}

export default function MembersPage() {
  const terms = [...membersData.terms].sort(
    (a, b) => a.order - b.order,
  )

  const current =
    terms.find(
      (term) =>
        term.termId === membersData.currentTermId,
    ) ?? terms[0]

  const historical = terms.filter(
    (term) => term.termId !== current?.termId,
  )

  return createElement(
    'main',
    {
      className: 'wf-members',
    },

    createElement(
      'section',
      {
        className: 'wf-members-hero',
        'aria-labelledby': 'wf-members-title',
      },

      createElement(
        'div',
        {
          className: 'wf-members-hero__inner',
        },

        createElement(
          'p',
          {
            className: 'wf-members-hero__eyebrow',
          },
          'WINNINGFUND',
        ),

        createElement(RouteHeroTitle, {
          id: 'wf-members-title',
          className: 'wf-members-hero__title',
          title: 'MEMBERS',
        }),

        createElement(
          'p',
          {
            className: 'wf-members-hero__copy',
          },
          '위닝펀드를 거쳐간 1-1기부터 현재까지, 모든 기수의 발자취를 소개합니다.',
        ),
      ),

      createElement(RouteHeroWave, { waveId: 'wf-members-route-wave', surface: 'soft' }),
    ),

    current
      ? createElement(
          'section',
          {
            className:
              'wf-members-section wf-members-section--current',
            'aria-labelledby':
              'wf-members-current-title',
          },

          createElement(
            'div',
            {
              className: 'wf-members-section__inner',
            },

            createElement(
              'div',
              {
                className:
                  'wf-members-current__heading',
              },

              createElement(
                'div',
                {
                  className:
                    'wf-members-current__meta',
                },
                createElement(
                  'span',
                  null,
                  '01 / CURRENT TERM',
                ),
                createElement(
                  'strong',
                  null,
                  `${current.label}기`,
                ),
              ),

              createElement(
                'h2',
                {
                  id: 'wf-members-current-title',
                },
                '현재 위닝펀드를 이끄는 사람들',
              ),
            ),

            createElement(MemberGrid, {
              members: current.members,
              generationContext: current.termId,
              assetResolver: (assetId) =>
                selectAssetById(
                  siteContentBundle,
                  assetId,
                ),
              layoutVariant: 'members-current',
            }),
          ),
        )
      : null,

    createElement(
      'section',
      {
        className:
          'wf-members-section wf-members-section--history',
        'aria-labelledby':
          'wf-members-history-title',
      },

      createElement(
        'div',
        {
          className: 'wf-members-section__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-members-history__heading',
          },

          createElement(
            'div',
            {
              className: 'wf-members-history__meta',
            },
            createElement(
              'span',
              null,
              '02 / MEMBERS & ALUMNI',
            ),
          ),

          createElement(
            'h2',
            {
              id: 'wf-members-history-title',
            },
            '기수별 멤버',
          ),

          createElement(
            'p',
            null,
            '여러 기수를 동시에 펼쳐 비교할 수 있습니다. 보유 명단은 9기부터 제공하며, 그 이전 기수는 기록만 유지합니다.',
          ),
        ),

        createElement(Accordion, {
          items: historical,
          itemIdResolver: (term) => term.termId,
          defaultOpenIds: [],
          multipleOpen: true,
          ariaLabel: '위닝펀드 역대 기수',
          headerContentResolver: (term) =>
            createElement(
              'span',
              {
                className:
                  'wf-members-history__trigger-content',
              },
              createElement(
                'strong',
                null,
                `${term.label}기`,
              ),
              createElement(
                'span',
                null,
                term.dataStatus === 'AVAILABLE'
                  ? `${term.members.length}명`
                  : '명단 미보유',
              ),
            ),
          panelContentResolver: (term) =>
            createElement(HistoricalMembers, {
              term,
            }),
        }),
      ),
    ),
  )
}
