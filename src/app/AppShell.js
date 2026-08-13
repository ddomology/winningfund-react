import { createElement } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import PageTransition from '../components/PageTransition.js'
import logoUrl from '../assets/brand/winningfund-logo.png'
import {
  siteContentBundle,
  selectNavigation,
  selectSiteConfig,
} from '../content/index.js'

const siteConfig = selectSiteConfig(siteContentBundle)
const navigationItems = selectNavigation(siteContentBundle)

const brand = Object.freeze({
  siteName: siteConfig.siteName,
  homePath: siteConfig.routeManifest.HOME,
  logoUrl,
  logoWidth: 189,
  logoHeight: 126,
})

export default function AppShell() {
  return createElement(
    PageTransition,
    null,
    createElement(
      'div',
      { className: 'wf-app-shell' },
      createElement(Header, {
        brand,
        navigationItems,
      }),
      createElement(
        'main',
        {
          id: 'main-content',
          className: 'wf-route-viewport',
        },
        createElement(Outlet),
      ),
      createElement(Footer, {
        siteName: siteConfig.siteName,
        secondaryText: '투자·경제 학회',
      }),
    ),
  )
}
