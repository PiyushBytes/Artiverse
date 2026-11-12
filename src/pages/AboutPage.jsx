import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function AboutPage({ onNavigate }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* Hero Banner */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-4 py-1.5 text-xs font-semibold text-[#35392d]">
            <Heart size={13} className="text-[#839b3d]" />
            <span>Our Campus Story</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-medium tracking-tight text-[#0d0f08] leading-[1.08]">
            Built at MSIT, Kolkata. <br />
            <i className="text-[#839b3d]">For the culture makers.</i>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5e6355] leading-relaxed">
            Every semester, passionate student leads spend hundreds of hours managing registrations on messy spreadsheets, posting notices that get lost, and dealing with counterfeit festival passes. Artiverse was created to give university culture the modern operating system it deserves.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[#e4e6da] bg-white p-7 shadow-sm">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#d4ff1f]/30 text-[#414d1e]">
              <Users size={22} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-[#0d0f08]">
              Decentralized Clubs
            </h3>
            <p className="mt-2 text-xs text-[#5e6355] leading-relaxed">
              Every committee keeps its identity, its team hierarchy, and its recruitment domain workflow intact without centralized friction.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e4e6da] bg-white p-7 shadow-sm">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#0d0f08] text-white">
              <ShieldCheck size={22} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-[#0d0f08]">
              Anti-Counterfeit Gates
            </h3>
            <p className="mt-2 text-xs text-[#5e6355] leading-relaxed">
              Single-use dynamic QR codes ensure only real ticket holders enter college auditoriums and festivals. Zero pass sharing.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e4e6da] bg-white p-7 shadow-sm">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f5f6ef] text-[#0d0f08] border border-[#e4e6da]">
              <Sparkles size={22} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-[#0d0f08]">
              Student First
            </h3>
            <p className="mt-2 text-xs text-[#5e6355] leading-relaxed">
              One profile stores your club applications, PI interview dates, and event tickets. No repetitive Google forms each semester.
            </p>
          </div>
        </div>

        {/* Location & Team Card */}
        <div className="mt-12 rounded-[28px] border border-[#e4e6da] bg-white p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#839b3d]">
              <MapPin size={15} />
              <span>Headquarters & Origin</span>
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#0d0f08]">
              Meghnad Saha Institute of Technology
            </h2>
            <p className="mt-2 text-sm text-[#5e6355] max-w-xl">
              Uchhepota, Madurdaha, Kolkata, West Bengal 700150. Initiated by student leads and designers passionate about modernizing campus workflows.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#424638]">
              <span className="flex items-center gap-1.5 rounded-full bg-[#f6f7f2] border border-[#e4e6da] px-3 py-1">
                <CheckCircle2 size={13} className="text-[#839b3d]" />
                MSIT Student Council Approved
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#f6f7f2] border border-[#e4e6da] px-3 py-1">
                <CheckCircle2 size={13} className="text-[#839b3d]" />
                Official Ticketing Partner
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf7] p-6 text-center shrink-0 w-full md:w-72">
            <Mail size={24} className="mx-auto text-[#0d0f08]" />
            <h4 className="mt-2 text-sm font-bold text-[#0d0f08]">Have questions or ideas?</h4>
            <p className="mt-1 text-[11px] text-[#5e6355]">Official communications desk</p>
            <a
              href="mailto:connect.arteza@gmail.com"
              className="mt-3 block text-xs font-bold text-[#839b3d] hover:underline"
            >
              connect.arteza@gmail.com
            </a>
            <button
              onClick={() => onNavigate('/contact')}
              className="mt-4 w-full rounded-xl bg-[#0d0f08] py-2 text-xs font-semibold text-white hover:bg-[#839b3d] transition-colors"
            >
              Open Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

