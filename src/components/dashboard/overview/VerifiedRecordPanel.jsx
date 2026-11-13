import { Link } from 'react-router-dom'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from './DashboardPanel'
import { isVerifiedRecord } from '../../../hooks/useDashboardData'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function recordTitle(record) {
  if (record.role === 'founder') return 'Founder'
  return record.title || record.role || record.contribution || ''
}

export default function VerifiedRecordPanel({ query, onNavigate }) {
  const records = [...(query.data || [])].sort((a, b) => {
    const aTime = Date.parse(a?.verified_at || a?.date || '')
    const bTime = Date.parse(b?.verified_at || b?.date || '')
    return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0)
  })

  return (
    <DashboardPanel id="verified-heading" title="Verified record" count={query.isSuccess ? records.filter(isVerifiedRecord).length : undefined}>
      {query.isPending ? <PanelSkeleton rows={2} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : records.length === 0 ? (
        <EmptyState action="View profile" to="/profile" onAction={onNavigate}>
          Verified committee roles and contributions will appear here after confirmation.
        </EmptyState>
      ) : (
        <ol className="space-y-0 px-5 py-2">
          {records.map((record, index) => {
            const verified = isVerifiedRecord(record)
            const title = recordTitle(record)
            const verifier = typeof record.verifier === 'string' ? record.verifier : record.verifier?.name
            const date = formatDate(record.verified_at || record.date)
            return (
              <li key={record.id || `${title}-${index}`} className="relative grid grid-cols-[16px_minmax(0,1fr)] gap-3 py-3">
                {index < records.length - 1 && <span aria-hidden="true" className="absolute bottom-[-1px] left-[7px] top-8 w-px bg-[#e4e6da]" />}
                <span className={`relative mt-0.5 size-4 rounded-full border ${verified ? 'border-[#d4ff1f] bg-[#d4ff1f]' : 'border-dashed border-[#8b907f] bg-white'}`} aria-label={verified ? 'Verified' : 'Pending verification'} />
                <div className="min-w-0">
                  {title && <p className="truncate text-sm font-medium text-[#0d0f08]">{title}</p>}
                  {!verified && <p className="mt-0.5 text-xs text-[#5e6355]">Pending verification</p>}
                  {(verified && (verifier || date)) && (
                    <p className="mt-1 text-xs leading-5 text-[#8b907f]">
                      {[verifier, date].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </DashboardPanel>
  )
}
