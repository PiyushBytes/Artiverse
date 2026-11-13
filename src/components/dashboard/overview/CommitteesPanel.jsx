import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from './DashboardPanel'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function committeeName(committee) {
  return committee.committee_name || committee.name || committee.committee_username || committee.username || ''
}

function committeeHandle(committee) {
  const handle = committee.committee_username || committee.username
  return typeof handle === 'string' && handle ? `@${handle.replace(/^@/, '')}` : ''
}

function committeeHref(committee) {
  const slug = committee.slug || committee.committee_username || committee.username
  if (typeof slug !== 'string' || !slug.trim()) return null
  const path = `/committees/${slug.replace(/^@/, '')}`
  return committee.ownership === 'owned' ? `${path}/manage` : path
}

export default function CommitteesPanel({ query, onNavigate, onCreateCommittee }) {
  const committees = query.data?.all || []
  return (
    <DashboardPanel id="committees-heading" title="Committees" count={query.isSuccess ? committees.length : undefined} action="Browse all" onAction={() => onNavigate('/committees')}>
      {query.isPending ? <PanelSkeleton rows={3} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : committees.length === 0 ? (
        <EmptyState action="Create a committee" onAction={onCreateCommittee}>
          Committees you create or join will appear here.
        </EmptyState>
      ) : (
        <div role="table" aria-labelledby="committees-heading">
          <div role="row" className="hidden min-h-10 grid-cols-[minmax(0,1.5fr)_minmax(100px,.7fr)_minmax(80px,.55fr)_minmax(110px,.65fr)_24px] items-center gap-3 border-b border-[#e4e6da] px-4 text-[11.5px] font-medium uppercase tracking-wide text-[#8b907f] min-[641px]:grid min-[641px]:px-5">
            <span role="columnheader">Committee</span><span role="columnheader">Your role</span><span role="columnheader">Status</span><span role="columnheader">Since</span><span aria-hidden="true" />
          </div>
          <div role="rowgroup" className="divide-y divide-[#e4e6da]">
            {committees.map((committee, index) => {
              const name = committeeName(committee)
              const handle = committeeHandle(committee)
              const href = committeeHref(committee)
              const role = committee.role
              const rawStatus = typeof committee.status === 'string' ? committee.status : ''
              const date = formatDate(committee.joined_at || committee.date_of_joining || (committee.ownership === 'owned' ? committee.date_of_creation : ''))
              const logo = committee.logo_url || committee.committee_logo || committee.logo
              const rowContent = (
                <>
                  <span role="cell" className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e4e6da] bg-[#fafaf5] text-xs font-semibold text-[#5e6355]">
                      {logo ? <img src={logo} alt="" className="size-full object-cover" /> : (name.trim()[0] || handle.replace('@', '')[0] || '')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[#0d0f08]">{name}</span>
                      {handle && <span className="mt-0.5 block truncate text-xs text-[#8b907f]">{handle}</span>}
                      {typeof role === 'string' && role && <span className="mt-0.5 block truncate text-xs text-[#5e6355] min-[641px]:hidden">{role === 'founder' ? 'Founder' : role}</span>}
                    </span>
                  </span>
                  <span role="cell" className="hidden truncate text-xs text-[#5e6355] min-[641px]:block">{role === 'founder' ? 'Founder' : (typeof role === 'string' ? role : '')}</span>
                  <span role="cell" className="text-right text-xs text-[#5e6355] min-[641px]:text-left">{rawStatus}</span>
                  <span role="cell" className="hidden text-xs text-[#5e6355] min-[641px]:block">{date}</span>
                  <span role="cell" className="hidden items-center justify-end text-[#8b907f] min-[641px]:flex"><ChevronRight size={17} className="transition-transform group-hover:translate-x-[3px]" /></span>
                </>
              )
              const rowClass = 'group grid min-h-[62px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0d0f08] min-[641px]:grid-cols-[minmax(0,1.5fr)_minmax(100px,.7fr)_minmax(80px,.55fr)_minmax(110px,.65fr)_24px] min-[641px]:px-5'
              return href ? (
                <Link key={committee.id || committee.committee_username || committee.username || index} role="row" to={href} className={rowClass}>
                  {rowContent}
                </Link>
              ) : (
                <div key={committee.id || committee.committee_username || committee.username || index} role="row" className={rowClass}>
                  {rowContent}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </DashboardPanel>
  )
}
