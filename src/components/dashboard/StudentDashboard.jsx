import { useEffect, useState } from 'react'
import { ArrowDownRight, Building2, Calendar } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import NextUpCard from './NextUpCard'
import CommitteeCard from './CommitteeCard'
import TicketPassCard from './TicketPassCard'
import TicketQrModal from './TicketQrModal'
import CreateChooserModal from './CreateChooserModal'
import CreateCommitteeWizard from './CreateCommitteeWizard'
import CreateEventWizard from './CreateEventWizard'
import CommandPalette from './CommandPalette'
import SubscriptionModal from './SubscriptionModal'
import DashboardHero from './user-home/DashboardHero'
import DashboardSectionHeading from './user-home/DashboardSectionHeading'
import ProfileProgressPanel from './user-home/ProfileProgressPanel'
import { getCommitteeList } from '../../api/committee'
import { initialStudentData } from '../../config/dashboardData'

export default function StudentDashboard({
  user,
  currentRoleView = 'student',
  onToggleRoleView,
  onNavigate,
  onToast,
  onOpenCommitteeDashboard,
}) {
  const reduceMotion = useReducedMotion()

  // Dynamic Dashboard Data State (initialized with future-dated mock data)
  const [data, setData] = useState(initialStudentData)

  // Subscription state (persisted in localStorage)
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return localStorage.getItem('artiverse_council_pro') === 'true'
    } catch {
      return false
    }
  })

  // Modals state
  const [activeQrPass, setActiveQrPass] = useState(null)
  const [isChooserOpen, setIsChooserOpen] = useState(false)
  const [isCommitteeWizardOpen, setIsCommitteeWizardOpen] = useState(false)
  const [isEventWizardOpen, setIsEventWizardOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)

  const handleUpgradePro = () => {
    setIsSubscribed(true)
    try {
      localStorage.setItem('artiverse_council_pro', 'true')
    } catch {
      // safe fallback
    }
  }

  // Fetch live committees using POST /av/committee/committee-list/
  useEffect(() => {
    let cancelled = false
    getCommitteeList()
      .then((res) => {
        if (cancelled || !res) return
        const owned = Array.isArray(res.owned) ? res.owned : []
        const memberOf = Array.isArray(res.member_of) ? res.member_of : []

        const mappedOwned = owned
          .filter((c) => Boolean(c && (c.committee_username || c.committee_name || c.name)))
          .map((c) => ({
            id: c.id,
            name: c.committee_name || c.name || (c.committee_username ? c.committee_username.replace(/_/g, ' ') : 'Campus Committee'),
            username: c.committee_username || '',
            description: c.committee_description || '',
            college: c.college || '',
            category: c.committee_category || 'Official Campus Club',
            icon: c.icon || '🎨',
            roleTitle: 'President & Founder',
            applicationId: `COM-${c.id || 1}`,
            currentStep: 3,
            steps: [
              { label: 'Registered', date: c.date_of_creation || 'Live', completed: true },
              { label: 'Roles Set', date: 'Active', completed: true },
              { label: 'Verified', date: 'Approved', completed: true },
              { label: 'Active', date: 'Live ✓', completed: true, active: true },
            ],
          }))

        const mappedMember = memberOf
          .filter((m) => Boolean(m && (m.committee_username || m.committee_name || m.committee?.committee_username || m.committee?.committee_name)))
          .map((m) => {
            const comm = m.committee || m
            const handle = comm.committee_username || comm.username || ''
            const title = comm.committee_name || comm.name || (handle ? handle.replace(/_/g, ' ') : 'Campus Club')
            const id = comm.id || m.id || 1
            return {
              id,
              name: title,
              username: handle,
              college: comm.college || '',
              category: comm.committee_category || 'Joined Committee',
              icon: comm.icon || '⚡',
              roleTitle: m.role || 'Member',
              applicationId: `MEM-${id}`,
              currentStep: 2,
              steps: [
                { label: 'Applied', date: 'Done', completed: true },
                { label: 'Shortlisted', date: 'Done', completed: true },
                { label: 'Inducted', date: 'Active ✓', completed: true, active: true },
              ],
            }
          })

        const allCommittees = [...mappedOwned, ...mappedMember]

        setData((prev) => ({
          ...prev,
          committees: allCommittees,
          summary: `${allCommittees.length} committee${allCommittees.length === 1 ? '' : 's'} · ${(prev.passes || []).length} passes`,
        }))
      })
      .catch(() => {
        // Fallback to empty list when user is fresh or not signed in
        setData((prev) => ({
          ...prev,
          committees: [],
          summary: `0 committees · ${(prev.passes || []).length} passes`,
        }))
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Creation callbacks
  const handleCommitteeCreated = (newCommittee) => {
    setData((prev) => ({
      ...prev,
      committees: [newCommittee, ...prev.committees],
      summary: `${prev.committees.length + 1} committees · 1 interview · ${prev.passes.length} passes`,
    }))
    onToast?.(`Committee "${newCommittee.name}" created successfully!`)
  }

  const handleEventCreated = (newPass) => {
    setData((prev) => ({
      ...prev,
      passes: [newPass, ...prev.passes],
      summary: `${prev.committees.length} committees · 1 interview · ${prev.passes.length + 1} passes`,
    }))
    onToast?.(`Event pass "${newPass.eventTitle}" published!`)
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 sm:space-y-10"
    >
      <DashboardHero
        user={user}
        committeesCount={data.committees.length}
        passesCount={data.passes.length}
        profileCompleteness={data.profileCompleteness}
        isSubscribed={isSubscribed}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        currentRoleView={currentRoleView}
        onToggleRoleView={onToggleRoleView}
        onCreateCommittee={() => setIsCommitteeWizardOpen(true)}
        onCreateEvent={() => setIsEventWizardOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigate={onNavigate}
      />

      <div className="space-y-9 sm:space-y-12">
        <div>
          <ProfileProgressPanel
            completeness={data.profileCompleteness}
            nextStep={data.profileNextStep}
            onNavigate={onNavigate}
          />
        </div>

        {data.nextUp && (
          <section>
            <DashboardSectionHeading eyebrow="Coming up" title="Your next campus moment" />
            <NextUpCard nextUp={data.nextUp} onToast={onToast} />
          </section>
        )}

        <section>
          <DashboardSectionHeading
            eyebrow="Your campus network"
            title="My committees"
            count={data.committees.length}
            action="Explore events"
            onAction={() => onNavigate?.('/events')}
          />

          {data.committees.length === 0 ? (
            <div className="border border-dashed border-[#ded8cf] bg-[#fcfbf8] px-5 py-10 text-center sm:px-8">
              <Building2 size={28} className="mx-auto text-[#ef6b3b]" />
              <p className="mt-3 font-display text-xl text-[#171614]">No committees yet</p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#65615b]">
                Join a committee to see it here, or create one for your campus.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('/events')}
                className="mt-5 inline-flex min-h-10 items-center gap-2 bg-[#171614] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#38332f]"
              >
                Browse live events <ArrowDownRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid gap-px border border-[#ded8cf] bg-[#ded8cf] sm:grid-cols-2">
              {data.committees.map((comm) => (
                <CommitteeCard
                  key={comm.id}
                  committee={comm}
                  onToast={onToast}
                  onClick={(targetComm) => {
                    const rawSlug = targetComm.slug || targetComm.username || targetComm.name || 'artikon'
                    const slug = String(rawSlug).toLowerCase().replace(/^@/, '').includes('artikon')
                      ? 'artikon'
                      : String(rawSlug).toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_-]/g, '') || 'artikon'
                    onNavigate?.(`/committees/${slug}`)
                  }}
                  onManage={(targetComm) => {
                    const rawSlug = targetComm.slug || targetComm.username || targetComm.name || 'artikon'
                    const slug = String(rawSlug).toLowerCase().replace(/^@/, '').includes('artikon')
                      ? 'artikon'
                      : String(rawSlug).toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_-]/g, '') || 'artikon'
                    onNavigate?.(`/committees/${slug}`)
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <DashboardSectionHeading
            eyebrow="Campus calendar"
            title="My event passes"
            count={data.passes.length}
            action="Browse events"
            onAction={() => onNavigate?.('/events')}
          />

          {data.passes.length === 0 ? (
            <div className="grid gap-0 border border-[#ded8cf] bg-[#fcfbf8] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2 text-xs font-medium text-[#65615b]">
                  <Calendar size={16} /> Event passes
                </div>
                <p className="mt-2 font-display text-xl text-[#171614]">No event passes yet</p>
                <p className="mt-1 text-xs leading-5 text-[#65615b]">Register for an event and your pass will appear here.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate?.('/events')}
                className="inline-flex min-h-11 items-center justify-center gap-2 border-t border-[#ded8cf] px-5 text-xs font-semibold text-[#171614] transition-colors hover:bg-[#171614] hover:text-white sm:min-h-0 sm:border-l sm:border-t-0"
              >
                Explore events <ArrowDownRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid gap-px border border-[#ded8cf] bg-[#ded8cf] sm:grid-cols-2">
              {data.passes.map((pass) => (
                <TicketPassCard key={pass.id} pass={pass} onShowQr={(p) => setActiveQrPass(p)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── MODALS & WIZARDS ── */}
      {/* 1. Show QR Code Modal */}
      {activeQrPass && (
        <TicketQrModal
          pass={activeQrPass}
          onClose={() => setActiveQrPass(null)}
          onToast={onToast}
        />
      )}

      {/* 2. First-Login / On-demand Create Chooser */}
      <CreateChooserModal
        isOpen={isChooserOpen}
        onClose={() => setIsChooserOpen(false)}
        userCommittees={data.committees}
        isSubscribed={isSubscribed}
        onSelectCommittee={() => setIsCommitteeWizardOpen(true)}
        onSelectEvent={() => setIsEventWizardOpen(true)}
        onSkip={() => onToast?.('Exploring as student member.')}
      />

      {/* 3. Create Committee Wizard (Snappy 1-step with 5-Committee Quota & Paywall) */}
      <CreateCommitteeWizard
        isOpen={isCommitteeWizardOpen}
        onClose={() => setIsCommitteeWizardOpen(false)}
        userCommittees={data.committees}
        isSubscribed={isSubscribed}
        onUpgradePro={handleUpgradePro}
        onCreated={handleCommitteeCreated}
        onOpenCommitteeDashboard={(comm) => onOpenCommitteeDashboard?.(comm)}
        onToast={onToast}
      />

      {/* 4. Create Event Wizard (4-Step) */}
      <CreateEventWizard
        isOpen={isEventWizardOpen}
        onClose={() => setIsEventWizardOpen(false)}
        userCommittees={data.committees}
        onCreated={handleEventCreated}
        onToast={onToast}
      />

      {/* 5. Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={setIsCommandPaletteOpen}
        onNavigate={onNavigate}
        onOpenCreateCommittee={() => setIsCommitteeWizardOpen(true)}
        onOpenCreateEvent={() => setIsEventWizardOpen(true)}
      />

      {/* 6. Council Pro Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentCount={data.committees.length}
        limit={5}
        isSubscribed={isSubscribed}
        onSubscribe={handleUpgradePro}
        onToast={onToast}
      />
    </motion.div>
  )
}
