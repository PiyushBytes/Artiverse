import { useState } from 'react'
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function InviteDrawer({
  isOpen,
  onClose,
  workspace,
  roles = [],
  onCreateInvite,
  onRevokeInvite,
  onReviewRequest,
  onToast,
}) {
  const [activeTab, setActiveTab] = useState('link') // 'link' | 'requests' | 'search'
  const [selectedRoleId, setSelectedRoleId] = useState('role_member')
  const [maxUses, setMaxUses] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('7')
  const [requireApproval, setRequireApproval] = useState(true)
  const [copiedToken, setCopiedToken] = useState(null)

  if (!isOpen) return null

  // SECURITY RULE: Low-level roles only for invite links. NEVER Admin or Owner!
  const safeAssignableRoles = roles.filter(
    (r) => r.id !== 'role_owner' && r.id !== 'role_admin'
  )

  const handleGenerateLink = (e) => {
    e.preventDefault()
    const expDate = new Date()
    expDate.setDate(expDate.getDate() + Number(expiresInDays))

    onCreateInvite?.({
      roleId: selectedRoleId,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expDate.toISOString().split('T')[0],
      requireApproval,
    })
    onToast?.('Invite link created.')
  }

  const handleCopy = (token) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://arteza.online'
    const fullLink = `${origin}/join/${token}`
    navigator.clipboard?.writeText(fullLink)
    setCopiedToken(token)
    onToast?.('Invite link copied to clipboard.')
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const pendingRequests = workspace?.joinRequests || []
  const activeInvites = (workspace?.invites || []).filter((inv) => !inv.isRevoked)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0d0f08]/40 backdrop-blur-xs"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full max-w-md flex-col justify-between border-l border-[#e4e6da] bg-[#ffffff] shadow-2xl"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6da] px-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0d0f08]">
                Invite & Manage Requests
              </h3>
              <p className="mt-0.5 text-xs text-[#5e6355]">
                Generate secure links or review incoming student requests.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] p-1 text-[#8b907f] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
            >
              <X size={17} />
            </button>
          </div>

          {/* Sub-Tabs */}
          <div className="flex border-b border-[#e4e6da] bg-[#fafaf5] px-6 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`border-b-2 py-2.5 font-medium transition-colors mr-5 ${
                activeTab === 'link'
                  ? 'border-[#0d0f08] text-[#0d0f08]'
                  : 'border-transparent text-[#5e6355] hover:text-[#0d0f08]'
              }`}
            >
              Invite Link
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-1.5 border-b-2 py-2.5 font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'border-[#0d0f08] text-[#0d0f08]'
                  : 'border-transparent text-[#5e6355] hover:text-[#0d0f08]'
              }`}
            >
              <span>Join Requests</span>
              {pendingRequests.length > 0 && (
                <span className="rounded-full bg-[#d4ff1f] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#0d0f08]">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab 1: Invite Link */}
          {activeTab === 'link' && (
            <div className="space-y-5 p-6 text-xs">
              <form onSubmit={handleGenerateLink} className="space-y-4">
                {/* Role Selector (Low-level roles only) */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#5e6355]">
                    Assign Role on Join
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-[10px] border border-[#e4e6da] bg-[#ffffff] px-3 text-xs text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                  >
                    {safeAssignableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.description?.slice(0, 45)}...
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-[#8b907f]">
                    Security rule: Invite links can never grant Admin or Owner permissions.
                  </p>
                </div>

                {/* Expiry & Max Uses */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5e6355]">
                      Expires In
                    </label>
                    <select
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(e.target.value)}
                      className="mt-1.5 h-9 w-full rounded-[10px] border border-[#e4e6da] bg-[#ffffff] px-2 text-xs text-[#0d0f08] outline-none"
                    >
                      <option value="1">24 hours</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5e6355]">
                      Max Uses
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      className="mt-1.5 h-9 w-full rounded-[10px] border border-[#e4e6da] bg-[#ffffff] px-3 text-xs text-[#0d0f08] outline-none focus:border-[#0d0f08]"
                    />
                  </div>
                </div>

                {/* Require approval toggle */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                    className="size-4 rounded accent-[#0d0f08]"
                  />
                  <span className="text-xs text-[#0d0f08]">
                    Require council approval before joining
                  </span>
                </label>

                <button
                  type="submit"
                  className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#0d0f08] text-xs font-semibold text-[#ffffff] hover:bg-[#0d0f08]/85"
                >
                  <Plus size={15} />
                  <span>Generate Invite Link</span>
                </button>
              </form>

              {/* Active Links List */}
              <div className="border-t border-[#e4e6da] pt-4">
                <h4 className="font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                  Active Links ({activeInvites.length})
                </h4>

                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto">
                  {activeInvites.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3"
                    >
                      <div>
                        <span className="font-mono text-xs font-semibold text-[#0d0f08]">
                          /join/{inv.token}
                        </span>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[#8b907f]">
                          <span>Role: {roles.find((r) => r.id === inv.roleId)?.name || 'Member'}</span>
                          <span>•</span>
                          <span>Expires: {inv.expiresAt || 'Never'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(inv.token)}
                          className="rounded-[6px] border border-[#e4e6da] bg-white p-1.5 text-[#5e6355] hover:text-[#0d0f08]"
                          title="Copy Link"
                        >
                          {copiedToken === inv.token ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRevokeInvite?.(inv.id)}
                          className="rounded-[6px] border border-[#e4e6da] bg-white p-1.5 text-rose-600 hover:bg-rose-50"
                          title="Revoke link"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeInvites.length === 0 && (
                    <p className="py-2 text-center text-xs text-[#8b907f]">
                      No active invite links generated yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Join Requests */}
          {activeTab === 'requests' && (
            <div className="p-6 text-xs space-y-3">
              <h4 className="font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                Pending Applications ({pendingRequests.length})
              </h4>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3"
                  >
                    <div>
                      <h5 className="font-semibold text-[#0d0f08]">{req.name}</h5>
                      <p className="font-mono text-[10px] text-[#8b907f]">{req.email}</p>
                      <span className="mt-1 inline-block rounded bg-white border border-[#e4e6da] px-1.5 py-0.2 font-mono text-[9px] text-[#5e6355]">
                        Domain: {req.domain}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onReviewRequest?.({ requestId: req.id, action: 'approve' })}
                        className="rounded-[6px] bg-[#0d0f08] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black/80"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReviewRequest?.({ requestId: req.id, action: 'reject' })}
                        className="rounded-[6px] border border-[#e4e6da] bg-white px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {pendingRequests.length === 0 && (
                  <div className="py-8 text-center text-[#5e6355]">
                    No pending join requests right now.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e4e6da] p-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[10px] border border-[#e4e6da] py-2 text-xs font-semibold text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}

