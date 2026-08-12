import {
  createElement,
  useMemo,
  useState,
} from 'react'

function normalizeIds(ids) {
  return new Set(Array.isArray(ids) ? ids : [])
}

export default function Accordion({
  items = [],
  itemIdResolver = (item) => item.id,
  defaultOpenIds = [],
  openIds,
  onOpenIdsChange,
  onToggle,
  multipleOpen = false,
  headerContentResolver = (item) => String(item?.label ?? ''),
  panelContentResolver = () => null,
  ariaLabel = 'Accordion',
}) {
  const controlled = Array.isArray(openIds)
  const [localOpenIds, setLocalOpenIds] = useState(() =>
    normalizeIds(defaultOpenIds),
  )

  const currentOpenIds = useMemo(
    () => (
      controlled
        ? normalizeIds(openIds)
        : localOpenIds
    ),
    [controlled, openIds, localOpenIds],
  )

  function commit(nextSet) {
    const nextIds = [...nextSet]

    if (controlled) {
      onOpenIdsChange?.(nextIds)
    } else {
      setLocalOpenIds(nextSet)
      onOpenIdsChange?.(nextIds)
    }
  }

  function toggle(itemId) {
    const next = new Set(currentOpenIds)

    if (next.has(itemId)) {
      next.delete(itemId)
    } else {
      if (!multipleOpen) next.clear()
      next.add(itemId)
    }

    commit(next)
    onToggle?.(itemId, {
      expanded: next.has(itemId),
      openIds: [...next],
    })
  }

  if (items.length === 0) return null

  return createElement(
    'div',
    {
      className: 'wf-accordion',
      'aria-label': ariaLabel,
    },
    ...items.map((item, index) => {
      const itemId = itemIdResolver(item)
      if (!itemId) {
        throw new Error(
          `Accordion item at index ${index} has no stable id.`,
        )
      }

      const expanded = currentOpenIds.has(itemId)
      const triggerId = `wf-accordion-trigger-${itemId}`
      const panelId = `wf-accordion-panel-${itemId}`

      return createElement(
        'div',
        {
          key: itemId,
          className: 'wf-accordion__item',
          'data-expanded': expanded ? 'true' : 'false',
        },
        createElement(
          'h3',
          { className: 'wf-accordion__heading' },
          createElement(
            'button',
            {
              id: triggerId,
              className: 'wf-accordion__trigger',
              type: 'button',
              'aria-expanded': expanded,
              'aria-controls': panelId,
              onClick: () => toggle(itemId),
            },
            createElement(
              'span',
              { className: 'wf-accordion__header-content' },
              headerContentResolver(item, {
                itemId,
                expanded,
              }),
            ),
            createElement(
              'span',
              {
                className: 'wf-accordion__state-text',
              },
              expanded ? '접기' : '펼치기',
            ),
            createElement(
              'span',
              {
                className: 'wf-accordion__indicator',
                'aria-hidden': 'true',
              },
              expanded ? '−' : '+',
            ),
          ),
        ),
        createElement(
          'div',
          {
            id: panelId,
            className: 'wf-accordion__panel',
            role: 'region',
            'aria-labelledby': triggerId,
            hidden: !expanded,
          },
          expanded
            ? panelContentResolver(item, {
                itemId,
                expanded,
              })
            : null,
        ),
      )
    }),
  )
}
