import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Menu, X, Sparkles, Calendar, Mail } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'

export default function MobileNavbar({
  onApply,
  onComingSoon,
  onEvents,
  onHome,
  isEventsPage,
  isApplyPage,
}) {
  const [open, setOpen] = useState(false)
  const links = ['Events', 'Gallery', 'Magazine', 'Team']

  const handleNav = (item) => {
    if (item === 'Events') onEvents()
    else onComingSoon(item)
    setOpen(false)
  }

  const handleApply = () => {
    onApply()
    setOpen(false)
  }

  const handleHome = () => {
    onHome()
    setOpen(false)
  }

  return (
    <div className="lg:hidden">
      {/* Top Mobile Bar */}
      <div className="flex h-14 w-full items-center justify-between px-4">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            handleHome()
          }}
          className="group inline-flex items-center gap-1 focus:outline-none"
          aria-label="Artiverse Home"
        >
          <span className="font-display text-[22px] font-bold tracking-[-0.01em] text-white">
            Artiverse
          </span>
          <span className="size-1.5 rounded-full bg-lime" />
        </a>

        {/* Right Actions: Compact Join Now + Menu Toggle */}
        <div className="flex items-center gap-2">
          {!isEventsPage && (
            <button
              onClick={handleApply}
              className={`lime-button glow rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                isApplyPage ? 'ring-2 ring-lime/50 ring-offset-2 ring-offset-ink' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-ink" />
                JOIN
              </span>
            </button>
          )}

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-[#080a10]/85 text-white/90 backdrop-blur-xl transition-colors hover:border-lime/50 hover:text-lime"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-3 right-3 top-[calc(100%+0.5rem)] rounded-2xl border border-white/15 bg-[#080a10]/95 p-5 shadow-2xl shadow-black/70 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3">
              {/* Navigation Links */}
              <div className="grid gap-1">
                {links.map((item) => {
                  const isActive = item === 'Events' && isEventsPage
                  return (
                    <button
                      key={item}
                      onClick={() => handleNav(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                        isActive
                          ? 'bg-lime/[0.1] text-lime font-bold'
                          : 'text-white/80 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <span>{item}</span>
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-lime" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Kalakriti’26 Featured Card */}
              <a
                href="https://kalakriti.arteza.online"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-lime/30 bg-lime/[0.06] px-4 py-3 text-xs font-bold uppercase tracking-wider text-lime transition hover:bg-lime hover:text-ink"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={15} />
                  <span>Kalakriti’26 Annual Fest</span>
                </div>
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Recruitment CTA Button */}
              {!isEventsPage && (
                <div className="pt-2">
                  <button
                    onClick={handleApply}
                    className="lime-button glow w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider"
                  >
                    Apply for Personal Interview
                  </button>
                  <p className="mt-2 text-center text-[10px] text-white/40">
                    Apply by {siteConfig.recruitment.closeDate}
                  </p>
                </div>
              )}

              {/* Social / Contact Links Footer */}
              <div className="mt-2 flex items-center justify-center gap-4 border-t border-white/10 pt-3 text-xs text-white/50">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition hover:text-lime"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
                  </svg>
                  <span>@arteza.msit</span>
                </a>
                <span className="text-white/20">·</span>
                <a
                  href={siteConfig.links.email}
                  className="flex items-center gap-1.5 transition hover:text-lime"
                >
                  <Mail size={13} />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
