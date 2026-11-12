import { useState } from 'react'
import { Check, Copy, Plus, Share2, Sparkles, UserPlus, Users } from 'lucide-react'
import { mockLeadUser } from '../../config/navigationData'

export default function LeadDashboard({ user, onToast }) {
  const [copied, setCopied] = useState(false)
  const committee = user?.managedCommittee || mockLeadUser.managedCommittee

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://artiverse.online/register?invite=${committee.inviteCode}`
      )
      setCopied(true)
      onToast?.('Invite link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      onToast?.('Invite code: ' + committee.inviteCode)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Committee Page Overview & "Invite a committee" button */}
      <section className="rounded-3xl border border-[#e4e6da] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#f6f7f2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5e6355]">
                Active Committee
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#849158]">
                <span className="size-1.5 rounded-full bg-[#849158] animate-pulse" />
                Recruitment Live
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#0d0f08] sm:text-3xl">
              {committee.name}
            </h1>
            <p className="mt-1 text-xs text-[#5e6355] max-w-xl">{committee.tagline}</p>
          </div>

          {/* Strictly required: "Invite a committee" button (lime) */}
          <button
            type="button"
            onClick={handleCopyInvite}
            className="button-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-sm"
          >
            {copied ? <Check size={16} /> : <UserPlus size={16} />}
            <span>{copied ? 'Link Copied!' : 'Invite a committee'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#e4e6da] pt-5">
          <div className="rounded-xl bg-[#f6f7f2] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">{committee.memberCount}</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Members
            </span>
          </div>
          <div className="rounded-xl bg-[#f6f7f2] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">{committee.requestsCount}</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Applications
            </span>
          </div>
          <div className="rounded-xl bg-[#f6f7f2] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">1-click</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              Bulk Passes
            </span>
          </div>
          <div className="rounded-xl bg-[#f6f7f2] p-3 text-center">
            <span className="text-2xl font-bold text-[#0d0f08]">Verified</span>
            <span className="block text-[10px] font-semibold text-[#5e6355] uppercase mt-0.5">
              MSIT Council
            </span>
          </div>
        </div>
      </section>

      {/* 2. Join Requests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#0d0f08]" />
            <h2 className="font-display text-xl font-bold text-[#0d0f08]">Join Requests</h2>
          </div>
          <span className="rounded-full bg-[#0d0f08] px-2.5 py-0.5 text-xs font-bold text-[#d4ff1f]">
            {committee.pendingRequests.length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {committee.pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#f6f7f2] font-mono text-xs font-bold text-[#0d0f08]">
                  {req.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0d0f08]">{req.name}</p>
                  <p className="text-xs text-[#5e6355]">
                    {req.dept} · Preferred: <span className="text-[#0d0f08] font-semibold">{req.domain}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onToast?.(`Accepted ${req.name}'s request`)}
                  className="rounded-xl bg-[#0d0f08] px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onToast?.(`Scheduled PI for ${req.name}`)}
                  className="rounded-xl border border-[#e4e6da] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0d0f08] hover:bg-[#f6f7f2]"
                >
                  Schedule PI
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
          <h2 className="font-display text-xl font-bold text-[#0d0f08]">Committee Members</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {committee.members.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 rounded-2xl border border-[#e4e6da] bg-white p-3.5 shadow-sm"
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

