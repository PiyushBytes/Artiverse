import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Palette,
  Plus,
  RotateCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { getCommitteeList } from '../api/committee'
import CreateCommitteeWizard from '../components/dashboard/CreateCommitteeWizard'

function DashboardSectionHeading({ eyebrow, title, count, action, onAction }) {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-[#ded8cf] pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-medium text-[#77736d]">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-2xl leading-tight text-[#171614] sm:text-3xl">
          {title}
          {typeof count === 'number' && (
            <span className="ml-2 font-sans text-sm font-medium text-[#8a857e]">
              {count}
            </span>
          )}
        </h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex min-h-9 items-center gap-2 self-start text-xs font-semibold text-[#65615b] transition hover:text-[#ef6b3b] sm:self-auto"
        >
          {action}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

export default function CommitteesPage({ currentUser, onNavigate, onToast }) {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'created' | 'joined'
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Live state strictly from backend
  const [ownedCommittees, setOwnedCommittees] = useState([])
  const [memberCommittees, setMemberCommittees] = useState([])
  const [pendingCommittees, setPendingCommittees] = useState([])

  const fetchCommittees = () => {
    setLoading(true)
    setError(null)

    getCommitteeList(true)
      .then((res) => {
        if (!res) return
        const owned = Array.isArray(res.owned) ? res.owned : []
        const memberOf = Array.isArray(res.member_of) ? res.member_of : []
        const pending = Array.isArray(res.pending) ? res.pending : []

        const mapBackend = (item, defaultRole = 'Member', defaultStatus = 'Active') => {
          const rawUsername = item.committee_username || item.username || ''
          const slug = String(rawUsername).toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'artikon'
          return {
            id: item.id || `comm_${slug}`,
            slug,
            name: item.committee_name || item.name || slug.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            username: rawUsername || slug,
            description: item.committee_description || item.description || '',
            email: item.committee_mail || item.email || '',
            roleTitle: defaultRole,
            status: defaultStatus,
          }
        }

        setOwnedCommittees(owned.map((o) => mapBackend(o, 'President & Founder', 'Active')))
        setMemberCommittees(memberOf.map((m) => mapBackend(m, 'Active Member', 'Active')))
        setPendingCommittees(pending.map((p) => mapBackend(p, 'Applicant', 'Pending')))
      })
      .catch((err) => {
        setError(err.message || 'Unable to load committees from backend.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCommittees()
  }, [])

  // Filter lists based on search
  const filterList = (list) => {
    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase().trim()
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }

  const filteredOwned = useMemo(() => filterList(ownedCommittees), [ownedCommittees, searchQuery])
  const filteredMember = useMemo(() => filterList(memberCommittees), [memberCommittees, searchQuery])
  const filteredPending = useMemo(() => filterList(pendingCommittees), [pendingCommittees, searchQuery])

  const totalCount = ownedCommittees.length + memberCommittees.length + pendingCommittees.length

  const handleCreated = (newComm) => {
    setIsCreateWizardOpen(false)
    fetchCommittees()
    onToast?.(`Committee "${newComm.name}" created successfully!`)
    const slug = (newComm.username || newComm.name || '').toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (slug) {
      onNavigate?.(`/committees/${slug}/manage`)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf5] px-4 pb-24 pt-6 text-[#171614] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* ── Top Header Strip ── */}
        <section className="overflow-hidden border border-[#ded8cf] bg-[#fcfbf8] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#ef6b3b]" />
                <span className="text-xs font-medium text-[#65615b]">Campus Network</span>
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#171614] sm:text-4xl">
                Committees & Guilds
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#65615b]">
                Manage the committees you lead, view your active team memberships, and access workspaces.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateWizardOpen(true)}
                className="inline-flex min-h-10 items-center gap-2 bg-[#171614] px-4 text-xs font-semibold text-white transition hover:bg-[#38332f]"
              >
                <Plus size={15} />
                <span>Create Committee</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Strip */}
          <div className="mt-6 flex flex-col gap-3 border-t border-[#ded8cf] pt-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All', count: totalCount },
                { id: 'created', label: 'Created by You', count: ownedCommittees.length },
                { id: 'joined', label: 'Joined', count: memberCommittees.length + pendingCommittees.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-[#171614] text-white'
                      : 'text-[#65615b] hover:bg-[#eeeae3] hover:text-[#171614]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-mono ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[#eeeae3] text-[#65615b]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a857e]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your committees..."
                className="w-full border border-[#ded8cf] bg-[#fcfbf8] pl-8 pr-3 py-1.5 text-xs text-[#171614] placeholder-[#8a857e] focus:border-[#ef6b3b] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 border border-[#ded8cf] bg-[#fcfbf8] p-5 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && !loading && (
          <div className="border border-[#ded8cf] bg-[#fcfbf8] p-6 text-center">
            <p className="text-xs text-[#a9431e]">{error}</p>
            <button
              type="button"
              onClick={fetchCommittees}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#171614] underline"
            >
              <RotateCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* ── Main Content Lists (NO fake data) ── */}
        {!loading && !error && (
          <div className="space-y-10">
            {/* 1. CREATED BY YOU SECTION */}
            {(activeTab === 'all' || activeTab === 'created') && (
              <section>
                <DashboardSectionHeading
                  eyebrow="Founder & Leadership"
                  title="Committees you created"
                  count={ownedCommittees.length}
                  action="+ New Committee"
                  onAction={() => setIsCreateWizardOpen(true)}
                />

                {filteredOwned.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredOwned.map((comm) => (
                      <div
                        key={comm.id}
                        className="group relative flex flex-col justify-between border border-[#ded8cf] bg-[#fcfbf8] p-5 transition-colors hover:bg-[#f5f1eb]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="grid size-12 shrink-0 place-items-center border border-[#ded8cf] bg-[#eeeae3] text-[#65615b]">
                                <Palette size={20} strokeWidth={1.5} />
                              </span>
                              <div className="min-w-0">
                                <h3 className="truncate font-display text-lg font-semibold text-[#171614] transition-colors group-hover:text-[#a9431e] sm:text-xl">
                                  {comm.name}
                                </h3>
                                <p className="truncate font-mono text-xs font-semibold text-[#5e6355]">
                                  @{comm.username}
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#47714a]">
                              <CheckCircle2 size={11} className="text-[#839b3d]" />
                              <span>Active</span>
                            </span>
                          </div>

                          {comm.description && (
                            <p className="mt-3 text-xs leading-relaxed text-[#65615b] line-clamp-2">
                              {comm.description}
                            </p>
                          )}
                        </div>

                        {/* Actions Bottom Bar */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#ded8cf] pt-3 text-xs">
                          <button
                            type="button"
                            onClick={() => onNavigate?.(`/committees/${comm.slug}`)}
                            className="font-semibold text-[#65615b] hover:text-[#171614] inline-flex items-center gap-1"
                          >
                            <span>Community Hub</span>
                            <ArrowUpRight size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigate?.(`/committees/${comm.slug}/manage`)}
                            className="inline-flex items-center gap-1 bg-[#171614] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#38332f]"
                          >
                            <Settings size={12} />
                            <span>Workspace</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[#ded8cf] bg-[#fcfbf8] px-5 py-10 text-center sm:px-8">
                    <Building2 size={28} className="mx-auto text-[#ef6b3b]" />
                    <p className="mt-3 font-display text-xl text-[#171614]">
                      No created committees yet
                    </p>
                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#65615b]">
                      Register your student society, festival committee, or creative guild to manage members, roles, tasks, and meetings.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreateWizardOpen(true)}
                      className="mt-5 inline-flex min-h-10 items-center gap-2 bg-[#171614] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#38332f]"
                    >
                      Create committee <ArrowDownRight size={14} />
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* 2. JOINED COMMITTEES & APPLICATIONS */}
            {(activeTab === 'all' || activeTab === 'joined') && (
              <section>
                <DashboardSectionHeading
                  eyebrow="Memberships & Applications"
                  title="Committees you joined"
                  count={memberCommittees.length + pendingCommittees.length}
                />

                {[...filteredMember, ...filteredPending].length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...filteredMember, ...filteredPending].map((comm) => (
                      <div
                        key={comm.id}
                        onClick={() => onNavigate?.(`/committees/${comm.slug}`)}
                        className="group relative flex cursor-pointer flex-col justify-between border border-[#ded8cf] bg-[#fcfbf8] p-5 transition-colors hover:bg-[#f5f1eb]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="grid size-12 shrink-0 place-items-center border border-[#ded8cf] bg-[#eeeae3] text-[#65615b]">
                                <Palette size={20} strokeWidth={1.5} />
                              </span>
                              <div className="min-w-0">
                                <h3 className="truncate font-display text-lg font-semibold text-[#171614] transition-colors group-hover:text-[#a9431e] sm:text-xl">
                                  {comm.name}
                                </h3>
                                <p className="truncate font-mono text-xs font-semibold text-[#5e6355]">
                                  @{comm.username}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium ${
                                comm.status === 'Active'
                                  ? 'text-[#47714a]'
                                  : 'text-[#65615b]'
                              }`}
                            >
                              {comm.status === 'Active' ? (
                                <CheckCircle2 size={11} className="text-[#839b3d]" />
                              ) : (
                                <Clock size={11} />
                              )}
                              <span>{comm.status}</span>
                            </span>
                          </div>

                          {comm.description && (
                            <p className="mt-3 text-xs leading-relaxed text-[#65615b] line-clamp-2">
                              {comm.description}
                            </p>
                          )}
                        </div>

                        {/* Role & Arrow */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#ded8cf] pt-3 text-xs">
                          <span className="font-semibold text-[#0d0f08]">
                            {comm.roleTitle}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-[#5e6355] transition-colors group-hover:text-[#171614]">
                            <span className="text-[11px]">View Committee</span>
                            <ArrowUpRight
                              size={14}
                              className="text-[#65615b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[#ded8cf] bg-[#fcfbf8] px-5 py-10 text-center sm:px-8">
                    <Users size={28} className="mx-auto text-[#ef6b3b]" />
                    <p className="mt-3 font-display text-xl text-[#171614]">
                      No joined committees yet
                    </p>
                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#65615b]">
                      You haven&apos;t joined any campus committees yet. Discover committees on campus and submit an application to participate.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate?.('/events')}
                      className="mt-5 inline-flex min-h-10 items-center gap-2 bg-[#171614] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#38332f]"
                    >
                      Explore live events <ArrowDownRight size={14} />
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {/* ── Create Committee Wizard Modal ── */}
      <CreateCommitteeWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onCreated={handleCreated}
        onToast={onToast}
        userCommittees={ownedCommittees}
      />
    </div>
  )
}
