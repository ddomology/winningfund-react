import { createElement } from 'react'

/*
 * Decorative hero brush signature.
 *
 * The artwork is intentionally separate from the WinningFund logo.
 * The PNG owns only high-resolution brush alpha/texture.
 * CSS owns color, placement and the one-shot reveal.
 */
export default function WinningFundBrushSignature() {
  return createElement(
    'span',
    {
      className: 'wf-home-brush-signature',
      'aria-hidden': 'true',
    },
    createElement('span', {
      className: 'wf-home-brush-signature__paint',
    }),
  )
}
