import { Home, Calendar, ArrowUpRight, Sparkles } from 'lucide-react'

export default function MobileBottomBar({ onHome, onEvents, onApply, isEventsPage, isApplyPage }) {
  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none lg:hidden"
    >
      <div className="mx-auto flex h-13 max-w-[340px] items-center justify-between rounded-full border border-white/15 bg-[#080a10]/92 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl pointer-events-auto">
        {/* Home */}
        <button
          onClick={onHome}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            !isEventsPage && !isApplyPage ? 'text-lime' : 'text-white/60 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home size={17} />
          <span>Home</span>
        </button>

        {/* Events */}
        <button
          onClick={onEvents}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            isEventsPage ? 'text-lime' : 'text-white/60 hover:text-white'
          }`}
          aria-label="Events"
        >
          <Calendar size={17} />
          <span>Events</span>
        </button>

        {/* Kalakriti’26 */}
        <a
          href="https://kalakriti.arteza.online"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60 hover:text-lime transition-colors"
          aria-label="Kalakriti 26"
        >
          <div className="flex items-center">
            <span className="font-bold text-[11px]">K'26</span>
            <ArrowUpRight size={11} className="text-lime" />
          </div>
          <span>Fest</span>
        </a>

        {/* Apply CTA Pill */}
        <button
          onClick={onApply}
          className="lime-button glow flex items-center gap-1 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(212,255,36,0.35)] active:scale-95 transition-transform"
          aria-label="Apply for recruitment"
        >
          <Sparkles size={12} className="text-ink" />
          <span>JOIN</span>
        </button>
      </div>
    </nav>
  )
}

