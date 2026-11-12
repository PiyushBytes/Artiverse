import { useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function NotificationsDrawer({ currentUser, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const notifications = currentUser?.notifications || [
    { id: '1', title: 'Welcome to Artiverse', desc: 'Your creative account is ready', time: 'Just now', unread: true },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className="fixed inset-0 z-[80] flex justify-end bg-[#0d0f08]/40 backdrop-blur-sm"
      >
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          role="dialog"
          aria-modal="true"
          className="relative h-full w-full max-w-sm border-l border-[#e4e6da] bg-white p-5 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-[#e4e6da] pb-4">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#0d0f08]" />
                <h3 className="font-display text-lg font-bold text-[#0d0f08]">Notifications</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full text-[#5e6355] hover:bg-[#f6f7f2]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[75vh]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl border p-3 transition-colors ${
                    n.unread
                      ? 'border-[#d4ff1f] bg-[#f9ffe0]/40'
                      : 'border-[#e4e6da] bg-[#fafbf7]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#0d0f08]">{n.title}</p>
                    <span className="text-[10px] text-[#777c70]">{n.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5e6355] leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e4e6da] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d0f08] py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              <Check size={14} />
              <span>Mark all as read</span>
            </button>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}

