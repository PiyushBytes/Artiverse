import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { QrCode, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function PassQrDialog({ pass, onClose }) {
  const reduceMotion = useReducedMotion()
  const qrValue = pass?.qr_payload || pass?.qr_code || pass?.qrData
  const qrImage = pass?.qr_image_url || pass?.qr_image

  useEffect(() => {
    if (!pass) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pass, onClose])

  return (
    <AnimatePresence>
      {pass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
          <motion.div initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.15 }} className="absolute inset-0 bg-[#0d0f08]/40" />
          <motion.section initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.15 }} role="dialog" aria-modal="true" aria-labelledby="pass-qr-title" className="relative w-full max-w-sm rounded-[14px] border border-[#e4e6da] bg-white p-5">
            <div className="flex items-start justify-between gap-3 border-b border-[#e4e6da] pb-4">
              <div className="flex items-center gap-2">
                <QrCode size={17} strokeWidth={1.6} className="text-[#5e6355]" />
                <h2 id="pass-qr-title" className="text-sm font-semibold text-[#0d0f08]">Event pass</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close pass QR" className="grid size-8 place-items-center rounded-[8px] text-[#5e6355] transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"><X size={17} /></button>
            </div>
            <div className="py-5 text-center">
              {(pass.event_name || pass.eventTitle || pass.event?.name || pass.event?.title) && <p className="text-sm font-medium text-[#0d0f08]">{pass.event_name || pass.eventTitle || pass.event?.name || pass.event?.title}</p>}
              {pass.pass_number || pass.passNumber ? <p className="mt-1 text-xs text-[#5e6355]">{pass.pass_number || pass.passNumber}</p> : null}
              <div className="mx-auto mt-4 grid size-52 place-items-center border border-[#e4e6da] bg-white p-3">
                {qrImage ? <img src={qrImage} alt="Event pass QR code" className="size-full object-contain" /> : <QRCodeSVG value={String(qrValue)} size={184} level="M" />}
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  )
}
