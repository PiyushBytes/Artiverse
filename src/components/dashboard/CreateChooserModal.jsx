import { ArrowRight, Building2, Calendar, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function CreateChooserModal({
  isOpen,
  onClose,
  userCommittees = [],
  isSubscribed = false,
  onSelectCommittee,
  onSelectEvent,
  onSkip,
}) {
  if (!isOpen) return null

  const count = userCommittees?.length || 0
  const isLimitReached = count >= 5 && !isSubscribed

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#e4e6da] bg-[#fafaf5] p-6 shadow-2xl sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#5e6355] hover:bg-black/5 hover:text-[#0d0f08]"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Title & Subtitle */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#46630b]">
              <Sparkles size={12} className="text-[#849158]" />
              <span>Welcome to Artiverse</span>
            </span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[#0d0f08] sm:text-3xl">
              What would you like to launch today?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#5e6355] sm:text-sm">
              Empower your campus community by setting up a committee or publishing your next flagship festival.
            </p>
          </div>

          {/* 2 Big Cards Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Card 1: Create a committee (Primary with Lime Border) */}
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                onSelectCommittee();
              }}
              className="group relative flex flex-col justify-between rounded-[24px] border-2 border-[#d4ff1f] bg-white p-6 text-left shadow-[0_12px_36px_-12px_rgba(212,255,31,0.25)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#d4ff1f] text-[#0d0f08] shadow-sm transition-transform group-hover:rotate-6">
                    <Building2 size={24} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isLimitReached
                        ? 'border border-amber-300 bg-amber-50 text-amber-800'
                        : isSubscribed
                        ? 'border border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#414d1e]'
                        : 'border border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                    }`}
                  >
                    {isLimitReached
                      ? '5/5 Used · Pro Required'
                      : isSubscribed
                      ? 'Pro · Unlimited'
                      : `${count}/5 Free Used`}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0d0f08]">Create a committee</h3>
                <p className="mt-1.5 text-xs text-[#5e6355] leading-relaxed">
                  Set up your club or team, assign key roles (President, VP, GS), and invite members. First 5 committees free!
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#0d0f08]">
                <span>{isLimitReached ? 'Upgrade to Create' : 'Get started'}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>

            {/* Card 2: Create an event (Secondary) */}
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                onSelectEvent();
              }}
              className="group relative flex flex-col justify-between rounded-[24px] border border-[#e4e6da] bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)] transition-all hover:border-[#0d0f08]/30"
            >
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fafaf5] text-[#0d0f08] border border-[#e4e6da] transition-transform group-hover:rotate-6">
                  <Calendar size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0d0f08]">Create an event</h3>
                <p className="mt-1.5 text-xs text-[#5e6355] leading-relaxed">
                  Publish campus events, open ticket registrations, issue QR gate passes, and track entries.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#0d0f08]">
                <span>Set up event</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          </div>

          {/* Skip Footer Link */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSkip?.();
              }}
              className="text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08] hover:underline"
            >
              Skip, I'll explore as a student →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

