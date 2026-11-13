import { Check, Copy, Download, MapPin, QrCode, ShieldCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export default function TicketQrModal({ pass, onClose, onToast }) {
  const [copied, setCopied] = useState(false)

  if (!pass) return null

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(pass.passNumber)
    setCopied(true)
    onToast?.(`Pass code ${pass.passNumber} copied to clipboard!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMock = () => {
    onToast?.(`Downloading offline digital pass ${pass.passNumber}...`)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/60 backdrop-blur-sm"
        />

        {/* Modal Ticket Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#e4e6da] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6da] bg-[#fafaf5] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#d4ff1f]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0d0f08]">
                Verified Digital Gate Pass
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-7 place-items-center rounded-full text-[#5e6355] hover:bg-black/5 hover:text-[#0d0f08]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Ticket Body */}
          <div className="p-6 text-center">
            <span className="inline-block rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/20 px-3 py-1 text-[11px] font-bold text-[#46630b]">
              {pass.ticketType} · {pass.status}
            </span>

            <h3 className="font-display mt-2.5 text-xl font-bold text-[#0d0f08]">
              {pass.eventTitle}
            </h3>
            <p className="mt-1 text-xs text-[#5e6355]">{pass.committeeName}</p>

            {/* QR Visual Canvas */}
            <div className="relative mx-auto my-5 flex size-44 items-center justify-center rounded-2xl border-2 border-dashed border-[#0d0f08]/20 bg-[#fafaf5] p-3 shadow-inner">
              {/* Simulated QR Pattern */}
              <div className="relative flex size-full flex-col items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                <QrCode size={110} className="text-[#0d0f08]" strokeWidth={1.8} />
                <span className="mt-1.5 font-mono text-[10px] font-bold tracking-wider text-[#0d0f08]">
                  {pass.passNumber}
                </span>
              </div>
            </div>

            {/* Gate & Time Details */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-left">
              <div>
                <p className="text-[10px] font-semibold uppercase text-[#5e6355]">Date & Time</p>
                <p className="mt-0.5 text-xs font-bold text-[#0d0f08]">{pass.date}</p>
                <p className="text-[10px] text-[#5e6355]">{pass.time}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-[#5e6355]">Entry Gate</p>
                <p className="mt-0.5 text-xs font-bold text-[#0d0f08]">{pass.gate}</p>
                <p className="truncate text-[10px] text-[#5e6355]">{pass.venue}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0f08] hover:bg-[#fafaf5]"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Pass ID'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadMock}
                className="lime-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                <Download size={14} />
                <span>Save Pass</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#849158]">
              <ShieldCheck size={12} />
              <span>Valid once for entry at {pass.gate}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

