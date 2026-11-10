import { useEffect, useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { MobileNavbar } from '../mobile'

export default function Navbar({ onApply, onComingSoon, onEvents, onHome, isEventsPage, isApplyPage }) {
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
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full py-3.5 sm:py-4 transition-colors duration-200 ${
        scrolled ? 'bg-[#05060a]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
      }`}
    >
      {/* Mobile Navbar: Clean, dedicated mobile component from src/mobile */}
      <MobileNavbar
        onApply={onApply}
        onComingSoon={onComingSoon}
        onEvents={onEvents}
        onHome={onHome}
        isEventsPage={isEventsPage}
        isApplyPage={isApplyPage}
      />

      {/* Desktop Navbar: Visible on large screens lg+ */}
      <div className="mx-auto hidden lg:flex w-full max-w-7xl lg:max-w-[1380px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onHome()
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
        <nav className="relative flex items-center rounded-full border border-white/10 bg-[#080a10]/80 px-4 py-1.5 backdrop-blur-2xl shadow-[0_8px_36px_rgba(0,0,0,0.3)]">
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

          {!isEventsPage && (
            <div className="pl-3 ml-2 border-l border-white/15">
              <button
                onClick={onApply}
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
      </div>
    </header>
  )
}
