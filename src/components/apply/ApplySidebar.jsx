import { ArrowLeft, Shield, Star, Users, Zap } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

const perks = [
  { icon: Users, label: '240+ applied this season' },
  { icon: Zap, label: `Apply by ${siteConfig.recruitment.closeDate}` },
  { icon: Star, label: `PI scheduled ${siteConfig.recruitment.piDateRange}` },
  { icon: Shield, label: 'Info used only for recruitment' },
]

export default function ApplySidebar({ onBack }) {
  return (
    <div className="flex flex-col justify-center px-4 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-14 lg:w-[42%] lg:px-12 lg:pb-16 lg:pt-32 xl:px-16">
      <button
        onClick={onBack}
        className="group mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white/50 transition-all hover:border-white/25 hover:text-white/80 lg:mb-12"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        Back
      </button>

      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-lime/80">
        Recruitment {siteConfig.recruitment.closeDate.split(' ').pop()}
      </p>

      <h1 className="mt-4 font-display text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.02] tracking-tight text-white">
        Join <i className="text-lime">Artiverse.</i>
      </h1>

      <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/50">
        Apply for a personal interview and become part of our creative community. Shape the art,
        ideas and moments that define campus culture.
      </p>

      {/* Feature pills */}
      <div className="mt-10 space-y-3 lg:mt-14">
        {perks.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-[13px] text-white/45">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
              <Icon size={14} className="text-white/50" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Domains grid */}
      <div className="mt-10 hidden lg:block">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
          Domains
        </p>
        <div className="flex flex-wrap gap-2">
          {siteConfig.domains.map((d) => (
            <span
              key={d.name}
              className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/45"
            >
              {d.icon} {d.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

