import { createElement } from 'react'

/*
 * WinningFund hero signature
 *
 * The old logo artwork is intentionally removed.
 * This component now renders only an abstract brush stroke.
 *
 * The original CodePen brush PNG is used purely as an alpha mask.
 * Brand colors are supplied by CSS.
 */

export default function WinningFundLogoReveal() {
  return createElement(
    'span',
    {
      className: 'wf-home-brush-stroke',
      'aria-hidden': 'true',
    },
    createElement('span', {
      className: 'wf-home-brush-stroke__paint',
    }),
  )
}
