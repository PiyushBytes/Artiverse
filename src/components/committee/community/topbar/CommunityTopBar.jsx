import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  Home,
  MessageCircle,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export default function CommunityTopBar({
  committee,
  activeTab = 'home',
  onChangeTab,
  searchQuery,
  onSearchChange,
  currentUser,
  viewMode = 'community',
  onToggleViewMode,
  onNavigate,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e9ecef] bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate?.(`/committees/${committee?.slug || 'artikon'}`)}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#2563eb] text-white shadow-sm font-bold text-lg">
              {committee?.logo || '💬'}
            </span>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-[#0f172a]">
                {committee?.name ? `${committee.name.split(' ')[0]} Hub` : 'Community'}
              </span>
              <p className="hidden sm:block text-[10px] text-[#94a3b8] font-mono">
                @{committee?.handle || 'community'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Top Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0] px-2 py-1">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'discussions', label: 'Discussions', icon: MessageSquare },
            { id: 'events', label: 'Events', icon: Sparkles },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab?.(item.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Search Bar in Middle/Right */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search post and comments..."
            className="min-h-10 w-full rounded-full border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-4 text-xs font-medium text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
          />
        </div>

        {/* Right: Notifications & User profile pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative grid size-9 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition shadow-sm"
          >
            <Bell size={16} />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              2
            </span>
          </button>

          <button
            type="button"
            className="relative hidden sm:grid size-9 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition shadow-sm"
          >
            <MessageCircle size={16} />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-[#2563eb] text-[9px] font-bold text-white">
              1
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white p-1 pl-1.5 shadow-sm">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
              }
              alt="User"
              className="size-7 rounded-full object-cover"
            />
            <span className="hidden sm:inline text-xs font-bold text-[#0f172a]">
              {currentUser?.name || 'Salahudin'}
            </span>
            <ChevronDown size={13} className="text-[#94a3b8] mr-1" />
          </div>
        </div>
      </div>
    </header>
  )
}

