import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import EventCard from './EventCard'
import EventDrawer from './EventDrawer'
import { events } from '../../config/events'

const tabs = ['All', 'Upcoming', 'Past']

export default function Events() {
  const reduceMotion = useReducedMotion()
  const [tab, setTab] = useState('Upcoming')
  const [category, setCategory] = useState('All categories')
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const carouselRef = useRef(null)

  const categories = useMemo(
    () => ['All categories', ...new Set(events.map((event) => event.category).filter(Boolean))],
    []
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return events.filter((event) => {
      const matchesSearch =
        !needle ||
        [event.title, event.venue, event.category, ...event.tags]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      const matchesCategory = category === 'All categories' || event.category === category
      return matchesSearch && matchesCategory
    })
  }, [category, query])

  const upcoming = filtered.filter((event) => event.status !== 'past')
  const past = filtered.filter((event) => event.status === 'past')
  const tabEvents = tab === 'Upcoming' ? upcoming : tab === 'Past' ? past : filtered

  const scrollCarousel = (direction) =>
    carouselRef.current?.scrollBy({
      left: direction * 270,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })

  return (
    <div className="events-page min-h-screen bg-ink pt-16 sm:pt-20">
      <section className="events-hero border-b border-white/10 px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 md:px-8 lg:px-10 lg:pb-12 lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
          <div className="w-full min-w-0">
            <p className="eyebrow mb-5">ARTIVERSE PRESENTS · EVENTS</p>
            <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[.96] tracking-[-.04em] text-white">
              Find your next <i className="text-lime">moment.</i>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
              Art, ideas and campus experiences—made together at MSIT.
            </p>
          </div>
          <label className="event-search flex min-h-12 w-full max-w-sm items-center gap-3 rounded-full border border-white/15 bg-white/[.045] px-4 py-3 text-white/55 transition focus-within:border-lime/70 focus-within:ring-2 focus-within:ring-lime/15 sm:px-5">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              aria-label="Search events"
            />
          </label>
        </div>
      </section>

      <section className="events-filter sticky top-16 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl sm:top-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 md:px-8 lg:px-10">
          <div className="flex items-center gap-5 sm:gap-7">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`event-tab relative py-2 text-[11px] uppercase tracking-[.2em] transition ${
                  tab === item ? 'text-lime' : 'text-white/50 hover:text-white'
                }`}
              >
                {item}
                {tab === item && (
                  <motion.span
                    layoutId="event-tab-active"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-lime"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-3 py-2 text-[9px] uppercase tracking-[.14em] transition ${
                  category === item
                    ? 'border-lime/55 bg-lime/[.08] text-lime'
                    : 'border-white/10 text-white/45 hover:border-white/25 hover:text-white/75'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-[46vh] py-8 sm:py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
          {tabEvents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 px-6 py-20 text-center">
              <span className="font-display text-4xl text-lime">✦</span>
              <p className="mt-4 font-display text-2xl text-white">
                Abhi koi event nahi. Jald aa raha hai.
              </p>
              <p className="mt-2 text-sm text-white/45">Try another filter or check back soon.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
                <div>
                  <p className="eyebrow">
                    {tab === 'Past'
                      ? 'FROM THE ARCHIVE'
                      : tab === 'All'
                        ? 'THE ARTIVERSE CALENDAR'
                        : 'WHAT’S NEXT'}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">
                    {tab === 'Past' ? (
                      <>
                        Past <i className="text-lime">highlights.</i>
                      </>
                    ) : tab === 'All' ? (
                      <>
                        All <i className="text-lime">events.</i>
                      </>
                    ) : (
                      <>
                        Upcoming <i className="text-lime">events.</i>
                      </>
                    )}
                  </h2>
                </div>
                {tab === 'Upcoming' && (
                  <div className="hidden gap-2 sm:flex">
                    <button
                      onClick={() => scrollCarousel(-1)}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-lime/60 hover:text-lime"
                      aria-label="Scroll events left"
                    >
                      <ArrowLeft size={17} />
                    </button>
                    <button
                      onClick={() => scrollCarousel(1)}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-lime/60 hover:text-lime"
                      aria-label="Scroll events right"
                    >
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </div>
              {tab === 'Upcoming' ? (
                <div
                  ref={carouselRef}
                  className="event-carousel -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-5 sm:mx-0 sm:gap-5 sm:px-0 sm:scroll-px-0"
                >
                  {upcoming.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onOpen={setSelectedEvent}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {tabEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onOpen={setSelectedEvent}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedEvent && (
          <EventDrawer
            key={selectedEvent.id}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

