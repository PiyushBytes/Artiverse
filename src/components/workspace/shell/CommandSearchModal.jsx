import { useEffect, useState } from 'react'
import {
  Calendar,
  CheckSquare,
  Command,
  Megaphone,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function CommandSearchModal({
  isOpen,
  onClose,
  workspace,
  onSelectAction,
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onSelectAction?.('toggleSearch')
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onSelectAction])

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const matchedMembers = (workspace?.members || []).filter(
    (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.title.toLowerCase().includes(q)
  )

  const matchedTasks = (workspace?.tasks || []).filter(
    (t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
  )

  const matchedAnnouncements = (workspace?.announcements || []).filter(
    (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q)
  )

  const matchedMeetings = (workspace?.meetings || []).filter(
    (m) => m.title.toLowerCase().includes(q) || (m.agenda || '').toLowerCase().includes(q)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:p-6 sm:pt-24">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0d0f08]/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -8 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[14px] border border-[#e4e6da] bg-[#ffffff] shadow-2xl"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#e4e6da] px-4 py-3.5">
          <Search size={17} className="text-[#8b907f]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, members, meetings..."
            autoFocus
            className="w-full text-sm text-[#0d0f08] placeholder-[#8b907f] outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] p-1 text-[#8b907f] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs">
          {/* Quick Actions */}
          {!q && (
            <div className="mb-2">
              <span className="px-3 py-1 font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                Quick Navigation
              </span>
              <div className="mt-1 space-y-0.5">
                {[
                  { id: 'overview', label: 'Go to Overview', icon: Command },
                  { id: 'members', label: 'Go to Members & Permissions', icon: Users },
                  { id: 'tasks', label: 'Go to Tasks Kanban', icon: CheckSquare },
                  { id: 'announcements', label: 'Go to Announcements', icon: Megaphone },
                  { id: 'meetings', label: 'Go to Meetings & Minutes', icon: Calendar },
                  { id: 'settings', label: 'Go to Committee Settings', icon: Settings },
                ].map((act) => {
                  const Icon = act.icon
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => {
                        onSelectAction?.(act.id)
                        onClose()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left font-medium text-[#0d0f08] hover:bg-[#f6f7f0]"
                    >
                      <Icon size={15} className="text-[#5e6355]" />
                      <span>{act.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Members */}
          {matchedMembers.length > 0 && (
            <div className="mb-2">
              <span className="px-3 py-1 font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                Members ({matchedMembers.length})
              </span>
              {matchedMembers.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectAction?.('members')
                    onClose()
                  }}
                  className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left hover:bg-[#f6f7f0]"
                >
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#5e6355]" />
                    <span className="font-semibold text-[#0d0f08]">{m.name}</span>
                    <span className="text-[#5e6355]">({m.title})</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8b907f]">{m.status}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div className="mb-2">
              <span className="px-3 py-1 font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                Tasks ({matchedTasks.length})
              </span>
              {matchedTasks.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectAction?.('tasks')
                    onClose()
                  }}
                  className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left hover:bg-[#f6f7f0]"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare size={14} className="text-[#5e6355]" />
                    <span className="font-semibold text-[#0d0f08]">{t.title}</span>
                  </div>
                  <span className="rounded bg-[#f6f7f0] px-1.5 py-0.5 text-[10px] uppercase font-mono text-[#5e6355]">
                    {t.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Meetings */}
          {matchedMeetings.length > 0 && (
            <div className="mb-2">
              <span className="px-3 py-1 font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                Meetings ({matchedMeetings.length})
              </span>
              {matchedMeetings.slice(0, 3).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectAction?.('meetings')
                    onClose()
                  }}
                  className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left hover:bg-[#f6f7f0]"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#5e6355]" />
                    <span className="font-semibold text-[#0d0f08]">{m.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8b907f]">{m.date}</span>
                </button>
              ))}
            </div>
          )}

          {q &&
            matchedMembers.length === 0 &&
            matchedTasks.length === 0 &&
            matchedAnnouncements.length === 0 &&
            matchedMeetings.length === 0 && (
              <div className="p-6 text-center text-[#5e6355]">
                No items matching &ldquo;{query}&rdquo;
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[#e4e6da] bg-[#fafaf5] px-4 py-2 font-mono text-[10px] text-[#8b907f]">
          <span>Use ↑↓ to navigate</span>
          <span>ESC to close</span>
        </div>
      </motion.div>
    </div>
  )
}

