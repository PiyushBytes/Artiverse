import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

const allCommitteesData = [
  {
    id: 'c1',
    name: 'Design Committee',
    category: 'Creative',
    tagline: 'Visual identities, festival branding, and creative design systems at MSIT.',
    college: 'MSIT, Kolkata',
    members: 38,
    status: 'open',
    domains: ['UI/UX', 'Branding', 'Illustration', 'Motion'],
    lead: 'Priya Sen (President)',
    icon: '🎨',
  },
  {
    id: 'c2',
    name: 'Cine Club MSIT',
    category: 'Cultural',
    tagline: 'Film screenings, cinematography workshops, and student film festivals.',
    college: 'MSIT, Kolkata',
    members: 46,
    status: 'open',
    domains: ['Screenwriting', 'Cinematography', 'Sound', 'Editing'],
    lead: 'Rohan Banerjee (Lead)',
    icon: '🎬',
  },
  {
    id: 'c3',
    name: 'ByteForge Tech Society',
    category: 'Technical',
    tagline: 'Open source builds, hackathons, and AI/Web development community.',
    college: 'MSIT, Kolkata',
    members: 62,
    status: 'open',
    domains: ['Fullstack', 'AI/ML', 'DevOps', 'App Dev'],
    lead: 'Siddharth Roy (Convenor)',
    icon: '⚡',
  },
  {
    id: 'c4',
    name: 'Literary & Debating Society',
    category: 'Literary',
    tagline: 'Inter-college parliamentary debates, youth parliaments, and poetry slams.',
    college: 'MSIT, Kolkata',
    members: 32,
    status: 'open',
    domains: ['Parliamentary Debate', 'Content Writing', 'Editorial'],
    lead: 'Megha Dutta (Secretary)',
    icon: '🎙️',
  },
  {
    id: 'c5',
    name: 'Rotaract Club MSIT',
    category: 'Social Impact',
    tagline: 'Community welfare, blood donation camps, and campus social outreach drives.',
    college: 'MSIT, Kolkata',
    members: 74,
    status: 'closed',
    domains: ['Social Work', 'PR', 'Logistics'],
    lead: 'Anik Paul (President)',
    icon: '🤝',
  },
  {
    id: 'c6',
    name: 'Rhythm & Beats Band Club',
    category: 'Cultural',
    tagline: 'Campus music bands, instrumental jams, and annual festival headlining acts.',
    college: 'MSIT, Kolkata',
    members: 28,
    status: 'open',
    domains: ['Vocals', 'Guitar/Bass', 'Drums', 'Audio Tech'],
    lead: 'Tanmay Das (Band Lead)',
    icon: '🎸',
  },
]

const categories = ['All', 'Creative', 'Cultural', 'Technical', 'Literary', 'Social Impact']

export default function CommitteesPage({ onNavigate, onToast }) {
  const reduceMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = allCommitteesData.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domains.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* Header Strip */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#e4e6da] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
              <Building2 size={13} className="text-[#839b3d]" />
              <span>Campus Directory</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#0d0f08]">
              Campus Committees & Clubs
            </h1>
            <p className="mt-2 text-base text-[#5e6355] max-w-xl">
              Explore officially verified student committees, track open recruitments, and submit your application in one place.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/register?role=committee')}
            className="lime-button glow shrink-0 flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
          >
            <Plus size={15} />
            <span>Register Committee</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#0d0f08] text-white shadow-sm'
                    : 'bg-white border border-[#e4e6da] text-[#5e6355] hover:text-[#0d0f08] hover:border-[#0d0f08]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6355]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by club or domain..."
              className="w-full rounded-full border border-[#e4e6da] bg-white py-2 pl-9 pr-4 text-xs font-medium text-[#0d0f08] placeholder:text-[#5e6355]/60 outline-none focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08]"
            />
          </div>
        </div>

        {/* Committees Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <motion.div
              key={club.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col justify-between rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)]"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#f5f6ef] text-2xl border border-[#e4e6da]">
                    {club.icon}
                  </span>
                  {club.status === 'open' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#d4ff1f]/20 border border-[#d4ff1f] px-2.5 py-0.5 text-[10px] font-bold text-[#414d1e]">
                      <span className="size-1.5 rounded-full bg-[#839b3d]" />
                      Recruitments Open
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#f5f6ef] border border-[#e4e6da] px-2.5 py-0.5 text-[10px] font-medium text-[#5e6355]">
                      Recruitments Closed
                    </span>
                  )}
                </div>

                {/* Name & Tagline */}
                <h3 className="mt-4 font-display text-xl font-semibold text-[#0d0f08] group-hover:text-[#839b3d] transition-colors">
                  {club.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#5e6355] leading-relaxed">
                  {club.tagline}
                </p>

                {/* Domains Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {club.domains.map((dom) => (
                    <span
                      key={dom}
                      className="rounded-md bg-[#f6f7f2] border border-[#e4e6da]/70 px-2 py-0.5 text-[10.5px] font-medium text-[#424638]"
                    >
                      {dom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="mt-6 border-t border-[#f0f1ea] pt-4">
                <div className="flex items-center justify-between text-xs text-[#5e6355]">
                  <span className="flex items-center gap-1">
                    <Users size={13} />
                    <strong>{club.members}</strong> active members
                  </span>
                  <span>{club.college}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (club.status === 'open') {
                        onNavigate('/apply')
                      } else {
                        onToast?.(`Recruitments for ${club.name} are currently closed.`)
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      club.status === 'open'
                        ? 'bg-[#0d0f08] text-white hover:bg-[#839b3d]'
                        : 'bg-[#f5f6ef] text-[#5e6355] cursor-not-allowed'
                    }`}
                  >
                    <span>{club.status === 'open' ? 'Apply Now' : 'Closed'}</span>
                    {club.status === 'open' && <ArrowRight size={13} />}
                  </button>

                  <button
                    onClick={() => onToast?.(`Contacting Lead: ${club.lead}`)}
                    className="grid size-10 place-items-center rounded-xl border border-[#e4e6da] text-[#0d0f08] hover:bg-[#f5f6ef] transition-colors"
                    title={`Contact ${club.lead}`}
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty Search State */}
        {filtered.length === 0 && (
          <div className="mt-12 text-center py-16 rounded-[24px] border border-dashed border-[#e4e6da] bg-white">
            <Building2 size={36} className="mx-auto text-[#5e6355]/40" />
            <h4 className="mt-3 text-base font-semibold text-[#0d0f08]">No committees found</h4>
            <p className="mt-1 text-xs text-[#5e6355]">Try adjusting your search query or category filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

