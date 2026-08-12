import { createElement } from 'react'

const VALID_LEVELS = new Set([1, 2, 3, 4, 5, 6])

export default function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 2,
  supplementaryContent,
  alignmentVariant = 'start',
  id,
}) {
  if (!title) {
    throw new Error('SectionHeader requires a title.')
  }

  if (!VALID_LEVELS.has(headingLevel)) {
    throw new Error(`Invalid SectionHeader headingLevel: ${headingLevel}`)
  }

  const Heading = `h${headingLevel}`

  return createElement(
    'header',
    {
      className: `wf-section-header wf-section-header--${alignmentVariant}`,
    },
    eyebrow
      ? createElement(
          'p',
          { className: 'wf-section-header__eyebrow' },
          eyebrow,
        )
      : null,
    createElement(
      Heading,
      {
        id,
        className: 'wf-section-header__title',
      },
      title,
    ),
    description
      ? createElement(
          'p',
          { className: 'wf-section-header__description' },
          description,
        )
      : null,
    supplementaryContent
      ? createElement(
          'div',
          { className: 'wf-section-header__supplementary' },
          supplementaryContent,
        )
      : null,
  )
}
