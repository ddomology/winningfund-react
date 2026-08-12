import { createElement } from 'react'
import ResponsiveMedia from './ResponsiveMedia.js'

export default function MemberCard({
  member,
  assetRef = null,
}) {
  if (!member?.name) return null

  const media = assetRef
    ? createElement(ResponsiveMedia, {
        assetRef,
        altText: `${member.name} 프로필 사진`,
        aspectRatio: 1,
        loadingPriority: 'LAZY',
        visualVariant: 'member',
      })
    : createElement(
        'div',
        {
          className: 'wf-member-card__media-fallback',
          'aria-hidden': 'true',
        },
      )

  return createElement(
    'article',
    {
      className: 'wf-member-card',
      'data-member-id': member.memberId,
    },
    media,
    createElement(
      'div',
      { className: 'wf-member-card__body' },
      createElement(
        'h3',
        { className: 'wf-member-card__name' },
        member.name,
      ),
      member.role
        ? createElement(
            'p',
            { className: 'wf-member-card__role' },
            member.role,
          )
        : null,
    ),
  )
}
