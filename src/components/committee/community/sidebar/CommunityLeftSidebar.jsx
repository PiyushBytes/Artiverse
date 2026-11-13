import { useState } from 'react'
import { Heart, Search } from 'lucide-react'

export default function CommunityLeftSidebar({
  channels = [],
  communities = [],
  following = [],
  activeFilter,
  onSelectFilter,
}) {
  const [search, setSearch] = useState('')
  const [favStates, setFavStates] = useState({})

  const toggleFav = (id) => {
    setFavStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="w-full space-y-6 rounded-[24px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* ── Search People or Group ── */}
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people or group"
          className="min-h-10 w-full rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-3 text-xs font-medium text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
        />
      </div>

      {/* ── 1. FAVOURITES ── */}
      <div>
        <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Favourites
        </h4>
        <div className="mt-2 space-y-1">
          {channels.map((ch) => {
            const isFav = favStates[ch.id] !== undefined ? favStates[ch.id] : ch.isFav
            return (
              <div
                key={ch.id}
                onClick={() => onSelectFilter?.(ch.name)}
                className={`group flex cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2 transition-all ${
                  activeFilter === ch.name ? 'bg-[#f1f5f9]' : 'hover:bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {ch.avatar ? (
                    <img
                      src={ch.avatar}
                      alt={ch.name}
                      className="size-7 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#e2e8f0] text-xs">
                      {ch.icon || '💬'}
                    </span>
                  )}
                  <span className="truncate text-xs font-semibold text-[#1e293b] group-hover:text-[#2563eb]">
                    {ch.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFav(ch.id)
                  }}
                  className="p-1 text-[#2563eb] hover:scale-110 transition-transform"
                >
                  <Heart
                    size={13}
                    className={isFav ? 'fill-current text-[#2563eb]' : 'text-[#cbd5e1]'}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 2. COMMUNITY / DOMAIN CHANNELS ── */}
      <div>
        <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Community
        </h4>
        <div className="mt-2 space-y-1">
          {filteredCommunities.map((com) => {
            const isFav = favStates[com.id] !== undefined ? favStates[com.id] : true
            const isActive = activeFilter === com.name
            return (
              <div
                key={com.id}
                onClick={() => onSelectFilter?.(com.name)}
                className={`group flex cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2 transition-all ${
                  isActive ? 'bg-[#2563eb] text-white shadow-sm' : 'hover:bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#1e293b]'
                    }`}
                  >
                    {com.icon || '🎨'}
                  </span>
                  <span
                    className={`truncate text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-[#1e293b] group-hover:text-[#2563eb]'
                    }`}
                  >
                    {com.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFav(com.id)
                  }}
                  className={`p-1 transition-transform hover:scale-110 ${
                    isActive ? 'text-white' : 'text-[#2563eb]'
                  }`}
                >
                  <Heart
                    size={13}
                    className={
                      isFav
                        ? isActive
                          ? 'fill-current text-white'
                          : 'fill-current text-[#2563eb]'
                        : 'text-[#cbd5e1]'
                    }
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3. FOLLOWING / ACTIVE MEMBERS ── */}
      <div>
        <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Following
        </h4>
        <div className="mt-2 space-y-1">
          {following.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectFilter?.(user.name)}
              className="group flex cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2 transition-all hover:bg-[#f8fafc]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-7 shrink-0 rounded-full object-cover"
                  />
                  {user.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <span className="truncate text-xs font-semibold text-[#1e293b] group-hover:text-[#2563eb]">
                  {user.name}
                </span>
              </div>

              <span className="p-1 text-[#cbd5e1] group-hover:text-[#2563eb] transition-colors">
                <Heart size={13} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

