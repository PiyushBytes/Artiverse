import { ArrowRight } from 'lucide-react'

export default function DashboardSectionHeading({ eyebrow, title, count, action, onAction }) {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-[#ded8cf] pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium text-[#77736d]">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-2xl leading-tight text-[#171614] sm:text-3xl">
          {title}{typeof count === 'number' && <span className="ml-2 font-sans text-sm font-medium text-[#8a857e]">{count}</span>}
        </h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex min-h-9 items-center gap-2 self-start text-xs font-semibold text-[#65615b] transition hover:text-[#ef6b3b] sm:self-auto"
        >
          {action}<ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}
