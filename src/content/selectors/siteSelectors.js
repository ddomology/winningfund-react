import { RECRUITMENT_STATUS, RECRUITMENT_VIEW } from '../contentStates.js'

export const selectSiteConfig = (bundle) => bundle.siteConfig
export const selectNavigation = (bundle) => bundle.navigation

export function selectHomePageData(bundle) {
  const map = new Map(
    bundle.activitySections.map((activity) => [
      activity.activityId,
      activity,
    ]),
  )

  const programOverview =
    bundle.homeContent.programOverviewActivityIds.map(
      (activityId) => {
        const activity = map.get(activityId)

        if (!activity) return null

        return {
          ...activity,
          homeLabel: activity.homeLabel ?? activity.title,
          targetRoute: '/activities',
          targetHash: `#${activity.activityId}`,
          target: `/activities#${activity.activityId}`,
        }
      },
    )

  return {
    ...bundle.homeContent,
    programOverview,
  }
}

export function selectAboutPageData(bundle) {
  return {
    aboutContent: bundle.aboutContent,
    organization: bundle.organization,
    externalActivities: bundle.externalActivities,
    socialLinks: bundle.socialLinks,
  }
}

export function selectMembersPageData(bundle) {
  return {
    currentTermId: bundle.siteConfig.currentTermId,
    terms: bundle.membersByTerm,
  }
}

export function selectActivitiesPageData(bundle) {
  return {
    activitySections: bundle.activitySections,
    reportExamples: bundle.reportExamples,
    clubs: bundle.clubs,
  }
}

export function resolveRecruitmentView(record) {
  if (!record || !Object.values(RECRUITMENT_STATUS).includes(record.status)) {
    return RECRUITMENT_VIEW.CONTENT_UNAVAILABLE
  }
  return record.status
}

export function selectRecruitmentPageData(bundle) {
  return {
    record: bundle.recruitment,
    view: resolveRecruitmentView(bundle.recruitment),
  }
}

export function selectAssetById(bundle, assetId) {
  if (!assetId) return null
  return bundle.assets.find((asset)=>asset.assetId === assetId) ?? null
}
