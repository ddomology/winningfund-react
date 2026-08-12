import { createElement } from 'react'
import MemberCard from './MemberCard.js'

export default function MemberGrid({
  members = [],
  generationContext,
  assetResolver = () => null,
  layoutVariant = 'default',
}) {
  if (members.length === 0) return null

  return createElement(
    'div',
    {
      className:
        `wf-member-grid wf-member-grid--${layoutVariant}`,
      'data-generation-context': generationContext || undefined,
    },
    ...members.map((member) =>
      createElement(MemberCard, {
        key: member.memberId ?? member.name,
        member,
        assetRef: assetResolver(member.photoAssetId),
      }),
    ),
  )
}
