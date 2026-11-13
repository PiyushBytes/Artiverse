import { Building2, CheckCircle2, GraduationCap, Palette, Sparkles, Star } from 'lucide-react'
import { motion } from 'motion/react'

const perks = [
  {
    icon: Sparkles,
    title: 'Recruitment & PI Scheduling',
    desc: 'Real-time notifications on personal interview slots.',
  },
  {
    icon: Star,
    title: 'Anti-Counterfeit QR Passes',
    desc: 'Digital gate passes valid strictly once for campus events.',
  },
  {
    icon: Palette,
    title: 'Committee Roster & Council Sync',
    desc: 'Official team management and inter-club collaboration.',
  },
]

export default function AuthHero({ mode }) {
  return (
    <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d] w-fit mb-3">
        <Sparkles size={13} className="text-[#839b3d]" />
        <span>Campus Culture OS</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.08] tracking-tight text-[#0d0f08]"
      >
        {mode === 'register' ? (
          <>
            Create your campus <br />
            <i className="italic text-[#839b3d] font-normal">creator profile.</i>
          </>
        ) : (
          <>
            One account for your <br />
            <i className="italic text-[#839b3d] font-normal">entire campus journey.</i>
          </>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-[#5e6355]"
      >
        {mode === 'register'
          ? 'Join Artiverse to access festival passes, committee recruitments, and campus event tickets.'
          : 'Enter your registered email or mobile to receive single-use authentication access.'}
      </motion.p>

      {/* Perks list */}
      <div className="mt-6 space-y-2.5">
        {perks.map(({ icon: Icon, title, desc }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.25 + idx * 0.08 }}
            className="flex items-center gap-3 rounded-2xl border border-[#e4e6da] bg-white p-3 shadow-sm transition-all hover:shadow-md"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#d4ff1f]/30 text-[#414d1e]">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#0d0f08]">{title}</h4>
              <p className="text-[11px] text-[#5e6355] truncate">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Origin footer note */}
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#5e6355]">
        <CheckCircle2 size={14} className="text-[#839b3d]" />
        <span>Built for campus committees and university student councils</span>
      </div>
    </div>
  )
}
