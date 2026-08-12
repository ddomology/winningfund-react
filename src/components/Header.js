import { createElement } from 'react'
import { Link } from 'react-router'
import DesktopNav from './DesktopNav.js'
import MobileNav from './MobileNav.js'

export default function Header({
  brand,
  navigationItems = [],
}) {
  const homePath = brand?.homePath ?? '/'
  const siteName = brand?.siteName ?? 'WinningFund'
  const logoUrl = brand?.logoUrl ?? null

  return createElement(
    'header',
    { className: 'wf-header' },
    createElement(
      'div',
      { className: 'wf-header__inner' },
      createElement(
        Link,
        {
          to: homePath,
          className: 'wf-brand',
          'aria-label': `${siteName} home`,
        },
        logoUrl
          ? createElement('img', {
              className: 'wf-brand__logo',
              src: logoUrl,
              alt: '',
              width: brand?.logoWidth ?? 189,
              height: brand?.logoHeight ?? 126,
            })
          : null,
        createElement(
          'span',
          { className: 'wf-brand__name' },
          siteName.toUpperCase(),
        ),
      ),
      createElement(DesktopNav, { items: navigationItems }),
      createElement(MobileNav, { items: navigationItems }),
    ),
  )
}
