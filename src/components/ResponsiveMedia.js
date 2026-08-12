import {
  createElement,
  useState,
} from 'react'

export default function ResponsiveMedia({
  assetRef,
  altText,
  decorative = false,
  caption,
  aspectRatio,
  cropPosition = '50% 50%',
  loadingPriority = 'LAZY',
  responsiveSizeIntent = '100vw',
  visualVariant = 'default',
}) {
  const [loadState, setLoadState] = useState('IDLE')

  const resolvedRatio =
    aspectRatio ??
    assetRef?.aspectRatio ??
    (
      assetRef?.intrinsicWidth && assetRef?.intrinsicHeight
        ? assetRef.intrinsicWidth / assetRef.intrinsicHeight
        : null
    )

  const src = assetRef?.src ?? assetRef?.url ?? null
  const informative = !decorative

  if (informative && !altText) {
    throw new Error(
      'ResponsiveMedia informative media requires altText.',
    )
  }

  const frameStyle = resolvedRatio
    ? { aspectRatio: String(resolvedRatio) }
    : undefined

  const imageStyle = {
    objectPosition: cropPosition,
  }

  const mediaNode = src && loadState !== 'ERROR'
    ? createElement('img', {
        className: 'wf-responsive-media__image',
        src,
        alt: decorative ? '' : altText,
        width: assetRef?.intrinsicWidth ?? undefined,
        height: assetRef?.intrinsicHeight ?? undefined,
        loading: loadingPriority === 'LAZY' ? 'lazy' : 'eager',
        fetchPriority:
          loadingPriority === 'PRIORITY' ? 'high' : undefined,
        sizes: responsiveSizeIntent,
        style: imageStyle,
        onLoad: () => setLoadState('LOADED'),
        onError: () => setLoadState('ERROR'),
      })
    : createElement(
        'div',
        {
          className: 'wf-responsive-media__fallback',
          'aria-hidden': decorative ? 'true' : undefined,
        },
        informative
          ? createElement(
              'span',
              { className: 'wf-responsive-media__fallback-text' },
              altText,
            )
          : null,
      )

  return createElement(
    'figure',
    {
      className:
        `wf-responsive-media wf-responsive-media--${visualVariant}`,
      'data-load-state': loadState,
    },
    createElement(
      'div',
      {
        className: 'wf-responsive-media__frame',
        style: frameStyle,
      },
      mediaNode,
    ),
    caption
      ? createElement(
          'figcaption',
          { className: 'wf-responsive-media__caption' },
          caption,
        )
      : null,
  )
}
