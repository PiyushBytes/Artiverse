import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react'

export default function Navbar({ onApply, onComingSoon, onEvents, onHome, isEventsPage, isApplyPage }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = ['Events', 'Gallery', 'Magazine', 'Team']

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 15)
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  const handleNav = (item) => {
    if (item === 'Events') onEvents()
    else onComingSoon(item)
    setOpen(false)
  }

  const handleApply = () => {
    onApply()
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full py-3.5 sm:py-4 transition-colors duration-200 ${
        scrolled ? 'bg-[#05060a]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl lg:max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo: Serif (Playfair Display) matching Hero headline */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onHome()
            setOpen(false)
          }}
          className="group relative inline-flex items-center gap-1 focus:outline-none"
          aria-label="Artiverse Home"
        >
          <span className="font-display text-[24px] sm:text-[27px] font-bold tracking-[-0.01em] text-white transition-colors duration-150 group-hover:text-lime">
            Artiverse
          </span>
          <span className="size-1.5 rounded-full bg-lime opacity-80" />
        </a>

        {/* Desktop Navigation Capsule */}
        <nav className="relative hidden lg:flex items-center rounded-full border border-white/10 bg-[#080a10]/80 px-4 py-1.5 backdrop-blur-2xl shadow-[0_8px_36px_rgba(0,0,0,0.3)]">
          {/* Nav Links: text-[13px] tracking-[0.12em] */}
          <div className="flex items-center gap-5 xl:gap-6 px-1">
            {links.map((item) => {
              const isActive = item === 'Events' && isEventsPage
              return (
                <button
                  key={item}
                  onClick={() => handleNav(item)}
                  className={`py-1 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                    isActive ? 'text-lime font-bold' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              )
            })}

            {/* Kalakriti’26: Clean ghost text-link */}
            <a
              href="https://kalakriti.arteza.online"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 py-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors duration-150 hover:text-lime"
            >
              <span>Kalakriti’26</span>
              <ArrowUpRight size={13} className="text-lime/90" />
            </a>
          </div>

          {/* Single Primary CTA: JOIN NOW */}
          {!isEventsPage && (
            <div className="pl-3 ml-2 border-l border-white/15">
              <button
                onClick={handleApply}
                className={`lime-button glow group relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(212,255,36,0.3)] transition-transform duration-150 hover:scale-[1.03] active:scale-95 ${
                  isApplyPage ? 'ring-2 ring-lime/50 ring-offset-2 ring-offset-ink' : ''
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-ink" />
                  JOIN NOW
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {!isEventsPage && (
            <button
              onClick={handleApply}
              className="lime-button glow rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider"
            >
              JOIN NOW
            </button>
          )}

          <button
            onClick={() => setOpen((c) => !c)}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-[#080a10]/80 text-white/90 backdrop-blur-xl transition-colors hover:border-lime/50 hover:text-lime"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] mx-auto max-w-sm rounded-3xl border border-white/15 bg-[#080a10]/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col items-center gap-3.5">
              {links.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNav(item)}
                  className={`w-full py-1.5 text-center text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    item === 'Events' && isEventsPage ? 'text-lime' : 'text-white/80 hover:text-lime'
                  }`}
                >
                  {item}
                </button>
              ))}

              <a
                href="https://kalakriti.arteza.online"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 py-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-lime"
              >
                <span>Kalakriti’26</span>
                <ArrowUpRight size={13} className="text-lime" />
              </a>

              {!isEventsPage && (
                <div className="mt-2 w-full pt-3 border-t border-white/10">
                  <button
                    onClick={handleApply}
                    className="lime-button glow w-full rounded-full py-2.5 text-xs font-bold tracking-wider"
                  >
                    JOIN NOW
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
