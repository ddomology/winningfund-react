import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  siteContentBundle,
  selectNavigation,
} from '../src/content/index.js'

const root = process.cwd()
let failed = false
const pass = (m) => console.log(`PASS: ${m}`)
const fail = (m) => {
  failed = true
  console.error(`FAIL: ${m}`)
}
const read = (rel) =>
  fs.readFileSync(path.join(root, rel), 'utf8')

const paths = selectNavigation(siteContentBundle).map(
  (item) => item.path,
)

if (
  JSON.stringify(paths) ===
  JSON.stringify([
    '/',
    '/about',
    '/members',
    '/activities',
    '/recruitment',
  ])
) {
  pass('normalized navigation resolves five canonical routes')
} else {
  fail(`navigation mismatch: ${paths.join(', ')}`)
}

const app = read('src/app/App.js')

for (const marker of [
  'index: true',
  "path: 'about'",
  "path: 'members'",
  "path: 'activities'",
  "path: 'recruitment'",
  "path: '*'",
]) {
  if (app.includes(marker)) {
    pass(`App route contains ${marker}`)
  } else {
    fail(`App route missing ${marker}`)
  }
}

const shell = read('src/app/AppShell.js')

for (const [label, pattern] of [
  ['Header', /createElement\(\s*Header/],
  ['PageTransition', /createElement\(\s*PageTransition/],
  ['Outlet', /createElement\(\s*Outlet/],
  ['Footer', /createElement\(\s*Footer/],
]) {
  if (pattern.test(shell)) {
    pass(`AppShell contains ${label}`)
  } else {
    fail(`AppShell missing ${label}`)
  }
}

if (
  shell.includes('selectNavigation') &&
  shell.includes('selectSiteConfig')
) {
  pass('AppShell owns normalized shared shell data composition')
} else {
  fail('AppShell does not supply normalized shell data')
}

const desktop = read('src/components/DesktopNav.js')
const mobile = read('src/components/MobileNav.js')

for (const [name, text] of [
  ['DesktopNav', desktop],
  ['MobileNav', mobile],
]) {
  if (
    text.includes('items = []') &&
    text.includes('NavLink')
  ) {
    pass(`${name} receives shared items by props and uses NavLink`)
  } else {
    fail(`${name} prop/navigation contract incomplete`)
  }

  if (
    !/siteContentBundle|content\/static|staticSiteSource/.test(text)
  ) {
    pass(`${name} does not acquire content itself`)
  } else {
    fail(`${name} directly acquires content`)
  }
}

if (
  mobile.includes('[location.pathname, location.hash]') &&
  mobile.includes('setMenuOpen(false)')
) {
  pass('MobileNav closes on route/hash commit')
} else {
  fail('MobileNav close-on-navigation contract missing')
}

const sourceFiles = []

function collect(dir) {
  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      collect(full)
    } else if (/\.(js|jsx|ts|tsx)$/i.test(entry.name)) {
      sourceFiles.push(full)
    }
  }
}

collect(path.join(root, 'src'))

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8')

  for (const pattern of [
    /window\.location\.href/,
    /window\.location\.assign/,
    /window\.location\.replace/,
    /history\.pushState/,
    /history\.replaceState/,
  ]) {
    if (pattern.test(text)) {
      fail(
        `manual navigation/history mutation: ${
          path.relative(root, file)
        }`,
      )
    }
  }
}

if (!failed) {
  pass('no manual window.location/history mutation')
}

if (failed) {
  console.error(
    '\nSTEP 04 route/AppShell regression verification FAILED.',
  )
  process.exit(1)
}

console.log(
  '\nSTEP 04 route/AppShell regression verification PASSED.',
)
