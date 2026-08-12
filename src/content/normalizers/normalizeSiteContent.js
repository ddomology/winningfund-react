export function normalizeToSiteContentBundle(source) {
  return {
    siteConfig: source.siteConfig ?? {},
    navigation: [...(source.navigation ?? [])]
      .filter((item) => item.visibility === 'VISIBLE')
      .sort((a, b) => a.order - b.order),
    homeContent: source.homeContent ?? null,
    aboutContent: source.aboutContent ?? null,
    organization: source.organization ?? null,
    externalActivities: source.externalActivities ?? null,
    socialLinks: source.socialLinks ?? null,
    membersByTerm: [...(source.membersByTerm ?? [])].sort((a,b)=>a.order-b.order),
    activitySections: [...(source.activitySections ?? [])].sort((a,b)=>a.order-b.order),
    reportExamples: [...(source.reportExamples ?? [])],
    clubs: [...(source.clubs ?? [])],
    recruitment: source.recruitment ?? null,
    assets: [...(source.assets ?? [])],
  }
}
