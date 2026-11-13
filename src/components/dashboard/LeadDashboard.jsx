import { useEffect, useState } from 'react'
import { Check, Copy, Plus, Share2, Sparkles, UserPlus, Users, X } from 'lucide-react'
import { mockLeadUser } from '../../config/navigationData'
import { getCommitteeList, getJoinRequests, reviewJoinRequest } from '../../api/committee'

export default function LeadDashboard({ user, onToggleRoleView, onToast }) {
  const [copied, setCopied] = useState(false)
  const [liveCommittee, setLiveCommittee] = useState(null)
  const committee = liveCommittee || user?.managedCommittee || mockLeadUser.managedCommittee
  const [pendingRequests, setPendingRequests] = useState(committee.pendingRequests || [])
  const [reviewingId, setReviewingId] = useState(null)

  // Fetch live owned committee and join requests
  useEffect(() => {
    let cancelled = false

    // 1. Fetch live committee details from GET /av/committee/committee-list/
    getCommitteeList()
      .then((data) => {
        if (cancelled || !data) return
        const owned = Array.isArray(data.owned) ? data.owned : []
        if (owned.length > 0) {
          const primary = owned[0]
          setLiveCommittee({
            id: primary.id,
            name: primary.committee_name,
            username: primary.committee_username,
            description: primary.committee_description,
            email: primary.committee_mail,
            inviteCode: primary.committee_username,
            pendingCount: primary.pending_requests_count ?? 0,
            members: mockLeadUser.managedCommittee.members,
          })
        }
      })
      .catch(() => {})

    // 2. Fetch live join requests using GET /av/committee/join-requests/
    getJoinRequests()
      .then((data) => {
        if (cancelled || !data) return
        const list = Array.isArray(data)
          ? data
          : data?.request
          ? (Array.isArray(data.request) ? data.request : [data.request])
          : []

        if (list.length > 0) {
          const mapped = list.map((item) => ({
            id: item.id || `req_${Date.now()}`,
            name: `${item.member?.first_name || 'Student'} ${item.member?.last_name || ''}`.trim() || item.committee_username,
            dept: item.member?.email || item.member?.phone_number || 'Campus Applicant',
            domain: item.committee_username || 'General Domain',
            time: item.requested_at
              ? new Date(item.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now',
          }))
          setPendingRequests(mapped)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  // Review (Approve / Reject) Join Request
  // POST /av/committee/join-requests/<int:pk>/review/
  const handleReview = async (requestId, action) => {
    setReviewingId(requestId)
    try {
      await reviewJoinRequest({ requestId, action })
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
      onToast?.(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
    } catch (err) {
      onToast?.(err.message || `Unable to ${action} request.`)
    } finally {
      setReviewingId(null)
    }
  }

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://artiverse.online/register?invite=${committee.inviteCode || committee.username}`
      )
      setCopied(true)
      onToast?.('Invite link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      onToast?.('Invite handle: @' + (committee.inviteCode || committee.username))
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Committee Page Overview & "Invite a committee" button */}
      <section className="rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#fafaf5] border border-[#e4e6da] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5e6355]">
                Active Committee Portal
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#849158]">
                <span className="size-1.5 rounded-full bg-[#849158] animate-pulse" />
                Recruitment Live
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0d0f08] sm:text-3xl">
              {committee.name}
            </h1>
            <p className="mt-1 text-xs text-[#5e6355] max-w-xl">{committee.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onToggleRoleView && (
              <button
                type="button"
                onClick={() => onToggleRoleView('student')}
                className="rounded-full border border-[#e4e6da] bg-[#fafaf5] px-4 py-2 text-xs font-semibold text-[#0d0f08] hover:bg-white"
              >
                Switch to Student View
              </button>
            )}

            {/* Strictly required: "Invite a committee" button (lime) */}
            <button
              type="button"
              onClick={handleCopyInvite}
              className="lime-button inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              {copied ? <Check size={16} /> : <UserPlus size={16} />}
              <span>{copied ? 'Link Copied!' : 'Invite a committee'}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#f0f1ea] pt-5">
          <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">{committee.memberCount}</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Council Members
            </span>
          </div>
          <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">{pendingRequests.length}</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Applications
            </span>
          </div>
          <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">1-click</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Bulk Passes
            </span>
          </div>
          <div className="rounded-2xl border border-[#e4e6da] bg-[#fafaf5] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">Verified</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Campus Backing
            </span>
          </div>
        </div>
      </section>

      {/* 2. Join Requests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#0d0f08]" />
            <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">Join Requests</h2>
          </div>
          <span className="rounded-full bg-[#0d0f08] px-2.5 py-0.5 text-xs font-bold text-[#d4ff1f]">
            {pendingRequests.length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-[24px] border border-[#e4e6da] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#fafaf5] font-mono text-xs font-bold text-[#0d0f08] border border-[#e4e6da]">
                  {req.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0d0f08]">{req.name}</p>
                  <p className="text-xs text-[#5e6355]">
                    {req.dept} · Domain: <span className="text-[#0d0f08] font-semibold">{req.domain}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={reviewingId === req.id}
                  onClick={() => handleReview(req.id, 'approve')}
                  className="rounded-full bg-[#0d0f08] px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {reviewingId === req.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  type="button"
                  disabled={reviewingId === req.id}
                  onClick={() => handleReview(req.id, 'reject')}
                  className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Members Roster */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#0d0f08]" />
          <h2 className="text-base font-bold text-[#0d0f08] sm:text-lg">Council Members</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {committee.members.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 rounded-[24px] border border-[#e4e6da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[#0d0f08] font-mono text-xs font-bold text-[#d4ff1f]">
                {member.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-[#0d0f08]">{member.name}</p>
                <p className="text-xs text-[#5e6355]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
