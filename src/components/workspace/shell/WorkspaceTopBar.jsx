import { useState } from 'react'
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  Menu,
  Megaphone,
  Plus,
  Search,
  UserPlus,
} from 'lucide-react'

export default function WorkspaceTopBar({
  workspace,
  activeModule,
  onOpenSearch,
  onOpenCreateTask,
  onOpenCreateAnnouncement,
  onOpenCreateMeeting,
  onOpenInviteMember,
  onToggleMobileSidebar,
}) {
  const [createMenuOpen, setCreateMenuOpen] = useState(false)

  const moduleNames = {
    overview: 'Overview',
    members: 'Members & Roles',
    tasks: 'Tasks',
    announcements: 'Announcements',
    meetings: 'Meetings',
    settings: 'Settings',
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e4e6da] bg-[#fafaf5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* ── Left: Mobile Hamburger & Breadcrumb ── */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation sidebar"
          className="lg:hidden rounded-[8px] p-1.5 text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[11px] sm:gap-2.5 sm:text-xs">
          <span className="hidden text-[#8b907f] sm:inline">Committees</span>
          <span className="hidden text-[#8b907f] sm:inline">/</span>
          <span className="max-w-[76px] truncate font-medium text-[#5e6355] sm:max-w-[180px]">{workspace?.name || 'Workspace'}</span>
          <span className="text-[#8b907f]">/</span>
          <h1 className="truncate font-semibold text-[#0d0f08]">
            {moduleNames[activeModule] || 'Overview'}
          </h1>
        </nav>
      </div>

      {/* ── Right: Command Search & Dark "Create" Dropdown ── */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        {/* Command Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search workspace"
          className="flex size-9 items-center justify-center gap-2 rounded-[10px] border border-[#e4e6da] bg-white text-xs text-[#5e6355] transition-colors hover:border-[#0d0f08]/30 hover:bg-[#f6f7f0] hover:text-[#0d0f08] sm:h-10 sm:w-auto sm:justify-start sm:px-3"
        >
          <Search size={15} className="text-[#8b907f]" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden sm:inline-block rounded-[4px] border border-[#e4e6da] bg-[#ffffff] px-1.5 py-0.2 font-mono text-[10px] text-[#8b907f]">
            Ctrl K
          </kbd>
        </button>

        {/* Dark "Create" Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCreateMenuOpen((prev) => !prev)}
            aria-label="Create workspace item"
            className="flex h-9 items-center gap-1 rounded-[10px] bg-[#0d0f08] px-2.5 text-xs font-semibold text-[#ffffff] transition-colors hover:bg-[#0d0f08]/85 sm:h-10 sm:gap-1.5 sm:px-3.5"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown size={14} className="text-[#8b907f]" />
          </button>

          {createMenuOpen && (
            <>
              <div
                onClick={() => setCreateMenuOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-48 rounded-[12px] border border-[#e4e6da] bg-[#ffffff] p-1.5 text-xs shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false)
                    onOpenCreateTask?.()
                  }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left font-medium text-[#0d0f08] hover:bg-[#f6f7f0]"
                >
                  <CheckSquare size={16} className="text-[#5e6355]" />
                  <span>New Task</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false)
                    onOpenCreateAnnouncement?.()
                  }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left font-medium text-[#0d0f08] hover:bg-[#f6f7f0]"
                >
                  <Megaphone size={16} className="text-[#5e6355]" />
                  <span>Broadcast Announcement</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false)
                    onOpenCreateMeeting?.()
                  }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left font-medium text-[#0d0f08] hover:bg-[#f6f7f0]"
                >
                  <Calendar size={16} className="text-[#5e6355]" />
                  <span>Schedule Meeting</span>
                </button>

                <div className="my-1 border-t border-[#e4e6da]" />

                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false)
                    onOpenInviteMember?.()
                  }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left font-medium text-[#0d0f08] hover:bg-[#f6f7f0]"
                >
                  <UserPlus size={16} className="text-[#5e6355]" />
                  <span>Invite Member</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

