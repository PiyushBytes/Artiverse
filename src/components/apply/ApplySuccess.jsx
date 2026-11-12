import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function ApplySuccess({ onBack, onReset, bookingUrl }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(212,255,36,0.06),transparent_65%)] blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg text-center"
        >
          <motion.div
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-8 grid size-20 place-items-center rounded-full border border-lime/30 bg-lime/[0.08] shadow-[0_0_60px_rgba(212,255,36,0.12)]"
          >
            <CheckCircle2 className="size-10 text-lime" />
          </motion.div>

          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Application <i className="text-lime">received.</i>
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-white/55">
            You've already applied. Book your personal interview slot to complete the next step.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            {bookingUrl ? (
              <a
                className="lime-button glow rounded-full px-8 py-4 text-sm font-bold"
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
              >
                Book PI Slot <ExternalLink size={16} />
              </a>
            ) : (
              <p className="rounded-full border border-cobalt/40 bg-cobalt/[0.06] px-6 py-3 text-sm text-cobalt-soft">
                PI booking link will be available soon.
              </p>
            )}

            <button
              onClick={onBack}
              className="ghost-button rounded-full px-6 py-3 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft size={15} /> Back to Home
            </button>

            <button
              onClick={onReset}
              className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/35 transition hover:text-white/60"
            >
              Apply again
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

