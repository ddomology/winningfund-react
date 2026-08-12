import { createElement } from 'react'

export default function ClubCard({ club }) {
  if (!club?.clubId || !club?.officialName) return null

  return createElement(
    'article',
    {
      className: 'wf-club-card',
      'data-club-id': club.clubId,
    },
    createElement(
      'p',
      { className: 'wf-club-card__category' },
      club.category,
    ),
    createElement(
      'h3',
      { className: 'wf-club-card__title' },
      club.officialName,
    ),
    club.activity
      ? createElement(
          'p',
          { className: 'wf-club-card__activity' },
          club.activity,
        )
      : null,
  )
}
