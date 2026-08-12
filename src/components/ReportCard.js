import { createElement } from 'react'
import ResponsiveMedia from './ResponsiveMedia.js'

export default function ReportCard({
  report,
  assetRef = null,
  displayTitle,
  unavailableContent = null,
}) {
  if (!report?.reportId || !report?.reportType) return null

  const title = report.title ?? displayTitle ?? null

  return createElement(
    'article',
    {
      className: 'wf-report-card',
      'data-report-id': report.reportId,
      'data-report-type': report.reportType,
      'data-source-status': report.sourceStatus || undefined,
    },
    assetRef
      ? createElement(ResponsiveMedia, {
          assetRef,
          altText: title
            ? `${title} 예시`
            : `Report example: ${report.reportType}`,
          caption: report.caption ?? undefined,
          loadingPriority: 'LAZY',
          visualVariant: 'report',
        })
      : null,
    createElement(
      'div',
      { className: 'wf-report-card__body' },
      createElement(
        'p',
        { className: 'wf-report-card__type' },
        report.reportType,
      ),
      title
        ? createElement(
            'h3',
            { className: 'wf-report-card__title' },
            title,
          )
        : null,
      !assetRef && unavailableContent
        ? createElement(
            'div',
            { className: 'wf-report-card__fallback' },
            unavailableContent,
          )
        : null,
    ),
  )
}
