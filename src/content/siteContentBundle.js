import { STATIC_SITE_SOURCE } from './static/staticSiteSource.js'
import { adaptStaticContentSource } from './adapters/staticContentAdapter.js'
import { normalizeToSiteContentBundle } from './normalizers/normalizeSiteContent.js'
import { validateSiteContentBundle } from './validators/validateSiteContent.js'

const adapted = adaptStaticContentSource(STATIC_SITE_SOURCE)
const bundle = normalizeToSiteContentBundle(adapted)
const validation = validateSiteContentBundle(bundle)

if (!validation.ok) {
  throw new Error(
    `WinningFund content validation failed:\n${validation.errors.join('\n')}`
  )
}

export const siteContentBundle = Object.freeze(bundle)
export const siteContentValidation = Object.freeze(validation)
