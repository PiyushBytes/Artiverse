import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from './DashboardPanel'

function dateParts(value) {
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return null
  const month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date)
  const day = new Intl.DateTimeFormat(undefined, { day: 'numeric' }).format(date)
  const detail = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', ...(String(value).includes('T') ? { timeStyle: 'short' } : {}) }).format(date)
  return { month, day, detail }
}

export default function UpcomingPanel({ query, onNavigate }) {
  const items = query.data || []
  return (
    <DashboardPanel id="upcoming-heading" title="Upcoming" count={query.isSuccess ? items.length : undefined}>
      {query.isPending ? <PanelSkeleton rows={2} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : items.length === 0 ? (
        <EmptyState compact action="Browse events" to="/events" onAction={onNavigate}>
          Upcoming slots and event deadlines will appear here when scheduled.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-[#e4e6da] px-4 sm:px-5">
          {items.map((item, index) => {
            const parts = dateParts(item.dashboardDate)
            if (!parts) return null
            const title = item.title || item.name || ''
            const detail = item.type || ''
            const to = item.url || item.href || '/events'
            return (
              <li key={item.id || `${item.dashboardDate}-${index}`}>
                <Link to={to} className="group flex min-h-[62px] items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-[#0d0f08]">
                  <span className="grid size-11 shrink-0 content-center justify-items-center rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] leading-none">
                    <span className="text-[10px] font-medium text-[#8b907f]">{parts.month}</span>
                    <span className="mt-1 text-sm font-semibold tabular-nums text-[#0d0f08]">{parts.day}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    {title && <span className="block truncate text-xs font-medium text-[#0d0f08]">{title}</span>}
                    <span className="mt-0.5 block truncate text-xs text-[#5e6355]">{detail || parts.detail}</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-[#8b907f] transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </DashboardPanel>
  )
}
