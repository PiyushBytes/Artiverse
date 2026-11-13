import { Calendar, Clock, MapPin, QrCode, Ticket } from 'lucide-react'

export default function TicketPassCard({ pass, onShowQr }) {
  const isConfirmed = pass.status === 'CONFIRMED'

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden bg-[#fcfbf8] p-5 transition-colors hover:bg-[#f5f1eb] sm:p-6"
    >
      {/* Top Meta & Status */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="grid size-6 place-items-center bg-[#eeeae3] text-[#171614]">
              <Ticket size={13} />
            </span>
            <span className="font-mono text-xs font-bold text-[#0d0f08]">{pass.passNumber}</span>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              isConfirmed
                ? 'text-[#47714a]'
                : 'text-[#65615b]'
            }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {String(pass.status).toLowerCase()}
          </span>
        </div>

        <h3 className="mt-3.5 font-display text-lg font-semibold tracking-tight text-[#171614] sm:text-xl">
          {pass.eventTitle}
        </h3>
        <p className="mt-0.5 text-xs text-[#5e6355]">{pass.committeeName}</p>

        {/* Date, Time & Venue */}
        <div className="mt-4 space-y-1.5 text-xs text-[#424638]">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="shrink-0 text-[#ef6b3b]" />
            <span>{pass.date} · {pass.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="shrink-0 text-[#ef6b3b]" />
            <span className="truncate">{pass.venue} ({pass.gate})</span>
          </div>
        </div>
      </div>

      {/* Perforated Divider Strip with side circular notches */}
      <div className="relative my-4 flex items-center">
        {/* Left notch */}
        <div className="absolute -left-8 size-4 rounded-full bg-[#fafaf5] border-r border-[#e4e6da]" />
        {/* Dashed line */}
        <div className="w-full border-t border-dashed border-[#ded8cf]" />
        {/* Right notch */}
        <div className="absolute -right-8 size-4 rounded-full bg-[#fafaf5] border-l border-[#e4e6da]" />
      </div>

      {/* Bottom Action Stub */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs font-medium text-[#5e6355]">Pass type</p>
          <p className="text-xs font-bold text-[#0d0f08]">{pass.ticketType}</p>
        </div>

        <button
          type="button"
          onClick={() => onShowQr(pass)}
          className="group inline-flex min-h-9 items-center gap-1.5 bg-[#171614] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#a9431e] active:scale-[.98]"
        >
          <QrCode size={14} />
          <span>Show QR</span>
        </button>
      </div>
    </div>
  )
}

