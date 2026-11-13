import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { DashboardPanel, EmptyState, PanelSkeleton, QueryErrorState } from './DashboardPanel'
import PassQrDialog from './PassQrDialog'
import { isActiveDashboardPass } from '../../../hooks/useDashboardData'

function getPassDate(pass) {
  const raw = pass.starts_at || pass.date || pass.valid_until
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.valueOf()) ? null : date
}

function passQrAvailable(pass) {
  return Boolean(pass.qr_payload || pass.qr_code || pass.qrData || pass.qr_image_url || pass.qr_image)
}

function formatDate(date) {
  return date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date) : ''
}

export default function PassesPanel({ query, onNavigate }) {
  const [selectedPass, setSelectedPass] = useState(null)
  const allPasses = query.data || []
  const activePasses = allPasses.filter((pass) => isActiveDashboardPass(pass))
  const pass = [...activePasses].sort((a, b) => (getPassDate(a)?.valueOf() || Infinity) - (getPassDate(b)?.valueOf() || Infinity))[0]
  const eventName = pass?.event_name || pass?.eventTitle || pass?.event?.name || pass?.event?.title
  const passNumber = pass?.pass_number || pass?.passNumber
  const date = pass ? formatDate(getPassDate(pass)) : ''

  return (
    <>
      <DashboardPanel id="passes-heading" title="Event passes" count={query.isSuccess ? allPasses.length : undefined} action="View all" onAction={() => onNavigate('/registrations?tab=passes')}>
        {query.isPending ? <PanelSkeleton rows={2} /> : query.isError ? <QueryErrorState error={query.error} onRetry={() => query.refetch()} /> : !pass ? (
          <EmptyState compact action="Browse events" to="/events" onAction={onNavigate}>
            {allPasses.length ? 'An active event pass will appear here when available.' : 'Event passes from your registrations will appear here.'}
          </EmptyState>
        ) : (
          <div className="p-4 sm:p-5">
            {eventName && <h3 className="truncate text-sm font-medium text-[#0d0f08]">{eventName}</h3>}
            {passNumber && <p className="mt-1 text-xs text-[#5e6355]">{passNumber}</p>}
            {date && <p className="mt-2 text-xs text-[#5e6355]">{date}</p>}
            {pass.status && <p className="mt-1 text-xs text-[#5e6355]">{pass.status}</p>}
            {passQrAvailable(pass) && (
              <button type="button" onClick={() => setSelectedPass(pass)} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
                <QrCode size={16} strokeWidth={1.6} /> Show QR
              </button>
            )}
          </div>
        )}
      </DashboardPanel>
      <PassQrDialog pass={selectedPass} onClose={() => setSelectedPass(null)} />
    </>
  )
}
