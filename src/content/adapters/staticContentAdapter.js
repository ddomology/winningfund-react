export function adaptStaticContentSource(source) {
  const routes = source?.siteConfig?.routeManifest ?? {}
  return {
    sourceType: source?.sourceType ?? 'UNKNOWN',
    sourceVersion: source?.sourceVersion ?? null,
    siteConfig: { ...(source?.siteConfig ?? {}) },
    navigation: [...(source?.navigation ?? [])].map((item) => ({
      ...item,
      path: routes[item.routeId] ?? null,
    })),
    homeContent: source?.homeContent ?? null,
    aboutContent: source?.aboutContent ?? null,
    organization: source?.organization ?? null,
    externalActivities: source?.externalActivities ?? null,
    socialLinks: source?.socialLinks ?? null,
    membersByTerm: source?.membersByTerm ?? [],
    activitySections: source?.activitySections ?? [],
    reportExamples: source?.reportExamples ?? [],
    clubs: source?.clubs ?? [],
    recruitment: source?.recruitment ?? null,
    assets: source?.assets ?? [],
  }
}
