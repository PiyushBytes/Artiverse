import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from './DashboardPanel'

const stages = ['Applied', 'Shortlisted', 'PI', 'Result']

function stageIndex(stage) {
  if (typeof stage !== 'string') return -1
  const value = stage.trim().toLowerCase()
  if (value === 'pi' || value.includes('personal interview')) return 2
  return stages.findIndex((label) => value === label.toLowerCase())
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export default function ApplicationsPanel({ query, onNavigate }) {
  const applications = query.data || []
  return (
    <DashboardPanel id="applications-heading" title="Applications" count={query.isSuccess ? applications.length : undefined} action="View all" onAction={() => onNavigate('/registrations?tab=applications')}>
      {query.isPending ? <PanelSkeleton rows={2} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : applications.length === 0 ? (
        <EmptyState action="Explore as a student" to="/apply" onAction={onNavigate}>
          Committee applications and their stages will appear here after you apply.
        </EmptyState>
      ) : (
        <div role="table" aria-labelledby="applications-heading">
          <div role="row" className="hidden min-h-10 grid-cols-[minmax(0,1.1fr)_minmax(80px,.7fr)_minmax(140px,1.1fr)_minmax(80px,.7fr)_minmax(90px,.7fr)_20px] items-center gap-3 border-b border-[#e4e6da] px-4 text-[11.5px] font-medium uppercase tracking-wide text-[#8b907f] min-[641px]:grid sm:px-5">
            <span role="columnheader">Committee</span><span role="columnheader">Domain</span><span role="columnheader">Stage</span><span role="columnheader">Status</span><span role="columnheader">Next step</span><span aria-hidden="true" />
          </div>
          <div role="rowgroup" className="divide-y divide-[#e4e6da]">
            {applications.map((application, index) => {
              const committee = application.committee || {}
              const name = application.committee_name || committee.name || application.name || ''
              const domain = application.domain || application.first_domain || ''
              const status = typeof application.status === 'string' ? application.status : ''
              const currentStage = application.stage || application.current_stage
              const activeStage = stageIndex(currentStage)
              const nextStepDate = formatDate(application.next_step_date || application.nextStepDate)
              const href = application.url || application.application_url || '/registrations'
              return (
                <Link key={application.id || index} role="row" to={href} className="group grid min-h-[62px] grid-cols-[minmax(0,1fr)] items-center gap-3 px-4 transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0d0f08] min-[641px]:grid-cols-[minmax(0,1.1fr)_minmax(80px,.7fr)_minmax(140px,1.1fr)_minmax(80px,.7fr)_minmax(90px,.7fr)_20px] min-[641px]:px-5">
                  <span role="cell" className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[#0d0f08]">{name}</span>
                    {currentStage && <span className="mt-0.5 block text-xs text-[#5e6355] min-[641px]:hidden">{currentStage}</span>}
                    {status && <span className="mt-0.5 block text-xs text-[#5e6355] min-[641px]:hidden">{status}</span>}
                  </span>
                  <span role="cell" className="hidden truncate text-xs text-[#5e6355] min-[641px]:block">{domain}</span>
                  <span role="cell" className="hidden min-w-0 items-center gap-1.5 min-[641px]:flex" aria-label={currentStage ? `Stage: ${currentStage}` : 'Stage not provided'}>
                    {stages.map((label, stage) => <span key={label} title={label} className={`h-1.5 min-w-0 flex-1 rounded-sm ${stage <= activeStage ? 'bg-[#d4ff1f]' : 'bg-[#e4e6da]'}`} />)}
                  </span>
                  <span role="cell" className="hidden truncate text-xs text-[#5e6355] min-[641px]:block">{status}</span>
                  <span role="cell" className="hidden truncate text-xs text-[#5e6355] min-[641px]:block">{nextStepDate}</span>
                  <span role="cell" className="hidden items-center justify-end text-[#8b907f] min-[641px]:flex"><ChevronRight size={17} className="transition-transform group-hover:translate-x-[3px]" /></span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </DashboardPanel>
  )
}
