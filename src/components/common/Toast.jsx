import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Info, X } from 'lucide-react'

export default function Toast({ message, onClose, duration = 4000 }) {
  // Auto-dismiss toast after duration (default 4 seconds)
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-[100] flex items-center gap-3 rounded-2xl border border-[#e4e6da] bg-[#0d0f08] px-4 py-3 text-xs font-medium text-white shadow-2xl backdrop-blur-md min-[900px]:bottom-6 min-[900px]:left-auto min-[900px]:right-6 min-[900px]:max-w-sm"
          role="status"
        >
          <span className="size-2 shrink-0 rounded-full bg-[#d4ff1f]" />
          <span className="flex-1 leading-snug">{message}</span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-6 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
