import { Bell, Menu, X } from 'lucide-react'
import MobileMenu from '../navbar/MobileMenu'

export default function MobileNavbar({
  currentUser,
  onLogin,
  onOpenNotifications,
  onOpenProfile,
  onNavigate,
  onLinkClick,
  menuOpen,
  setMenuOpen,
}) {
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
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#e4e6da] bg-[#fafaf5]/95 px-3 backdrop-blur-md min-[900px]:hidden sm:px-4">
      {/* Left: Logo */}
      <a
        href="/"
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault()
            onNavigate('/')
          }
        }}
        className="inline-flex items-center gap-2 font-bold tracking-tight text-[#0d0f08]"
      >
        <span className="size-2 rounded-full bg-[#d4ff1f]" />
        <span className="text-base font-bold">Artiverse</span>
      </a>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {currentUser ? (
          <>
            {/* Notifications icon with badge */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative grid size-9 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08]"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-3.5 place-items-center rounded-full bg-[#0d0f08] px-1 text-[8px] font-bold text-[#d4ff1f] ring-1 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-white bg-[#0d0f08] font-mono text-[11px] font-bold text-white shadow-sm"
              aria-label="Open profile menu"
            >
              {initials}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08]"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </>
        ) : (
          <>
            {/* Lime Log in button */}
            <button
              type="button"
              onClick={onLogin}
              className="button-primary h-9 px-3.5 text-xs font-bold"
            >
              Log in
            </button>

            {/* Menu icon */}
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08]"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </>
        )}
      </div>
      {menuOpen && <MobileMenu currentUser={currentUser} onLinkClick={onLinkClick} />}
    </header>
  )
}

