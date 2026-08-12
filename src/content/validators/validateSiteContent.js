import { MEMBER_DATA_STATUS, RECRUITMENT_STATUS } from '../contentStates.js'

const REQUIRED_ROUTES = Object.freeze({
  HOME:'/', ABOUT:'/about', MEMBERS:'/members',
  ACTIVITIES:'/activities', RECRUITMENT:'/recruitment',
})
const CORE_IDS = Object.freeze([
  'sector-followup','classes','mock-investment-fm','reports',
])
const MEMBER_STATUSES = new Set(Object.values(MEMBER_DATA_STATUS))
const RECRUITMENT_STATUSES = new Set(Object.values(RECRUITMENT_STATUS))

function walk(value, visit) {
  visit(value)
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) walk(child, visit)
  }
}

export function validateSiteContentBundle(bundle) {
  const errors = []
  const warnings = []

  if (bundle?.siteConfig?.siteName !== 'WinningFund') {
    errors.push('siteConfig.siteName must remain WinningFund.')
  }

  for (const [id, expected] of Object.entries(REQUIRED_ROUTES)) {
    if (bundle?.siteConfig?.routeManifest?.[id] !== expected) {
      errors.push(`routeManifest.${id} must be ${expected}.`)
    }
  }

  for (const item of bundle?.navigation ?? []) {
    if (!item.id || !item.label || !item.path) {
      errors.push('Visible navigation requires id/label/path.')
    }
    if (!Object.values(REQUIRED_ROUTES).includes(item.path)) {
      errors.push(`Non-canonical navigation path: ${item.path}`)
    }
  }

  const activityIds = (bundle?.activitySections ?? []).map((x)=>x.activityId)
  const homeIds = bundle?.homeContent?.programOverviewActivityIds ?? []
  if (JSON.stringify(activityIds) !== JSON.stringify(CORE_IDS)) {
    errors.push('Canonical activity IDs/order changed.')
  }
  if (JSON.stringify(homeIds) !== JSON.stringify(CORE_IDS)) {
    errors.push('HOME program IDs/order changed.')
  }

  const activitySet = new Set(activityIds)
  for (const id of homeIds) {
    if (!activitySet.has(id)) errors.push(`HOME references missing activity: ${id}`)
  }

  const termIds = new Set()
  for (const term of bundle?.membersByTerm ?? []) {
    if (termIds.has(term.termId)) errors.push(`Duplicate termId: ${term.termId}`)
    termIds.add(term.termId)

    if (!MEMBER_STATUSES.has(term.dataStatus)) {
      errors.push(`Invalid member dataStatus: ${term.termId}`)
    }
    if (term.dataStatus === MEMBER_DATA_STATUS.KNOWN_EMPTY && !term.knownEmptyEvidence) {
      errors.push(`KNOWN_EMPTY requires evidence: ${term.termId}`)
    }

    const generation = Number(String(term.termId).split('-')[0])
    if (generation < 9 && (term.members?.length ?? 0) > 0) {
      errors.push(`Pre-9 fabricated member records prohibited: ${term.termId}`)
    }
  }

  if (!termIds.has(bundle?.siteConfig?.currentTermId)) {
    errors.push('currentTermId does not resolve.')
  }

  const current = (bundle?.membersByTerm ?? []).find(
    (term)=>term.termId === bundle?.siteConfig?.currentTermId
  )
  if (current?.termId === '18-2' && current.members?.length !== 9) {
    errors.push('18-2 must contain 9 verified current records.')
  }

  const assetIds = new Set()
  for (const asset of bundle?.assets ?? []) {
    if (!asset.assetId) errors.push('Asset missing assetId.')
    if (assetIds.has(asset.assetId)) errors.push(`Duplicate assetId: ${asset.assetId}`)
    assetIds.add(asset.assetId)
    if (/^data:/i.test(String(asset.sourcePath ?? ''))) {
      errors.push(`Embedded data URI prohibited: ${asset.assetId}`)
    }
  }

  for (const term of bundle?.membersByTerm ?? []) {
    for (const member of term.members ?? []) {
      if (member.photoAssetId && !assetIds.has(member.photoAssetId)) {
        errors.push(`Missing member asset: ${member.memberId}`)
      }
    }
  }

  const recruitment = bundle?.recruitment
  if (!recruitment || !RECRUITMENT_STATUSES.has(recruitment.status)) {
    warnings.push(
      'Recruitment authoritative status unresolved: CONTENT_UNAVAILABLE fallback required.'
    )
  }

  walk(bundle, (value) => {
    if (typeof value === 'string' && /^data:/i.test(value)) {
      errors.push('Bundle contains embedded data URI.')
    }
  })

  return { ok: errors.length === 0, errors, warnings }
}
