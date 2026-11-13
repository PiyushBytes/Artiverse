import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export default function ProfileCompletenessCard({ completeness = 75, nextStep, onNavigate }) {
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completeness / 100) * circumference

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)]">
      <div className="flex items-center gap-5">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex size-20 shrink-0 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 80 80">
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#e4e6da"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#d4ff1f"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Centered Percentage */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-sm font-bold text-[#0d0f08]">{completeness}%</span>
            <span className="text-[8px] font-semibold text-[#5e6355]">DONE</span>
          </div>
        </div>

        {/* Info & Next Step CTA */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]">
            <ShieldCheck size={14} className="text-[#849158]" />
            <span>Profile Verification</span>
          </div>
          <p className="mt-1 text-xs text-[#5e6355] leading-relaxed">
            {nextStep || 'Add your social handles and resume to unlock instant club recruitment.'}
          </p>

          <button
            type="button"
            onClick={() => onNavigate?.('/settings')}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0d0f08] hover:underline"
          >
            <span>Complete Profile</span>
            <ArrowRight size={13} className="text-[#849158]" />
          </button>
        </div>
      </div>
    </div>
  )
}

