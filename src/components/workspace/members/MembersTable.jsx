import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Edit2,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react'

const STATUS_VARIANTS = {
  Active: 'border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#0d0f08]',
  Pending: 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]',
  Invited: 'border-blue-200 bg-blue-50 text-blue-800',
  Alumni: 'border-amber-200 bg-amber-50 text-amber-800',
  Suspended: 'border-rose-200 bg-rose-50 text-rose-800',
}

export default function MembersTable({
  members = [],
  roles = [],
  currentUserId,
  onUpdateMember,
  onRemoveMember,
  canManageMembers,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingTitleId, setEditingTitleId] = useState(null)
  const [titleDraft, setTitleDraft] = useState('')
  const [activeMenuId, setActiveMenuId] = useState(null)

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'All' || m.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getRole = (roleId) => roles.find((r) => r.id === roleId) || { name: 'Member' }

  const handleStartEditTitle = (m) => {
    setEditingTitleId(m.id)
    setTitleDraft(m.title)
    setActiveMenuId(null)
  }

  const handleSaveTitle = (m) => {
    onUpdateMember?.(m.id, { title: titleDraft.trim() || m.title })
    setEditingTitleId(null)
  }

  return (
    <div className="space-y-4">
      {/* ── Search & Status Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b907f]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name, email, or title..."
            className="h-9 w-full rounded-[10px] border border-[#e4e6da] bg-[#ffffff] pl-9 pr-3 text-xs text-[#0d0f08] placeholder-[#8b907f] outline-none focus:border-[#0d0f08]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['All', 'Active', 'Invited', 'Pending', 'Alumni', 'Suspended'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-[8px] px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[#0d0f08] text-[#ffffff]'
                  : 'border border-[#e4e6da] bg-[#ffffff] text-[#5e6355] hover:bg-[#f6f7f0]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="overflow-hidden rounded-[14px] border border-[#e4e6da] bg-[#ffffff] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e4e6da] bg-[#fafaf5] font-mono text-[10px] uppercase text-[#5e6355]">
              <tr>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Display Title</th>
                <th className="px-4 py-3 font-semibold">Permission Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Joined Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6da]">
              {filteredMembers.map((m) => {
                const role = getRole(m.roleId)
                const isOwner = role.id === 'role_owner'
                return (
                  <tr key={m.id} className="hover:bg-[#f6f7f0]/60 transition-colors">
                    {/* Member Name & Avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="size-7 rounded-full object-cover"
                          />
                        ) : (
                          <span className="grid size-7 place-items-center rounded-full bg-[#f6f7f0] font-mono text-[10px] font-bold text-[#0d0f08] border border-[#e4e6da]">
                            {m.initials || m.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <span className="font-semibold text-[#0d0f08] block">
                            {m.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#8b907f]">
                            {m.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Display Title (Separated from Permission Roles) */}
                    <td className="px-4 py-3">
                      {editingTitleId === m.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={titleDraft}
                            onChange={(e) => setTitleDraft(e.target.value)}
                            className="h-7 w-36 rounded-[6px] border border-[#0d0f08] px-2 text-xs text-[#0d0f08] outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveTitle(m)}
                            className="rounded-[6px] bg-[#0d0f08] p-1 text-white hover:bg-[#0d0f08]/85"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="group/title flex items-center gap-1.5">
                          <span className="text-[#0d0f08] font-medium">
                            {m.title || 'Member'}
                          </span>
                          {canManageMembers && !isOwner && (
                            <button
                              type="button"
                              onClick={() => handleStartEditTitle(m)}
                              className="opacity-0 group-hover/title:opacity-100 text-[#8b907f] hover:text-[#0d0f08]"
                            >
                              <Edit2 size={11} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Permission Role Badge */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-0.5 text-[11px] font-semibold text-[#0d0f08]">
                        <Shield size={11} className="text-[#8b907f]" />
                        <span>{role.name}</span>
                      </span>
                    </td>

                    {/* Status Chip */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                          STATUS_VARIANTS[m.status] || STATUS_VARIANTS.Active
                        }`}
                      >
                        {m.status || 'Active'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-3 font-mono text-[11px] text-[#5e6355]">
                      {m.joinedDate || 'Recently'}
                    </td>

                    {/* Row Menu */}
                    <td className="px-4 py-3 text-right">
                      {canManageMembers && !isOwner && m.userId !== currentUserId ? (
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId((prev) => (prev === m.id ? null : m.id))
                            }
                            aria-label={`Options for ${m.name}`}
                            className="rounded-[6px] p-1 text-[#8b907f] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {activeMenuId === m.id && (
                            <>
                              <div
                                onClick={() => setActiveMenuId(null)}
                                className="fixed inset-0 z-30"
                              />
                              <div className="absolute right-0 top-full z-40 mt-1 w-44 rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-1 text-xs shadow-md">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditTitle(m)}
                                  className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left text-[#0d0f08] hover:bg-[#f6f7f0]"
                                >
                                  <Edit2 size={13} />
                                  <span>Edit title</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextStatus = m.status === 'Active' ? 'Suspended' : 'Active'
                                    onUpdateMember?.(m.id, { status: nextStatus })
                                    setActiveMenuId(null)
                                  }}
                                  className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left text-[#0d0f08] hover:bg-[#f6f7f0]"
                                >
                                  <UserCheck size={13} />
                                  <span>{m.status === 'Active' ? 'Suspend member' : 'Reactivate member'}</span>
                                </button>

                                <div className="my-1 border-t border-[#e4e6da]" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Remove ${m.name} from committee?`)) {
                                      onRemoveMember?.(m.id)
                                    }
                                    setActiveMenuId(null)
                                  }}
                                  className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 size={13} />
                                  <span>Remove member</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono text-[10px] text-[#8b907f]">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#5e6355]">
                    No members matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

