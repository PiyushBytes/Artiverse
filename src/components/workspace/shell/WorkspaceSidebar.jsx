import {
  Calendar,
  Building2,
  CheckSquare,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Megaphone,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react'

export default function WorkspaceSidebar({
  workspace,
  activeModule,
  onSelectModule,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) {
  const slug = workspace?.slug || 'artikon'

  // Badges calculate strictly when > 0
  const pendingRequestsCount = (workspace?.joinRequests || []).length
  const activeTasksCount = (workspace?.tasks || []).filter(
    (t) => t.status !== 'done'
  ).length
  const upcomingMeetingsCount = (workspace?.meetings || []).filter(
    (m) => m.status === 'upcoming'
  ).length
  const unreadAnnouncementsCount = (workspace?.announcements || []).length

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'members',
      label: 'Members & Roles',
      icon: Users,
      badge: pendingRequestsCount,
      badgeVariant: 'lime',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: activeTasksCount,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      badge: unreadAnnouncementsCount,
    },
    {
      id: 'meetings',
      label: 'Meetings',
      icon: Calendar,
      badge: upcomingMeetingsCount,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: 0,
    },
  ]

  const content = (
    <div className="flex h-full w-[248px] flex-col justify-between border-r border-[#e4e6da] bg-[#fafaf5] p-4 text-[#0d0f08]">
      {/* ── Committee Identity ── */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-[#e4e6da] bg-white text-[#5e6355]">
              {workspace?.logo ? workspace.logo : <Building2 size={18} strokeWidth={1.7} />}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-[15px] font-semibold tracking-tight text-[#0d0f08]">
                {workspace?.name || 'Committee'}
              </h2>
              <span className="block truncate font-mono text-[10px] text-[#5e6355]">
                @{slug}
              </span>
            </div>
          </div>

          {isOpenMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden rounded-[8px] p-1 text-[#5e6355] hover:bg-[#f6f7f0]"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* ── View Public Page Link ── */}
        <button
          type="button"
          onClick={() => onNavigate(`/committees/${slug}`)}
          className="mt-2 flex w-full items-center justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs font-semibold text-[#5e6355] transition-colors hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
        >
          <span>View Public Page</span>
          <ExternalLink size={13} className="text-[#8b907f]" />
        </button>

        {/* ── Navigation Menu ── */}
        <nav aria-label="Workspace navigation" className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectModule(item.id)
                  onCloseMobile?.()
                }}
                className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0d0f08] text-[#ffffff] font-semibold'
                    : 'text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#ffffff]' : 'text-[#8b907f]'}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Badges shown strictly only when > 0 */}
                {item.badge > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.2 font-mono text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#ffffff]/20 text-[#ffffff]'
                        : item.badgeVariant === 'lime'
                        ? 'bg-[#d4ff1f] text-[#0d0f08]'
                        : 'bg-[#f6f7f0] text-[#0d0f08] border border-[#e4e6da]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Bottom Identity Pill ── */}
      <div className="border-t border-[#e4e6da] pt-3">
        <div className="flex items-center gap-2 text-[11px] text-[#5e6355]">
          <span className="size-2 rounded-full bg-[#d4ff1f]" />
          <span className="truncate font-medium">Council Workspace</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Permanent 236px) */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen">
        {content}
      </aside>

      {/* Mobile Slide-over Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onCloseMobile}
            className="absolute inset-0 bg-[#0d0f08]/40 backdrop-blur-xs"
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  )
}

