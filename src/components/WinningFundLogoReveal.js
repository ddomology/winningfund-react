import { createElement } from 'react'
import winningFundLogoUrl from '../assets/brand/winningfund-logo.png'
import ribbonAUrl from '../assets/brand/winningfund-ribbon-a.png'
import ribbonBUrl from '../assets/brand/winningfund-ribbon-b.png'

/*
 * STEP 05ZD — Original-Pixel Logo Reveal
 *
 * The SVG paths below are NEVER visible artwork. They are only broad masks
 * that uncover exact pixels copied from the original 189x126 logo PNG.
 * Therefore the source PNG owns final silhouette, gradient, caps and AA.
 */

const VIEWBOX_WIDTH = 189
const VIEWBOX_HEIGHT = 126

const MASK_PATH_A = [
  'M 26.5 72',
  'C 28.5 84, 34.5 98, 47.5 101',
  'C 59 102, 71 99, 78.44 93.48',
  'C 83 84, 85.5 68, 87.9 58',
  'C 91 50, 94 45, 96 42',
].join(' ')

const MASK_PATH_B = [
  'M 79 94',
  'C 85 98, 92 101, 98.5 101',
  'C 106 101, 113 99, 117.76 94.95',
  'C 122 89, 124.5 84, 126.9 80',
  'L 139.7 54',
  'L 152.5 28',
  'L 163 8',
].join(' ')

export default function WinningFundLogoReveal() {
  return createElement(
    'span',
    {
      className: 'wf-home-logo-reveal',
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        className: 'wf-home-logo-reveal__svg',
        viewBox: `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`,
        preserveAspectRatio: 'xMidYMid meet',
        focusable: 'false',
      },
      createElement(
        'defs',
        null,
        createElement(
          'mask',
          {
            id: 'wf-logo-mask-a',
            x: 0,
            y: 0,
            width: VIEWBOX_WIDTH,
            height: VIEWBOX_HEIGHT,
            maskUnits: 'userSpaceOnUse',
          },
          createElement('rect', {
            x: 0,
            y: 0,
            width: VIEWBOX_WIDTH,
            height: VIEWBOX_HEIGHT,
            fill: '#000',
          }),
          createElement('path', {
            className: 'wf-home-logo-reveal__mask-path wf-home-logo-reveal__mask-path--a',
            d: MASK_PATH_A,
            pathLength: 1,
            fill: 'none',
            stroke: '#fff',
            strokeWidth: 47,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
        ),
        createElement(
          'mask',
          {
            id: 'wf-logo-mask-b',
            x: 0,
            y: 0,
            width: VIEWBOX_WIDTH,
            height: VIEWBOX_HEIGHT,
            maskUnits: 'userSpaceOnUse',
          },
          createElement('rect', {
            x: 0,
            y: 0,
            width: VIEWBOX_WIDTH,
            height: VIEWBOX_HEIGHT,
            fill: '#000',
          }),
          createElement('path', {
            className: 'wf-home-logo-reveal__mask-path wf-home-logo-reveal__mask-path--b',
            d: MASK_PATH_B,
            pathLength: 1,
            fill: 'none',
            stroke: '#fff',
            strokeWidth: 51,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
        ),
      ),
      createElement('image', {
        className: 'wf-home-logo-reveal__base',
        href: winningFundLogoUrl,
        x: 0,
        y: 0,
        width: VIEWBOX_WIDTH,
        height: VIEWBOX_HEIGHT,
        preserveAspectRatio: 'none',
      }),
      /* B is below A so the source logo's overlap order is preserved. */
      createElement('image', {
        className: 'wf-home-logo-reveal__ribbon wf-home-logo-reveal__ribbon--b',
        href: ribbonBUrl,
        x: 0,
        y: 0,
        width: VIEWBOX_WIDTH,
        height: VIEWBOX_HEIGHT,
        preserveAspectRatio: 'none',
        mask: 'url(#wf-logo-mask-b)',
      }),
      createElement('image', {
        className: 'wf-home-logo-reveal__ribbon wf-home-logo-reveal__ribbon--a',
        href: ribbonAUrl,
        x: 0,
        y: 0,
        width: VIEWBOX_WIDTH,
        height: VIEWBOX_HEIGHT,
        preserveAspectRatio: 'none',
        mask: 'url(#wf-logo-mask-a)',
      }),
    ),
  )
}
