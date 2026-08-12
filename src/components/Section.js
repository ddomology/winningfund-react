import { createElement } from 'react'

export default function Section({
  sectionId,
  semanticLabel,
  widthPolicy = 'content',
  spacingVariant = 'default',
  children,
  className = '',
}) {
  if (children === null || children === undefined || children === false) {
    return null
  }

  const classes = [
    'wf-section',
    `wf-section--width-${widthPolicy}`,
    `wf-section--spacing-${spacingVariant}`,
    className,
  ].filter(Boolean).join(' ')

  return createElement(
    'section',
    {
      id: sectionId || undefined,
      className: classes,
      'aria-label': semanticLabel || undefined,
    },
    children,
  )
}
