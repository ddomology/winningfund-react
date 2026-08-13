import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
let failed = false

function pass(message) {
  console.log(`PASS: ${message}`)
}

function fail(message) {
  failed = true
  console.error(`FAIL: ${message}`)
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const components = [
  'Header.js',
  'DesktopNav.js',
  'MobileNav.js',
  'PageTransition.js',
  'Section.js',
  'SectionHeader.js',
  'ResponsiveMedia.js',
  'CTAButton.js',
  'ExternalLink.js',
  'Accordion.js',
  'MemberGrid.js',
  'MemberCard.js',
  'ActivitySection.js',
  'ReportCard.js',
  'ClubCard.js',
  'InternalSectionNav.js',
  'Footer.js',
]

for (const component of components) {
  const relativePath = `src/components/${component}`
  if (fs.existsSync(path.join(root, relativePath))) {
    pass(`shared primitive exists: ${component}`)
  } else {
    fail(`missing shared primitive: ${component}`)
  }
}

for (const component of components) {
  const text = read(`src/components/${component}`)

  if (/from ['"].*\/pages\//.test(text)) {
    fail(`${component} imports a page`)
  }

  if (/content\/static|staticSiteSource|assetRegistry/.test(text)) {
    fail(`${component} imports a physical content source`)
  }

  if (/classList\.|querySelector\(/.test(text)) {
    fail(`${component} uses DOM classes/querySelector as state mechanism`)
  }

  if (
    /window\.location\.href|window\.location\.assign|window\.location\.replace|history\.pushState|history\.replaceState/.test(text)
  ) {
    fail(`${component} manually owns navigation/history`)
  }
}

if (!failed) {
  pass('shared primitives do not import pages/physical sources or own manual history')
}

const pageTransition = read('src/components/PageTransition.js')
if (
  !pageTransition.includes("from 'react-router'") &&
  !/navigate\(|history\.|window\.location/.test(pageTransition)
) {
  pass('PageTransition is visual-only and does not own router/history')
} else {
  fail('PageTransition owns navigation semantics')
}

const sectionHeader = read('src/components/SectionHeader.js')
if (
  sectionHeader.includes('headingLevel') &&
  sectionHeader.includes("`h${headingLevel}`") &&
  sectionHeader.includes("throw new Error('SectionHeader requires a title.')")
) {
  pass('SectionHeader separates heading semantics from visual styling')
} else {
  fail('SectionHeader heading contract incomplete')
}

const media = read('src/components/ResponsiveMedia.js')
for (const marker of [
  'decorative = false',
  'altText',
  'loadingPriority',
  "setLoadState('ERROR')",
  'wf-responsive-media__fallback',
]) {
  if (media.includes(marker)) {
    pass(`ResponsiveMedia contract marker: ${marker}`)
  } else {
    fail(`ResponsiveMedia missing contract marker: ${marker}`)
  }
}

const cta = read('src/components/CTAButton.js')
for (const marker of [
  "intentType === 'INTERNAL_ROUTE'",
  "intentType === 'INTERNAL_SECTION'",
  "intentType === 'EXTERNAL'",
  "intentType === 'ACTION'",
  "Link,",
  "'button'",
]) {
  if (cta.includes(marker)) {
    pass(`CTA semantic branch: ${marker}`)
  } else {
    fail(`CTA semantic branch missing: ${marker}`)
  }
}

const externalLink = read('src/components/ExternalLink.js')
if (
  externalLink.includes("['http:', 'https:']") &&
  externalLink.includes("rel: opensNewWindow ? 'noopener noreferrer'")
) {
  pass('ExternalLink rejects invalid/dead URLs and exposes safe new-tab semantics')
} else {
  fail('ExternalLink URL/new-tab semantics incomplete')
}

const accordion = read('src/components/Accordion.js')
for (const marker of [
  'defaultOpenIds',
  'openIds',
  'onOpenIdsChange',
  'multipleOpen',
  'aria-expanded',
  'aria-controls',
  'aria-labelledby',
  'hidden: !expanded',
  'useState',
]) {
  if (accordion.includes(marker)) {
    pass(`Accordion contract marker: ${marker}`)
  } else {
    fail(`Accordion missing: ${marker}`)
  }
}

if (!/classList\.|document\.querySelector/.test(accordion)) {
  pass('Accordion state is explicit React state/props, not DOM class mutation')
} else {
  fail('Accordion mutates DOM as source of truth')
}

const memberCard = read('src/components/MemberCard.js')
if (
  memberCard.includes("if (!member?.name) return null") &&
  !memberCard.includes("createElement(\n    'button'")
) {
  pass('MemberCard requires verified identity and has no fake button semantics')
} else {
  fail('MemberCard identity/semantic contract incomplete')
}

const internalNav = read('src/components/InternalSectionNav.js')
if (
  internalNav.includes('Link,') &&
  internalNav.includes("hash: `#${item.id}`") &&
  internalNav.includes("'aria-current': active ? 'location'")
) {
  pass('InternalSectionNav uses SPA hash links with semantic active state')
} else {
  fail('InternalSectionNav contract incomplete')
}

const appShell = read('src/app/AppShell.js')
if (
  appShell.includes('selectNavigation') &&
  appShell.includes('selectSiteConfig') &&
  /createElement\(\s*PageTransition/.test(appShell) &&
  /createElement\(\s*Header/.test(appShell) &&
  /createElement\(\s*Footer/.test(appShell)
) {
  pass('AppShell supplies normalized content into shared shell primitives')
} else {
  fail('AppShell shared primitive wiring incomplete')
}

if (!/content\/static|staticSiteSource/.test(appShell)) {
  pass('AppShell does not bypass content source boundary')
} else {
  fail('AppShell imports physical content source')
}

const main = read('src/main.js')
if (main.includes("'./styles/shared-primitives.css'")) {
  pass('shared primitive style layer is isolated and removable')
} else {
  fail('shared primitive style layer missing')
}

const css = read('src/styles/shared-primitives.css')
if (
  css.includes('.wf-section') &&
  css.includes('.wf-accordion') &&
  css.includes('.wf-responsive-media') &&
  css.includes('.wf-member-grid') &&
  css.includes('.wf-internal-section-nav')
) {
  pass('shared primitives have generic presentation layer')
} else {
  fail('shared primitive presentation layer incomplete')
}

const homeText = read('src/pages/HomePage.js')

if (
  !homeText.includes('RoutePlaceholder') &&
  homeText.includes('selectHomePageData')
) {
  pass('HomePage.js now composes STEP 04 primitives through normalized data')
} else {
  fail('HomePage.js STEP 05 composition missing')
}

const aboutText = read('src/pages/AboutPage.js')

if (
  !aboutText.includes('RoutePlaceholder') &&
  aboutText.includes('selectAboutPageData') &&
  aboutText.includes("className: 'wf-about'")
) {
  pass('AboutPage.js now composes ABOUT UI through normalized data')
} else {
  fail('AboutPage.js ABOUT composition missing')
}

const membersText = read('src/pages/MembersPage.js')
if (
  !membersText.includes('RoutePlaceholder') &&
  membersText.includes('selectMembersPageData') &&
  membersText.includes('MemberGrid') &&
  membersText.includes('Accordion')
) {
  pass('MembersPage.js now composes MEMBERS UI through normalized data')
} else {
  fail('MembersPage.js MEMBERS composition missing')
}

const activitiesText = read('src/pages/ActivitiesPage.js')
if (
  !activitiesText.includes('RoutePlaceholder') &&
  activitiesText.includes('selectActivitiesPageData') &&
  activitiesText.includes('InternalSectionNav')
) {
  pass('ActivitiesPage.js now composes ACTIVITIES UI through normalized data')
} else {
  fail('ActivitiesPage.js ACTIVITIES composition missing')
}

const recruitmentText = read('src/pages/RecruitmentPage.js')
if (
  !recruitmentText.includes('RoutePlaceholder') &&
  recruitmentText.includes('selectRecruitmentPageData') &&
  recruitmentText.includes('CTAButton')
) {
  pass('RecruitmentPage.js now composes RECRUITMENT UI through normalized data')
} else {
  fail('RecruitmentPage.js RECRUITMENT composition missing')
}

if (failed) {
  console.error('\nSTEP 04 shared primitive verification FAILED.')
  process.exit(1)
}

console.log('\nSTEP 04 shared primitive verification PASSED.')
