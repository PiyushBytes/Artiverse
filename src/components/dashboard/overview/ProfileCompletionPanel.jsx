import { Check, Circle, Pencil } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { DashboardPanel, PanelSkeleton, QueryErrorState } from './DashboardPanel'

export default function ProfileCompletionPanel({ query, profile }) {
  const reduceMotion = useReducedMotion()
  if (query.isPending) return <DashboardPanel id="completion-heading" title="Profile completion"><PanelSkeleton rows={3} /></DashboardPanel>
  if (query.isError) return <DashboardPanel id="completion-heading" title="Profile completion"><QueryErrorState error={query.error} onRetry={() => query.refetch()} /></DashboardPanel>

  const missingFields = profile.fields.filter((field) => !field.complete)
  return (
    <DashboardPanel id="completion-heading" title="Profile completion">
      <div className="p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-[#5e6355]">Required fields</span>
          <span className="text-sm font-semibold tabular-nums text-[#0d0f08]">{profile.percent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f6f7f0]" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={profile.percent}>
          <motion.span initial={{ scaleX: reduceMotion ? profile.percent / 100 : 0 }} animate={{ scaleX: profile.percent / 100 }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }} className="block h-full origin-left rounded-full bg-[#d4ff1f]" />
        </div>
        <p className="mt-2 text-xs leading-5 text-[#8b907f]">{profile.completed} of {profile.total} required fields complete</p>

        {missingFields.length > 0 ? (
          <ul className="mt-4 divide-y divide-[#e4e6da] border-t border-[#e4e6da]">
            {missingFields.map((field) => (
              <li key={field.id}>
                <Link to={field.href} className="flex min-h-10 items-center justify-between gap-3 text-xs text-[#5e6355] transition-colors hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">
                  <span className="flex items-center gap-2"><Circle size={14} strokeWidth={1.6} />{field.label}</span>
                  <Pencil size={14} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 flex items-center gap-2 border-t border-[#e4e6da] pt-4 text-xs font-medium text-[#0d0f08]"><Check size={15} /> Required profile fields are complete</p>
        )}
      </div>
    </DashboardPanel>
  )
}
