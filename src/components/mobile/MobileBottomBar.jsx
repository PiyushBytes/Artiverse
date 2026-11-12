import { Bell, Building2, GraduationCap, LayoutDashboard, Mail, Search, User } from 'lucide-react'
import { mobileBottomLoggedIn, mobileBottomLoggedOut } from '../../config/navigationData'

const iconMap = {
  building: Building2,
  student: GraduationCap,
  search: Search,
  contact: Mail,
  dashboard: LayoutDashboard,
  bell: Bell,
  profile: User,
}

export default function MobileBottomBar({
  currentUser,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenContact,
  onOpenProfile,
}) {
  const items = currentUser ? mobileBottomLoggedIn : mobileBottomLoggedOut
  const unreadCount =
    currentUser?.unreadNotificationsCount ??
    (currentUser?.notifications?.filter((n) => n.unread)?.length || 0)

  const handleItemClick = (id) => {
    switch (id) {
      case 'registerCommittee':
        onNavigate('/register?role=committee')
        break
      case 'joinStudent':
        onNavigate('/apply')
        break
      case 'search':
        onOpenSearch()
        break
      case 'contact':
        onOpenContact()
        break
      case 'dashboard':
        onNavigate('/dashboard')
        break
      case 'notifications':
        onOpenNotifications()
        break
      case 'profile':
        onOpenProfile()
        break
      default:
        break
    }
  }

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4e6da] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl min-[900px]:hidden"
    >
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          const isLime = item.isLime

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className="group flex flex-col items-center justify-center gap-1 py-1.5 transition-transform active:scale-95"
            >
              <span
                className={`relative grid size-8 place-items-center rounded-xl transition-all ${
                  isLime
                    ? 'bg-[#d4ff1f] text-[#0d0f08] font-bold shadow-sm'
                    : 'text-[#424638] group-hover:text-[#0d0f08]'
                }`}
              >
                <Icon size={17} />
                {item.hasBadge && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid min-w-3.5 place-items-center rounded-full bg-[#0d0f08] px-1 text-[8px] font-bold text-[#d4ff1f] ring-1 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-semibold tracking-tight ${
                  isLime ? 'text-[#0d0f08] font-bold' : 'text-[#5e6355]'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

