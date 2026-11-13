import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  Ticket,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { getCommitteeList } from '../api/committee'

export default function SearchPage({ onNavigate }) {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getCommitteeList()
      .then((res) => {
        if (cancelled || !res) return
        const owned = Array.isArray(res.owned) ? res.owned : []
        const memberOf = Array.isArray(res.member_of) ? res.member_of : []

        const liveCommittees = [
          ...owned
            .filter((c) => Boolean(c && (c.committee_username || c.committee_name || c.name)))
            .map((c) => ({
              id: `c_${c.id}`,
              type: 'committee',
              title: c.committee_name || c.name || (c.committee_username ? c.committee_username.replace(/_/g, ' ') : 'Campus Committee'),
              subtitle: c.committee_description || `@${c.committee_username || 'handle'} · Official Campus Committee`,
              category: c.committee_category || 'Creative Arts & Design',
              tag: 'Recruitments Open',
              link: c.committee_username ? `/committees/${c.committee_username}` : '/events',
            })),
          ...memberOf
            .filter((m) => Boolean(m && (m.committee_username || m.committee_name || m.committee?.committee_username || m.committee?.committee_name)))
            .map((m) => {
              const comm = m.committee || m
              return {
                id: `m_${comm.id || m.id}`,
                type: 'committee',
                title: comm.committee_name || comm.name || (comm.committee_username ? comm.committee_username.replace(/_/g, ' ') : 'Campus Club'),
                subtitle: comm.committee_description || `@${comm.committee_username || 'club'} · Member Council`,
                category: comm.committee_category || 'Campus Club',
                tag: 'Member',
                link: comm.committee_username ? `/committees/${comm.committee_username}` : '/events',
              }
            }),
        ]

        setItems(liveCommittees)
      })
      .catch(() => {
        setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const results = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType
    const q = (query || '').trim().toLowerCase()
    if (!q) return matchesType
    const matchesQuery =
      (item.title || '').toLowerCase().includes(q) ||
      (item.subtitle || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    return matchesType && matchesQuery
  })

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] px-4 pb-20 pt-8 min-[900px]:px-6 min-[900px]:pt-28">
      <div className="mx-auto max-w-[850px]">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
            <Search size={13} className="text-[#839b3d]" />
            <span>Campus Search Engine</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#0d0f08]">
            Search Artiverse
          </h1>
          <p className="mt-2 text-sm text-[#5e6355]">
            Find official committees, registered campus clubs, and student organizations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6355]"
          />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search committees, clubs or handles..."
            className="w-full rounded-2xl border border-[#e4e6da] bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-[#0d0f08] shadow-sm outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
          />
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'committee', label: 'Committees & Clubs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                filterType === tab.id
                  ? 'bg-[#0d0f08] text-white shadow-sm'
                  : 'bg-white border border-[#e4e6da] text-[#5e6355] hover:text-[#0d0f08]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-6 space-y-3">
          {loading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl border border-[#e4e6da] bg-white/70 p-4" />
              ))}
            </div>
          )}

          {!loading && results.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onNavigate(item.link)}
              className="flex items-center justify-between rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f5f6ef] border border-[#e4e6da] text-[#0d0f08]">
                  <Building2 size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#0d0f08]">{item.title}</h4>
                  <p className="text-xs text-[#5e6355]">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block rounded-full bg-[#f6f7f2] border border-[#e4e6da] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#424638]">
                  {item.tag}
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-[#f5f6ef] text-[#0d0f08]">
                  <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          ))}

          {!loading && results.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[#e4e6da] bg-white px-4">
              <Building2 size={32} className="mx-auto text-[#5e6355]/40" />
              <p className="mt-3 text-sm font-semibold text-[#0d0f08]">No committees registered yet</p>
              <p className="mt-1 text-xs text-[#5e6355]">Create your committee in the dashboard to list it on campus search.</p>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="lime-button glow mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
