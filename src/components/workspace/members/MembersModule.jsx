import { useState } from 'react'
import {
  Clock,
  Filter,
  Plus,
  Shield,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import MembersTable from './MembersTable'
import RolesMatrix from './RolesMatrix'
import InviteDrawer from './InviteDrawer'

export default function MembersModule({
  workspace,
  currentUserId,
  onUpdateMember,
  onRemoveMember,
  onSaveRoles,
  onTransferOwnership,
  onCreateInvite,
  onRevokeInvite,
  onReviewRequest,
  onToast,
  canManageMembers = true,
  canManageRoles = true,
}) {
  const [subTab, setSubTab] = useState('roster') // 'roster' | 'roles'
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const members = workspace?.members || []
  const roles = workspace?.roles || []
  const pendingRequestsCount = workspace?.joinRequests?.filter(r => r.status === 'pending').length || 0

  return (
    <div className="space-y-6">
      {/* Sub-header navigation & actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-1">
          <button
            type="button"
            onClick={() => setSubTab('roster')}
            className={`flex items-center gap-2 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition ${
              subTab === 'roster'
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            <Users size={15} />
            <span>Members</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                subTab === 'roster'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#fafaf5] text-[#5e6355] border border-[#e4e6da]'
              }`}
            >
              {members.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('roles')}
            className={`flex items-center gap-2 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition ${
              subTab === 'roles'
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            <Shield size={15} />
            <span>Roles & Permissions</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                subTab === 'roles'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#fafaf5] text-[#5e6355] border border-[#e4e6da]'
              }`}
            >
              {roles.length}
            </span>
          </button>
        </div>

        {canManageMembers && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-[10px] border border-[#0d0f08] bg-[#0d0f08] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#202419]"
            >
              <UserPlus size={15} />
              <span>Invite Member</span>
              {pendingRequestsCount > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-[#d4ff1f]" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Views */}
      {subTab === 'roster' && (
        <MembersTable
          members={members}
          roles={roles}
          currentUserId={currentUserId}
          onUpdateMember={onUpdateMember}
          onRemoveMember={onRemoveMember}
          canManageMembers={canManageMembers}
        />
      )}

      {subTab === 'roles' && (
        <RolesMatrix
          workspace={workspace}
          currentUserId={currentUserId}
          onSaveRoles={onSaveRoles}
          onTransferOwnership={onTransferOwnership}
          onToast={onToast}
        />
      )}

      {/* Slide-over Invite Drawer */}
      <InviteDrawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspace={workspace}
        roles={roles}
        onCreateInvite={onCreateInvite}
        onRevokeInvite={onRevokeInvite}
        onReviewRequest={onReviewRequest}
        onToast={onToast}
      />
    </div>
  )
}

