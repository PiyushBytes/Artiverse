import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Bell, ChevronDown, LogOut, Menu, Plus, Search } from 'lucide-react'
import { getUnreadNotificationsCount } from '../../../hooks/useDashboardData'

function getInitials(user) {
  const names = [user?.first_name, user?.last_name].filter((value) => typeof value === 'string' && value.trim())
  if (names.length) return names.map((name) => name.trim()[0]).join('').slice(0, 2).toUpperCase()
  const name = typeof user?.fullName === 'string' && !user.fullName.includes('@') ? user.fullName : user?.name
  return typeof name === 'string' ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : ''
}

function getDisplayName(user) {
  if (typeof user?.fullName === 'string' && !user.fullName.includes('@')) return user.fullName
  const names = [user?.first_name, user?.last_name].filter((value) => typeof value === 'string' && value.trim())
  if (names.length) return names.join(' ')
  return typeof user?.name === 'string' && !user.name.includes('@') ? user.name : ''
}

export default function DashboardTopbar({ user, sectionTitle = 'Overview', onToggleSidebar, onOpenSearch, onOpenNotifications, onCreateCommittee, onCreateEvent, onSignOut }) {
  const reduceMotion = useReducedMotion()
  const [createOpen, setCreateOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const menuRef = useRef(null)
  const unreadCount = getUnreadNotificationsCount(user)
  const initials = getInitials(user)
  const userName = getDisplayName(user)
  const avatar = user?.avatar_url || user?.profile_image || user?.avatar || '/pictureb.webp'

  useEffect(() => {
    const closeMenus = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setCreateOpen(false)
        setAccountOpen(false)
      }
    }
    const onKeyDown = (event) => { if (event.key === 'Escape') { setCreateOpen(false); setAccountOpen(false) } }
    document.addEventListener('mousedown', closeMenus)
    window.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('mousedown', closeMenus); window.removeEventListener('keydown', onKeyDown) }
  }, [])

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenSearch()
      }
    }
    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [onOpenSearch])

  const menuInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }
  const menuAnimate = { opacity: 1, scale: 1, y: 0 }
  const menuExit = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }
  const menuTransition = { duration: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-[#e4e6da] bg-[#fafaf5]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1120px] items-center gap-3 px-4 sm:px-6">
        <button type="button" onClick={onToggleSidebar} aria-label="Open dashboard navigation" aria-controls="dashboard-navigation" className="grid size-9 shrink-0 place-items-center rounded-[8px] text-[#5e6355] hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-[#0d0f08] min-[900px]:hidden"><Menu size={18} strokeWidth={1.6} /></button>
        <div className="hidden shrink-0 items-center gap-2 text-xs text-[#8b907f] sm:flex"><span>Artiverse</span><span aria-hidden="true">/</span><span className="font-medium text-[#0d0f08]">{sectionTitle}</span></div>

        <button type="button" onClick={onOpenSearch} aria-label="Search the dashboard" className="ml-auto flex h-9 min-w-0 max-w-[320px] flex-1 items-center gap-2 rounded-[10px] border border-[#e4e6da] bg-white px-3 text-left text-xs text-[#8b907f] transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-[#0d0f08] sm:ml-auto sm:flex-initial sm:w-[260px]">
          <Search size={16} strokeWidth={1.6} />
          <span className="flex-1 truncate">Search</span>
          <kbd className="hidden rounded-[5px] border border-[#e4e6da] px-1.5 py-0.5 font-sans text-[10px] text-[#8b907f] sm:inline">Ctrl K</kbd>
        </button>

        <div ref={menuRef} className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button type="button" onClick={() => { setCreateOpen((open) => !open); setAccountOpen(false) }} aria-expanded={createOpen} aria-haspopup="menu" className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#0d0f08] px-3 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
              <Plus size={16} strokeWidth={1.6} /><span className="hidden sm:inline">Create</span><ChevronDown size={14} strokeWidth={1.6} />
            </button>
            <AnimatePresence>
              {createOpen && (
                <motion.div initial={menuInitial} animate={menuAnimate} exit={menuExit} transition={menuTransition} role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-44 rounded-[10px] border border-[#e4e6da] bg-white p-1.5">
                  <button type="button" role="menuitem" onClick={() => { setCreateOpen(false); onCreateCommittee() }} className="flex min-h-9 w-full items-center gap-2 rounded-[7px] px-2.5 text-left text-xs text-[#0d0f08] hover:bg-[#f6f7f0]"><Plus size={15} /> Committee</button>
                  <button type="button" role="menuitem" onClick={() => { setCreateOpen(false); onCreateEvent?.() }} disabled={!onCreateEvent} title={!onCreateEvent ? 'Event publishing is not connected yet' : undefined} className="flex min-h-9 w-full items-center gap-2 rounded-[7px] px-2.5 text-left text-xs text-[#0d0f08] hover:bg-[#f6f7f0] disabled:cursor-not-allowed disabled:text-[#8b907f]"><Plus size={15} /> Event</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="button" onClick={onOpenNotifications} aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'} className="relative grid size-9 place-items-center rounded-[10px] border border-[#e4e6da] bg-white text-[#0d0f08] transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">
            <Bell size={17} strokeWidth={1.6} />
            {unreadCount > 0 && <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#d4ff1f] ring-2 ring-white" />}
          </button>

          <div className="relative">
            <button type="button" onClick={() => { setAccountOpen((open) => !open); setCreateOpen(false) }} aria-label="Open account menu" aria-expanded={accountOpen} aria-haspopup="menu" className="grid size-9 place-items-center overflow-hidden rounded-full border border-[#e4e6da] bg-white text-xs font-semibold text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
              {avatar ? <img src={avatar} alt="" className="size-full object-cover" /> : initials}
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div initial={menuInitial} animate={menuAnimate} exit={menuExit} transition={menuTransition} role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 rounded-[10px] border border-[#e4e6da] bg-white p-1.5">
                  {userName && <p className="truncate border-b border-[#e4e6da] px-2.5 py-2 text-xs font-medium text-[#0d0f08]">{userName}</p>}
                  <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); onSignOut() }} className="flex min-h-9 w-full items-center gap-2 rounded-[7px] px-2.5 text-left text-xs text-[#0d0f08] hover:bg-[#f6f7f0]"><LogOut size={15} /> Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
