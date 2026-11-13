import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Plus,
  QrCode,
  Search,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Ticket,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { defaultCommitteeProfile } from '../config/committeeProfileData'
import { getJoinRequests, joinCommittee, reviewJoinRequest } from '../api/committee'

function InstagramIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function CommitteeProfilePage({
  committee: propCommittee,
  committeeId,
  currentUser,
  onNavigate,
  onToast,
  onBack,
}) {
  const reduceMotion = useReducedMotion()

  // Merge provided committee with rich default template
  const committee = useMemo(() => {
    const raw = propCommittee || {}
    const username = raw.username || raw.committee_username || committeeId || 'committee'
    const name = raw.name || raw.committee_name || (username ? username.replace(/_/g, ' ') : 'Campus Committee')
    const description = raw.description || raw.committee_description || raw.tagline || defaultCommitteeProfile.about

    return {
      ...defaultCommitteeProfile,
      ...raw,
      id: raw.id || username,
      name,
      username,
      description,
      college: raw.college || defaultCommitteeProfile.college,
      category: raw.category || raw.committee_category || defaultCommitteeProfile.category,
      icon: raw.icon || '🏛️',
      accentColor: raw.accentColor || defaultCommitteeProfile.accentColor,
      isOwner: Boolean(
        raw.isOwner ||
        raw.roleTitle?.toLowerCase().includes('founder') ||
        raw.roleTitle?.toLowerCase().includes('president') ||
        currentUser?.managedCommittee?.id === raw.id ||
        (raw.owner && currentUser && raw.owner.id === currentUser.id)
      ),
    }
  }, [propCommittee, committeeId, currentUser])

  // Determine user relation to this committee: 'lead' | 'member' | 'visitor'
  const userRole = useMemo(() => {
    if (committee.isOwner) return 'lead'
    if (committee.roleTitle && !committee.roleTitle.toLowerCase().includes('visitor')) return 'member'
    if (currentUser?.committees?.some((c) => c.id === committee.id || c.username === committee.username)) return 'member'
    return 'visitor'
  }, [committee, currentUser])

  const [activeTab, setActiveTab] = useState('overview')
  const [isFollowing, setIsFollowing] = useState(false)
  const [hasRequestedJoin, setHasRequestedJoin] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Live Join Requests state for Lead Management
  const [pendingRequests, setPendingRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [reviewingId, setReviewingId] = useState(null)

  // Custom Announcements state (allows lead to add a live update)
  const [announcements, setAnnouncements] = useState(committee.announcements || [])
  const [newNoticeTitle, setNewNoticeTitle] = useState('')
  const [newNoticeBody, setNewNoticeBody] = useState('')
  const [isPostingNotice, setIsPostingNotice] = useState(false)

  // Team council state (allows lead to add roles)
  const [teamMembers, setTeamMembers] = useState(committee.teamLadder || [])
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleTitle, setNewRoleTitle] = useState('')

  // Recruitment Toggle state
  const [recruitmentOpen, setRecruitmentOpen] = useState(committee.recruitment?.isOpen ?? true)

  // Load real join requests if user is lead
  useEffect(() => {
    if (userRole !== 'lead') return
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

        const mapped = list.map((item) => ({
          id: item.id || `req_${Date.now()}`,
          name: `${item.member?.first_name || 'Applicant'} ${item.member?.last_name || ''}`.trim() || item.committee_username,
          email: item.member?.email || 'Student Applicant',
          phone: item.member?.phone_number || '',
          time: item.requested_at
            ? new Date(item.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
            : 'Pending',
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
  }, [userRole])

  // Tabs configured based on user role
  const availableTabs = useMemo(() => {
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'events', label: 'Events' },
      { id: 'team', label: 'Team' },
    ]

    // Members and Leads see Members, Updates & Gallery
    if (userRole === 'member' || userRole === 'lead') {
      tabs.push({ id: 'members', label: 'Members' })
      tabs.push({ id: 'updates', label: 'Updates' })
      tabs.push({ id: 'gallery', label: 'Gallery' })
      tabs.push({ id: 'resources', label: 'Resources' })
    } else {
      // Visitors see Gallery publicly
      tabs.push({ id: 'gallery', label: 'Gallery' })
    }

    // Only Leads see Settings & Management
    if (userRole === 'lead') {
      tabs.push({ id: 'settings', label: 'Settings & Manage' })
    }

    return tabs
  }, [userRole])

  // Handle Join Committee Request
  const handleJoinCommittee = async () => {
    try {
      const res = await joinCommittee({ committee_username: committee.username })
      setHasRequestedJoin(true)
      onToast?.(res.detail || `Join request sent to ${committee.name}!`)
    } catch (err) {
      onToast?.(err.message || 'Unable to submit join request. Please try again.')
    }
  }

  // Handle Review Join Application
  const handleReviewApplication = async (requestId, action) => {
    setReviewingId(requestId)
    try {
      await reviewJoinRequest({ requestId, action })
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
      onToast?.(`Applicant ${action === 'approve' ? 'approved & welcomed' : 'rejected'}.`)
    } catch (err) {
      onToast?.(err.message || `Unable to ${action} applicant.`)
    } finally {
      setReviewingId(null)
    }
  }

  // Add Notice
  const handlePostNotice = (e) => {
    e.preventDefault()
    if (!newNoticeTitle.trim() || !newNoticeBody.trim()) return
    const newNotice = {
      id: `ann_${Date.now()}`,
      title: newNoticeTitle.trim(),
      content: newNoticeBody.trim(),
      date: 'Just now',
      author: currentUser?.fullName || 'Council Lead',
      pinned: true,
    }
    setAnnouncements([newNotice, ...announcements])
    setNewNoticeTitle('')
    setNewNoticeBody('')
    setIsPostingNotice(false)
    onToast?.('Official announcement posted.')
  }

  // Add Council Member
  const handleAddTeamRole = (e) => {
    e.preventDefault()
    if (!newRoleName.trim() || !newRoleTitle.trim()) return
    const newEntry = {
      role: newRoleTitle.trim(),
      name: newRoleName.trim(),
      initials: newRoleName.trim().slice(0, 2).toUpperCase(),
      tier: 'Domain Lead',
    }
    setTeamMembers([...teamMembers, newEntry])
    setNewRoleName('')
    setNewRoleTitle('')
    onToast?.(`Added ${newRoleName} as ${newRoleTitle}!`)
  }

  const handleCopyShareLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      onToast?.('Committee profile link copied!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      onToast?.(`Profile handle: @${committee.username}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf5] text-[#0d0f08] pb-24 pt-5 min-[900px]:pt-20">
      {/* ── TOP NAV STRIP ── */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 mb-4">
        <button
          type="button"
          onClick={() => {
            if (onBack) onBack()
            else onNavigate?.('/dashboard')
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[#e4e6da] bg-white px-4 py-1.5 text-xs font-semibold text-[#5e6355] shadow-sm hover:border-[#0d0f08]/30 hover:text-[#0d0f08] transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* ── 1. COVER BANNER & HEADER ── */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#e4e6da] bg-white shadow-sm">
          {/* Cover Art Banner (Adaptive Accent Color) */}
          <div
            className="h-44 sm:h-56 w-full relative"
            style={{
              background: committee.coverGradient || 'linear-gradient(135deg, #0d0f08 0%, #1e2612 50%, #2f3d17 100%)',
            }}
          >
            {/* Subtle glow orb */}
            <div
              className="absolute -right-20 -top-20 size-72 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: committee.accentColor || '#d4ff1f' }}
            />

            <div className="absolute right-4 top-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/60 transition-all"
                title="Share Committee Card"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Profile Header Block: Overlapping Logo, Details, Role-aware CTA */}
          <div className="px-6 pb-6 pt-0 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">
              {/* Logo + Names */}
              <div className="flex items-end gap-4 min-w-0">
                <div className="relative grid size-24 sm:size-28 shrink-0 place-items-center rounded-3xl border-4 border-white bg-[#fafaf5] text-4xl shadow-md">
                  <span>{committee.icon || '🏛️'}</span>
                  {recruitmentOpen && (
                    <span
                      className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white bg-[#d4ff1f] shadow-sm flex items-center justify-center text-[8px] font-bold text-[#0d0f08]"
                      title="Recruitments Open"
                    >
                      ●
                    </span>
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0d0f08]">
                      {committee.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/30 px-2 py-0.5 text-[10px] font-bold text-[#414d1e]">
                      <CheckCircle2 size={10} className="text-[#839b3d]" />
                      <span>Verified Council</span>
                    </span>
                  </div>

                  <p className="mt-0.5 font-mono text-xs font-semibold text-[#849158]">
                    @{committee.username}
                  </p>
                </div>
              </div>

              {/* Role-Aware Action Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
                {userRole === 'lead' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="lime-button glow flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                  >
                    <Settings size={14} />
                    <span>Manage Council</span>
                  </button>
                ) : userRole === 'member' ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/30 px-5 py-2.5 text-xs font-bold text-[#414d1e]">
                    <Check size={14} strokeWidth={2.5} className="text-[#839b3d]" />
                    <span>Joined Member</span>
                  </div>
                ) : hasRequestedJoin ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e6da] bg-[#fafaf5] px-5 py-2.5 text-xs font-semibold text-[#5e6355]">
                    <Clock size={14} />
                    <span>Join Request Pending</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFollowing((f) => !f)}
                      className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all border ${
                        isFollowing
                          ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                          : 'border-[#e4e6da] bg-white text-[#5e6355] hover:text-[#0d0f08]'
                      }`}
                    >
                      {isFollowing ? 'Following ✓' : 'Follow'}
                    </button>

                    <button
                      type="button"
                      onClick={handleJoinCommittee}
                      className="lime-button glow flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                    >
                      <UserPlus size={14} />
                      <span>Join Committee</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tagline & Meta Strip */}
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5e6355]">
              {committee.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5e6355]">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-[#849158]" />
                <strong>{committee.category}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                <span>{committee.college}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={13} />
                <strong>{committee.stats?.membersCount || 42}</strong> members
              </span>
            </div>
          </div>

          {/* ── 2. SLIDING PILL NAVIGATION TABS ── */}
          <div className="border-t border-[#f0f1ea] px-6 sm:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
              {availableTabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-colors shrink-0 ${
                      isActive ? 'text-[#0d0f08]' : 'text-[#5e6355] hover:text-[#0d0f08]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="committeeTabPill"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-[#d4ff1f]"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── 3. MAIN CONTENT: 2 COLUMNS (Wide Content Left, Sticky Sidebar Right) ── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: ACTIVE TAB CONTENT (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* ──────── TAB 1: OVERVIEW ──────── */}
            {activeTab === 'overview' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Stats Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {[
                    { label: 'Active Members', value: committee.stats?.membersCount || 42, icon: Users },
                    { label: 'Events Organized', value: committee.stats?.eventsHeld || 8, icon: Calendar },
                    { label: 'Total Attendees', value: `${committee.stats?.totalAttendance || 1420}+`, icon: Ticket },
                    { label: 'Established', value: committee.foundedYear || 2025, icon: Award },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[22px] border border-[#e4e6da] bg-white p-4 shadow-sm"
                    >
                      <stat.icon size={16} className="text-[#849158]" />
                      <div className="mt-2 font-display text-2xl font-bold text-[#0d0f08]">
                        {stat.value}
                      </div>
                      <p className="text-[11px] font-medium text-[#5e6355]">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* About & Mission */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 sm:p-7 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                    About the Committee
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5e6355]">
                    {committee.about || defaultCommitteeProfile.about}
                  </p>
                  <div className="mt-4 rounded-2xl bg-[#fafaf5] border border-[#e4e6da] p-4 text-xs text-[#424638] leading-relaxed">
                    <strong className="text-[#0d0f08]">Council Mission:</strong>{' '}
                    {committee.mission || defaultCommitteeProfile.mission}
                  </div>
                </section>

                {/* "What We Do" Domain Cards */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                      What We Do
                    </h3>
                    <span className="text-xs text-[#5e6355]">Core Domains</span>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {(committee.whatWeDo || defaultCommitteeProfile.whatWeDo).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-4 transition-all hover:bg-white hover:shadow-sm"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="mt-2 text-sm font-bold text-[#0d0f08]">{item.title}</h4>
                        <p className="mt-1 text-xs text-[#5e6355] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Team Leadership Ladder */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                        Council Leadership Ladder
                      </h3>
                      <p className="text-xs text-[#5e6355]">Executive officers and domain leads</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('team')}
                      className="text-xs font-semibold text-[#839b3d] hover:underline"
                    >
                      View all team →
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {teamMembers.slice(0, 6).map((member) => (
                      <div
                        key={member.role}
                        className="flex items-center gap-3 rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3"
                      >
                        <div className="grid size-10 place-items-center rounded-xl bg-[#0d0f08] text-xs font-bold text-[#d4ff1f]">
                          {member.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#0d0f08]">{member.name}</p>
                          <p className="truncate text-[11px] text-[#5e6355]">{member.role}</p>
                        </div>
                        <span className="rounded-md bg-white border border-[#e4e6da] px-2 py-0.5 text-[9px] font-semibold text-[#5e6355]">
                          {member.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Verified Contributions (X-Factor) */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-[#849158]" />
                    <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                      Verified Member Contributions
                    </h3>
                  </div>
                  <p className="text-xs text-[#5e6355] mb-4">
                    Officially endorsed leadership credentials and festival execution credits.
                  </p>

                  <div className="space-y-3">
                    {(committee.verifiedContributions || defaultCommitteeProfile.verifiedContributions).map((c) => (
                      <div
                        key={c.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-[#0d0f08]">{c.member}</strong>
                            <span className="text-[#5e6355]">({c.role})</span>
                          </div>
                          <p className="mt-1 text-[#424638]">{c.work}</p>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#414d1e] bg-[#d4ff1f]/30 border border-[#d4ff1f] px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 size={12} className="text-[#839b3d]" />
                          <span>{c.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Sponsor Wall */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                        Partners & Sponsors
                      </h3>
                      <p className="text-xs text-[#5e6355]">Brand collaborations and event backers</p>
                    </div>
                    {userRole === 'lead' && (
                      <button
                        type="button"
                        onClick={() => onToast?.('Sponsor manager opening...')}
                        className="text-xs font-semibold text-[#839b3d] hover:underline"
                      >
                        + Add Sponsor
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(committee.sponsors || defaultCommitteeProfile.sponsors).map((s) => (
                      <div
                        key={s.name}
                        className="flex flex-col items-center justify-center rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-4 text-center"
                      >
                        <span className="text-xs font-bold text-[#0d0f08]">{s.name}</span>
                        <span className="mt-1 text-[10px] text-[#5e6355]">{s.tier}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ──────── TAB 2: EVENTS TIMELINE ──────── */}
            {activeTab === 'events' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#0d0f08]">Events & Conclaves</h3>
                    <p className="text-xs text-[#5e6355]">Official productions hosted by {committee.name}</p>
                  </div>
                  {userRole === 'lead' && (
                    <button
                      type="button"
                      onClick={() => onToast?.('Event creation wizard opened.')}
                      className="lime-button glow flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                    >
                      <Plus size={14} />
                      <span>Host Event</span>
                    </button>
                  )}
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-4">
                  {(committee.eventsTimeline || defaultCommitteeProfile.eventsTimeline).map((ev, index) => (
                    <div
                      key={ev.id}
                      className="flex gap-4 rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-sm transition-all hover:border-[#0d0f08]/30"
                    >
                      <div className="flex flex-col items-center">
                        <span className="grid size-11 place-items-center rounded-2xl bg-[#fafaf5] border border-[#e4e6da] text-xl font-bold">
                          {index === 0 ? '🔥' : '⚡'}
                        </span>
                        <div className="w-0.5 flex-1 bg-[#f0f1ea] mt-3" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              ev.status === 'upcoming'
                                ? 'bg-[#d4ff1f]/30 border border-[#d4ff1f] text-[#414d1e]'
                                : 'bg-[#fafaf5] border border-[#e4e6da] text-[#5e6355]'
                            }`}
                          >
                            {ev.status === 'upcoming' ? 'Upcoming' : 'Concluded'}
                          </span>
                          <span className="text-xs text-[#5e6355] flex items-center gap-1">
                            <Clock size={12} />
                            {ev.date}
                          </span>
                        </div>

                        <h4 className="mt-2 text-base font-bold text-[#0d0f08]">{ev.title}</h4>
                        <p className="mt-1 text-xs text-[#5e6355]">{ev.desc}</p>

                        <div className="mt-3 flex items-center justify-between border-t border-[#f0f1ea] pt-3 text-xs">
                          <span className="flex items-center gap-1 text-[#5e6355]">
                            <MapPin size={12} />
                            {ev.venue}
                          </span>

                          <button
                            type="button"
                            onClick={() => onNavigate?.('/events')}
                            className="inline-flex items-center gap-1 font-bold text-[#0d0f08] hover:text-[#839b3d]"
                          >
                            <span>{ev.passes}</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 3: TEAM ──────── */}
            {activeTab === 'team' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#0d0f08]">Council Team Roster</h3>
                    <p className="text-xs text-[#5e6355]">Elected council leads and coordinators</p>
                  </div>
                  {userRole === 'lead' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-semibold text-[#839b3d] hover:underline"
                    >
                      + Add Team Role
                    </button>
                  )}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.role + member.name}
                      className="flex items-center gap-3.5 rounded-[22px] border border-[#e4e6da] bg-white p-4 shadow-sm"
                    >
                      <div className="grid size-12 place-items-center rounded-2xl bg-[#0d0f08] text-sm font-bold text-[#d4ff1f]">
                        {member.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#0d0f08]">{member.name}</p>
                        <p className="truncate text-xs text-[#5e6355]">{member.role}</p>
                      </div>
                      <span className="rounded-full bg-[#fafaf5] border border-[#e4e6da] px-2.5 py-1 text-[10px] font-semibold text-[#5e6355]">
                        {member.tier}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 4: MEMBERS (Members & Leads only) ──────── */}
            {activeTab === 'members' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#f0f1ea] pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0d0f08]">General Members Directory</h3>
                    <p className="text-xs text-[#5e6355]">Verified student members on campus</p>
                  </div>
                  <span className="rounded-full bg-[#fafaf5] border border-[#e4e6da] px-3 py-1 text-xs font-mono font-bold text-[#0d0f08]">
                    {committee.stats?.membersCount || 42} Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Priya Sen', dept: 'CSE · 2nd Year', status: 'Active', joined: 'Nov 2025' },
                    { name: 'Debarghya Roy', dept: 'ECE · 3rd Year', status: 'Active', joined: 'Oct 2025' },
                    { name: 'Ritika Ghosh', dept: 'IT · 1st Year', status: 'Active', joined: 'Dec 2025' },
                    { name: 'Aarav Sen', dept: 'ME · 2nd Year', status: 'Active', joined: 'Jan 2026' },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-xl bg-white border border-[#e4e6da] font-bold text-[#0d0f08]">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-[#0d0f08]">{m.name}</strong>
                          <p className="text-[11px] text-[#5e6355]">{m.dept}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#5e6355]">Since {m.joined}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#d4ff1f]/30 border border-[#d4ff1f] px-2 py-0.5 text-[9px] font-bold text-[#414d1e]">
                          <Check size={10} />
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 5: UPDATES & ANNOUNCEMENTS ──────── */}
            {activeTab === 'updates' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#0d0f08]">Announcements Feed</h3>
                    <p className="text-xs text-[#5e6355]">Official notices broadcasted to all members</p>
                  </div>
                  {userRole === 'lead' && (
                    <button
                      type="button"
                      onClick={() => setIsPostingNotice((p) => !p)}
                      className="lime-button glow flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                    >
                      <Plus size={14} />
                      <span>New Post</span>
                    </button>
                  )}
                </div>

                {/* Lead Posting Drawer */}
                {isPostingNotice && userRole === 'lead' && (
                  <form onSubmit={handlePostNotice} className="rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-[#0d0f08]">Post Council Update</h4>
                    <input
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="Notice headline..."
                      className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-3.5 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                    />
                    <textarea
                      rows={3}
                      required
                      value={newNoticeBody}
                      onChange={(e) => setNewNoticeBody(e.target.value)}
                      placeholder="Announcement body text..."
                      className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-3.5 py-2 text-xs text-[#0d0f08] outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPostingNotice(false)}
                        className="rounded-full border border-[#e4e6da] px-4 py-1.5 text-xs font-semibold text-[#5e6355]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="lime-button rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                      >
                        Publish Update
                      </button>
                    </div>
                  </form>
                )}

                {/* Notices List */}
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#849158]">
                          <Megaphone size={13} />
                          {ann.author}
                        </span>
                        <span className="text-[11px] text-[#5e6355]">{ann.date}</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-[#0d0f08]">{ann.title}</h4>
                      <p className="text-xs leading-relaxed text-[#5e6355]">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 6: GALLERY ──────── */}
            {activeTab === 'gallery' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-[#0d0f08]">Event Photos & Highlights</h3>
                  <span className="text-xs text-[#5e6355]">Campus Archives</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {(committee.gallery || defaultCommitteeProfile.gallery).map((alb) => (
                    <div
                      key={alb.id}
                      className="group flex flex-col justify-between rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-sm transition-all hover:border-[#0d0f08]/30"
                    >
                      <div className="h-32 rounded-2xl bg-[#fafaf5] border border-[#e4e6da] flex items-center justify-center text-4xl shadow-inner group-hover:scale-[1.02] transition-transform">
                        {alb.coverEmoji}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#0d0f08]">{alb.title}</h4>
                          <p className="text-xs text-[#5e6355]">{alb.photosCount} Photos</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToast?.(`Viewing ${alb.title} album.`)}
                          className="rounded-full bg-[#fafaf5] border border-[#e4e6da] p-2 text-[#0d0f08] hover:bg-[#d4ff1f]"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 7: RESOURCES (Members only) ──────── */}
            {activeTab === 'resources' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#f0f1ea] pb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0d0f08]">Member Resources & Brand Assets</h3>
                    <p className="text-xs text-[#5e6355]">Official templates, checklists and documents</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(committee.resources || defaultCommitteeProfile.resources).map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3.5 text-xs transition-all hover:bg-white"
                    >
                      <div>
                        <strong className="text-[#0d0f08]">{res.title}</strong>
                        <p className="text-[11px] text-[#5e6355] mt-0.5">{res.type} • {res.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToast?.(`Downloading ${res.title}...`)}
                        className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e4e6da] px-3 py-1.5 font-semibold text-[#0d0f08] hover:bg-[#d4ff1f]"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──────── TAB 8: SETTINGS & MANAGE (Leads only) ──────── */}
            {activeTab === 'settings' && userRole === 'lead' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Review Pending Join Requests */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#f0f1ea] pb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0d0f08]">
                        Pending Join Applications ({pendingRequests.length})
                      </h3>
                      <p className="text-xs text-[#5e6355]">Review student join requests via API</p>
                    </div>
                    {loadingRequests && <span className="text-xs text-[#5e6355]">Loading...</span>}
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#5e6355]">
                      <CheckCircle2 size={32} className="mx-auto text-[#839b3d]" />
                      <p className="mt-2 font-bold text-[#0d0f08]">All caught up!</p>
                      <p className="mt-0.5">No pending join requests waiting for review.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((req) => (
                        <div
                          key={req.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-4 text-xs"
                        >
                          <div>
                            <strong className="text-sm font-bold text-[#0d0f08]">{req.name}</strong>
                            <p className="text-[11px] text-[#5e6355]">{req.email} {req.phone ? `• ${req.phone}` : ''}</p>
                            <span className="text-[10px] text-[#849158] font-mono">Applied: {req.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={reviewingId === req.id}
                              onClick={() => handleReviewApplication(req.id, 'approve')}
                              className="lime-button rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={reviewingId === req.id}
                              onClick={() => handleReviewApplication(req.id, 'reject')}
                              className="rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 2. Add Council Team Role */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-display text-lg font-bold text-[#0d0f08]">Add Council Team Role</h3>
                  <form onSubmit={handleAddTeamRole} className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Student full name..."
                      className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-3.5 py-2.5 text-xs font-semibold text-[#0d0f08] outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={newRoleTitle}
                      onChange={(e) => setNewRoleTitle(e.target.value)}
                      placeholder="Role title (e.g. Creative Lead)..."
                      className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-3.5 py-2.5 text-xs font-semibold text-[#0d0f08] outline-none"
                    />
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="lime-button rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                      >
                        + Assign Role
                      </button>
                    </div>
                  </form>
                </section>

                {/* 3. Recruitment Controls */}
                <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0d0f08]">Recruitment Status</h3>
                      <p className="text-xs text-[#5e6355]">Enable or disable the "Join the team" recruitment card</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRecruitmentOpen((o) => !o)
                        onToast?.(`Recruitment set to ${!recruitmentOpen ? 'OPEN' : 'CLOSED'}`)
                      }}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        recruitmentOpen
                          ? 'bg-[#d4ff1f] text-[#0d0f08]'
                          : 'bg-[#fafaf5] border border-[#e4e6da] text-[#5e6355]'
                      }`}
                    >
                      {recruitmentOpen ? 'Recruitments Open ✓' : 'Recruitments Closed'}
                    </button>
                  </div>
                </section>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR CARDS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* CARD 1: NEXT EVENT CARD WITH COUNTDOWN */}
            {committee.nextEvent && (
              <div className="rounded-[26px] border border-[#e4e6da] bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d4ff1f]/30 border border-[#d4ff1f] px-2.5 py-0.5 text-[10px] font-bold text-[#414d1e]">
                    <Flame size={12} className="text-[#839b3d]" />
                    <span>Next Flagship Event</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[#849158]">
                    {committee.nextEvent.daysLeft}d left
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-[#0d0f08]">
                    {committee.nextEvent.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#5e6355] leading-relaxed">
                    {committee.nextEvent.tagline}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fafaf5] border border-[#e4e6da] p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[#5e6355]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {committee.nextEvent.date}
                    </span>
                    <span>{committee.nextEvent.time}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-[#0d0f08] pt-1 border-t border-[#e4e6da]">
                    <span>Pass Entry</span>
                    <span className="font-mono">{committee.nextEvent.ticketPrice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate?.('/events')}
                  className="lime-button glow w-full flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <span>Book Event Pass</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {/* CARD 2: "JOIN THE TEAM" RECRUITMENT CARD (Shown when open) */}
            {recruitmentOpen && (
              <div className="rounded-[26px] border border-[#d4ff1f] bg-[#d4ff1f]/10 p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#414d1e]">
                    <UserPlus size={14} className="text-[#839b3d]" />
                    <span>Join the Council Team</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5e6355]">
                    Deadline: {committee.recruitment?.deadline || 'March 20'}
                  </span>
                </div>

                <p className="text-xs text-[#424638] leading-relaxed">
                  Open domain recruitments are live for the upcoming annual cycle. Build verified campus leadership credentials.
                </p>

                {/* Open Domains */}
                <div className="space-y-1.5">
                  {(committee.recruitment?.domains || defaultCommitteeProfile.recruitment.domains).map((dom) => (
                    <div
                      key={dom.name}
                      className="flex items-center justify-between rounded-xl bg-white border border-[#e4e6da] px-3 py-1.5 text-[11px]"
                    >
                      <strong className="text-[#0d0f08]">{dom.name}</strong>
                      <span className="font-mono text-[#849158] font-semibold">{dom.slots}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleJoinCommittee}
                  className="w-full rounded-full bg-[#0d0f08] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#839b3d] transition-all"
                >
                  Apply to Council
                </button>
              </div>
            )}

            {/* CARD 3: CONTACT & OFFICIAL SOCIALS */}
            <div className="rounded-[26px] border border-[#e4e6da] bg-white p-5 shadow-sm space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5e6355]">
                Official Contact & Socials
              </h4>

              <div className="space-y-2 text-xs">
                <a
                  href={`mailto:${committee.socials?.email || committee.email || 'contact@campus.edu'}`}
                  className="flex items-center gap-2.5 rounded-xl border border-[#e4e6da] bg-[#fafaf5] p-2.5 text-[#0d0f08] hover:bg-white transition-colors"
                >
                  <Mail size={14} className="text-[#849158]" />
                  <span className="truncate">{committee.socials?.email || committee.email || 'contact@campus.edu'}</span>
                </a>

                {committee.socials?.instagram && (
                  <a
                    href={committee.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-[#e4e6da] bg-[#fafaf5] p-2.5 text-[#0d0f08] hover:bg-white transition-colors"
                  >
                    <InstagramIcon size={14} className="text-[#849158]" />
                    <span>Instagram Profile</span>
                    <ExternalLink size={12} className="ml-auto text-[#5e6355]" />
                  </a>
                )}

                {committee.socials?.linkedin && (
                  <a
                    href={committee.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-[#e4e6da] bg-[#fafaf5] p-2.5 text-[#0d0f08] hover:bg-white transition-colors"
                  >
                    <LinkedinIcon size={14} className="text-[#849158]" />
                    <span>LinkedIn Network</span>
                    <ExternalLink size={12} className="ml-auto text-[#5e6355]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. SHAREABLE INSTAGRAM STORY CARD MODAL (Creative Feature) ── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-[#0d0f08]/65 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-sm rounded-[32px] border border-[#e4e6da] bg-[#0d0f08] p-6 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-white/60 hover:bg-white/10"
              >
                <X size={16} />
              </button>

              {/* Story Aspect Card */}
              <div className="text-center pt-2">
                <span className="grid size-16 mx-auto place-items-center rounded-2xl bg-[#d4ff1f] text-3xl text-[#0d0f08]">
                  {committee.icon || '🏛️'}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">{committee.name}</h3>
                <p className="font-mono text-xs text-[#d4ff1f]">@{committee.username}</p>
                <p className="mt-2 text-xs text-white/70 line-clamp-2 px-2">{committee.description}</p>

                {/* Simulated QR Code for Instant Joining */}
                <div className="mt-5 mx-auto size-36 bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-lg">
                  <QrCode size={110} className="text-[#0d0f08]" />
                </div>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-white/60">
                  Scan to Open on Artiverse
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="lime-button flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                  >
                    <Copy size={13} />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToast?.('Story graphic saved to downloads!')
                      setIsShareModalOpen(false)
                    }}
                    className="rounded-full border border-white/20 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Save Story Graphic
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
