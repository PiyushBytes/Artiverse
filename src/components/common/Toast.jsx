import { AnimatePresence, motion } from 'motion/react'

export default function Toast({ message, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          className="fixed bottom-[calc(92px+env(safe-area-inset-bottom))] left-1/2 z-[90] flex -translate-x-1/2 items-center rounded-full border border-[#d4ff1f]/40 bg-[#11151d] px-5 py-3 text-sm text-white shadow-xl min-[900px]:bottom-5"
          role="status"
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-4 font-bold text-[#d4ff1f] hover:opacity-80"
            aria-label="Dismiss"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

