import { createElement } from 'react'
import Section from './Section.js'
import SectionHeader from './SectionHeader.js'

export default function ActivitySection({
  activity,
  summary,
  children,
  headingLevel = 2,
}) {
  if (!activity?.activityId || !activity?.title) {
    return null
  }

  return createElement(
    Section,
    {
      sectionId: activity.activityId,
      semanticLabel: activity.title,
      className: 'wf-activity-section',
    },
    createElement(SectionHeader, {
      eyebrow: activity.programNumber
        ? `PROGRAM ${activity.programNumber}`
        : undefined,
      title: activity.title,
      description: summary,
      headingLevel,
      id: `${activity.activityId}-title`,
    }),
    children || null,
  )
}
