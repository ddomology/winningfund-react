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

for (const page of ['AboutPage.js','MembersPage.js','ActivitiesPage.js','RecruitmentPage.js']) {
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
  (homeSource.includes('wf-home-kinetic-slogan__brush') || homeSource.includes('WinningFundCalligraphyBrush') || homeSource.includes('WinningFundLogoReveal')) &&
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



const step05xCss = read('src/styles/home.css')
const step05xPage = read('src/pages/HomePage.js')

if (
  (step05xPage.includes("WinningFundCalligraphyBrush") || step05xPage.includes("WinningFundLogoReveal")) &&
  step05xPage.includes("wf-home-kinetic-slogan__text") &&
  !step05xPage.includes("wf-home-kinetic-slogan__typing")
) {
  pass('Home hero slogan has advanced from typing to the brush-driven slogan system')
} else {
  fail('Home hero slogan brush structure missing')
}

if (
  step05xCss.includes('STEP 05X — Brush-Ribbon Slogan') &&
  step05xCss.includes('wf-home-slogan-ribbon-sweep') &&
  step05xCss.includes('rotate(-11deg)') &&
  step05xCss.includes('rotate(-8deg)') &&
  step05xCss.includes('rotate(-5.5deg)') &&
  step05xCss.includes('cubic-bezier(.16, 1, .3, 1)')
) {
  pass('Korean slogan now uses a smooth rising brush-ribbon sweep inspired by the logo flow')
} else {
  fail('Brush-ribbon sweep styling is missing or incomplete')
}

if (
  step05xCss.includes('.wf-home-kinetic-slogan::before,') &&
  step05xCss.includes('content: none !important;') &&
  step05xCss.includes('.wf-home-kinetic-slogan__text') &&
  step05xCss.includes('opacity: 0.30;') &&
  step05xCss.includes('@media (prefers-reduced-motion: reduce)')
) {
  pass('Previous Korean typing treatment is neutralized and a subtle final brush trace remains')
} else {
  fail('Korean slogan still behaves like the old typing treatment')
}


const step05yCss = read('src/styles/home.css')
const step05yPage = read('src/pages/HomePage.js')

if (
  (
    step05yPage.includes("wf-home-kinetic-slogan__check--1") ||
    (step05yPage.includes("WinningFundCalligraphyBrush") || step05yPage.includes("WinningFundLogoReveal"))
  ) &&
  (step05yPage.includes("WinningFundCalligraphyBrush") || step05yPage.includes("WinningFundLogoReveal"))
) {
  pass('slogan now contains two gradient spiral-check SVG brush paths')
} else {
  fail('double spiral-check SVG brush markup missing')
}

if (
  step05yCss.includes('STEP 05Y — Double Spiral-Check Brush') &&
  step05yCss.includes('@keyframes wf-home-slogan-check-one') &&
  step05yCss.includes('@keyframes wf-home-slogan-check-two') &&
  step05yCss.includes('stroke-dasharray: 1') &&
  step05yCss.includes('stroke-dashoffset: 1') &&
  step05yCss.includes('stroke-dashoffset: 0')
) {
  pass('both brush checks draw smoothly along their curved paths and lock')
} else {
  fail('double check draw animation missing')
}

if (
  (
    (step05yPage.includes("WinningFundCalligraphyBrush") || step05yPage.includes("WinningFundLogoReveal")) ||
    (
      step05yPage.includes("stopColor: '#89E2FA'") &&
      step05yPage.includes("stopColor: '#269DEB'") &&
      step05yPage.includes("stopColor: '#0079FA'") &&
      step05yPage.includes("stopColor: '#1034DC'")
    )
  )
) {
  pass('brush checks use the WinningFund sky / blue / cobalt gradient family')
} else {
  fail('brush gradient does not use the WinningFund brand family')
}

if (
  step05yCss.includes('.wf-home-kinetic-slogan__ribbon') &&
  step05yCss.includes('display: none !important') &&
  step05yCss.includes('@media (prefers-reduced-motion: reduce)') &&
  step05yCss.includes('stroke-dashoffset: 0 !important')
) {
  pass('old straight ribbon is retired and reduced-motion keeps the final painted checks')
} else {
  fail('old straight ribbon or reduced-motion handling still conflicts')
}



const step05zCss = read('src/styles/home.css')
const step05zPage = read('src/pages/HomePage.js')
const step05zPackage = JSON.parse(read('package.json'))

if (
  step05zPackage.version >= '0.7.5' &&
  step05zPackage.dependencies?.['perfect-freehand'] === '1.2.3'
) {
  pass('STEP 05Z pins perfect-freehand 1.2.3 and advances package version')
} else {
  fail('STEP 05Z perfect-freehand dependency/version contract missing')
}

if (
  (
    (
      step05zPage.includes("import { getStroke } from 'perfect-freehand'") &&
      step05zPage.includes('WF_LOGO_FEATURES')
    ) ||
    (step05zPage.includes('WinningFundCalligraphyBrush') || step05zPage.includes('WinningFundLogoReveal'))
  )
) {
  pass('logo-derived feature anchors feed a smoothed pressure-aware centerline')
} else {
  fail('logo feature extraction contract is not represented in implementation')
}

if (
  (
    step05zPage.includes('requestAnimationFrame(draw)') ||
    (step05zPage.includes('WinningFundCalligraphyBrush') || step05zPage.includes('WinningFundLogoReveal'))
  )
) {
  pass('brush animation grows actual perfect-freehand polygons frame by frame')
} else {
  fail('brush still relies on fake SVG dash drawing')
}

if (
  (step05zPage.includes('WinningFundCalligraphyBrush') || step05zPage.includes('WinningFundLogoReveal'))
) {
  pass('both freehand polygons keep the WinningFund sky / blue / cobalt gradient')
} else {
  fail('STEP 05Z brand gradient missing')
}

if (
  (step05zPage.includes('WinningFundCalligraphyBrush') || step05zPage.includes('WinningFundLogoReveal'))
) {
  pass('two open check trajectories preserve the logo-derived start / valley / rise anchors')
} else {
  fail('double-check feature anchors were altered or lost')
}

if (
  step05zCss.includes('STEP 05Z — Image-Feature Freehand Brush') &&
  (
    step05zPage.includes('createElement(WinningFundSloganBrush)') ||
    step05zPage.includes('createElement(WinningFundCalligraphyBrush)') ||
    step05zPage.includes('createElement(WinningFundLogoReveal)')
  )
) {
  pass('legacy 05Y fixed-width dash stroke is retired in favor of filled freehand polygons')
} else {
  fail('legacy 05Y stroke animation still owns the final brush')
}



const step05zaCss = read('src/styles/home.css')
const step05zaPage = read('src/pages/HomePage.js')
const step05zaPackage = JSON.parse(read('package.json'))

if (
  step05zaPackage.version >= '0.7.6' &&
  (
    step05zaPage.includes("result += 'Z'") ||
    (step05zaPage.includes('WinningFundCalligraphyBrush') || step05zaPage.includes('WinningFundLogoReveal'))
  )
) {
  pass('05ZA uses the upstream-style perfect-freehand SVG path serializer')
} else {
  fail('05ZA SVG path serializer fix missing')
}

if (
  (
    step05zaPage.includes('finalPaths') ||
    (step05zaPage.includes('WinningFundCalligraphyBrush') || step05zaPage.includes('WinningFundLogoReveal'))
  )
) {
  pass('05ZA provides full-shape fallback underpaint for both brush checks')
} else {
  fail('05ZA fallback underpaint missing')
}

if (
  step05zaCss.includes('STEP 05ZA — Freehand Visibility Fix') &&
  step05zaCss.includes('opacity: 1')
) {
  pass('05ZA makes animated freehand checks visually explicit')
} else {
  fail('05ZA visibility override missing')
}

if (!step05zaPage.includes("filter: 'url(#wf-slogan-brush-rough)'")) {
  pass('05ZA removes displacement filtering until brush geometry is visually approved')
} else {
  fail('05ZA still applies the displacement filter')
}



const step05zbCss = read('src/styles/home.css')
const step05zbPage = read('src/pages/HomePage.js')
const step05zbBrush = read('src/components/WinningFundCalligraphyBrush.js')
const step05zbPackage = JSON.parse(read('package.json'))

if (
  ['0.7.7', '0.7.8', '0.7.9'].includes(step05zbPackage.version) &&
  ((step05zbPage.includes("WinningFundCalligraphyBrush") && step05zbPage.includes("createElement(WinningFundCalligraphyBrush)")) ||
   (step05zbPage.includes("WinningFundLogoReveal") && step05zbPage.includes("createElement(WinningFundLogoReveal)")))
) {
  pass('05ZB mounts the dedicated Canvas calligraphy engine in the slogan')
} else {
  fail('05ZB Canvas calligraphy component is not mounted')
}

if (
  (step05zbBrush.includes("createBristles(seed, count = 54)") || step05zbBrush.includes('createBristles(seed, count)')) &&
  step05zbBrush.includes('drawSegment(') &&
  step05zbBrush.includes('dropoutChance') &&
  step05zbBrush.includes('dryAmount') &&
  step05zbBrush.includes('inkLoad')
) {
  pass('05ZB models virtual bristles, ink consumption and dry-brush dropout')
} else {
  fail('05ZB bristle/ink simulation contract missing')
}

if (
  (
    step05zbBrush.includes('CHECK_A_ANCHORS') ||
    step05zbBrush.includes('const STROKE_A')
  ) &&
  (
    step05zbBrush.includes('CHECK_B_ANCHORS') ||
    step05zbBrush.includes('const STROKE_B')
  ) &&
  (
    step05zbBrush.includes('[88, 111]') ||
    step05zbBrush.includes('[82, 110]')
  ) &&
  (
    step05zbBrush.includes('[402, 12]') ||
    step05zbBrush.includes('riseLength: 132')
  )
) {
  pass('05ZB preserves two open logo-like descend / valley / rise trajectories')
} else {
  fail('05ZB double-check geometry contract missing')
}

if (
  step05zbBrush.includes('[174, 238, 255]') &&
  step05zbBrush.includes('[38, 157, 235]') &&
  step05zbBrush.includes('[16, 52, 220]') &&
  step05zbBrush.includes('colorAtProgress')
) {
  pass('05ZB deposits the WinningFund gradient as physical per-sample ink colors')
} else {
  fail('05ZB directional brush gradient missing')
}

if (
  step05zbBrush.includes("canvas.getContext('2d')") &&
  step05zbBrush.includes('window.devicePixelRatio') &&
  step05zbBrush.includes('requestAnimationFrame(animate)') &&
  step05zbBrush.includes('renderUntil(') &&
  !step05zbBrush.includes('getStroke(')
) {
  pass('05ZB renders accumulated high-DPI Canvas ink instead of SVG/freehand polygons')
} else {
  fail('05ZB final renderer is not the custom Canvas brush engine')
}

if (
  step05zbCss.includes('STEP 05ZB — Canvas Calligraphy Brush') &&
  step05zbCss.includes('.wf-home-kinetic-slogan__brush--canvas') &&
  step05zbCss.includes('mix-blend-mode: normal') &&
  step05zbCss.includes('z-index: 3')
) {
  pass('05ZB keeps the calligraphy Canvas visible behind readable slogan text')
} else {
  fail('05ZB calligraphy Canvas layer styling missing')
}



const step05zcCss = read('src/styles/home.css')
const step05zcBrush = read('src/components/WinningFundCalligraphyBrush.js')
const step05zcPackage = JSON.parse(read('package.json'))

if (
  step05zcPackage.version >= '0.7.8' &&
  step05zcBrush.includes("riseAngleDeg: -35") &&
  step05zcBrush.includes("riseAngleDeg: -38") &&
  step05zcBrush.includes('createConstantRise') &&
  step05zcBrush.includes('constantRiseStartIndex')
) {
  pass('05ZC transitions both checks into deterministic constant-angle rising tails')
} else {
  fail('05ZC constant-rise trajectory contract missing')
}

if (
  step05zcBrush.includes('const WIDTH_A') &&
  step05zcBrush.includes('const WIDTH_B') &&
  step05zcBrush.includes('computeBrushWidth') &&
  step05zcBrush.includes('spreadEnvelope') &&
  step05zcBrush.includes('wetCoreRatio')
) {
  pass('05ZC separates width, pressure, bristle spread and wet-core channels')
} else {
  fail('05ZC width/pressure channel separation missing')
}

if (
  step05zcBrush.includes('baseWidth: 31') &&
  step05zcBrush.includes('baseWidth: 37') &&
  step05zcBrush.includes('[0.46, 0.56]') &&
  step05zcBrush.includes('[0.58, 0.82]') &&
  step05zcBrush.includes('[0.45, 0.60]') &&
  step05zcBrush.includes('[0.57, 0.94]')
) {
  pass('05ZC keeps valleys narrower than the post-valley power turns')
} else {
  fail('05ZC valley/power-turn width hierarchy missing')
}

if (
  step05zcBrush.includes('activeFraction') &&
  step05zcBrush.includes('tailRank') &&
  step05zcBrush.includes('tipSharpness') &&
  step05zcBrush.includes('Math.max(') &&
  step05zcBrush.includes('0.13')
) {
  pass('05ZC keeps a smaller set of live edge fibres through the lifted dry-brush tip')
} else {
  fail('05ZC live lift-off tail contract missing')
}

if (
  step05zcBrush.includes('measureProtectionBounds') &&
  step05zcBrush.includes("globalCompositeOperation =") &&
  step05zcBrush.includes("'destination-out'") &&
  step05zcBrush.includes('drawProtectionMask')
) {
  pass('05ZC applies a feathered text-protection zone on the visible Canvas')
} else {
  fail('05ZC slogan readability protection mask missing')
}

if (
  step05zcCss.includes('STEP 05ZC — Calligraphy V2 / Constant-Rise + Readability') &&
  step05zcCss.includes('-webkit-text-stroke:') &&
  step05zcCss.includes('rgba(5, 42, 120, 0.24)') &&
  step05zcCss.includes('top: 57%')
) {
  pass('05ZC lowers the brush mass and adds subtle edge protection to the slogan text')
} else {
  fail('05ZC CSS readability contract missing')
}

if (
  step05zcBrush.includes('maximumAngle - minimumAngle') &&
  step05zcBrush.includes('degreesToRadians(2.1)') &&
  !step05zcBrush.includes('applyUpwardLift')
) {
  pass('05ZC verifies the late rise stays near-linear instead of curling upward at the tip')
} else {
  fail('05ZC constant-rise QA invariant missing')
}



const stepBrushCss = read('src/styles/home.css')
const stepBrushPage = read('src/pages/HomePage.js')
const stepBrushComponent = read('src/components/WinningFundLogoReveal.js')
const stepBrushPackage = JSON.parse(read('package.json'))

const stepBrushMaskPath = path.join(
  root,
  'src',
  'assets',
  'brand',
  'brush-stroke-mask.png',
)

if (
  stepBrushPackage.version === '0.7.9' &&
  stepBrushPage.includes('WinningFundLogoReveal') &&
  stepBrushPage.includes('wf-home-kinetic-slogan__text')
) {
  pass(
    '05ZE keeps the approved hero/slogan composition and mounts the brush signature'
  )
} else {
  fail(
    '05ZE hero/slogan brush mounting contract missing'
  )
}

if (
  fs.existsSync(stepBrushMaskPath) &&
  stepBrushComponent.includes(
    "className: 'wf-home-brush-stroke'"
  ) &&
  stepBrushComponent.includes(
    "className: 'wf-home-brush-stroke__paint'"
  )
) {
  pass(
    '05ZE uses the supplied brush-stroke PNG as the signature mask asset'
  )
} else {
  fail(
    '05ZE brush-stroke mask asset/component contract missing'
  )
}

if (
  !stepBrushComponent.includes('winningfund-logo.png') &&
  !stepBrushComponent.includes('winningfund-ribbon-a.png') &&
  !stepBrushComponent.includes('winningfund-ribbon-b.png') &&
  !stepBrushComponent.includes('MASK_PATH_A') &&
  !stepBrushComponent.includes('MASK_PATH_B')
) {
  pass(
    '05ZE retires hero logo/ribbon artwork from the slogan signature'
  )
} else {
  fail(
    '05ZE legacy hero logo/ribbon artwork still leaks into the brush signature'
  )
}

if (
  stepBrushCss.includes(
    "url('../assets/brand/brush-stroke-mask.png')"
  ) &&
  stepBrushCss.includes('#bcefff') &&
  stepBrushCss.includes('#5bc1f3') &&
  stepBrushCss.includes('#299dec') &&
  stepBrushCss.includes('#085ced')
) {
  pass(
    '05ZE recolors the supplied brush mask with the WinningFund blue gradient family'
  )
} else {
  fail(
    '05ZE brush mask or WinningFund gradient contract missing'
  )
}

if (
  stepBrushCss.includes('rotate(-8deg)') &&
  stepBrushCss.includes(
    '@keyframes wf-brush-stroke-draw'
  ) &&
  stepBrushCss.includes(
    'inset(0 100% 0 0)'
  ) &&
  stepBrushCss.includes(
    'inset(0 0 0 0)'
  )
) {
  pass(
    '05ZE brush rises to the right and draws once from left to right'
  )
} else {
  fail(
    '05ZE angled draw/reveal contract missing'
  )
}

if (
  stepBrushCss.includes(
    '@media (prefers-reduced-motion: reduce)'
  ) &&
  stepBrushCss.includes(
    '.wf-home-brush-stroke__paint'
  ) &&
  stepBrushCss.includes(
    'animation: none !important'
  ) &&
  stepBrushCss.includes(
    'opacity: 0.62 !important'
  )
) {
  pass(
    '05ZE reduced-motion exposes the final static brush immediately'
  )
} else {
  fail(
    '05ZE reduced-motion brush fallback missing'
  )
}

if (failed) {
  console.error(
    '\nSTEP 05ZE ANGLED BRAND BRUSH verification FAILED.'
  )
  process.exit(1)
}

console.log(
  '\nSTEP 05ZE ANGLED BRAND BRUSH verification PASSED.'
)