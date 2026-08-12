import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  siteContentBundle,
  siteContentValidation,
  selectHomePageData,
  selectAboutPageData,
  selectMembersPageData,
  selectActivitiesPageData,
  selectRecruitmentPageData,
  selectNavigation,
  RECRUITMENT_VIEW,
} from '../src/content/index.js'

const root = process.cwd()
let failed = false
const pass=(m)=>console.log(`PASS: ${m}`)
const fail=(m)=>{failed=true;console.error(`FAIL: ${m}`)}

for (const key of [
  'siteConfig','navigation','homeContent','aboutContent','organization',
  'externalActivities','socialLinks','membersByTerm','activitySections',
  'reportExamples','clubs','recruitment','assets',
]) {
  key in siteContentBundle ? pass(`SiteContentBundle root ${key}`) : fail(`missing root ${key}`)
}

siteContentValidation.ok
  ? pass('bundle validation has zero blocking errors')
  : siteContentValidation.errors.forEach(fail)

siteContentValidation.warnings.some((w)=>w.includes('Recruitment authoritative status unresolved'))
  ? pass('recruitment unresolved remains explicit warning')
  : fail('recruitment unresolved warning missing')

const nav=selectNavigation(siteContentBundle)
nav.map((x)=>x.path).join('|')==='/'+'|/about|/members|/activities|/recruitment'
  ? pass('navigation resolves canonical five routes')
  : fail('navigation route order mismatch')

const canonical=['sector-followup','classes','mock-investment-fm','reports']
const home=selectHomePageData(siteContentBundle)
home.programOverview.map((x)=>x?.activityId).join('|')===canonical.join('|')
  ? pass('HOME program projection joins canonical activity records')
  : fail('HOME duplicated/broke canonical activity references')

home.hero.englishIdentity==='INVESTMENT AND ECONOMICS CLUB' &&
home.hero.koreanSlogan==='우리는 늘 최선의 선택을 연구합니다'
  ? pass('approved HOME hero copy preserved')
  : fail('approved HOME hero copy changed')

const members=selectMembersPageData(siteContentBundle)
const current=members.terms.find((x)=>x.termId===members.currentTermId)
members.currentTermId==='18-2' && current?.members?.length===9
  ? pass('18-2 current term + 9 verified members preserved')
  : fail('18-2 current member baseline invalid')

const pre9=members.terms.filter((x)=>Number(x.termId.split('-')[0])<9)
pre9.every((x)=>x.dataStatus==='UNAVAILABLE' && x.members.length===0)
  ? pass('pre-9 terms remain UNAVAILABLE with no fabricated members')
  : fail('pre-9 historical integrity violated')

const activities=selectActivitiesPageData(siteContentBundle)
activities.activitySections.map((x)=>x.activityId).join('|')===canonical.join('|')
  ? pass('canonical activity IDs/order preserved')
  : fail('canonical activity IDs/order invalid')

for (const name of ['자하부공','위닝홀미팅','산그좋','위닝스런']) {
  activities.clubs.some((x)=>x.officialName===name)
    ? pass(`approved club ${name}`)
    : fail(`missing approved club ${name}`)
}

const recruitment=selectRecruitmentPageData(siteContentBundle)
recruitment.view===RECRUITMENT_VIEW.CONTENT_UNAVAILABLE
  ? pass('unresolved recruitment -> CONTENT_UNAVAILABLE')
  : fail(`unexpected recruitment view ${recruitment.view}`)

recruitment.record?.period?.startAt==='2026-08-03' &&
recruitment.record?.period?.endAt==='2026-08-21'
  ? pass('approved recruitment period preserved')
  : fail('approved recruitment period missing')

recruitment.record?.applicationUrl===null &&
recruitment.record?.contact===null &&
recruitment.record?.posterAssetId===null
  ? pass('recruitment URL/contact/poster remain unfabricated')
  : fail('recruitment unresolved values fabricated')

activities.reportExamples.every((x)=>x.assetId===null && x.unresolvedKey==='U-007')
  ? pass('U-007 report assets explicitly unresolved')
  : fail('U-007 report assets fabricated')

const fm=activities.activitySections.find((x)=>x.activityId==='mock-investment-fm')
fm?.semanticFacts?.tradingJournalAssetId===null &&
fm?.semanticFacts?.unresolvedKey==='U-006'
  ? pass('U-006 FM journal explicitly unresolved')
  : fail('U-006 FM journal silently filled')

siteContentBundle.assets.length===10 &&
siteContentBundle.assets.every((x)=>x.assetId && x.sourcePath && !String(x.sourcePath).startsWith('data:'))
  ? pass('10 managed asset refs, no embedded base64')
  : fail('asset registry invalid')

const pageDir=path.join(root,'src','pages')
for (const entry of fs.readdirSync(pageDir,{withFileTypes:true}).filter((x)=>x.isFile()&&/Page\.js$/.test(x.name))) {
  const text=fs.readFileSync(path.join(pageDir,entry.name),'utf8');
  /content\/static|staticSiteSource|assetRegistry/.test(text)
    ? fail(`${entry.name} imports physical source directly`)
    : pass(`${entry.name} does not know physical source`)
}

for (const fn of [
  selectHomePageData,selectAboutPageData,selectMembersPageData,
  selectActivitiesPageData,selectRecruitmentPageData,
]) {
  typeof fn==='function' ? pass(`page selector exported: ${fn.name}`) : fail('page selector missing')
}

if (failed) {
  console.error('\nSTEP 03 content boundary verification FAILED.')
  process.exit(1)
}
console.log('\nSTEP 03 content boundary verification PASSED.')
