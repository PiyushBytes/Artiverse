import { useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function NotificationsDrawer({ currentUser, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const notifications = Array.isArray(currentUser?.notifications) ? currentUser.notifications : []
  const formatNotificationTime = (notification) => {
    const value = notification.created_at || notification.time
    if (!value) return ''
    const date = new Date(value)
    return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', ...(String(value).includes('T') ? { timeStyle: 'short' } : {}) }).format(date)
  }

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
          className="relative flex h-full w-full max-w-sm flex-col border-l border-[#e4e6da] bg-white p-5"
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
                aria-label="Close notifications"
                className="grid size-8 place-items-center rounded-full text-[#5e6355] hover:bg-[#f6f7f2] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 max-h-[75vh] space-y-2.5 overflow-y-auto">
              {notifications.length === 0 && <p className="rounded-[10px] border border-dashed border-[#e4e6da] p-4 text-xs leading-5 text-[#5e6355]">Your notifications will appear here.</p>}
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
                    <span className="text-[10px] text-[#777c70]">{formatNotificationTime(n)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#5e6355]">{n.desc || n.body}</p>
                </div>
              ))}
            </div>
          </div>

        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}

