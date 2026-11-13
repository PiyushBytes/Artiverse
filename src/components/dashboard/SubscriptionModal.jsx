import { useState } from 'react'
import {
  Building2,
  Check,
  Crown,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function SubscriptionModal({
  isOpen,
  onClose,
  currentCount = 5,
  limit = 5,
  isSubscribed = false,
  onSubscribe,
  onToast,
}) {
  const [billingCycle, setBillingCycle] = useState('annual') // 'annual' | 'monthly'
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSubscribe?.()
      onToast?.('🎉 Welcome to Artiverse Council Pro! Unlimited committees unlocked.')
      onClose()
    }, 900)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-[#e4e6da] bg-[#fafaf5] p-6 shadow-2xl sm:p-8"
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

          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#414d1e]">
              <Crown size={13} className="text-[#849158]" />
              <span>Council Pro Subscription</span>
            </span>

            <h2 className="font-display mt-3.5 text-2xl font-bold tracking-tight text-[#0d0f08] sm:text-3xl">
              Unlock Unlimited Committees
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs text-[#5e6355] sm:text-sm">
              You have utilized <strong className="text-[#0d0f08]">{currentCount} of {limit} free committee slots</strong>. Upgrade to Artiverse Pro to scale your campus organizations without limits.
            </p>
          </div>

          {/* Quota Progress Bar */}
          <div className="my-5 rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0d0f08]">Free Tier Allocation</span>
              <span className="font-mono font-semibold text-[#849158]">
                {currentCount} / {limit} Used ({Math.min(100, Math.round((currentCount / limit) * 100))}%)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#f0f1ea]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#849158] to-[#d4ff1f] transition-all duration-500"
                style={{ width: `${Math.min(100, (currentCount / limit) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[#5e6355]">
              Free accounts are limited to {limit} active committees. Council Pro removes all creation caps.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border border-[#e4e6da] bg-white p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#0d0f08] text-white shadow-sm'
                    : 'text-[#5e6355] hover:text-[#0d0f08]'
                }`}
              >
                Annual (Save 40%)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#0d0f08] text-white shadow-sm'
                    : 'text-[#5e6355] hover:text-[#0d0f08]'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Plan Card */}
          <div className="mt-4 rounded-2xl border-2 border-[#d4ff1f] bg-white p-5 shadow-[0_8px_30px_rgb(212,255,31,0.2)]">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-md bg-[#d4ff1f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d0f08]">
                  Council Pro Plan
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#0d0f08]">Campus Organizer Pass</h3>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-[#0d0f08]">
                  {billingCycle === 'annual' ? '₹499' : '₹99'}
                  <span className="text-xs font-normal text-[#5e6355]">
                    {billingCycle === 'annual' ? '/year' : '/month'}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <span className="text-[10px] font-semibold text-[#849158]">
                    Just ₹41/month · Billed annually
                  </span>
                )}
              </div>
            </div>

            {/* Features checklist */}
            <ul className="mt-4 space-y-2 border-t border-[#f0f1ea] pt-3 text-xs text-[#5e6355]">
              {[
                'Unlimited Committee Creations (No 5-club ceiling)',
                'Verified Green Checkmark on all committee profiles',
                'Multi-tier council roles (President, VP, GS, Joint Sec, Treasurer, POCs)',
                'Priority Event Ticket Publishing & Gate QR Validation',
                'Campus-wide recruitment management & candidate pipeline export',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#d4ff1f] text-[#0d0f08]">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[#0d0f08] font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#5e6355]">
              <ShieldCheck size={14} className="text-[#849158]" />
              <span>Cancel or renew anytime · Instant activation</span>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleUpgrade}
              className="lime-button glow flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0d0f08] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-[#0d0f08] border-t-transparent" />
                  <span>Activating Pro...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Upgrade to Council Pro</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

