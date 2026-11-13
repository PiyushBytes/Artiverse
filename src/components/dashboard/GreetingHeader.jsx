import { useState } from 'react'
import {
  Building2,
  Calendar,
  ChevronDown,
  Command,
  Crown,
  Plus,
  Sparkles,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function GreetingHeader({
  user,
  summary,
  ownedCount = 0,
  isSubscribed = false,
  onOpenSubscription,
  currentRoleView = 'student',
  onToggleRoleView,
  onOpenCreateCommittee,
  onOpenCreateEvent,
  onOpenCommandPalette,
}) {
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false)

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.first_name || user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || ''
  const isLead = user?.role === 'lead'

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[#e4e6da] pb-7">
      {/* Left: Greeting & Summary */}
      <div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#849158]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
            {isLead ? 'Lead & Member Workspace' : 'Student Overview'}
          </span>
          <button
            type="button"
            onClick={onOpenSubscription}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all hover:scale-105 ${
              isSubscribed
                ? 'border border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#414d1e]'
                : ownedCount >= 5
                ? 'border border-amber-300 bg-amber-50 text-amber-800'
                : 'border border-[#e4e6da] bg-white text-[#5e6355] hover:border-[#0d0f08]'
            }`}
          >
            {isSubscribed ? (
              <>
                <Crown size={11} className="text-[#849158]" />
                <span>Council Pro Active</span>
              </>
            ) : (
              <>
                <span>{ownedCount}/5 Free Committees</span>
                <span className="text-[#849158]">· Upgrade</span>
              </>
            )}
          </button>
        </div>

        <h1 className="mt-2 text-3xl font-normal tracking-tight text-[#0d0f08] sm:text-4xl">
          <span className="text-[#5e6355]">{getGreeting()}{firstName ? ', ' : ''}</span>
          {firstName && <span className="font-display font-bold italic text-[#0d0f08]">{firstName}</span>}
        </h1>

        <p className="mt-1.5 text-xs font-medium text-[#5e6355] sm:text-sm">
          {summary || 'Welcome to your campus culture workspace.'}
        </p>
      </div>

      {/* Right: Role Toggle & + Create Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Role Toggle Pill (Student | Committee) if user leads a committee */}
        {isLead && (
          <div className="flex items-center rounded-full border border-[#e4e6da] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onToggleRoleView('student')}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                currentRoleView === 'student' ? 'text-[#0d0f08]' : 'text-[#5e6355] hover:text-[#0d0f08]'
              }`}
            >
              {currentRoleView === 'student' && (
                <motion.div
                  layoutId="activeRoleTab"
                  className="absolute inset-0 rounded-full bg-[#d4ff1f]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">Student</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleRoleView('lead')}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                currentRoleView === 'lead' ? 'text-[#0d0f08]' : 'text-[#5e6355] hover:text-[#0d0f08]'
              }`}
            >
              {currentRoleView === 'lead' && (
                <motion.div
                  layoutId="activeRoleTab"
                  className="absolute inset-0 rounded-full bg-[#d4ff1f]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">Committee</span>
            </button>
          </div>
        )}

        {/* + Create Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCreateDropdownOpen((prev) => !prev)}
            className="lime-button group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08] shadow-sm transition-transform active:scale-95"
            aria-expanded={createDropdownOpen}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Create</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${createDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {createDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-2xl border border-[#e4e6da] bg-white p-1.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.18)]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setCreateDropdownOpen(false)
                    onOpenCreateCommittee()
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-[#0d0f08] transition-colors hover:bg-[#fafaf5]"
                >
                  <Building2 size={15} className="text-[#849158]" />
                  <div>
                    <span>Committee</span>
                    <span className="block text-[10px] font-normal text-[#5e6355]">Setup club or team</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateDropdownOpen(false)
                    onOpenCreateEvent()
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-[#0d0f08] transition-colors hover:bg-[#fafaf5]"
                >
                  <Calendar size={15} className="text-[#849158]" />
                  <div>
                    <span>Event</span>
                    <span className="block text-[10px] font-normal text-[#5e6355]">Publish festival & tickets</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

