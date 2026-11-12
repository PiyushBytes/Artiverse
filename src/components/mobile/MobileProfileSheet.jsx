import { LogOut, Settings, User, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function MobileProfileSheet({ currentUser, onClose, onSignOut, onNavigate }) {
  if (!currentUser) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0f08]/50 backdrop-blur-sm min-[900px]:hidden"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full rounded-t-[28px] border-t border-[#e4e6da] bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3">
            <div>
              <p className="text-sm font-bold text-[#0d0f08]">{currentUser.fullName}</p>
              <p className="text-xs text-[#5e6355]">
                {currentUser.role === 'lead' ? 'Committee Lead' : 'Student Member'} ·{' '}
                {currentUser.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full text-[#5e6355] hover:bg-[#f6f7f2]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Links */}
          <div className="mt-3 space-y-1">
            <button
              type="button"
              onClick={() => {
                onClose()
                onNavigate?.('/profile')
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-3 text-sm font-semibold text-[#0d0f08] hover:bg-[#f6f7f2]"
            >
              <User size={17} className="text-[#5e6355]" />
              <span>My Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose()
                onNavigate?.('/settings')
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-3 text-sm font-semibold text-[#0d0f08] hover:bg-[#f6f7f2]"
            >
              <Settings size={17} className="text-[#5e6355]" />
              <span>Settings</span>
            </button>
          </div>

          {/* Strictly in Avatar/Profile sheet: Log Out */}
          <div className="mt-4 border-t border-[#e4e6da] pt-3">
            <button
              type="button"
              onClick={() => {
                onClose()
                onSignOut()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

