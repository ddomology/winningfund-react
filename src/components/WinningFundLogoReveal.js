import { createElement } from 'react'

/*
 * WINNINGFUND — DIGITAL BRUSH SIGNATURE
 *
 * This is intentionally NOT the WinningFund logo.
 *
 * It is a single abstract brand-color gesture:
 * sky blue -> cyan -> vivid blue -> cobalt.
 *
 * Final artwork and reveal logic are separated:
 * - paths own the artwork
 * - centerline mask owns the drawing animation
 */

const BRUSH_SHAPE = [
  'M 22 112',
  'C 126 126, 216 164, 326 169',
  'C 438 174, 538 142, 638 103',
  'C 742 63, 844 40, 965 46',
  'C 987 47, 998 57, 992 70',
  'C 884 80, 784 108, 676 149',
  'C 564 192, 454 219, 337 218',
  'C 223 217, 122 192, 31 166',
  'C 12 160, 7 148, 10 132',
  'C 12 122, 16 116, 22 112',
  'Z',
].join(' ')

const REVEAL_PATH = [
  'M 18 146',
  'C 166 183, 290 197, 423 170',
  'C 566 141, 704 77, 824 59',
  'C 885 50, 940 50, 989 59',
].join(' ')

export default function WinningFundLogoReveal() {
  return createElement(
    'span',
    {
      className:
        'wf-home-logo-reveal wf-home-digital-brush',
      'aria-hidden': 'true',
    },

    createElement(
      'svg',
      {
        className: 'wf-home-logo-reveal__svg',
        viewBox: '0 0 1000 260',
        preserveAspectRatio: 'none',
        focusable: 'false',
      },

      createElement(
        'defs',
        null,

        /*
         * Main longitudinal brand gradient.
         */
        createElement(
          'linearGradient',
          {
            id: 'wf-digital-brush-base',
            x1: '0%',
            y1: '50%',
            x2: '100%',
            y2: '50%',
          },

          createElement('stop', {
            offset: '0%',
            stopColor: '#BDEEFF',
          }),

          createElement('stop', {
            offset: '22%',
            stopColor: '#84DEFA',
          }),

          createElement('stop', {
            offset: '46%',
            stopColor: '#43B9F5',
          }),

          createElement('stop', {
            offset: '70%',
            stopColor: '#168AF1',
          }),

          createElement('stop', {
            offset: '100%',
            stopColor: '#0759ED',
          }),
        ),


        /*
         * Soft internal highlight.
         */
        createElement(
          'radialGradient',
          {
            id: 'wf-digital-brush-highlight',
            cx: '34%',
            cy: '34%',
            r: '62%',
          },

          createElement('stop', {
            offset: '0%',
            stopColor: '#E1F9FF',
            stopOpacity: '0.72',
          }),

          createElement('stop', {
            offset: '34%',
            stopColor: '#9BEAFF',
            stopOpacity: '0.34',
          }),

          createElement('stop', {
            offset: '100%',
            stopColor: '#FFFFFF',
            stopOpacity: '0',
          }),
        ),


        /*
         * Slight cobalt depth toward the end.
         */
        createElement(
          'linearGradient',
          {
            id: 'wf-digital-brush-depth',
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '0%',
          },

          createElement('stop', {
            offset: '42%',
            stopColor: '#063DBC',
            stopOpacity: '0',
          }),

          createElement('stop', {
            offset: '74%',
            stopColor: '#063DBC',
            stopOpacity: '0.12',
          }),

          createElement('stop', {
            offset: '100%',
            stopColor: '#032FAD',
            stopOpacity: '0.24',
          }),
        ),


        /*
         * Slight edge softening only.
         */
        createElement(
          'filter',
          {
            id: 'wf-digital-brush-soft',
            x: '-5%',
            y: '-18%',
            width: '110%',
            height: '136%',
          },

          createElement('feGaussianBlur', {
            stdDeviation: '0.65',
          }),
        ),


        /*
         * Animated reveal mask.
         *
         * The mask is deliberately much wider than the artwork.
         * The artwork silhouette still owns the final visible shape.
         */
        createElement(
          'mask',
          {
            id: 'wf-digital-brush-reveal',
            x: 0,
            y: 0,
            width: 1000,
            height: 260,
            maskUnits: 'userSpaceOnUse',
          },

          createElement('rect', {
            x: 0,
            y: 0,
            width: 1000,
            height: 260,
            fill: '#000',
          }),

          createElement('path', {
            className:
              'wf-home-digital-brush__mask-path',
            d: REVEAL_PATH,
            pathLength: 1,
            fill: 'none',
            stroke: '#fff',
            strokeWidth: 238,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
        ),
      ),


      createElement(
        'g',
        {
          className: 'wf-home-digital-brush__art',
          mask: 'url(#wf-digital-brush-reveal)',
        },

        /*
         * Base body.
         */
        createElement('path', {
          d: BRUSH_SHAPE,
          fill: 'url(#wf-digital-brush-base)',
          filter: 'url(#wf-digital-brush-soft)',
        }),

        /*
         * Highlight.
         */
        createElement('path', {
          d: BRUSH_SHAPE,
          fill: 'url(#wf-digital-brush-highlight)',
        }),

        /*
         * Depth.
         */
        createElement('path', {
          d: BRUSH_SHAPE,
          fill: 'url(#wf-digital-brush-depth)',
        }),
      ),
    ),
  )
}
