import { useState } from 'react'
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Layers,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

const workflows = {
  students: {
    title: 'For Students',
    badge: 'Student Journey',
    headline: 'Your gateway to campus culture, committees, and events.',
    steps: [
      {
        number: '01',
        title: 'Discover Committees',
        desc: 'Explore officially verified college clubs across Cultural, Tech, Design, and Social domains without missing notice board deadlines.',
        icon: Users,
      },
      {
        number: '02',
        title: 'One-Click Application',
        desc: 'Choose your preferred domains, paste your portfolio or GitHub link, and submit in under 2 minutes.',
        icon: FileCheck2,
      },
      {
        number: '03',
        title: 'Real-Time PI Scheduling',
        desc: 'Get live notifications when your interview slot is assigned. No messy WhatsApp groups or lost emails.',
        icon: Calendar,
      },
      {
        number: '04',
        title: 'Digital QR Event Passes',
        desc: 'Book tickets for college festivals and workshops. Your single-use QR pass is stored right inside your profile.',
        icon: Ticket,
      },
    ],
    ctaText: 'Apply to Committees',
    ctaLink: '/apply',
  },
  committees: {
    title: 'For Committee Leads',
    badge: 'Committee Management',
    headline: 'Run seamless recruitment cycles and manage your roster.',
    steps: [
      {
        number: '01',
        title: 'Register Your Committee',
        desc: 'Create an official presence with invite codes for vice presidents, coordinators, and core office bearers.',
        icon: Layers,
      },
      {
        number: '02',
        title: 'Applicant Shortlisting',
        desc: 'Review applicants domain by domain. Mark Shortlisted, Schedule PI, or Accepted with transparent status updates.',
        icon: Sparkles,
      },
      {
        number: '03',
        title: 'College Council Sync',
        desc: 'Export finalized member rosters directly for university administration and faculty advisory approvals.',
        icon: ShieldCheck,
      },
      {
        number: '04',
        title: 'Invite & Collaborate',
        desc: 'Send invitations to other committees to co-host events and pool festival budgets together.',
        icon: Users,
      },
    ],
    ctaText: 'Register Your Committee',
    ctaLink: '/register?role=committee',
  },
  organisers: {
    title: 'For Event Organisers',
    badge: 'Festival & Ticketing',
    headline: 'High-speed entry scanning and sponsor analytics.',
    steps: [
      {
        number: '01',
        title: 'Publish Events & Tickets',
        desc: 'Set pass tiers, early bird limits, and venue capacities. Instant shareable booking links.',
        icon: Ticket,
      },
      {
        number: '02',
        title: 'Anti-Counterfeit QR Scanning',
        desc: 'Volunteers scan passes at campus gates using any phone camera. Each QR is valid strictly once with zero duplicates.',
        icon: QrCode,
      },
      {
        number: '03',
        title: 'Live Capacity Tracker',
        desc: 'Watch real-time gate throughput and attendance percentage right from the organiser control room.',
        icon: CheckCircle2,
      },
      {
        number: '04',
        title: 'Sponsor Footfall Reports',
        desc: 'Generate automated audit-ready reports documenting student turnout and brand impressions.',
        icon: Award,
      },
    ],
    ctaText: 'Create Event Ticket',
    ctaLink: '/events',
  },
}

export default function HowItWorksPage({ onNavigate }) {
  const reduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState('students')
  const current = workflows[activeTab]

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] px-4 pb-20 pt-8 min-[900px]:px-6 min-[900px]:pt-28">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-4 py-1.5 text-xs font-semibold text-[#35392d]">
            <Sparkles size={13} className="text-[#839b3d]" />
            <span>How Artiverse Works</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#0d0f08]">
            Built for everyone who creates campus culture.
          </h1>
          <p className="mt-3 text-base text-[#5e6355]">
            One unified operating system that connects students, committees, and event organisers.
          </p>

          {/* Interactive Role Switcher Tabs */}
          <div className="mt-8 inline-flex items-center rounded-full border border-[#e4e6da] bg-white p-1.5 shadow-sm">
            {Object.keys(workflows).map((key) => {
              const item = workflows[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                    isActive ? 'bg-[#0d0f08] text-white shadow-sm' : 'text-[#5e6355] hover:text-[#0d0f08]'
                  }`}
                >
                  {item.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#839b3d]">
                {current.badge}
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0d0f08]">
                {current.headline}
              </h2>
            </div>
            <button
              onClick={() => onNavigate(current.ctaLink)}
              className="lime-button glow hidden sm:flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <span>{current.ctaText}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {current.steps.map((st, i) => {
              const Icon = st.icon
              return (
                <motion.div
                  key={st.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex flex-col justify-between rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-[#839b3d]">
                        {st.number}
                      </span>
                      <span className="grid size-10 place-items-center rounded-xl bg-[#f5f6ef] border border-[#e4e6da] text-[#0d0f08]">
                        <Icon size={18} />
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-lg font-semibold text-[#0d0f08]">
                      {st.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#5e6355] leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-[#839b3d]">
                    <CheckCircle2 size={13} />
                    <span>Included in Artiverse</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => onNavigate(current.ctaLink)}
              className="lime-button glow w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <span>{current.ctaText}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

