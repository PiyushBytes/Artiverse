import { ArrowUpRight, CalendarDays, Home, Sparkles } from 'lucide-react'

function itemClass(active) {
  return `flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-1 text-[9px] font-semibold uppercase tracking-[.08em] transition-colors ${active ? 'text-lime' : 'text-white/55 active:text-white'}`
}

export default function MobileBottomBar({ onHome, onEvents, onApply, isEventsPage, isApplyPage, isLoginPage }) {
  const isHomePage = !isEventsPage && !isApplyPage && !isLoginPage
  return <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-50 px-4 pb-safe lg:hidden">
    <div className="mx-auto grid h-[58px] w-full max-w-md grid-cols-4 rounded-full border border-white/15 bg-[#10131b]/90 px-2 shadow-[0_10px_40px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl">
      <button onClick={onHome} className={itemClass(isHomePage)} aria-label="Home" aria-current={isHomePage ? 'page' : undefined}>
        <Home size={17} strokeWidth={1.8}/><span>Home</span>
      </button>
      <button onClick={onEvents} className={itemClass(isEventsPage)} aria-label="Events" aria-current={isEventsPage ? 'page' : undefined}>
        <CalendarDays size={17} strokeWidth={1.8}/><span>Events</span>
      </button>
      <a href="https://kalakriti.arteza.online" target="_blank" rel="noreferrer" className={itemClass(false)} aria-label="Kalakriti 26">
        <span className="flex items-center gap-0.5 text-[12px] font-bold tracking-normal">K’26<ArrowUpRight size={11}/></span><span>Fest</span>
      </a>
      <button onClick={onApply} className={itemClass(isApplyPage)} aria-label="Apply" aria-current={isApplyPage ? 'page' : undefined}>
        <Sparkles size={17} strokeWidth={1.8}/><span>Apply</span>
      </button>
    </div>
  </nav>
}
