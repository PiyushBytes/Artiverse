import { useLocation } from 'react-router-dom'
import {
  CalendarDays,
  FileCheck2,
  LayoutDashboard,
  Settings,
  Ticket,
  UserRound,
  Users,
} from 'lucide-react'

export default function DashboardIconRail({
  applicationCount = 0,
  onNavigate,
}) {
  const location = useLocation()
  const path = location.pathname

  const mainLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/committees', label: 'Committees', icon: Users },
    { to: '/events', label: 'Live Events', icon: CalendarDays },
    { to: '/registrations?tab=passes', label: 'My passes', icon: Ticket },
    {
      to: '/registrations?tab=applications',
      label: 'Applications',
      icon: FileCheck2,
      badge: applicationCount,
    },
    { to: '/profile', label: 'My Profile', icon: UserRound },
  ]

  const settingsLink = { to: '/settings', label: 'Settings', icon: Settings }

  const isCurrentActive = (link) => {
    if (link.label === 'Applications') {
      return path === '/registrations' && location.search.includes('tab=applications')
    }
    if (link.label === 'My passes') {
      return (
        path === '/registrations' &&
        (!location.search || location.search.includes('tab=passes'))
      )
    }
    if (link.label === 'Committees') {
      return path === '/committees'
    }
    if (link.label === 'Overview') {
      return path === '/dashboard'
    }
    if (link.label === 'My Profile') {
      return path === '/profile'
    }
    return path === link.to
  }

  const settingsActive = path === '/settings'

  return (
    <aside
      aria-label="Dashboard navigation rail"
      className="fixed inset-y-0 left-0 z-40 hidden w-[68px] flex-col items-center justify-between border-r border-[#e4e6da] bg-[#ffffff] py-6 shadow-[1px_0_4px_rgba(0,0,0,0.02)] min-[900px]:flex"
    >
      {/* ── Top Brand Icon ── */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onNavigate?.('/dashboard')}
          aria-label="Go to Overview"
          className="grid size-10 place-items-center rounded-[12px] bg-[#0d0f08] text-[#d4ff1f] shadow-sm transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
        >
          <span className="size-2 rounded-full bg-[#d4ff1f]" />
        </button>

      </div>

      {/* Keep the main destinations centered in the available rail height. */}
      <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2" aria-label="Main navigation icons">
          {mainLinks.map((link) => {
            const Icon = link.icon
            const active = isCurrentActive(link)

            return (
              <div key={link.label} className="group relative">
                <button
                  type="button"
                  onClick={() => onNavigate?.(link.to)}
                  aria-label={link.label}
                  aria-current={active ? 'page' : undefined}
                  className={`relative grid size-11 place-items-center rounded-[12px] transition-all focus-visible:outline-2 focus-visible:outline-[#0d0f08] ${
                    active
                      ? 'bg-[#0d0f08] text-white shadow-xs'
                      : 'text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]'
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />

                  {/* Dot/Count Badge */}
                  {link.badge > 0 && (
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#d4ff1f] ring-2 ring-white" />
                  )}
                </button>

                {/* Hover Tooltip */}
                <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-[8px] bg-[#0d0f08] px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {link.label}
                  {link.badge > 0 && ` (${link.badge})`}
                </span>
              </div>
            )
          })}
      </nav>

      {/* ── Bottom Settings Icon ── */}
      <div className="group relative">
        <button
          type="button"
          onClick={() => onNavigate?.(settingsLink.to)}
          aria-label={settingsLink.label}
          aria-current={settingsActive ? 'page' : undefined}
          className={`grid size-11 place-items-center rounded-[12px] transition-all focus-visible:outline-2 focus-visible:outline-[#0d0f08] ${
            settingsActive
              ? 'bg-[#0d0f08] text-white shadow-xs'
              : 'text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]'
          }`}
        >
          <Settings size={19} strokeWidth={settingsActive ? 2.2 : 1.8} />
        </button>

        <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-[8px] bg-[#0d0f08] px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {settingsLink.label}
        </span>
      </div>
    </aside>
  )
}
