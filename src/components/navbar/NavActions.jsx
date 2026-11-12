import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut, Menu, Settings, User, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function NavActions({
  currentUser,
  onLogin,
  onSignOut,
  onOpenNotifications,
  onOpenProfile,
  onOpenSettings,
  menuOpen,
  setMenuOpen,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileMenuOpen])

  const unreadCount =
    currentUser?.unreadNotificationsCount ??
    (currentUser?.notifications?.filter((n) => n.unread)?.length || 0)

  const initials =
    currentUser?.initials ||
    currentUser?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('') ||
    'U'

  return (
    <div className="flex shrink-0 items-center gap-2.5">
      {currentUser ? (
        /* ── LOGGED IN: Notifications with badge + Profile Avatar Dropdown ── */
        <div className="flex items-center gap-2">
          {/* Notifications Button with Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative grid size-10 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08] transition-colors hover:bg-[#f6f7f2] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-[#0d0f08] px-1 text-[9px] font-bold text-[#d4ff1f] ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar with Dropdown Menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-expanded={profileMenuOpen}
              className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#0d0f08] font-mono text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
              aria-label="User account menu"
            >
              {initials}
            </button>

            {/* Profile Dropdown Menu (Strictly: Profile, Settings, Log out) */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-2xl border border-[#e4e6da] bg-white p-1.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.18)]"
                >
                  <div className="border-b border-[#e4e6da] px-3 py-2">
                    <p className="truncate text-xs font-bold text-[#0d0f08]">{currentUser.fullName}</p>
                    <p className="truncate text-[10px] text-[#5e6355]">
                      {currentUser.role === 'lead' ? 'Committee Lead' : 'Student Member'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        onOpenProfile?.()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0d0f08] transition-colors hover:bg-[#f6f7f2]"
                    >
                      <User size={15} className="text-[#5e6355]" />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        onOpenSettings?.()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#0d0f08] transition-colors hover:bg-[#f6f7f2]"
                    >
                      <Settings size={15} className="text-[#5e6355]" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-[#e4e6da] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        onSignOut()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      <span>Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* ── LOGGED OUT: Log in (lime button) ── */
        <button
          type="button"
          onClick={onLogin}
          className="button-primary min-h-10 px-4 text-xs font-bold sm:min-h-11 sm:px-5 sm:text-sm"
        >
          Log in
        </button>
      )}

      {/* Hamburger Menu Toggle (for Mobile View) */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08] min-[900px]:hidden hover:bg-[#f6f7f2]"
      >
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
    </div>
  )
}
