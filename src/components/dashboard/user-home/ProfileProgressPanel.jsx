import { ArrowUpRight, ShieldCheck } from 'lucide-react'

export default function ProfileProgressPanel({ completeness = 50, nextStep, onNavigate }) {
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, Number(completeness) || 0))
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <section className="grid gap-5 border border-[#ded8cf] bg-[#f1eee8] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6">
      <div className="relative grid size-[76px] shrink-0 place-items-center">
        <svg className="size-full -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r={radius} stroke="#d9d4ca" strokeWidth="5" fill="transparent" />
          <circle
            cx="40" cy="40" r={radius} stroke="#ef6b3b" strokeWidth="5" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-display text-lg text-[#171614]">{progress}%</span>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-medium text-[#65615b]">
          <ShieldCheck size={16} className="text-[#65615b]" /> Profile completion
        </p>
        <p className="mt-1 font-display text-xl leading-snug text-[#171614]">Complete your profile</p>
        <p className="mt-1 text-xs leading-5 text-[#65615b]">{nextStep || 'Add a few details so committees can get to know you.'}</p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate?.('/profile')}
        className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#171614] bg-[#171614] px-4 text-xs font-semibold text-white transition-colors hover:border-[#38332f] hover:bg-[#38332f] sm:justify-self-end"
      >
        Edit profile <ArrowUpRight size={14} />
      </button>
    </section>
  )
}
