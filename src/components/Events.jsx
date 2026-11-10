import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { events } from "../config/events";

const tabs = ["All", "Upcoming", "Past"];
const statusInfo = {
  open: { label: "Registrations open", dot: "bg-lime", text: "text-lime" },
  soon: { label: "Coming soon", dot: "bg-white/45", text: "text-white/65" },
  live: { label: "Live now", dot: "bg-cobalt-soft", text: "text-cobalt-soft" },
  past: { label: "Ended", dot: "bg-white/30", text: "text-white/50" },
};

function PosterArtwork({ event, past = false }) {
  return (
    <div
      className={`event-poster event-poster--${event.posterTheme || "default"} ${past ? "is-past" : ""}`}
    >
      {event.poster ? (
        <img
          src={event.poster}
          alt={`${event.title} event poster`}
          loading="lazy"
          className="event-poster-image"
        />
      ) : (
        <div className="event-poster-art" aria-hidden="true">
          <span className="poster-orbit poster-orbit-one" />
          <span className="poster-orbit poster-orbit-two" />
          <span className="poster-spark">✳</span>
          <span className="poster-edition">ARTIVERSE · MSIT</span>
          <span className="poster-word">{event.title}</span>
          <span className="poster-year">CREATIVE ARTS / KOLKATA</span>
        </div>
      )}
    </div>
  );
}

function StatusPill({ event }) {
  const status = statusInfo[event.status] || statusInfo.soon;
  return (
    <span className="event-status">
      <i
        className={`size-1.5 shrink-0 rounded-full ${status.dot} ${event.status === "open" || event.status === "live" ? "animate-pulse" : ""}`}
      />
      <span className={status.text}>{status.label}</span>
    </span>
  );
}

function EventCard({ event, onOpen, reduceMotion, index = 0 }) {
  const past = event.status === "past";
  const canRegister = event.status === "open" && event.link;
  const [saved, setSaved] = useState(false);
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015 }}
      transition={{ duration: 0.48, delay: reduceMotion ? 0 : (index % 6) * 0.055, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="flex min-w-0 flex-wrap gap-1.5">{event.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/65">{tag}</span>)}</div>
          <button onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} className="relative z-30 grid size-8 shrink-0 place-items-center rounded-full text-white/55 transition hover:bg-white/5 hover:text-lime" aria-label={saved ? `Remove ${event.title} from saved events` : `Save ${event.title}`} aria-pressed={saved}><Heart size={19} className={saved ? "fill-lime text-lime" : ""}/></button>
        </div>
        <h3 className="mt-2 font-display text-[22px] italic leading-tight text-white">{event.title}</h3>
        <p className="mt-1 text-[9px] uppercase tracking-[.12em] text-white/40">{event.date} <span className="text-lime">·</span> {event.venue}</p>
        <div className="mt-2 flex items-center justify-between gap-2"><StatusPill event={event}/>{canRegister ? <a href={event.link} onClick={(e) => e.stopPropagation()} className="relative z-30 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[.12em] text-lime">Register <ArrowUpRight size={13}/></a> : <span className="text-[9px] uppercase tracking-[.1em] text-white/35">{event.category}</span>}</div>
      </div>
    </motion.article>
  );
}

function EventDrawer({ event, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);
  const canRegister = event.status === "open" && event.link;
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex justify-end bg-ink/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-drawer-title"
        className="event-drawer relative h-full w-full max-w-[500px] overflow-y-auto border-l border-white/10 bg-[#080a10] p-5 sm:p-8"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
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
          <PosterArtwork event={event} past={event.status === "past"} />
        </div>
        <div className="mt-6">
          <StatusPill event={event} />
          <p className="mt-5 text-[10px] uppercase tracking-[.22em] text-white/55">
            {event.date}
          </p>
          <h2
            id="event-drawer-title"
            className="mt-2 font-display text-4xl italic"
          >
            {event.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            {event.description}
          </p>
          <dl className="mt-7 grid gap-4 border-y border-white/10 py-5 text-sm">
            <div className="flex gap-3">
              <CalendarDays className="shrink-0 text-lime" size={17} />
              <div>
                <dt className="text-[10px] uppercase tracking-[.2em] text-white/45">
                  Schedule
                </dt>
                <dd className="mt-1 text-white/80">
                  {event.schedule || "To be announced"}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="shrink-0 text-lime" size={17} />
              <div>
                <dt className="text-[10px] uppercase tracking-[.2em] text-white/45">
                  Venue
                </dt>
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
              {event.status === "past"
                ? "View recap soon"
                : "Event details coming soon"}
            </button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}

export default function Events() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState("Upcoming");
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const carouselRef = useRef(null);
  const categories = useMemo(
    () => [
      "All categories",
      ...new Set(events.map((event) => event.category).filter(Boolean)),
    ],
    [],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesSearch =
        !needle ||
        [event.title, event.venue, event.category, ...event.tags]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesCategory =
        category === "All categories" || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, query]);
  const upcoming = filtered.filter((event) => event.status !== "past");
  const past = filtered.filter((event) => event.status === "past");
  const tabEvents =
    tab === "Upcoming" ? upcoming : tab === "Past" ? past : filtered;
  const scrollCarousel = (direction) =>
    carouselRef.current?.scrollBy({
      left: direction * 270,
      behavior: reduceMotion ? "auto" : "smooth",
    });

  return (
    <div className="events-page min-h-screen bg-ink pt-16 sm:pt-20">
      <section className="events-hero border-b border-white/10 px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 md:px-8 lg:px-10 lg:pb-12 lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
          <div className="w-full min-w-0">
            <p className="eyebrow mb-5">ARTIVERSE PRESENTS · EVENTS</p>
            <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[.96] tracking-[-.04em]">
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
                className={`event-tab relative py-2 text-[11px] uppercase tracking-[.2em] transition ${tab === item ? "text-lime" : "text-white/50 hover:text-white"}`}
              >
                {item}
                {tab === item && (
                  <motion.span
                    layoutId="event-tab-active"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-lime"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
                className={`shrink-0 rounded-full border px-3 py-2 text-[9px] uppercase tracking-[.14em] transition ${category === item ? "border-lime/55 bg-lime/[.08] text-lime" : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/75"}`}
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
              <p className="mt-4 font-display text-2xl">
                Abhi koi event nahi. Jald aa raha hai.
              </p>
              <p className="mt-2 text-sm text-white/45">
                Try another filter or check back soon.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
                <div>
                  <p className="eyebrow">
                    {tab === "Past"
                      ? "FROM THE ARCHIVE"
                      : tab === "All"
                        ? "THE ARTIVERSE CALENDAR"
                        : "WHAT’S NEXT"}
                  </p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                    {tab === "Past" ? (
                      <>
                        Past <i className="text-lime">highlights.</i>
                      </>
                    ) : tab === "All" ? (
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
                {tab === "Upcoming" && (
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
              {tab === "Upcoming" ? (
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
  );
}
