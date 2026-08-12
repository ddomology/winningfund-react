import { createElement } from 'react'
import { Link } from 'react-router'
import Section from '../components/Section.js'
import SectionHeader from '../components/SectionHeader.js'
import HomeSectionRail from '../components/HomeSectionRail.js'
import WinningFundLogoReveal from '../components/WinningFundLogoReveal.js'
import {
  siteContentBundle,
  selectHomePageData,
} from '../content/index.js'

const homeData = selectHomePageData(siteContentBundle)


/* STEP 05ZD: original logo pixels are revealed by feature-path masks behind the slogan. */

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

function HomeHero() {
  return createElement(
    'section',
    {
      id: 'home-hero',
      className: 'wf-home-hero wf-home-hero--kinetic-entrance',
      'aria-labelledby': 'wf-home-title',
    },
    createElement(
      'div',
      {
        className:
          'wf-home-hero__inner wf-home-hero__inner--kinetic-entrance',
      },
      createElement(
        'div',
        { className: 'wf-home-hero__kinetic-side' },
        createElement(
          'div',
          { className: 'wf-home-hero__impact-meta' },
          createElement('span', null, '01 / HOME'),
          createElement(
            'strong',
            { className: 'wf-home-hero__impact-kicker' },
            '투자·경제 학회',
          ),
        ),
      ),
      createElement(
        'div',
        { className: 'wf-home-hero__kinetic-main' },
        createElement(
          'div',
          { className: 'wf-home-hero__impact-brand' },
          'WINNINGFUND',
        ),
        createElement(
          'h1',
          {
            id: 'wf-home-title',
            className: 'wf-home-hero__kinetic-title-a11y',
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
            delayClass: 'wf-home-kinetic-row--1',
          }),
          createElement(HeroWordRow, {
            number: '02',
            english: 'ECONOMICS',
            delayClass: 'wf-home-kinetic-row--2',
            annotation: 'AND',
          }),
          createElement(HeroWordRow, {
            number: '03',
            english: 'CLUB',
            delayClass: 'wf-home-kinetic-row--3',
          }),
        ),
        createElement(
          'div',
          { className: 'wf-home-kinetic-footer' },
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
            className: 'wf-home-kinetic-footer__divider',
            'aria-hidden': 'true',
          }),
          createElement(
            'p',
            {
              className: 'wf-home-kinetic-slogan',
              'aria-label': homeData.hero.koreanSlogan,
            },
            createElement(WinningFundLogoReveal),
            createElement(
              'span',
              { className: 'wf-home-kinetic-slogan__text' },
              homeData.hero.koreanSlogan,
            ),
          ),
        ),
      ),
    ),
  )
}

function ShortIntroduction() {
  const introduction = homeData.shortIntroduction

  return createElement(
    Section,
    {
      sectionId: 'short-introduction',
      spacingVariant: 'compact',
      className: 'wf-home-intro',
    },
    createElement(
      'div',
      { className: 'wf-home-intro__grid' },
      createElement(
        'div',
        { className: 'wf-home-section-index' },
        '02 / 소개',
      ),
      createElement(
        'div',
        { className: 'wf-home-intro__statement' },
        createElement(
          'p',
          { className: 'wf-home-intro__name' },
          introduction?.heading ?? '위닝펀드',
        ),
        createElement(
          'p',
          { className: 'wf-home-intro__identity' },
          introduction?.supportingIdentity ?? '투자·경제 학회',
        ),
        introduction?.bodyCopy
          ? createElement(
              'p',
              { className: 'wf-home-intro__copy' },
              introduction.bodyCopy,
            )
          : null,
      ),
    ),
  )
}

function ProgramOverview() {
  return createElement(
    Section,
    {
      sectionId: 'program-overview',
      className: 'wf-home-programs',
    },
    createElement(
      'div',
      { className: 'wf-home-section-index' },
      '03 / 활동',
    ),
    createElement(SectionHeader, {
      title: '주요 활동',
      headingLevel: 2,
    }),
    createElement(
      'div',
      { className: 'wf-home-programs__list' },
      ...homeData.programOverview.map(
        (program, index) =>
          createElement(
            Link,
            {
              key: program.activityId,
              to: program.target,
              className: 'wf-home-program',
            },
            createElement(
              'span',
              { className: 'wf-home-program__number' },
              String(index + 1).padStart(2, '0'),
            ),
            createElement(
              'span',
              { className: 'wf-home-program__body' },
              createElement(
                'strong',
                { className: 'wf-home-program__title' },
                program.homeLabel,
              ),
              program.homeSummary
                ? createElement(
                    'span',
                    { className: 'wf-home-program__summary' },
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
  )
}

function MissionSection() {
  const mission = homeData.mission
  if (!mission?.items?.length) return null

  return createElement(
    Section,
    {
      sectionId: 'mission',
      className: 'wf-home-mission',
    },
    createElement(
      'div',
      { className: 'wf-home-section-index' },
      '04 / 방향',
    ),
    createElement(SectionHeader, {
      title: mission.title,
      headingLevel: 2,
    }),
    createElement(
      'div',
      { className: 'wf-home-mission__grid' },
      ...mission.items.map((item) =>
        createElement(
          'article',
          {
            key: item.id,
            className: 'wf-home-mission__item',
          },
          createElement(
            'span',
            { className: 'wf-home-mission__number' },
            String(item.order).padStart(2, '0'),
          ),
          createElement(
            'h3',
            { className: 'wf-home-mission__heading' },
            item.heading,
          ),
          item.description
            ? createElement(
                'p',
                { className: 'wf-home-mission__copy' },
                item.description,
              )
            : null,
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

  return createElement(
    Section,
    {
      sectionId: 'contents-18-2',
      className: 'wf-home-semester',
    },
    createElement(
      'div',
      { className: 'wf-home-section-index' },
      '05 / 18-2',
    ),
    createElement(
      'div',
      { className: 'wf-home-semester__heading-row' },
      createElement(SectionHeader, {
        title: semester.title,
        headingLevel: 2,
      }),
      createElement(
        'div',
        {
          className: 'wf-home-semester__term',
          'aria-hidden': 'true',
        },
        '18—2',
      ),
    ),
    semester.scheduleItems?.length
      ? createElement(
          'ol',
          { className: 'wf-home-semester__timeline' },
          ...semester.scheduleItems.map((item) =>
            createElement(
              'li',
              {
                key: item.id,
                className: 'wf-home-semester__item',
              },
              createElement(
                'span',
                { className: 'wf-home-semester__date' },
                item.period ?? item.dateLabel,
              ),
              createElement(
                'strong',
                { className: 'wf-home-semester__item-title' },
                item.title,
              ),
              item.description
                ? createElement(
                    'span',
                    { className: 'wf-home-semester__description' },
                    item.description,
                  )
                : null,
            ),
          ),
        )
      : createElement('div', {
          className: 'wf-home-semester__source-line',
          'data-content-state': semester.sourceStatus,
          'aria-hidden': 'true',
        }),
  )
}

export default function HomePage() {
  return createElement(
    'div',
    { className: 'wf-home' },
    createElement(HomeSectionRail),
    createElement(HomeHero),
    createElement(ShortIntroduction),
    createElement(ProgramOverview),
    createElement(MissionSection),
    createElement(SemesterContents),
  )
}
