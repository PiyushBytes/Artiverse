import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Globe,
  Mail,
  Plus,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { getJoinRequests, reviewJoinRequest } from '../../api/committee'

const roleSuggestions = [
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Creative Director',
  'Event Lead',
  'Technical Head',
  'PR & Outreach Lead',
  'Content Writer',
  'Core Member',
]

export default function CommitteeManagementDashboard({
  committee,
  user,
  onBack,
  onOpenCreateEvent,
  onToast,
  onUpdateCommittee,
  onViewPublic,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('roles') // 'roles', 'requests', 'events', 'settings'
  const [copied, setCopied] = useState(false)
  
  // Custom Roles state
  const [members, setMembers] = useState(
    committee?.members && committee.members.length > 0
      ? committee.members
      : [
          {
            id: 'mem_owner',
            name: user?.fullName || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || committee?.owner?.name || 'You (Founder)',
            role: 'Founder & President',
            email: committee?.email || user?.email || '',
            access: 'Admin',
            initials: (user?.fullName || user?.first_name || 'U').charAt(0).toUpperCase(),
            dateAdded: 'Founder',
          },
        ]
  )

  // Add Custom Role Modal state
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberAccess, setNewMemberAccess] = useState('Coordinator')

  // Join Requests state (API backed)
  const [pendingRequests, setPendingRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)

  // Committee Settings state
  const [settingsForm, setSettingsForm] = useState({
    name: committee?.name || '',
    tagline: committee?.description || '',
    category: committee?.category || 'Creative Arts & Design',
    email: committee?.email || '',
    instagram: '',
    website: '',
    recruitmentOpen: true,
  })

  // Fetch join requests for this committee
  useEffect(() => {
    let cancelled = false
    setLoadingRequests(true)

    getJoinRequests()
      .then((data) => {
        if (cancelled || !data) return
        const list = Array.isArray(data)
          ? data
          : data?.request
          ? (Array.isArray(data.request) ? data.request : [data.request])
          : []

        // Filter for this specific committee if username matches
        const filtered = list.filter(
          (item) => !committee?.username || item.committee_username === committee.username
        )

        const mapped = filtered.map((item) => ({
          id: item.id || `req_${Date.now()}`,
          name: `${item.member?.first_name || 'Applicant'} ${item.member?.last_name || ''}`.trim() || item.committee_username,
          email: item.member?.email || 'No email provided',
          phone: item.member?.phone_number || '',
          domain: item.committee_username || 'Member',
          status: item.status || 'pending',
          requestedAt: item.requested_at
            ? new Date(item.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Just now',
        }))

        setPendingRequests(mapped)
      })
      .catch(() => {
        setPendingRequests([])
      })
      .finally(() => {
        if (!cancelled) setLoadingRequests(false)
      })

    return () => {
      cancelled = true
    }
  }, [committee?.username])

  // Review (Approve/Reject) Request
  const handleReview = async (requestId, action) => {
    setReviewingId(requestId)
    try {
      await reviewJoinRequest({ requestId, action })
      
      const targetReq = pendingRequests.find((r) => r.id === requestId)
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))

      if (action === 'approve' && targetReq) {
        // Automatically add approved student to members roster!
        const initials = targetReq.name.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'MB'
        setMembers((prev) => [
          ...prev,
          {
            id: `mem_${Date.now()}`,
            name: targetReq.name,
            role: 'Inducted Member',
            email: targetReq.email,
            access: 'Member',
            initials,
            dateAdded: 'Today',
          },
        ])
      }

      onToast?.(`Applicant ${action === 'approve' ? 'approved & added to council' : 'rejected'}.`)
    } catch (err) {
      onToast?.(err.message || `Unable to ${action} request.`)
    } finally {
      setReviewingId(null)
    }
  }

  // Copy Committee Invite Link
  const handleCopyInvite = async () => {
    const handle = committee?.username || 'committee'
    const inviteUrl = `https://artiverse.online/register?invite=${handle}`
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      onToast?.('Invite link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      onToast?.(`Invite handle: @${handle}`)
    }
  }

  // Add Custom Role
  const handleAddCustomRole = (e) => {
    e.preventDefault()
    if (!newMemberName.trim() || !newMemberRole.trim()) {
      onToast?.('Please enter member name and role title.')
      return
    }

    const initials = newMemberName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    const newMem = {
      id: `role_${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      email: newMemberEmail.trim() || 'Not specified',
      access: newMemberAccess,
      initials: initials || 'MB',
      dateAdded: 'Just now',
    }

    setMembers((prev) => [...prev, newMem])
    onToast?.(`Added "${newMem.name}" as ${newMem.role}!`)
    
    // Reset form
    setNewMemberName('')
    setNewMemberRole('')
    setNewMemberEmail('')
    setIsAddRoleOpen(false)
  }

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    onToast?.('Council member removed.')
  }

  const handleSaveSettings = (e) => {
    e.preventDefault()
    onUpdateCommittee?.({
      ...committee,
      name: settingsForm.name,
      description: settingsForm.tagline,
      email: settingsForm.email,
      category: settingsForm.category,
    })
    onToast?.('Committee customization saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* ── TOP NAVIGATION STRIP ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#e4e6da] bg-white px-4 py-2 text-xs font-semibold text-[#5e6355] shadow-sm hover:border-[#0d0f08] hover:text-[#0d0f08] transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to Student Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onViewPublic && (
            <button
              type="button"
              onClick={onViewPublic}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0d0f08] bg-white px-3.5 py-2 text-xs font-bold text-[#0d0f08] shadow-sm hover:bg-[#fafaf5]"
            >
              <span>View Public Page</span>
              <span>↗</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyInvite}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0f08] shadow-sm hover:bg-[#fafaf5]"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied' : 'Share Invite'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCreateEvent?.(committee)}
            className="lime-button glow inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#0d0f08]"
          >
            <Plus size={14} />
            <span>Host Event</span>
          </button>
        </div>
      </div>

      {/* ── COMMITTEE HERO BANNER ── */}
      <div className="rounded-[28px] border border-[#e4e6da] bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.08)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#fafaf5] text-3xl shadow-inner border border-[#e4e6da]">
              {committee?.icon || '🎨'}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#0d0f08] sm:text-3xl">
                  {committee?.name || 'My Committee'}
                </h1>
                <span className="rounded-full bg-[#d4ff1f] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0d0f08]">
                  @{committee?.username || 'handle'}
                </span>
                <span className="rounded-full border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-0.5 text-[10px] font-bold text-[#5e6355]">
                  {committee?.category || 'Campus Society'}
                </span>
              </div>

              <p className="mt-2 text-xs text-[#5e6355] max-w-2xl leading-relaxed">
                {committee?.description || 'Official student committee workspace. Manage council roles, review applications and run campus events.'}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#5e6355]">
                {committee?.email && (
                  <span className="flex items-center gap-1.5 font-medium text-[#0d0f08]">
                    <Mail size={13} className="text-[#849158]" />
                    <span>{committee.email}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-bold text-[#1b380f] rounded-full bg-[#d4ff1f]/35 border border-[#d4ff1f] px-2.5 py-0.5 shadow-sm">
                  <span className="size-2 rounded-full bg-[#1b380f] animate-pulse" />
                  <span>Recruitments Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:flex sm:items-center">
            <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-3 text-center">
              <span className="text-xl font-bold text-[#0d0f08]">{members.length}</span>
              <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">Council</span>
            </div>
            <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-3 text-center">
              <span className="text-xl font-bold text-[#0d0f08]">{pendingRequests.length}</span>
              <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">Requests</span>
            </div>
            <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-3 text-center">
              <span className="text-xl font-bold text-[#0d0f08]">Live</span>
              <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">Verified</span>
            </div>
          </div>
        </div>

        {/* ── TABS SELECTOR ── */}
        <div className="mt-8 flex items-center gap-2 border-t border-[#f0f1ea] pt-5 overflow-x-auto scrollbar-none">
          {[
            { id: 'roles', label: `Council & Custom Roles (${members.length})`, icon: Users },
            { id: 'requests', label: `Join Requests (${pendingRequests.length})`, icon: UserPlus },
            { id: 'events', label: 'Committee Events', icon: Calendar },
            { id: 'settings', label: 'Customize & Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0d0f08] text-white shadow-sm'
                    : 'bg-[#fafaf5] text-[#5e6355] hover:bg-white hover:text-[#0d0f08] border border-transparent hover:border-[#e4e6da]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── TAB 1: COUNCIL & CUSTOM ROLES ("udhar custom sab add karpayenge") ── */}
      {activeTab === 'roles' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">
                Council Roles & Team Members
              </h2>
              <p className="text-xs text-[#5e6355]">
                Add custom roles, appoint leads (VP, GS, Treasurer, POCs) and build your committee team.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddRoleOpen(true)}
              className="lime-button inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full px-4 py-2 text-xs font-bold text-[#0d0f08]"
            >
              <UserPlus size={14} />
              <span>Add Council Role</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="group flex items-start justify-between rounded-[24px] border border-[#e4e6da] bg-white p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#0d0f08] font-mono text-xs font-bold text-[#d4ff1f] shrink-0">
                    {member.initials}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0d0f08]">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#849158]">{member.role}</p>
                    <p className="mt-1 text-[11px] text-[#5e6355]">{member.email}</p>
                    <span className="mt-2 inline-block rounded-md bg-[#fafaf5] border border-[#e4e6da] px-2 py-0.5 text-[10px] font-semibold text-[#5e6355]">
                      {member.access} Access
                    </span>
                  </div>
                </div>

                {member.id !== 'mem_owner' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#5e6355] hover:text-red-600 transition-opacity"
                    title="Remove role"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}

            {/* Empty state when council has 1 member */}
            {members.length <= 1 && (
              <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#e4e6da] bg-[#fafaf5] p-6 text-center sm:col-span-1 lg:col-span-2">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-xl shadow-sm border border-[#e4e6da]">
                  👋
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#0d0f08]">Invite your team</h4>
                <p className="mt-1 text-xs text-[#5e6355] max-w-xs leading-relaxed">
                  Appoint vice presidents, general secretaries, domain leads, and faculty advisors to co-manage this committee with you.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#0d0f08] bg-white px-4 py-1.5 text-xs font-bold text-[#0d0f08] hover:bg-[#fafaf5] transition shadow-sm"
                >
                  <UserPlus size={13} />
                  <span>Add First Council Role</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TAB 2: JOIN REQUESTS (Live Backend API) ── */}
      {activeTab === 'requests' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">
                Pending Member Applications
              </h2>
              <p className="text-xs text-[#5e6355]">
                Students requesting to join @{committee?.username}. Approved members are automatically added to the council.
              </p>
            </div>
            <span className="rounded-full bg-[#0d0f08] px-3 py-1 text-xs font-bold text-[#d4ff1f]">
              {pendingRequests.length} Pending
            </span>
          </div>

          {loadingRequests ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl border border-[#e4e6da] bg-white" />
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#e4e6da] bg-white p-10 text-center">
              <UserCheck size={32} className="mx-auto text-[#849158]" />
              <p className="mt-2 text-sm font-bold text-[#0d0f08]">No pending applications</p>
              <p className="mt-1 text-xs text-[#5e6355]">
                Share your committee link (@{committee?.username}) with students to invite applications.
              </p>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="lime-button mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                <Share2 size={13} />
                <span>Copy Recruitment Link</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-3 rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#fafaf5] font-mono text-xs font-bold text-[#0d0f08] border border-[#e4e6da]">
                      {req.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#0d0f08]">{req.name}</h3>
                      <p className="text-xs text-[#5e6355]">
                        {req.email} {req.phone ? `· ${req.phone}` : ''}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-[#849158]">
                        Applied: {req.requestedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={reviewingId === req.id}
                      onClick={() => handleReview(req.id, 'approve')}
                      className="rounded-full bg-[#0d0f08] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#839b3d] disabled:opacity-50"
                    >
                      {reviewingId === req.id ? 'Processing...' : 'Approve & Induct'}
                    </button>
                    <button
                      type="button"
                      disabled={reviewingId === req.id}
                      onClick={() => handleReview(req.id, 'reject')}
                      className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── TAB 3: HOSTED EVENTS ── */}
      {activeTab === 'events' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">
                Committee Events & Festivals
              </h2>
              <p className="text-xs text-[#5e6355]">
                Publish campus concerts, workshops, and conclaves under @{committee?.username}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenCreateEvent?.(committee)}
              className="lime-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <Plus size={14} />
              <span>+ Create Event</span>
            </button>
          </div>

          <div className="rounded-[24px] border border-dashed border-[#e4e6da] bg-white p-10 text-center">
            <Calendar size={32} className="mx-auto text-[#849158]" />
            <h3 className="mt-2 text-sm font-bold text-[#0d0f08]">No events published yet</h3>
            <p className="mt-1 text-xs text-[#5e6355]">
              Create an event to open online registrations, generate QR passes, and track entry.
            </p>
            <button
              type="button"
              onClick={() => onOpenCreateEvent?.(committee)}
              className="lime-button mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <Plus size={14} />
              <span>Publish First Event</span>
            </button>
          </div>
        </section>
      )}

      {/* ── TAB 4: CUSTOMIZE & SETTINGS ── */}
      {activeTab === 'settings' && (
        <section className="rounded-[28px] border border-[#e4e6da] bg-white p-6 sm:p-8 shadow-sm">
          <div className="border-b border-[#f0f1ea] pb-4">
            <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">
              Customize Committee Profile
            </h2>
            <p className="text-xs text-[#5e6355]">
              Update description, official communication channels, and recruitment status.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="mt-6 space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                Committee Name
              </label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-2.5 text-xs font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                Tagline / Description
              </label>
              <textarea
                rows={3}
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-2 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-2 text-xs font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Category
                </label>
                <input
                  type="text"
                  value={settingsForm.category}
                  onChange={(e) => setSettingsForm({ ...settingsForm, category: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-[#fafaf5] px-4 py-2 text-xs font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="lime-button rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── MODAL: ADD CUSTOM ROLE / INVITE COUNCIL MEMBER ── */}
      <AnimatePresence>
        {isAddRoleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddRoleOpen(false)}
              className="absolute inset-0 bg-[#0d0f08]/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              className="relative w-full max-w-md rounded-[28px] border border-[#e4e6da] bg-[#fafaf5] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-xl bg-[#d4ff1f] text-[#0d0f08]">
                    <UserPlus size={15} />
                  </span>
                  <h3 className="text-sm font-bold text-[#0d0f08]">Add Custom Council Role</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="grid size-7 place-items-center rounded-full text-[#5e6355] hover:bg-black/5"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleAddCustomRole} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                    Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter member's full name"
                    className="mt-1 w-full rounded-2xl border border-[#e4e6da] bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                    Custom Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    placeholder="Role title (e.g. Vice President, Event Lead)"
                    className="mt-1 w-full rounded-2xl border border-[#e4e6da] bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                  />

                  {/* Quick Role Suggestions */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {roleSuggestions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewMemberRole(r)}
                        className="rounded-md border border-[#e4e6da] bg-white px-2 py-0.5 text-[10px] font-medium text-[#5e6355] hover:border-[#0d0f08] hover:text-[#0d0f08]"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="member@campus.edu"
                      className="mt-1 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs text-[#0d0f08] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                      Access Level
                    </label>
                    <select
                      value={newMemberAccess}
                      onChange={(e) => setNewMemberAccess(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                    >
                      <option value="Admin">Admin (Full Control)</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Member">Council Member</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="lime-button glow w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                  >
                    Add to Council
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
