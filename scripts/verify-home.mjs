import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  siteContentBundle,
  selectHomePageData,
} from '../src/content/index.js'

const root = process.cwd()
let failed = false
const pass = (message) => console.log(`PASS: ${message}`)
const fail = (message) => { failed = true; console.error(`FAIL: ${message}`) }
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')

const homeSource = read('src/pages/HomePage.js')
const railSource = read('src/components/HomeSectionRail.js')
const homeCss = read('src/styles/home.css')
const staticSource = read('src/content/static/staticSiteSource.js')
const homeData = selectHomePageData(siteContentBundle)

if (!homeSource.includes('RoutePlaceholder')) pass('HOME remains implemented')
else fail('HOME regressed to placeholder')

if (homeSource.includes('HomeSectionRail') && homeSource.includes("id: 'home-hero'")) {
  pass('HOME mounts section rail and stable hero anchor')
} else {
  fail('section rail/hero anchor wiring missing')
}

for (const id of [
  'home-hero',
  'short-introduction',
  'program-overview',
  'mission',
  'contents-18-2',
]) {
  if (railSource.includes(`id: '${id}'`)) pass(`rail section id ${id}`)
  else fail(`rail missing section id ${id}`)
}

for (const number of ['01', '02', '03', '04', '05']) {
  if (railSource.includes(`number: '${number}'`)) pass(`rail number ${number}`)
  else fail(`rail missing ${number}`)
}

if (
  railSource.includes("? 'current'") &&
  railSource.includes("? 'visited'") &&
  railSource.includes("'upcoming'") &&
  railSource.includes("'data-state': state")
) {
  pass('rail exposes current/visited/upcoming state without completion icons')
} else {
  fail('rail state contract incomplete')
}

if (!/[✓✔☑]/.test(railSource + homeSource)) {
  pass('no check/completion glyphs used')
} else {
  fail('completion glyph found')
}

if (
  railSource.includes('window.requestAnimationFrame') &&
  railSource.includes("window.addEventListener('scroll'") &&
  !/history\.|window\.location|pushState|replaceState/.test(railSource)
) {
  pass('rail tracks scroll locally without owning history/navigation')
} else {
  fail('rail scroll/history contract invalid')
}

if (
  railSource.includes("href: `#${section.id}`") &&
  railSource.includes("'aria-current':") &&
  railSource.includes("'aria-label': `${section.number} ${section.label}`")
) {
  pass('rail links are semantic same-page anchors')
} else {
  fail('rail anchor accessibility contract incomplete')
}

if (
  homeCss.includes('var(--wf-brand-sky)') &&
  homeCss.includes('var(--wf-brand-blue)') &&
  homeCss.includes('var(--wf-brand-cobalt)') &&
  homeCss.includes("[data-state='visited']") &&
  homeCss.includes("[data-state='current']") &&
  homeCss.includes("[data-state='upcoming']")
) {
  pass('rail uses WinningFund brand colors for progress/state hierarchy')
} else {
  fail('brand color rail styling incomplete')
}

if (
  !homeCss.includes('@keyframes wf-hero-settle') &&
  !homeCss.includes('--wf-hero-final-height') &&
  !homeSource.includes('wf-home-hero__continuation')
) {
  pass('05C hero-settle/continuation gimmick removed')
} else {
  fail('legacy hero-settle/continuation remains')
}

if (
  homeSource.includes('INVESTMENT') &&
  homeSource.includes('ECONOMICS') &&
  homeSource.includes('CLUB') &&
  homeSource.includes('homeData.hero.koreanSlogan') &&
  homeCss.includes('.wf-home-hero--kinetic-entrance')
) {
  pass('three-row clip-entrance hero composition present')
} else {
  fail('hero composition regressed')
}

if (
  homeData.hero.englishIdentity === 'INVESTMENT AND ECONOMICS CLUB' &&
  homeData.hero.koreanSlogan === '우리는 늘 최선의 선택을 연구합니다'
) {
  pass('approved Hero data unchanged')
} else {
  fail('approved Hero data changed')
}

for (const label of ['HOME','ABOUT','MEMBERS','ACTIVITIES','RECRUITMENT']) {
  if (staticSource.includes(`"label": "${label}"`)) pass(`global nav label ${label}`)
  else fail(`global nav label not English: ${label}`)
}

if (
  homeCss.includes('@media (max-width: 63.99rem)') &&
  homeCss.includes('grid-template-columns: repeat(5, minmax(0, 1fr))')
) {
  pass('same rail DOM recomposes horizontally on compact viewports')
} else {
  fail('compact rail recomposition missing')
}

if (
  homeCss.includes('@media (prefers-reduced-motion: reduce)') &&
  homeCss.includes('animation: none !important')
) {
  pass('reduced motion preserved')
} else {
  fail('reduced motion missing')
}

const aboutPageSource = read('src/pages/AboutPage.js')

if (
  !aboutPageSource.includes('RoutePlaceholder') &&
  aboutPageSource.includes('selectAboutPageData')
) {
  pass('AboutPage.js is intentionally implemented after HOME')
} else {
  fail('AboutPage.js implementation boundary invalid')
}

const membersPageSource = read('src/pages/MembersPage.js')
if (
  !membersPageSource.includes('RoutePlaceholder') &&
  membersPageSource.includes('selectMembersPageData')
) {
  pass('MembersPage.js is intentionally implemented after ABOUT')
} else {
  fail('MembersPage.js implementation boundary invalid')
}

for (const page of ['ActivitiesPage.js','RecruitmentPage.js']) {
  const text = read(`src/pages/${page}`)
  if (text.includes('RoutePlaceholder')) pass(`${page} remains placeholder`)
  else fail(`${page} unexpectedly implemented`)
}


if (
  railSource.includes("className: 'wf-home-rail__label'") &&
  homeCss.includes('.wf-home-rail__label') &&
  homeCss.includes('font-size: 1.44rem') &&
  homeCss.includes('width: 58px')
) {
  pass('desktop section rail has amplified number/label/tick presence')
} else {
  fail('amplified desktop section rail styling missing')
}

const indexSource = read('index.html')

if (
  indexSource.includes('rel="icon"') &&
  indexSource.includes('href="/favicon.png"') &&
  indexSource.includes('<title>WinningFund</title>') &&
  fs.existsSync(path.join(root, 'public', 'favicon.png'))
) {
  pass('WinningFund brand mark is wired as browser-tab favicon')
} else {
  fail('browser-tab favicon/title wiring missing')
}


if (
  homeCss.includes('--wf-home-editorial-gutter: clamp(64px, 4.6vw, 96px)') &&
  homeCss.includes('.wf-home-hero__inner {\n    grid-template-columns:') &&
  homeCss.includes('.wf-home-hero__inner > * {\n    grid-column: 2;') &&
  homeCss.includes('.wf-home > .wf-section {\n    display: grid;') &&
  homeCss.includes('.wf-home > .wf-section > * {\n    grid-column: 2;')
) {
  pass('desktop HOME reserves a dedicated editorial gutter grid column between rail and content')
} else {
  fail('dedicated rail/content gutter grid column missing')
}

if (
  !homeCss.includes('.wf-home-hero__inner {\n    padding-left:') &&
  !homeCss.includes('.wf-home > .wf-section {\n    padding-left:')
) {
  pass('05F spacing is grid-column based rather than ad-hoc left padding')
} else {
  fail('05F regressed to padding-only rail/content spacing')
}

if (
  homeCss.includes('@media (max-width: 86rem) and (min-width: 64rem)') &&
  homeCss.includes('--wf-home-editorial-gutter: clamp(44px, 4vw, 60px)') &&
  homeCss.includes('@media (max-width: 63.99rem)') &&
  homeCss.includes('--wf-home-editorial-gutter: 0px')
) {
  pass('editorial gutter scales down before compact horizontal rail mode')
} else {
  fail('editorial gutter responsive policy missing')
}


const step05gCss = read('src/styles/home.css')

if (
  step05gCss.includes('padding-block: 0.08em 0.14em') &&
  step05gCss.includes('margin-block: -0.08em -0.14em') &&
  step05gCss.includes('line-height: 0.94')
) {
  pass('hero reveal masks reserve glyph-safe vertical breathing room')
} else {
  fail('hero glyph clipping fix missing')
}

if (!homeSource.includes('<svg')) {
  pass('hero remains semantic HTML rather than SVG lettering')
} else {
  fail('hero text was replaced by decorative SVG text')
}

if (
  fs.existsSync(
    path.join(
      root,
      'third_party',
      'SVG_GRADIENT_FILLED_TEXT_MIT.txt',
    ),
  )
) {
  pass('uploaded gradient reference MIT license retained')
} else {
  fail('uploaded gradient reference license missing')
}










const step05oCss = read('src/styles/home.css')
const step05oPackage = read('package.json')

if (
  homeSource.includes('function HeroWordRow') &&
  homeSource.includes("english: 'INVESTMENT'") &&
  homeSource.includes("english: 'ECONOMICS'") &&
  homeSource.includes("english: 'CLUB'") &&
  homeSource.includes("number: '01'") &&
  homeSource.includes("number: '02'") &&
  homeSource.includes("number: '03'")
) {
  pass('three numbered English typography rows preserved')
} else {
  fail('three-row English structure missing')
}

if (
  !homeSource.includes("korean: '투자'") &&
  !homeSource.includes("korean: '경제'") &&
  !homeSource.includes("korean: '학회'") &&
  !homeSource.includes('wf-home-kinetic-row__korean') &&
  !step05oCss.includes('@media (hover: hover) and (pointer: fine)')
) {
  pass('투자/경제/학회 hover layer is completely removed')
} else {
  fail('old Korean hover content or hover dependency remains')
}

if (
  homeSource.includes('wf-home-kinetic-row__reveal') &&
  step05oCss.includes('@keyframes wf-home-center-clip-entrance') &&
  step05oCss.includes('0 50%') &&
  step05oCss.includes('100% 100%') &&
  step05oCss.includes('opacity: 0')
) {
  pass('reference center-line hover clip is converted into entrance animation')
} else {
  fail('clip entrance animation missing')
}

if (
  step05oCss.includes('--wf-row-delay: 120ms') &&
  step05oCss.includes('--wf-row-delay: 300ms') &&
  step05oCss.includes('--wf-row-delay: 480ms')
) {
  pass('clip entrance is staggered across the three English rows')
} else {
  fail('clip entrance stagger missing')
}

if (
  step05oCss.includes('.wf-home-kinetic-row__ghost') &&
  step05oCss.includes('color: rgba(255,255,255,.17)') &&
  step05oCss.includes('@keyframes wf-home-ghost-resolve') &&
  step05oCss.includes('color: #ffffff')
) {
  pass('ghost English resolves to clean solid-white final typography')
} else {
  fail('final English resolution missing')
}

if (
  !step05oPackage.includes('gsap') &&
  !homeSource.includes('ScrollTrigger') &&
  !homeSource.includes('gsap.')
) {
  pass('entrance adaptation remains dependency-free')
} else {
  fail('GSAP/ScrollTrigger leaked into STEP 05O')
}

if (
  step05oCss.includes('@media (prefers-reduced-motion: reduce)') &&
  step05oCss.includes('color: #ffffff !important') &&
  step05oCss.includes('display: none !important')
) {
  pass('reduced-motion skips the clip entrance and shows final state immediately')
} else {
  fail('reduced-motion final state missing')
}

if (
  fs.existsSync(
    path.join(
      root,
      'third_party',
      'TEXT_SCROLL_HOVER_GSAP_CLIP_MIT.txt',
    ),
  )
) {
  pass('reference MIT license remains retained')
} else {
  fail('reference license missing')
}


const step05pCss = read('src/styles/home.css')

if (
  step05pCss.includes(
    '.wf-home-hero__inner.wf-home-hero__inner--kinetic-entrance'
  ) &&
  step05pCss.includes('> .wf-home-hero__kinetic-side') &&
  step05pCss.includes('grid-column: 1') &&
  step05pCss.includes('> .wf-home-hero__kinetic-main') &&
  step05pCss.includes('grid-column: 2')
) {
  pass('05P overrides the inherited 05F child grid-column collision')
} else {
  fail('05F/05O grid-column collision is not explicitly fixed')
}

if (
  step05pCss.includes('grid-template-rows: minmax(0, 1fr)') &&
  step05pCss.includes('grid-row: 1') &&
  step05pCss.includes('align-items: stretch')
) {
  pass('kinetic side and main share one desktop grid row')
} else {
  fail('kinetic hero children can still auto-place onto separate rows')
}

if (
  step05pCss.includes('@media (min-width: 64rem) and (max-height: 820px)') &&
  step05pCss.includes('min-height: clamp(94px, 13.2vh, 126px)') &&
  step05pCss.includes('.wf-home-kinetic-footer')
) {
  pass('short desktop heights preserve the lower term/slogan band')
} else {
  fail('short-height desktop safeguard missing')
}


const step05qCss = read('src/styles/home.css')

if (
  homeSource.includes("className: 'wf-home-kinetic-row__text-slot'") &&
  homeSource.includes("className: 'wf-home-kinetic-row__ghost'") &&
  homeSource.includes("className: 'wf-home-kinetic-row__reveal'") &&
  step05qCss.includes('.wf-home-kinetic-row__text-slot {')
) {
  pass('ghost and reveal layers share one text-slot coordinate system')
} else {
  fail('shared text-slot coordinate system missing')
}

if (
  step05qCss.includes('.wf-home-kinetic-row--3') &&
  step05qCss.includes('.wf-home-kinetic-row__text-slot') &&
  step05qCss.includes('justify-self: end') &&
  step05qCss.includes('width: max-content') &&
  step05qCss.includes('margin-right: clamp(8px, 2.4vw, 34px)') &&
  step05qCss.includes('padding-right: 0')
) {
  pass('CLUB final and reveal positions are owned by one right-aligned slot')
} else {
  fail('CLUB alignment ownership is still split')
}

if (
  (homeSource.includes('WinningFundBrushSignature') || homeSource.includes('wf-home-kinetic-slogan__brush') || homeSource.includes('WinningFundCalligraphyBrush') || homeSource.includes('WinningFundLogoReveal')) &&
  homeSource.includes('wf-home-kinetic-slogan__text') &&
  step05qCss.includes('wf-home-korean-typing') &&
  step05qCss.includes('@keyframes wf-home-korean-caret-move') &&
  step05qCss.includes('@keyframes wf-home-korean-caret-blink')
) {
  pass('Korean slogan source advanced beyond the typing baseline while preserving the historical reference block')
} else {
  fail('Korean slogan bridge state missing')
}

if (
  !step05qCss.includes('font-family: monospace') &&
  step05qCss.includes('-webkit-background-clip: text') &&
  step05qCss.includes('background-size: 0% 100%')
) {
  pass('Korean typing preserves proportional typography instead of monospace')
} else {
  fail('typing adaptation regressed to monospace/layout-width animation')
}

if (
  step05qCss.includes('--wf-kinetic-bridge: clamp(64px, 5vw, 88px)') &&
  step05qCss.includes('.wf-home-hero__kinetic-side::before') &&
  step05qCss.includes('rgba(143, 218, 250, 0.68)')
) {
  pass('desktop section rail -> hero bridge gutter is present')
} else {
  fail('bridge gutter missing')
}

if (
  step05qCss.includes(
    ".wf-home-rail__link[data-state='current']"
  ) &&
  step05qCss.includes('.wf-home-rail__tick::after') &&
  step05qCss.includes('transparent 100%')
) {
  pass('current rail tick extends into bridge gutter and fades out')
} else {
  fail('rail-to-hero connector missing')
}

if (
  step05qCss.includes('@media (prefers-reduced-motion: reduce)') &&
  step05qCss.includes(
    '.wf-home-kinetic-slogan__typing'
  ) &&
  step05qCss.includes('color: #ffffff !important') &&
  step05qCss.includes(
    '.wf-home-kinetic-slogan::after'
  )
) {
  pass('typing effect has an immediate reduced-motion final state')
} else {
  fail('typing reduced-motion handling missing')
}

if (
  fs.existsSync(
    path.join(
      root,
      'third_party',
      'CSS_TYPING_EFFECT_MIT.txt',
    ),
  )
) {
  pass('supplied typing reference MIT license retained')
} else {
  fail('typing reference license missing')
}


const step05rCss = read('src/styles/home.css')

if (
  step05rCss.includes('font-size: clamp(1.44rem, 1.92vw, 2.08rem)') &&
  step05rCss.includes('font-weight: 780')
) {
  pass('Korean slogan scale and weight increased')
} else {
  fail('Korean slogan scale increase missing')
}

if (
  step05rCss.includes('.wf-home-kinetic-footer__divider') &&
  step05rCss.includes('height: clamp(10px, 0.95vw, 15px)') &&
  step05rCss.includes('rgba(132, 214, 250, 0.46) 28%') &&
  step05rCss.includes('rgba(81, 183, 245, 0.58) 52%') &&
  step05rCss.includes('box-shadow:') &&
  step05rCss.includes('rgba(72, 175, 242, 0.12)')
) {
  pass('bottom divider is now a brand color field instead of a black line')
} else {
  fail('bottom divider still behaves like the old black line')
}

if (
  step05rCss.includes(
    ".wf-home-rail__link[data-state='current']"
  ) &&
  step05rCss.includes('height: clamp(10px, 0.9vw, 14px)') &&
  step05rCss.includes('rgba(110, 203, 247, 0.42) 60%') &&
  step05rCss.includes('transparent 100%')
) {
  pass('rail-to-hero gutter connector is a soft fading color field')
} else {
  fail('rail-to-hero connector is not softened into a color field')
}


const step05sCss = read('src/styles/home.css')

if (
  step05sCss.includes("STEP 05S — Dot Connector / Clean Footer") &&
  step05sCss.includes('radial-gradient(') &&
  step05sCss.includes('width: clamp(18px, 1.8vw, 28px)') &&
  step05sCss.includes('height: clamp(18px, 1.8vw, 28px)') &&
  step05sCss.includes('border-radius: 999px')
) {
  pass('active rail connector is now a compact blue dot')
} else {
  fail('active rail connector still behaves like a long bar')
}

if (
  step05sCss.includes('.wf-home-kinetic-footer__divider') &&
  step05sCss.includes('display: none !important') &&
  step05sCss.includes('background: none !important') &&
  step05sCss.includes('box-shadow: none !important')
) {
  pass('visual effect between 18-2 and Korean slogan is removed')
} else {
  fail('footer divider/effect still remains')
}

if (
  step05sCss.includes('.wf-home-kinetic-footer {') &&
  step05sCss.includes('justify-content: space-between') &&
  step05sCss.includes('grid-template-columns:') &&
  step05sCss.includes('minmax(160px, auto)') &&
  step05sCss.includes('minmax(0, auto)')
) {
  pass('footer layout simplified to term plus slogan only')
} else {
  fail('footer layout was not simplified')
}


const step05tCss = read('src/styles/home.css')

if (
  step05tCss.includes("STEP 05T — Rail State Stack / Hard-Cut Gutter") &&
  step05tCss.includes('.wf-home-rail__tick,') &&
  step05tCss.includes('display: none !important') &&
  step05tCss.includes('content: none !important')
) {
  pass('rail connector bar/dot is fully removed')
} else {
  fail('rail connector bar/dot still remains')
}

if (
  step05tCss.includes(".wf-home-rail__link[data-state='upcoming']") &&
  step05tCss.includes('var(--wf-ink-muted) 46%') &&
  step05tCss.includes(".wf-home-rail__link[data-state='current']") &&
  step05tCss.includes('linear-gradient(') &&
  step05tCss.includes("var(--wf-brand-cobalt) 100%") &&
  step05tCss.includes('transform: translateY(-9px)') &&
  step05tCss.includes(".wf-home-rail__link[data-state='visited']") &&
  step05tCss.includes('transform: translateY(-4px)')
) {
  pass('rail states now follow gray upcoming / raised gradient current / raised visited')
} else {
  fail('rail state stack styling is missing')
}

if (
  step05tCss.includes('.wf-home-hero__kinetic-side::before') &&
  step05tCss.includes('content: none !important') &&
  step05tCss.includes('.wf-home-hero__kinetic-main') &&
  step05tCss.includes('#69ccf5 0%') &&
  step05tCss.includes('!important')
) {
  pass('gutter is now a hard cut without side gradients')
} else {
  fail('gutter still has side gradient treatment')
}


const step05uCss = read('src/styles/home.css')

if (
  step05uCss.includes('STEP 05U — Reveal Lock') &&
  step05uCss.includes('@keyframes wf-home-center-clip-lock') &&
  step05uCss.includes('opacity: 1') &&
  step05uCss.includes('forwards')
) {
  pass('English entrance reveal now locks as the permanent final state')
} else {
  fail('English reveal still behaves as a temporary effect')
}

if (
  step05uCss.includes('@keyframes wf-home-ghost-retire') &&
  step05uCss.includes('calc(var(--wf-row-delay) + 820ms)') &&
  step05uCss.includes('opacity: 0')
) {
  pass('underlying ghost retires only after its reveal has completed')
} else {
  fail('ghost text can interfere with the locked reveal')
}

if (
  step05uCss.includes('@media (prefers-reduced-motion: reduce)') &&
  step05uCss.includes('display: flex !important') &&
  step05uCss.includes('clip-path:') &&
  step05uCss.includes('100% 100%') &&
  step05uCss.includes('opacity: 1 !important')
) {
  pass('reduced-motion uses the same locked final English design')
} else {
  fail('reduced-motion does not preserve the locked final design')
}


const step05vCss = read('src/styles/home.css')

if (
  step05vCss.includes('STEP 05V — Tone-on-Tone Rail / Cobalt English') &&
  step05vCss.includes(".wf-home-rail__link[data-state='current'] .wf-home-rail__number") &&
  step05vCss.includes('color: var(--wf-brand-cobalt);') &&
  step05vCss.includes(".wf-home-rail__link[data-state='current'] .wf-home-rail__label") &&
  step05vCss.includes('color: var(--wf-brand-blue);') &&
  step05vCss.includes('background: none !important')
) {
  pass('section rail now uses tone-on-tone brand colors instead of gradient text')
} else {
  fail('section rail still uses a flashy gradient treatment')
}

if (
  step05vCss.includes('.wf-home-rail__progress') &&
  step05vCss.includes('var(--wf-brand-sky) 86%') &&
  step05vCss.includes('var(--wf-brand-blue) 84%') &&
  step05vCss.includes('var(--wf-brand-cobalt) 88%')
) {
  pass('rail progress uses a restrained three-blue tone-on-tone treatment')
} else {
  fail('rail progress tone-on-tone treatment missing')
}

if (
  step05vCss.includes('.wf-home-kinetic-row__reveal {') &&
  step05vCss.includes('color: var(--wf-brand-cobalt);') &&
  step05vCss.includes('.wf-home-kinetic-row__reveal-word') &&
  step05vCss.includes('text-shadow: none;') &&
  step05vCss.includes('rgba(241, 248, 255, 0.96)')
) {
  pass('English reveal now resolves in cobalt on a cool pale card')
} else {
  fail('English reveal is not using the cobalt treatment')
}


const step05wCss = read('src/styles/home.css')

if (
  step05wCss.includes('STEP 05W — Card Width Rebalance / Slogan Emphasis') &&
  step05wCss.includes('--wf-card-trail') &&
  step05wCss.includes('width: fit-content;') &&
  step05wCss.includes('padding-right: var(--wf-card-trail);')
) {
  pass('English pale cards now follow text-led widths with restrained trailing space')
} else {
  fail('English card-width rebalance is missing')
}

if (
  step05wCss.includes(".wf-home-kinetic-row--3") &&
  step05wCss.includes('margin-right: clamp(10px, 2vw, 28px);') &&
  step05wCss.includes('justify-self: end;') &&
  step05wCss.includes('padding-right: var(--wf-card-trail);')
) {
  pass('CLUB now follows the same card-spacing rule family as the first two rows')
} else {
  fail('CLUB card spacing is not unified with the other rows')
}

if (
  step05wCss.includes('.wf-home-kinetic-slogan::before') &&
  step05wCss.includes('content: attr(aria-label);') &&
  step05wCss.includes('font-size: clamp(1.44rem, 1.95vw, 2.08rem);') &&
  step05wCss.includes('text-shadow: 0 0 18px rgba(255,255,255,0.08);')
) {
  pass('Korean slogan now has stronger visual emphasis while preserving typing')
} else {
  fail('Korean slogan emphasis is missing')
}
const stepFinalBrushCss = read('src/styles/home.css')
const stepFinalBrushPage = read('src/pages/HomePage.js')
const stepFinalBrushPackage = JSON.parse(read('package.json'))

const stepFinalBrushCssCompact =
  stepFinalBrushCss
    .toLowerCase()
    .replace(/\s+/g, '')

const stepFinalBrushComponentPath = path.join(
  root,
  'src',
  'components',
  'WinningFundBrushSignature.js',
)

const stepLegacyLogoComponentPath = path.join(
  root,
  'src',
  'components',
  'WinningFundLogoReveal.js',
)

const stepLegacyCalligraphyPath = path.join(
  root,
  'src',
  'components',
  'WinningFundCalligraphyBrush.js',
)

const stepHqBrushMaskPath = path.join(
  root,
  'src',
  'assets',
  'brand',
  'brush-stroke-mask-hq.png',
)

const stepLowResBrushMaskPath = path.join(
  root,
  'src',
  'assets',
  'brand',
  'brush-stroke-mask.png',
)

const stepFinalBrushComponent =
  fs.existsSync(stepFinalBrushComponentPath)
    ? read('src/components/WinningFundBrushSignature.js')
    : ''

if (
  stepFinalBrushPage.includes(
    "import WinningFundBrushSignature from '../components/WinningFundBrushSignature.js'"
  ) &&
  stepFinalBrushPage.includes(
    'createElement(WinningFundBrushSignature)'
  ) &&
  stepFinalBrushPage.includes(
    'wf-home-kinetic-slogan__text'
  )
) {
  pass('05ZG mounts the dedicated final brush signature component')
} else {
  fail('05ZG final brush component wiring missing')
}

if (
  fs.existsSync(stepFinalBrushComponentPath) &&
  stepFinalBrushComponent.includes(
    "className: 'wf-home-brush-signature'"
  ) &&
  stepFinalBrushComponent.includes(
    "className: 'wf-home-brush-signature__paint'"
  )
) {
  pass('05ZG brush component has single-purpose semantic ownership')
} else {
  fail('05ZG brush component contract missing')
}

if (
  !fs.existsSync(stepLegacyLogoComponentPath) &&
  !fs.existsSync(stepLegacyCalligraphyPath) &&
  !fs.existsSync(stepLowResBrushMaskPath) &&
  fs.existsSync(stepHqBrushMaskPath)
) {
  pass('05ZG removes obsolete logo/calligraphy/low-resolution brush files')
} else {
  fail('05ZG obsolete brush implementation files remain')
}

if (
  !stepFinalBrushPackage.dependencies?.['perfect-freehand']
) {
  pass('05ZG removes the unused perfect-freehand dependency')
} else {
  fail('05ZG still carries the dead perfect-freehand dependency')
}

if (
  stepFinalBrushCss.includes('STEP 05ZG') &&
  !stepFinalBrushCss.includes('STEP 05X') &&
  !stepFinalBrushCss.includes('STEP 05Y') &&
  !stepFinalBrushCss.includes('STEP 05Z — Image-Feature Freehand Brush') &&
  !stepFinalBrushCss.includes('WF BRUSH STROKE PATCH START') &&
  !stepFinalBrushCss.includes('WF HQ BRUSH TYPOGRAPHY PATCH START')
) {
  pass('05ZG collapses the brush experiment tail into one final CSS contract')
} else {
  fail('05ZG legacy brush CSS tail remains')
}

if (
  stepFinalBrushCssCompact.includes(
    '.wf-home-kinetic-slogan__text{'
  ) &&
  stepFinalBrushCssCompact.includes(
    'opacity:1!important'
  ) &&
  stepFinalBrushCssCompact.includes(
    'transform:none!important'
  ) &&
  stepFinalBrushCssCompact.includes(
    'animation:none!important'
  )
) {
  pass('05ZG Korean slogan is static from first paint')
} else {
  fail('05ZG Korean slogan still owns entrance motion')
}

if (
  stepFinalBrushCssCompact.includes(
    '@keyframeswf-home-brush-signature-draw'
  ) &&
  stepFinalBrushCssCompact.includes('540ms') &&
  stepFinalBrushCssCompact.includes('1.34s') &&
  stepFinalBrushCssCompact.includes('opacity:0.34')
) {
  pass('05ZG runs one restrained brush gesture after English settles')
} else {
  fail('05ZG brush timing/intensity contract missing')
}

if (
  stepFinalBrushCssCompact.includes(
    "url('../assets/brand/brush-stroke-mask-hq.png')"
  ) &&
  stepFinalBrushCssCompact.includes(
    'width:clamp(480px,43vw,700px)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'aspect-ratio:3072/1046'
  ) &&
  stepFinalBrushCssCompact.includes(
    'rotate(-3.5deg)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'scaley(0.54)'
  )
) {
  pass('05ZG uses the HQ mask with restrained final geometry')
} else {
  fail('05ZG HQ brush geometry contract missing')
}

if (
  stepFinalBrushCssCompact.includes('#c8f2ff0%') &&
  stepFinalBrushCssCompact.includes('#8de2fb34%') &&
  stepFinalBrushCssCompact.includes('#55c1f468%') &&
  stepFinalBrushCssCompact.includes('#2d96ec100%') &&
  !stepFinalBrushCssCompact.includes('#085ced100%')
) {
  pass('05ZG keeps brush texture visible against the cobalt hero field')
} else {
  fail('05ZG final brush color contrast contract missing')
}

if (
  stepFinalBrushCssCompact.includes(
    'clamp(3.1rem,7.15vw,7.4rem)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'clamp(2.9rem,6.7vw,6.9rem)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'clamp(2.75rem,6.15vw,6.35rem)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'clamp(1.55rem,2.05vw,2.35rem)'
  ) &&
  stepFinalBrushCssCompact.includes(
    'clamp(1.95rem,2.6vw,2.85rem)'
  )
) {
  pass('05ZG locks the reviewed final hero typography hierarchy')
} else {
  fail('05ZG final typography hierarchy missing')
}

if (
  stepFinalBrushCssCompact.includes(
    '@media(prefers-reduced-motion:reduce)'
  ) &&
  stepFinalBrushCssCompact.includes(
    '.wf-home-brush-signature__paint{'
  ) &&
  stepFinalBrushCssCompact.includes(
    'opacity:0.34!important'
  ) &&
  stepFinalBrushCssCompact.includes(
    'animation:none!important'
  )
) {
  pass('05ZG reduced-motion exposes the final static composition')
} else {
  fail('05ZG reduced-motion final composition missing')
}

if (failed) {
  console.error(
    '\nSTEP 05ZG FINAL BRUSH / MAINTENANCE verification FAILED.'
  )
  process.exit(1)
}

console.log(
  '\nSTEP 05ZG FINAL BRUSH / MAINTENANCE verification PASSED.'
)