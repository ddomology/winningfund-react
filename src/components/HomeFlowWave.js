import { createElement } from 'react'

export default function HomeFlowWave() {
  return createElement(
    'div',
    {
      className: 'wf-home-wave',
      'aria-hidden': 'true',
    },
    createElement(
      'svg',
      {
        className: 'wf-home-wave__svg',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 24 150 28',
        preserveAspectRatio: 'none',
        focusable: 'false',
      },
      createElement(
        'defs',
        null,
        createElement('path', {
          id: 'wf-home-gentle-wave',
          d: 'M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z',
        }),
      ),
      createElement(
        'g',
        { className: 'wf-home-wave__layers' },
        createElement('use', {
          href: '#wf-home-gentle-wave',
          x: '48',
          y: '0',
          className: 'wf-home-wave__layer wf-home-wave__layer--1',
        }),
        createElement('use', {
          href: '#wf-home-gentle-wave',
          x: '48',
          y: '3',
          className: 'wf-home-wave__layer wf-home-wave__layer--2',
        }),
        createElement('use', {
          href: '#wf-home-gentle-wave',
          x: '48',
          y: '5',
          className: 'wf-home-wave__layer wf-home-wave__layer--3',
        }),
        createElement('use', {
          href: '#wf-home-gentle-wave',
          x: '48',
          y: '7',
          className: 'wf-home-wave__layer wf-home-wave__layer--4',
        }),
      ),
    ),
  )
}
