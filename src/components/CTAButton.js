import { createElement } from 'react'
import { Link } from 'react-router'

const NAVIGATION_TYPES = new Set([
  'INTERNAL_ROUTE',
  'INTERNAL_SECTION',
  'EXTERNAL',
])

export default function CTAButton({
  label,
  intentType,
  target,
  availability = 'AVAILABLE',
  unavailableReason,
  emphasisVariant = 'primary',
  onAction,
}) {
  if (!label) {
    throw new Error('CTAButton requires label.')
  }

  if (
    NAVIGATION_TYPES.has(intentType) &&
    availability === 'AVAILABLE' &&
    !target
  ) {
    throw new Error(
      `CTAButton ${intentType} requires a target.`,
    )
  }

  const className = `wf-cta wf-cta--${emphasisVariant}`

  if (availability !== 'AVAILABLE') {
    return createElement(
      'span',
      {
        className: `${className} wf-cta--unavailable`,
        'aria-disabled': 'true',
      },
      createElement('span', null, label),
      unavailableReason
        ? createElement(
            'span',
            { className: 'wf-cta__reason' },
            unavailableReason,
          )
        : null,
    )
  }

  if (intentType === 'INTERNAL_ROUTE') {
    return createElement(
      Link,
      { className, to: target },
      label,
    )
  }

  if (intentType === 'INTERNAL_SECTION') {
    return createElement(
      Link,
      { className, to: target },
      label,
    )
  }

  if (intentType === 'EXTERNAL') {
    return createElement(
      'a',
      {
        className,
        href: target,
        rel: 'noopener noreferrer',
      },
      label,
    )
  }

  if (intentType === 'ACTION') {
    return createElement(
      'button',
      {
        className,
        type: 'button',
        onClick: onAction,
      },
      label,
    )
  }

  throw new Error(`Unsupported CTA intentType: ${intentType}`)
}
