import { TicketCheck } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { heroMockupData } from '../../../config/heroData'

export default function VerifiedCard({ activeRole }) {
  const reduceMotion = useReducedMotion()
  const card = heroMockupData.roleCards[activeRole] || heroMockupData.roleCards.Student

  return <AnimatePresence mode="wait" initial={false}>
    <motion.div key={activeRole} initial={reduceMotion ? false : { opacity: 0, x: -12, y: 5 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: 8 }} transition={{ duration: reduceMotion ? 0 : 0.24 }} className="absolute bottom-[12%] -left-[42px] z-30 w-[236px] rounded-[18px] border border-[#2b2f23] bg-[#0d0f08]/95 p-3 text-white shadow-[0_16px_36px_-8px_rgba(0,0,0,0.4)] sm:-left-[46px] sm:w-[246px]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#d4ff1f] text-[#0d0f08] shadow-[0_0_16px_rgba(212,255,31,0.25)]">
          <TicketCheck size={16} strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-tight text-white">{card.title}</span>
            <span className="text-[9px] font-semibold text-[#d4ff1f]">Just now</span>
          </div>
          <p className="truncate text-[10px] text-white/70">{card.desc}</p>
          <p className="mt-0.5 text-[9px] font-medium text-white/50">{card.meta}</p>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
}
