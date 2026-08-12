import { createElement } from 'react'

function isValidExternalUrl(url) {
  if (!url) return false

  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export default function ExternalLink({
  label,
  url,
  description,
  icon,
  openMode = 'same-tab',
}) {
  if (!label || !isValidExternalUrl(url)) {
    return null
  }

  const opensNewWindow = openMode === 'new-tab'

  return createElement(
    'a',
    {
      className: 'wf-external-link',
      href: url,
      target: opensNewWindow ? '_blank' : undefined,
      rel: opensNewWindow ? 'noopener noreferrer' : undefined,
    },
    icon
      ? createElement(
          'span',
          {
            className: 'wf-external-link__icon',
            'aria-hidden': 'true',
          },
          icon,
        )
      : null,
    createElement(
      'span',
      { className: 'wf-external-link__content' },
      createElement(
        'span',
        { className: 'wf-external-link__label' },
        label,
        opensNewWindow
          ? createElement(
              'span',
              { className: 'wf-visually-hidden' },
              ' (opens in a new tab)',
            )
          : null,
      ),
      description
        ? createElement(
            'span',
            { className: 'wf-external-link__description' },
            description,
          )
        : null,
    ),
  )
}
