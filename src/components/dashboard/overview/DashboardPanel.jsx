import { AlertCircle, RotateCw } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export function panelVariants(reduceMotion) {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] } },
  }
}

export function DashboardPanel({ id, title, count, action, onAction, children, className = '', reduceMotion: requestedReduceMotion }) {
  const systemReduceMotion = useReducedMotion()
  const reduceMotion = requestedReduceMotion ?? systemReduceMotion
  return (
    <motion.section
      variants={panelVariants(reduceMotion)}
      className={`overflow-hidden rounded-[14px] border border-[#e4e6da] bg-white ${className}`}
      aria-labelledby={id}
    >
      <div className="flex min-h-[58px] items-center justify-between gap-3 border-b border-[#e4e6da] px-4 py-3 sm:px-5">
        <h2 id={id} className="text-sm font-semibold text-[#0d0f08] sm:text-base">
          {title}
          {typeof count === 'number' && <span className="ml-2 tabular-nums text-[#8b907f]">{count}</span>}
        </h2>
        {action && onAction && (
          <button type="button" onClick={onAction} className="text-xs font-medium text-[#5e6355] transition-colors hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
            {action}
          </button>
        )}
      </div>
      {children}
    </motion.section>
  )
}

export function EmptyState({ children, action, to, onAction, compact = false }) {
  return (
    <div className={`m-4 rounded-[10px] border border-dashed border-[#e4e6da] px-4 text-center ${compact ? 'py-5' : 'py-7'}`}>
      <p className="mx-auto max-w-sm text-xs leading-5 text-[#5e6355]">{children}</p>
      {action && to && onAction && (
        <button type="button" onClick={() => onAction(to)} className="mt-3 inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
          {action}
        </button>
      )}
      {action && !to && onAction && (
        <button type="button" onClick={onAction} className="mt-3 inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
          {action}
        </button>
      )}
    </div>
  )
}

export function QueryErrorState({ error, onRetry }) {
  return (
    <div className="m-4 flex items-start gap-3 rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-4" role="alert">
      <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#5e6355]" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#0d0f08]">This section could not be loaded</p>
        {error?.message && <p className="mt-1 break-words text-xs text-[#5e6355]">{error.message}</p>}
        <button type="button" onClick={onRetry} className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs font-semibold text-[#0d0f08] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
          <RotateCw size={13} /> Try again
        </button>
      </div>
    </div>
  )
}

export function PanelSkeleton({ rows = 2 }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="space-y-0 px-4 sm:px-5" aria-label="Loading" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex min-h-[62px] items-center gap-3 border-b border-[#e4e6da] last:border-b-0">
          <span className={`size-8 shrink-0 rounded-full bg-[#f6f7f0] ${reduceMotion ? '' : 'animate-pulse motion-reduce:animate-none'}`} />
          <span className="flex-1 space-y-2">
            <span className={`block h-3 w-2/5 rounded bg-[#f6f7f0] ${reduceMotion ? '' : 'animate-pulse motion-reduce:animate-none'}`} />
            <span className={`block h-2.5 w-1/4 rounded bg-[#f6f7f0] ${reduceMotion ? '' : 'animate-pulse motion-reduce:animate-none'}`} />
          </span>
        </div>
      ))}
    </div>
  )
}

export default DashboardPanel;
