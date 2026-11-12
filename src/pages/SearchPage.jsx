import { useState } from 'react'
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

const directoryDatabase = [
  {
    id: 's_1',
    type: 'committee',
    title: 'Design Committee MSIT',
    subtitle: 'Branding, UI/UX & Festival Creatives',
    category: 'Creative Club',
    tag: 'Recruitments Open',
    link: '/committees',
  },
  {
    id: 's_2',
    type: 'committee',
    title: 'Cine Club MSIT',
    subtitle: 'Screenwriting, Cinematography & Film Festivals',
    category: 'Cultural Club',
    tag: 'Recruitments Open',
    link: '/committees',
  },
  {
    id: 's_3',
    type: 'committee',
    title: 'ByteForge Tech Society',
    subtitle: 'Hackathons, Web Dev & Open Source',
    category: 'Technical Club',
    tag: 'Recruitments Open',
    link: '/committees',
  },
  {
    id: 's_4',
    type: 'event',
    title: 'Cine-Charcha 2026',
    subtitle: 'MSIT Auditorium · March 15',
    category: 'Film Conclave',
    tag: 'Passes Live (₹99)',
    link: '/events',
  },
  {
    id: 's_5',
    type: 'event',
    title: "Kalakriti'26 Annual Fest",
    subtitle: 'Main Grounds · March 28-30',
    category: 'Cultural Festival',
    tag: 'Early Bird Live (₹149)',
    link: '/events',
  },
  {
    id: 's_6',
    type: 'college',
    title: 'Meghnad Saha Institute of Technology',
    subtitle: 'Kolkata, West Bengal · 8 Active Committees',
    category: 'University Campus',
    tag: 'Verified Partner',
    link: '/about',
  },
]

export default function SearchPage({ onNavigate }) {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const results = directoryDatabase.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
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
            Find committees, campus events, festivals, and student opportunities across colleges.
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
            placeholder="Search committees, events, colleges (e.g. Design, Kalakriti, MSIT)..."
            className="w-full rounded-2xl border border-[#e4e6da] bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-[#0d0f08] shadow-sm outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
          />
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'committee', label: 'Committees' },
            { id: 'event', label: 'Events & Passes' },
            { id: 'college', label: 'Colleges' },
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
          {results.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onNavigate(item.link)}
              className="flex items-center justify-between rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f5f6ef] border border-[#e4e6da] text-[#0d0f08]">
                  {item.type === 'committee' && <Building2 size={18} />}
                  {item.type === 'event' && <Ticket size={18} />}
                  {item.type === 'college' && <MapPin size={18} />}
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

          {results.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#e4e6da] bg-white">
              <Search size={32} className="mx-auto text-[#5e6355]/40" />
              <p className="mt-2 text-sm font-semibold text-[#0d0f08]">No matching records found</p>
              <p className="text-xs text-[#5e6355]">Try a different search keyword</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

