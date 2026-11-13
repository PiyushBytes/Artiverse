import { useEffect, useState } from 'react'
import {
  Building2,
  Calendar,
  Compass,
  FileText,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Ticket,
  User,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreateCommittee,
  onOpenCreateEvent,
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onClose(true) // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const items = [
    // Actions
    { id: 'act_1', label: 'Create new Committee', category: 'Actions', icon: PlusCircle, action: () => { onClose(false); onOpenCreateCommittee?.(); } },
    { id: 'act_2', label: 'Create new Event', category: 'Actions', icon: Sparkles, action: () => { onClose(false); onOpenCreateEvent?.(); } },
    
    // Pages
    { id: 'p_1', label: 'My Dashboard', category: 'Pages', icon: Compass, href: '/dashboard' },
    { id: 'p_2', label: 'All Committees Directory', category: 'Pages', icon: Building2, href: '/committees' },
    { id: 'p_3', label: 'My Registrations & Passes', category: 'Pages', icon: Ticket, href: '/registrations' },
    { id: 'p_4', label: 'Account Profile', category: 'Pages', icon: User, href: '/profile' },
    { id: 'p_5', label: 'Settings & Security', category: 'Pages', icon: Settings, href: '/settings' },
  ]

  const filtered = query.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    : items

  const handleSelect = (item) => {
    if (item.action) {
      item.action()
    } else if (item.href) {
      onClose(false)
      onNavigate?.(item.href)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 sm:pt-28">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(false)}
          className="absolute inset-0 bg-[#0d0f08]/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[26px] border border-[#e4e6da] bg-white shadow-2xl"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 border-b border-[#e4e6da] px-4 py-3 sm:px-5">
            <Search size={18} className="text-[#5e6355]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search committees, events, passes or pages... (Ctrl+K)"
              className="flex-1 bg-transparent text-sm font-medium text-[#0d0f08] outline-none placeholder:text-[#5e6355]/50"
            />
            <kbd className="hidden sm:inline-block rounded-lg border border-[#e4e6da] bg-[#fafaf5] px-2 py-0.5 font-mono text-[10px] text-[#5e6355]">
              ESC
            </kbd>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="sm:hidden grid size-6 place-items-center text-[#5e6355]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5e6355]">
                No matching results found for "{query}".
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-[#fafaf5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 place-items-center rounded-lg bg-[#fafaf5] text-[#0d0f08] group-hover:bg-[#d4ff1f]">
                          <Icon size={14} />
                        </span>
                        <span className="font-semibold text-[#0d0f08]">{item.label}</span>
                      </div>
                      <span className="rounded-md border border-[#e4e6da] bg-[#fafaf5] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#5e6355]">
                        {item.category}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

