import { useEffect } from 'react'
import { Mail, MessageCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { siteConfig } from '../../config/siteConfig'

export default function ContactModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0d0f08]/50 px-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          className="w-full max-w-sm rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3">
            <h3 className="font-display text-lg font-bold text-[#0d0f08]">Get in touch</h3>
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full text-[#5e6355] hover:bg-[#f6f7f2]"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#5e6355]">
            Have a question about committee registration, student onboarding, or campus events? Reach
            out directly.
          </p>

          <div className="mt-5 space-y-2.5">
            {/* Email Option */}
            <a
              href={siteConfig.links.email}
              className="flex items-center gap-3 rounded-2xl border border-[#e4e6da] p-3 text-left transition-all hover:border-[#0d0f08] hover:bg-[#f6f7f2]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[#0d0f08] text-white">
                <Mail size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0d0f08]">Email Support</p>
                <p className="truncate text-[11px] text-[#5e6355]">connect.arteza@gmail.com</p>
              </div>
            </a>

            {/* WhatsApp Option */}
            <a
              href="https://wa.me/917534233233"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#e4e6da] p-3 text-left transition-all hover:border-[#25D366] hover:bg-[#25D366]/5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[#25D366] text-white">
                <MessageCircle size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0d0f08]">WhatsApp Chat</p>
                <p className="truncate text-[11px] text-[#5e6355]">Quick query response</p>
              </div>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

