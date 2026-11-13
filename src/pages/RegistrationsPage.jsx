import { useState } from 'react'
import { CalendarDays, QrCode, Ticket } from 'lucide-react'
import { useMyApplications, useMyPasses } from '../hooks/useDashboardData'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from '../components/dashboard/overview/DashboardPanel'
import ApplicationsPanel from '../components/dashboard/overview/ApplicationsPanel'
import PassQrDialog from '../components/dashboard/overview/PassQrDialog'

function passDate(pass) {
  const value = pass.starts_at || pass.date || pass.valid_until
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function eventName(pass) {
  return pass.event_name || pass.eventTitle || pass.event?.name || pass.event?.title || ''
}

function hasQrData(pass) {
  return Boolean(pass.qr_payload || pass.qr_code || pass.qrData || pass.qr_image_url || pass.qr_image)
}

function PassesList({ query, onNavigate }) {
  const [selectedPass, setSelectedPass] = useState(null)
  const passes = query.data || []

  return (
    <>
      <DashboardPanel id="my-passes-heading" title="My passes" count={query.isSuccess ? passes.length : undefined} action="Browse events" onAction={() => onNavigate('/events')}>
        {query.isPending ? <PanelSkeleton rows={3} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : passes.length === 0 ? (
          <EmptyState action="Browse events" to="/events" onAction={onNavigate}>
            Event passes linked to your account will appear here.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-[#e4e6da]">
            {passes.map((pass, index) => {
              const name = eventName(pass)
              const number = pass.pass_number || pass.passNumber
              const date = passDate(pass)
              const status = typeof pass.status === 'string' ? pass.status : ''
              return (
                <li key={pass.id || number || `${name}-${index}`} className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]">
                      <Ticket size={17} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      {name && <h3 className="truncate text-sm font-medium text-[#0d0f08]">{name}</h3>}
                      {number && <p className="mt-0.5 truncate text-xs text-[#5e6355]">{number}</p>}
                      {(date || pass.venue) && <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#8b907f]">{date && <><CalendarDays size={13} />{date}</>}{date && pass.venue && <span aria-hidden="true">·</span>}{pass.venue && <span>{pass.venue}</span>}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    {status && <span className="inline-flex min-h-6 items-center rounded-full border border-[#e4e6da] bg-[#fafaf5] px-2.5 text-xs text-[#5e6355]">{status}</span>}
                    {hasQrData(pass) && <button type="button" onClick={() => setSelectedPass(pass)} className="inline-flex min-h-9 items-center gap-2 rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]"><QrCode size={15} strokeWidth={1.6} />Show QR</button>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </DashboardPanel>
      <PassQrDialog pass={selectedPass} onClose={() => setSelectedPass(null)} />
    </>
  )
}

export default function RegistrationsPage({ currentUser, onNavigate, tab }) {
  const passesQuery = useMyPasses(currentUser)
  const applicationsQuery = useMyApplications(currentUser)
  const showPasses = tab !== 'applications'
  const showApplications = tab !== 'passes'

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5 px-4 pb-12 pt-6 sm:space-y-6 sm:px-6">
      {showPasses && <PassesList query={passesQuery} onNavigate={onNavigate} />}
      {showApplications && <ApplicationsPanel query={applicationsQuery} onNavigate={onNavigate} />}
    </div>
  )
}
