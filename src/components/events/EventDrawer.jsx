import { useEffect, useRef } from 'react'
import { ArrowUpRight, CalendarDays, MapPin, X } from 'lucide-react'
import { motion } from 'motion/react'
import PosterArtwork from './PosterArtwork'
import StatusPill from './StatusPill'

export default function EventDrawer({ event, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const canRegister = event.status === 'open' && event.link

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex justify-end bg-ink/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-drawer-title"
        className="event-drawer relative h-full w-full max-w-[500px] overflow-y-auto border-l border-white/10 bg-[#080a10] p-5 sm:p-8"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-ink/70 text-white/75 hover:border-lime/50 hover:text-lime"
          aria-label="Close event details"
        >
          <X size={18} />
        </button>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <PosterArtwork event={event} past={event.status === 'past'} />
        </div>
        <div className="mt-6">
          <StatusPill event={event} />
          <p className="mt-5 text-[10px] uppercase tracking-[.22em] text-white/55">{event.date}</p>
          <h2 id="event-drawer-title" className="mt-2 font-display text-4xl italic text-white">
            {event.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">{event.description}</p>
          <dl className="mt-7 grid gap-4 border-y border-white/10 py-5 text-sm">
            <div className="flex gap-3">
              <CalendarDays className="shrink-0 text-lime" size={17} />
              <div>
                <dt className="text-[10px] uppercase tracking-[.2em] text-white/45">Schedule</dt>
                <dd className="mt-1 text-white/80">{event.schedule || 'To be announced'}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="shrink-0 text-lime" size={17} />
              <div>
                <dt className="text-[10px] uppercase tracking-[.2em] text-white/45">Venue</dt>
                <dd className="mt-1 text-white/80">{event.venue}</dd>
              </div>
            </div>
          </dl>
          {canRegister ? (
            <a href={event.link} className="lime-button glow mt-6 w-full">
              Register <ArrowUpRight size={16} />
            </a>
          ) : (
            <button
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white/45"
            >
              {event.status === 'past' ? 'View recap soon' : 'Event details coming soon'}
            </button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  )
}

