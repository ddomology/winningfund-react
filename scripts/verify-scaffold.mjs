import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root=process.cwd()
let failed=false
const pass=(m)=>console.log(`PASS: ${m}`)
const fail=(m)=>{failed=true;console.error(`FAIL: ${m}`)}
const exists=(r)=>fs.existsSync(path.join(root,r))

for (const rel of [
  'index.html','package.json','vite.config.js','src/main.js','src/app/App.js',
  'src/app/AppShell.js','src/assets/brand/winningfund-logo.png',
  'src/content/siteContentBundle.js','src/content/index.js',
]) exists(rel)?pass(`required file ${rel}`):fail(`missing ${rel}`)

for (const rel of ['src/app','src/pages','src/components','src/content','src/assets','src/styles','src/tests']) {
  exists(rel)?pass(`responsibility directory ${rel}`):fail(`missing directory ${rel}`)
}

const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
const installed={...(pkg.dependencies??{}),...(pkg.devDependencies??{})}
for (const [name,version] of Object.entries({
  react:'19.2.8','react-dom':'19.2.8','react-router':'7.18.2',
  '@vitejs/plugin-react':'6.0.4',vite:'8.1.5',
})) installed[name]===version?pass(`${name}@${version}`):fail(`unexpected ${name}`)

for (const forbidden of ['redux','@reduxjs/toolkit','next','express','axios','framer-motion','gsap']) {
  if(installed[forbidden]) fail(`unnecessary dependency ${forbidden}`)
}

const homePath=path.join(root,'src','pages','HomePage.js')
if(!fs.existsSync(homePath)){
  fail('missing HomePage.js')
}else{
  const homeText=fs.readFileSync(homePath,'utf8')
  !homeText.includes('RoutePlaceholder') && homeText.includes('selectHomePageData')
    ? pass('HomePage.js implemented through normalized HOME selector')
    : fail('HomePage.js STEP 05 implementation missing')
}

const aboutPath=path.join(root,'src','pages','AboutPage.js')
if(!fs.existsSync(aboutPath)){
  fail('missing AboutPage.js')
}else{
  const aboutText=fs.readFileSync(aboutPath,'utf8')
  !aboutText.includes('RoutePlaceholder') &&
  aboutText.includes('selectAboutPageData') &&
  aboutText.includes("className: 'wf-about'")
    ? pass('AboutPage.js implemented through normalized ABOUT selector')
    : fail('AboutPage.js ABOUT implementation missing')
}

const membersPath=path.join(root,'src','pages','MembersPage.js')
if(!fs.existsSync(membersPath)){
  fail('missing MembersPage.js')
}else{
  const membersText=fs.readFileSync(membersPath,'utf8')
  !membersText.includes('RoutePlaceholder') &&
  membersText.includes('selectMembersPageData') &&
  membersText.includes("className: 'wf-members'")
    ? pass('MembersPage.js implemented through normalized MEMBERS selector')
    : fail('MembersPage.js MEMBERS implementation missing')
}

for (const page of ['ActivitiesPage.js','RecruitmentPage.js']) {
  const full=path.join(root,'src','pages',page)
  if(!fs.existsSync(full)){fail(`missing ${page}`);continue}
  fs.readFileSync(full,'utf8').includes('RoutePlaceholder')
    ? pass(`${page} remains placeholder-only`)
    : fail(`${page} gained business UI before its stage`)
}

const memberDir=path.join(root,'src','assets','members','18-2')
const portraits=fs.existsSync(memberDir)
  ? fs.readdirSync(memberDir).filter((n)=>/\.jpe?g$/i.test(n))
  : []
portraits.length===9?pass('9 canonical 18-2 portraits'):fail(`portrait count ${portraits.length}`)

if(failed){console.error('\nSTEP 03 scaffold invariant verification FAILED.');process.exit(1)}
console.log('\nSTEP 03 scaffold invariant verification PASSED.')
