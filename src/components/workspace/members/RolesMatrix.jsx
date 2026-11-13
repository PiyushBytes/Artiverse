import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Edit2,
  Lock,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react'
import { PERMISSION_GROUPS } from '../api/workspaceApi'

export default function RolesMatrix({
  workspace,
  currentUserId,
  onSaveRoles,
  onTransferOwnership,
  onToast,
}) {
  const roles = workspace?.roles || []
  const members = workspace?.members || []
  const isOwner = workspace?.ownerId === currentUserId

  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || 'role_owner')
  const [newRoleName, setNewRoleName] = useState('')
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [transferTargetId, setTransferTargetId] = useState('')
  const [typedConfirmation, setTypedConfirmation] = useState('')
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0]

  // Toggle permission flag for custom roles (Owner is locked)
  const handleTogglePermission = (permKey) => {
    if (activeRole.isLocked) return // Cannot alter Owner role

    const currentPerms = activeRole.permissions || []
    const updatedPerms = currentPerms.includes(permKey)
      ? currentPerms.filter((k) => k !== permKey)
      : [...currentPerms, permKey]

    const updatedRoles = roles.map((r) =>
      r.id === activeRole.id ? { ...r, permissions: updatedPerms } : r
    )

    onSaveRoles?.(updatedRoles)
    onToast?.(`Updated permissions for ${activeRole.name}.`)
  }

  // Create custom role
  const handleCreateRole = (e) => {
    e.preventDefault()
    if (!newRoleName.trim()) return

    const newRole = {
      id: `role_${Date.now()}`,
      name: newRoleName.trim(),
      isSystem: false,
      isLocked: false,
      color: '#0d0f08',
      description: 'Custom appointed council role.',
      permissions: ['members.view', 'tasks.view', 'announcements.view', 'meetings.view'],
    }

    onSaveRoles?.([...roles, newRole])
    setSelectedRoleId(newRole.id)
    setNewRoleName('')
    setIsCreatingRole(false)
    onToast?.(`Custom role "${newRole.name}" created.`)
  }

  // Delete custom role
  const handleDeleteRole = (roleId) => {
    if (roles.find((r) => r.id === roleId)?.isSystem) {
      alert('System roles cannot be deleted.')
      return
    }
    if (confirm('Delete this custom role? Members with this role will revert to Member.')) {
      const updatedRoles = roles.filter((r) => r.id !== roleId)
      onSaveRoles?.(updatedRoles)
      setSelectedRoleId(roles[0].id)
      onToast?.('Role deleted.')
    }
  }

  // Members assigned to this role
  const assignedMembers = members.filter((m) => m.roleId === activeRole.id)

  // Handle transfer ownership
  const handleConfirmTransfer = (e) => {
    e.preventDefault()
    if (typedConfirmation !== 'TRANSFER OWNERSHIP') {
      alert('Type TRANSFER OWNERSHIP in capital letters to confirm.')
      return
    }

    onTransferOwnership?.({ newOwnerId: transferTargetId })
    setIsTransferModalOpen(false)
    setTypedConfirmation('')
    setTransferTargetId('')
    onToast?.('Committee ownership transferred.')
  }

  return (
    <div className="space-y-6">
      {/* ── Role Selector & New Role Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#0d0f08]">
            Roles & Permission Matrix
          </h3>
          <p className="mt-0.5 text-xs text-[#5e6355]">
            Granular access controls enforced across tasks, meetings, announcements and member actions.
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingRole(true)}
              className="flex items-center gap-1.5 rounded-[10px] border border-[#e4e6da] bg-white px-3 py-1.5 text-xs font-semibold text-[#0d0f08] hover:bg-[#f6f7f0]"
            >
              <Plus size={14} />
              <span>Create Custom Role</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTransferModalOpen(true)}
              className="flex items-center gap-1.5 rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
            >
              <AlertTriangle size={13} />
              <span>Transfer Ownership</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Role Input Bar */}
      {isCreatingRole && (
        <form
          onSubmit={handleCreateRole}
          className="flex items-center gap-2 rounded-[12px] border border-[#0d0f08] bg-white p-3"
        >
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="e.g. Design Lead, Editorial Head, Event POC"
            className="flex-1 text-xs text-[#0d0f08] outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsCreatingRole(false)}
            className="rounded-[6px] px-2.5 py-1 text-xs text-[#5e6355] hover:bg-[#f6f7f0]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-[6px] bg-[#0d0f08] px-3 py-1 text-xs font-semibold text-white"
          >
            Save Role
          </button>
        </form>
      )}

      {/* ── Role Pills Navigation ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {roles.map((r) => {
          const isSelected = r.id === selectedRoleId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRoleId(r.id)}
              className={`flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 font-medium transition-colors ${
                isSelected
                  ? 'bg-[#0d0f08] text-white'
                  : 'border border-[#e4e6da] bg-white text-[#5e6355] hover:bg-[#f6f7f0]'
              }`}
            >
              {r.isLocked && <Lock size={12} className={isSelected ? 'text-white' : 'text-[#8b907f]'} />}
              <span>{r.name}</span>
              {r.isSystem && (
                <span className="font-mono text-[9px] uppercase opacity-60">System</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Active Role Card & Permission Matrix ── */}
      <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-xs">
        {/* Role Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-[#e4e6da] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-[#0d0f08]">
                {activeRole.name} Role
              </h4>
              {activeRole.isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f6f7f0] px-2 py-0.2 text-[10px] font-semibold text-[#5e6355]">
                  <Lock size={10} /> Locked System Role
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#5e6355]">
              {activeRole.description}
            </p>
          </div>

          {!activeRole.isSystem && isOwner && (
            <button
              type="button"
              onClick={() => handleDeleteRole(activeRole.id)}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
            >
              <Trash2 size={13} />
              <span>Delete Role</span>
            </button>
          )}
        </div>

        {/* Assigned People Counter */}
        <div className="my-4 flex items-center justify-between rounded-[10px] bg-[#fafaf5] p-3 text-xs">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-[#5e6355]" />
            <span className="font-semibold text-[#0d0f08]">
              {assignedMembers.length} member{assignedMembers.length !== 1 ? 's' : ''} assigned
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#8b907f]">
            {assignedMembers.map((m) => m.name).join(', ') || 'No members assigned yet'}
          </span>
        </div>

        {/* Checkbox Matrix Grouped by Module */}
        <div className="space-y-6 pt-2">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.id} className="border-t border-[#f0f1ea] pt-4 first:border-0 first:pt-0">
              <h5 className="font-mono text-[10px] font-semibold uppercase text-[#8b907f]">
                {group.label}
              </h5>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {group.permissions.map((perm) => {
                  const isChecked = activeRole.permissions?.includes(perm.key)
                  return (
                    <label
                      key={perm.key}
                      className={`flex items-start gap-2.5 rounded-[10px] border p-2.5 transition-colors ${
                        activeRole.isLocked
                          ? 'cursor-not-allowed border-[#e4e6da] bg-[#fafaf5]/60 opacity-80'
                          : 'cursor-pointer border-[#e4e6da] hover:bg-[#f6f7f0]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={activeRole.isLocked}
                        onChange={() => handleTogglePermission(perm.key)}
                        className="mt-0.5 size-4 rounded accent-[#0d0f08]"
                      />
                      <div>
                        <span className="block text-xs font-medium text-[#0d0f08]">
                          {perm.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#8b907f]">
                          {perm.key}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transfer Ownership Confirmation Modal ── */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsTransferModalOpen(false)}
            className="absolute inset-0 bg-[#0d0f08]/50 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md rounded-[14px] border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-700">
              <AlertTriangle size={20} />
              <h4 className="text-sm font-bold">Transfer Committee Ownership</h4>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#5e6355]">
              Transferring ownership gives full control to another member. You will become an Admin and lose the ability to manage the Owner role.
            </p>

            <form onSubmit={handleConfirmTransfer} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#0d0f08]">
                  Select New Owner
                </label>
                <select
                  required
                  value={transferTargetId}
                  onChange={(e) => setTransferTargetId(e.target.value)}
                  className="mt-1 h-9 w-full rounded-[10px] border border-[#e4e6da] bg-white px-3 text-xs text-[#0d0f08] outline-none"
                >
                  <option value="">Select a council member...</option>
                  {members
                    .filter((m) => m.roleId !== 'role_owner')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0d0f08]">
                  Type <span className="font-mono text-rose-700 font-bold">TRANSFER OWNERSHIP</span> to confirm
                </label>
                <input
                  type="text"
                  required
                  value={typedConfirmation}
                  onChange={(e) => setTypedConfirmation(e.target.value)}
                  placeholder="TRANSFER OWNERSHIP"
                  className="mt-1 h-9 w-full rounded-[10px] border border-rose-300 px-3 font-mono text-xs text-[#0d0f08] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="rounded-[10px] px-3 py-1.5 text-xs text-[#5e6355] hover:bg-[#f6f7f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={typedConfirmation !== 'TRANSFER OWNERSHIP' || !transferTargetId}
                  className="rounded-[10px] bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

