import { createElement } from 'react'

export default function Footer({
  siteName = 'WinningFund',
  secondaryText = 'Investment & Economics Club',
}) {
  return createElement(
    'footer',
    { className: 'wf-footer' },
    createElement(
      'div',
      { className: 'wf-footer__inner' },
      createElement(
        'strong',
        { className: 'wf-footer__brand' },
        siteName.toUpperCase(),
      ),
      secondaryText
        ? createElement(
            'span',
            { className: 'wf-footer__meta' },
            secondaryText,
          )
        : null,
    ),
  )
}
