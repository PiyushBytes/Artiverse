import { ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export default function AuthHeader({ onBack }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 w-full shrink-0 border-b border-[#e4e6da] bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Back to Home */}
        <div className="flex flex-1 items-center justify-start">
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-[#f5f6ef] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d0f08] transition-all hover:border-[#0d0f08]/30 hover:bg-white"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-150 group-hover:-translate-x-1 text-[#5e6355]"
            />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Back</span>
          </motion.button>
        </div>

        {/* Middle: Artiverse Community Badge */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#414d1e] shadow-sm backdrop-blur-xl sm:px-4 sm:text-[11px]"
          >
            <Sparkles size={12} className="text-[#839b3d]" />
            <span>Artiverse Portal</span>
          </motion.div>
        </div>

        {/* Right Corner: Secure Member Portal */}
        <div className="flex flex-1 items-center justify-end">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-[#f5f6ef] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e6355] sm:px-3.5 sm:text-[11px]"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#839b3d]" />
            <span className="hidden sm:inline">Secure Access</span>
            <span className="sm:hidden">Secure</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
