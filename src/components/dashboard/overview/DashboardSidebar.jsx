import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CalendarDays, FileCheck2, LayoutDashboard, Settings, Ticket, UserRound, Users, X } from 'lucide-react'

const iconProps = { size: 17, strokeWidth: 1.6 }

export default function DashboardSidebar({ mobileOpen, onClose, applicationCount }) {
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    if (!mobileOpen) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen, onClose])

  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/committees', label: 'Committees', icon: Users },
    { to: '/events', label: 'Events', icon: CalendarDays },
    { to: '/registrations?tab=passes', label: 'My passes', icon: Ticket },
    { to: '/registrations?tab=applications', label: 'Applications', icon: FileCheck2, badge: applicationCount },
    { to: '/profile', label: 'My Profile', icon: UserRound },
  ]

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-[#0d0f08]/30 min-[900px]:hidden" />}
      <aside id="dashboard-navigation" className={`fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col border-r border-[#e4e6da] bg-[#fafaf5] transition-transform duration-200 motion-reduce:transition-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full min-[900px]:translate-x-0'}`} aria-label="Dashboard sidebar">
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#e4e6da] px-5">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 text-sm font-semibold tracking-[-.01em] text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">
            <span className="size-2 rounded-full bg-[#d4ff1f]" aria-hidden="true" /> Artiverse
          </Link>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="grid size-8 place-items-center rounded-[8px] text-[#5e6355] hover:bg-[#f6f7f0] min-[900px]:hidden"><X size={17} /></button>
        </div>

        <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map(({ to, label, icon: Icon, badge }) => {
            const active = label === 'Applications'
              ? path === '/registrations' && location.search.includes('tab=applications')
              : label === 'My passes'
                ? path === '/registrations' && (!location.search || location.search.includes('tab=passes'))
            : label === 'Committees'
              ? path === '/dashboard' && location.hash.includes('committees-heading')
              : path === to
            return (
              <Link key={label} to={to} onClick={onClose} aria-current={active ? 'page' : undefined} className={`flex min-h-10 items-center gap-3 rounded-[10px] px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-[#0d0f08] ${active ? 'bg-[#f6f7f0] font-semibold text-[#0d0f08]' : 'font-medium text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]'}`}>
                <Icon {...iconProps} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {label === 'Applications' && badge > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-[#d4ff1f] px-1.5 text-[11px] font-semibold tabular-nums text-[#0d0f08]">{badge}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-[#e4e6da] p-3">
          <Link to="/settings" onClick={onClose} aria-current={path === '/settings' ? 'page' : undefined} className="flex min-h-10 items-center gap-3 rounded-[10px] px-3 text-[13px] font-medium text-[#5e6355] transition-colors hover:bg-[#f6f7f0] hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">
            <Settings {...iconProps} /> Settings
          </Link>
        </div>
      </aside>
    </>
  )
}
