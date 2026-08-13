import { createElement } from 'react'
import CTAButton from '../components/CTAButton.js'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import {
  selectRecruitmentPageData,
  selectSiteConfig,
  siteContentBundle,
} from '../content/index.js'

const recruitmentData =
  selectRecruitmentPageData(siteContentBundle)

const siteConfig =
  selectSiteConfig(siteContentBundle)

function parseLocalDate(value, endOfDay = false) {
  if (!value) return null

  const [year, month, day] = value
    .split('-')
    .map(Number)

  if (![year, month, day].every(Number.isFinite)) {
    return null
  }

  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  )
}

function resolvePeriodState(period) {
  const start = parseLocalDate(period?.startAt)
  const end = parseLocalDate(period?.endAt, true)

  if (!start || !end) {
    return {
      state: 'UNKNOWN',
      label: 'SCHEDULE TBD',
      detail: '모집 일정 확인 중',
    }
  }

  const now = new Date()

  if (now < start) {
    return {
      state: 'COMING_SOON',
      label: 'COMING SOON',
      detail: `${start.getMonth() + 1}월 ${start.getDate()}일부터`,
    }
  }

  if (now > end) {
    return {
      state: 'CLOSED',
      label: 'CLOSED',
      detail: '모집 기간 종료',
    }
  }

  return {
    state: 'OPEN',
    label: 'OPEN NOW',
    detail: `${end.getMonth() + 1}월 ${end.getDate()}일까지`,
  }
}

function formatDateToken(value) {
  if (!value) return '--.--'

  const [, month, day] = value.split('-')
  return `${month}.${day}`
}

export default function RecruitmentPage() {
  const { record } = recruitmentData
  const period = record?.period
  const periodState = resolvePeriodState(period)
  const term = siteConfig.currentTermId ?? '18-2'
  const applicationAvailable = Boolean(record?.applicationUrl)

  const startToken = formatDateToken(period?.startAt)
  const endToken = formatDateToken(period?.endAt)

  return createElement(
    'main',
    {
      className: 'wf-recruitment',
    },

    createElement(
      'section',
      {
        className: 'wf-recruitment-hero',
        'aria-labelledby': 'wf-recruitment-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-hero__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-recruitment-hero__topline',
          },
          createElement('span', null, 'WINNINGFUND'),
          createElement(
            'span',
            {
              className: 'wf-recruitment-hero__term',
            },
            `${term} RECRUITMENT`,
          ),
        ),

        createElement(RouteHeroTitle, {
          id: 'wf-recruitment-title',
          className: 'wf-recruitment-hero__title',
          title: 'RECRUITMENT',
          alignment: 'left',
        }),

        createElement(
          'div',
          {
            className: 'wf-recruitment-hero__bottom',
          },

          createElement(
            'div',
            {
              className: 'wf-recruitment-hero__period',
            },
            createElement('span', null, startToken),
            createElement(
              'span',
              {
                className: 'wf-recruitment-hero__period-rule',
                'aria-hidden': 'true',
              },
            ),
            createElement('span', null, endToken),
          ),

          createElement(
            'div',
            {
              className: 'wf-recruitment-status',
              'data-state': periodState.state,
            },
            createElement(
              'span',
              {
                className: 'wf-recruitment-status__dot',
                'aria-hidden': 'true',
              },
            ),
            createElement(
              'div',
              null,
              createElement('strong', null, periodState.label),
              createElement('span', null, periodState.detail),
            ),
          ),
        ),
      ),

      createElement(RouteHeroWave, { waveId: 'wf-recruitment-route-wave', surface: 'white' }),
    ),

    createElement(
      'section',
      {
        className: 'wf-recruitment-info',
        'aria-labelledby': 'wf-recruitment-info-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-section__inner',
        },

        createElement(
          'header',
          {
            className: 'wf-recruitment-info__heading',
          },
          createElement(
            'span',
            null,
            'APPLICATION INFO',
          ),
          createElement(
            'h2',
            {
              id: 'wf-recruitment-info-title',
            },
            '다음 위닝펀드를 함께 만들 사람을 기다립니다.',
          ),
          createElement(
            'p',
            null,
            '현재 확정된 모집 기간을 먼저 안내합니다. 지원 링크와 세부 전형, 문의처는 확정 정보가 들어오는 즉시 이 페이지에서 이어서 안내합니다.',
          ),
        ),

        createElement(
          'dl',
          {
            className: 'wf-recruitment-facts',
          },

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '01'),
            createElement('dt', null, 'TERM'),
            createElement('dd', null, term),
          ),

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '02'),
            createElement('dt', null, 'PERIOD'),
            createElement(
              'dd',
              null,
              period?.displayText ?? `${startToken} — ${endToken}`,
            ),
          ),

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '03'),
            createElement('dt', null, 'APPLICATION'),
            createElement(
              'dd',
              null,
              applicationAvailable
                ? '지원 링크 공개'
                : 'TO BE UPDATED',
            ),
          ),
        ),
      ),
    ),

    createElement(
      'section',
      {
        className: 'wf-recruitment-action',
        'aria-labelledby': 'wf-recruitment-action-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-section__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-recruitment-action__copy',
          },
          createElement('span', null, 'JOIN WINNINGFUND'),
          createElement(
            'h2',
            {
              id: 'wf-recruitment-action-title',
            },
            `${term}`,
          ),
          createElement(
            'p',
            null,
            applicationAvailable
              ? '지원서를 확인하고 위닝펀드에 합류해 보세요.'
              : '지원 링크는 현재 준비 중입니다. 확정되는 즉시 이 버튼이 활성화됩니다.',
          ),
        ),

        createElement(CTAButton, {
          label: 'APPLY NOW',
          intentType: 'EXTERNAL',
          target: record?.applicationUrl,
          availability:
            applicationAvailable
              ? 'AVAILABLE'
              : 'UNAVAILABLE',
          unavailableReason:
            applicationAvailable
              ? undefined
              : '지원 링크 준비 중',
          emphasisVariant: 'primary',
        }),
      ),
    ),
  )
}
