import { useEffect, useState } from 'react'
import { ArrowUpRight, Sparkles, UserCheck } from 'lucide-react'
import { MobileNavbar } from '../mobile'

export default function Navbar({
  onApply,
  onComingSoon,
  onEvents,
  onHome,
  onLogin,
  onSignOut,
  isEventsPage,
  isApplyPage,
  isLoginPage,
  currentUser
}) {
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

  const handleLogin = () => {
    if (onLogin) onLogin()
    else onComingSoon('Member Login')
  }

  return (
    <header
      className={`fixed inset-x-0 top-3 sm:top-5 z-50 w-full transition-all duration-200 pointer-events-none`}
    >
      {/* Mobile Navbar: Clean, dedicated mobile component from src/mobile */}
      <div className="pointer-events-auto">
        <MobileNavbar
          onApply={onApply}
          onComingSoon={onComingSoon}
          onEvents={onEvents}
          onHome={onHome}
          onLogin={handleLogin}
          onSignOut={onSignOut}
          loggedInUser={currentUser}
          isEventsPage={isEventsPage}
          isApplyPage={isApplyPage}
          isLoginPage={isLoginPage}
        />
      </div>

      {/* Desktop Navbar: Visible on large screens lg+ */}
      <div className="relative mx-auto hidden lg:flex w-full max-w-7xl lg:max-w-[1380px] items-center justify-between px-6 lg:px-8 pointer-events-auto">
        {/* Logo on Left */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onHome()
          }}
          className="group relative z-10 inline-flex items-center gap-1 focus:outline-none"
          aria-label="Artiverse Home"
        >
          <span className="font-display text-[24px] sm:text-[27px] font-bold tracking-[-0.01em] text-white transition-colors duration-150 group-hover:text-lime">
            Artiverse
          </span>
          <span className="size-1.5 rounded-full bg-lime opacity-80" />
        </a>

        {/* Desktop Navigation Capsule: Centered in the middle, with bright white border and links only */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center rounded-full border border-white/40 bg-[#080a10]/85 px-6 py-2 backdrop-blur-2xl shadow-[0_8px_36px_rgba(0,0,0,0.4),0_0_16px_rgba(255,255,255,0.06)] hover:border-white/55 transition-colors duration-200">
          <div className="flex items-center gap-6 xl:gap-7">
            {links.map((item) => {
              const isActive = item === 'Events' && isEventsPage
              return (
                <button
                  key={item}
                  onClick={() => handleNav(item)}
                  className={`py-1 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                    isActive ? 'text-lime font-bold' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              )
            })}

            {/* Kalakriti’26 Ghost Link */}
            <a
              href="https://kalakriti.arteza.online"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 py-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors duration-150 hover:text-lime"
            >
              <span>Kalakriti’26</span>
              <ArrowUpRight size={13} className="text-lime/90" />
            </a>
          </div>
        </nav>

        {/* Top Right Corner: LOG IN / Member Button */}
        <div className="z-10 flex items-center justify-end gap-3">
          {currentUser ? (
            <div className="group relative flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_20px_rgba(212,255,36,0.18)]">
              <span className="grid size-5 place-items-center rounded-full bg-lime text-[10px] font-extrabold text-ink">
                {currentUser.fullName?.charAt(0) || 'M'}
              </span>
              <span className="text-lime">
                {currentUser.fullName?.split(' ')[0] || 'Member'}
              </span>
              <span className="size-1.5 rounded-full bg-lime animate-pulse" />
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className={`lime-button glow group relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-transform duration-150 hover:scale-[1.03] active:scale-95 ${
                isLoginPage
                  ? 'ring-2 ring-white/60 shadow-[0_0_28px_rgba(212,255,36,0.5)]'
                  : 'shadow-[0_0_20px_rgba(212,255,36,0.3)]'
              }`}
              aria-label="Log in"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles size={12} className="text-ink" />
                LOG IN
              </span>
            </button>
          )}
          {currentUser ? (
            <button onClick={onSignOut} className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65 transition hover:border-white/35 hover:text-white">
              Sign Out
            </button>
          ) : (
            null
          )}
        </div>
      </div>
    </header>
  )
}
