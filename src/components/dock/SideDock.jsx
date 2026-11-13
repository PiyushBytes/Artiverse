import { useState } from 'react'
import {
  Building2,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
} from 'lucide-react'
import { motion } from 'motion/react'
import SearchModal from './SearchModal'
import ContactModal from './ContactModal'
import { sideDockLoggedIn, sideDockLoggedOut } from '../../config/navigationData'
import CreateChooserModal from '../dashboard/CreateChooserModal'
import CreateCommitteeWizard from '../dashboard/CreateCommitteeWizard'
import CreateEventWizard from '../dashboard/CreateEventWizard'

const iconMap = {
  building: Building2,
  student: GraduationCap,
  search: Search,
  contact: Mail,
  dashboard: LayoutDashboard,
  create: Plus,
  help: HelpCircle,
}

export default function SideDock({ currentUser, onNavigate, onToast }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [chooserOpen, setChooserOpen] = useState(false)
  const [committeeWizardOpen, setCommitteeWizardOpen] = useState(false)
  const [eventWizardOpen, setEventWizardOpen] = useState(false)

  const items = currentUser ? sideDockLoggedIn : sideDockLoggedOut

  const handleClick = (id) => {
    if (id === 'search') {
      setSearchOpen(true)
      return
    }
    if (id === 'contact' || id === 'help') {
      setContactOpen(true)
      return
    }
    if (id === 'create') {
      setChooserOpen(true)
      return
    }
    if (id === 'registerCommittee') {
      onNavigate('/register?role=committee')
      return
    }
    if (id === 'joinStudent') {
      onNavigate('/apply')
      return
    }
    if (id === 'dashboard') {
      onNavigate('/dashboard')
      return
    }
  }

  return (
    <>
      {/* Desktop Floating Side Dock (Strictly 4 buttons, positioned on left) */}
      <aside
        aria-label="Side dock"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 rounded-[26px] border border-[#e4e6da] bg-white/95 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl min-[900px]:flex"
      >
        {items.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const isLime = item.isLime

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.06, x: 2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleClick(item.id)}
              className={`group relative flex size-12 items-center justify-center rounded-2xl transition-all focus-visible:outline-2 focus-visible:outline-[#0d0f08] ${
                isLime
                  ? 'bg-[#d4ff1f] text-[#0d0f08] shadow-[0_0_20px_rgba(212,255,36,0.35)] font-bold'
                  : 'bg-[#fafaf5] text-[#424638] hover:bg-[#0d0f08] hover:text-white'
              }`}
              aria-label={item.label}
            >
              <Icon size={20} />

              {/* Tooltip on Hover (Opens to the right into the viewport) */}
              <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-[#e4e6da] bg-[#0d0f08] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100">
                {item.label}
                <span className="block text-[10px] font-normal text-white/60">{item.sub}</span>
              </span>
            </motion.button>
          )
        })}
      </aside>

      {/* Search Modal */}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onSelect={(entry) => onToast?.(`Selected: ${entry.name}`)}
        />
      )}

      {/* Help & Contact Modal */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* Create Chooser Modal */}
      <CreateChooserModal
        isOpen={chooserOpen}
        onClose={() => setChooserOpen(false)}
        onSelectCommittee={() => setCommitteeWizardOpen(true)}
        onSelectEvent={() => setEventWizardOpen(true)}
        onSkip={() => onToast?.('Exploring as student member.')}
      />

      {/* Committee Wizard */}
      <CreateCommitteeWizard
        isOpen={committeeWizardOpen}
        onClose={() => setCommitteeWizardOpen(false)}
        onCreated={(comm) => onToast?.(`Created committee "${comm.name}"!`)}
        onToast={onToast}
      />

      {/* Event Wizard */}
      <CreateEventWizard
        isOpen={eventWizardOpen}
        onClose={() => setEventWizardOpen(false)}
        onCreated={(ev) => onToast?.(`Published event "${ev.eventTitle}"!`)}
        onToast={onToast}
      />
    </>
  )
}
