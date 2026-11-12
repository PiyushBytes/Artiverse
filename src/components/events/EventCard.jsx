import { useState } from 'react'
import { ArrowUpRight, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import PosterArtwork from './PosterArtwork'
import StatusPill from './StatusPill'

export default function EventCard({ event, onOpen, reduceMotion, index = 0 }) {
  const past = event.status === 'past'
  const canRegister = event.status === 'open' && event.link
  const [saved, setSaved] = useState(false)

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015 }}
      transition={{
        duration: 0.48,
        delay: reduceMotion ? 0 : (index % 6) * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="event-poster-card group relative w-[min(72vw,220px)] shrink-0 snap-start sm:w-[220px]"
    >
      <button
        className="absolute inset-0 z-10"
        onClick={() => onOpen(event)}
        aria-label={`View details for ${event.title}`}
      />
      <div className="event-card-poster relative aspect-[4/5]">
        <PosterArtwork event={event} past={past} />
      </div>
      <div className="relative z-20 px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {event.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/65"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSaved(!saved)
            }}
            className="relative z-30 grid size-8 shrink-0 place-items-center rounded-full text-white/55 transition hover:bg-white/5 hover:text-lime"
            aria-label={saved ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
            aria-pressed={saved}
          >
            <Heart size={19} className={saved ? 'fill-lime text-lime' : ''} />
          </button>
        </div>
        <h3 className="mt-2 font-display text-[22px] italic leading-tight text-white">
          {event.title}
        </h3>
        <p className="mt-1 text-[9px] uppercase tracking-[.12em] text-white/40">
          {event.date} <span className="text-lime">·</span> {event.venue}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <StatusPill event={event} />
          {canRegister ? (
            <a
              href={event.link}
              onClick={(e) => e.stopPropagation()}
              className="relative z-30 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[.12em] text-lime"
            >
              Register <ArrowUpRight size={13} />
            </a>
          ) : (
            <span className="text-[9px] uppercase tracking-[.1em] text-white/35">
              {event.category}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

