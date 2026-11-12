const statusInfo = {
  open: { label: 'Registrations open', dot: 'bg-lime', text: 'text-lime' },
  soon: { label: 'Coming soon', dot: 'bg-white/45', text: 'text-white/65' },
  live: { label: 'Live now', dot: 'bg-cobalt-soft', text: 'text-cobalt-soft' },
  past: { label: 'Ended', dot: 'bg-white/30', text: 'text-white/50' },
}

export default function StatusPill({ event }) {
  const status = statusInfo[event.status] || statusInfo.soon
  return (
    <span className="event-status">
      <i
        className={`size-1.5 shrink-0 rounded-full ${status.dot} ${
          event.status === 'open' || event.status === 'live' ? 'animate-pulse' : ''
        }`}
      />
      <span className={status.text}>{status.label}</span>
    </span>
  )
}

