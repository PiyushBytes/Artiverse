import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJoinRequests, reviewJoinRequest, getCommitteeList } from '../../../api/committee'

// ── PERMISSION MATRIX DEFINITION ──
export const PERMISSION_GROUPS = [
  {
    id: 'members',
    label: 'Members & Access',
    permissions: [
      { key: 'members.view', label: 'View members roster' },
      { key: 'members.invite', label: 'Create invite links & invite members' },
      { key: 'members.edit_status', label: 'Change member status (Active, Alumni, Suspended)' },
      { key: 'members.manage_roles', label: 'Create and assign custom roles' },
      { key: 'members.requests', label: 'Review pending join applications' },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks & Projects',
    permissions: [
      { key: 'tasks.view', label: 'View task Kanban board' },
      { key: 'tasks.create', label: 'Create new tasks' },
      { key: 'tasks.edit', label: 'Edit and move tasks' },
      { key: 'tasks.delete', label: 'Delete tasks' },
    ],
  },
  {
    id: 'announcements',
    label: 'Announcements',
    permissions: [
      { key: 'announcements.view', label: 'Read announcements & vote on polls' },
      { key: 'announcements.create', label: 'Broadcast announcements and create polls' },
      { key: 'announcements.delete', label: 'Delete announcements' },
    ],
  },
  {
    id: 'meetings',
    label: 'Meetings & Minutes',
    permissions: [
      { key: 'meetings.view', label: 'View meeting schedules' },
      { key: 'meetings.create', label: 'Schedule meetings & set agendas' },
      { key: 'meetings.mark_attendance', label: 'Mark attendance & take minutes' },
      { key: 'meetings.action_items', label: 'Convert action items to Kanban tasks' },
    ],
  },
  {
    id: 'committee',
    label: 'Committee Administration',
    permissions: [
      { key: 'committee.settings', label: 'Edit committee info & branding' },
      { key: 'committee.transfer_ownership', label: 'Transfer primary ownership' },
      { key: 'committee.audit_log', label: 'View security audit logs' },
    ],
  },
]

export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key)
)

export const DEFAULT_SYSTEM_ROLES = [
  {
    id: 'role_owner',
    name: 'Owner',
    isSystem: true,
    isLocked: true,
    color: '#0d0f08',
    description: 'Complete administrative control over all workspace modules and ownership transfer.',
    permissions: ALL_PERMISSION_KEYS,
  },
  {
    id: 'role_admin',
    name: 'Admin',
    isSystem: true,
    isLocked: false,
    color: '#2563eb',
    description: 'Can manage members, tasks, announcements and meetings, but cannot transfer ownership.',
    permissions: ALL_PERMISSION_KEYS.filter((k) => k !== 'committee.transfer_ownership'),
  },
  {
    id: 'role_coordinator',
    name: 'Coordinator',
    isSystem: true,
    isLocked: false,
    color: '#059669',
    description: 'Can coordinate tasks, run meetings, and post announcements.',
    permissions: [
      'members.view',
      'tasks.view',
      'tasks.create',
      'tasks.edit',
      'announcements.view',
      'announcements.create',
      'meetings.view',
      'meetings.create',
      'meetings.mark_attendance',
      'meetings.action_items',
    ],
  },
  {
    id: 'role_member',
    name: 'Member',
    isSystem: true,
    isLocked: false,
    color: '#5e6355',
    description: 'Standard active member with read access and ability to manage assigned tasks.',
    permissions: [
      'members.view',
      'tasks.view',
      'tasks.create',
      'tasks.edit',
      'announcements.view',
      'meetings.view',
    ],
  },
]

// ── LOCAL PERSISTENCE STORAGE HELPER ──
function getStoreKey(slug) {
  return `artiverse_workspace_v2_${String(slug).toLowerCase()}`
}

export function loadWorkspaceStore(slug, currentUser) {
  const key = getStoreKey(slug)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading workspace store:', err)
  }

  // Initial state with current user as owner and zero fake/hardcoded items
  const ownerName =
    currentUser?.fullName ||
    [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') ||
    currentUser?.name ||
    'You'
  const ownerEmail = currentUser?.email || 'lead@msit.edu'
  const initials = ownerName.slice(0, 2).toUpperCase()

  const initialStore = {
    slug,
    name: slug.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    logo: '🏛️',
    description: 'Official committee workspace on Artiverse.',
    ownerId: currentUser?.id || 'user_owner',
    members: [
      {
        id: currentUser?.id ? `mem_${currentUser.id}` : 'mem_owner',
        userId: currentUser?.id || 'user_owner',
        name: ownerName,
        email: ownerEmail,
        title: 'Founder & President',
        roleId: 'role_owner',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        initials,
        avatar: currentUser?.avatar || null,
      },
    ],
    roles: DEFAULT_SYSTEM_ROLES,
    tasks: [],
    announcements: [],
    meetings: [],
    invites: [],
    joinRequests: [],
    auditLogs: [
      {
        id: `audit_${Date.now()}`,
        action: 'Workspace Initialized',
        actor: ownerName,
        target: slug,
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    localStorage.setItem(key, JSON.stringify(initialStore))
  } catch {}

  return initialStore
}

export function saveWorkspaceStore(slug, store) {
  const key = getStoreKey(slug)
  try {
    localStorage.setItem(key, JSON.stringify(store))
  } catch (err) {
    console.error('Error saving workspace store:', err)
  }
}

// ── PERMISSION CHECK HELPER ──
export function checkUserPermission(workspace, currentUserId, permissionKey) {
  if (!workspace || !currentUserId) return false
  const member = workspace.members.find(
    (m) => m.userId === currentUserId || m.id === currentUserId || m.email === currentUserId
  )
  if (!member) {
    // If user is designated workspace owner
    if (workspace.ownerId === currentUserId) return true
    return false
  }

  const role = workspace.roles.find((r) => r.id === member.roleId)
  if (!role) return false
  if (role.id === 'role_owner') return true
  return role.permissions.includes(permissionKey)
}

// ── TANSTACK QUERY HOOKS ──

/** Fetch entire workspace with server join-requests sync */
export function useWorkspace(slug, currentUser) {
  return useQuery({
    queryKey: ['workspace', slug],
    queryFn: async () => {
      const store = loadWorkspaceStore(slug, currentUser)

      // Sync live join requests from backend API if available
      try {
        const liveRequests = await getJoinRequests()
        const reqList = Array.isArray(liveRequests)
          ? liveRequests
          : liveRequests?.request
          ? (Array.isArray(liveRequests.request) ? liveRequests.request : [liveRequests.request])
          : []

        const matching = reqList
          .filter((item) => !slug || item.committee_username === slug || item.committee_username === store.name)
          .map((item) => ({
            id: item.id || `req_${Date.now()}`,
            name: `${item.member?.first_name || 'Applicant'} ${item.member?.last_name || ''}`.trim(),
            email: item.member?.email || 'student@msit.edu',
            phone: item.member?.phone_number || '',
            domain: item.committee_username || 'General',
            status: item.status || 'pending',
            date: item.requested_at ? new Date(item.requested_at).toISOString().split('T')[0] : 'Today',
          }))

        if (matching.length > 0) {
          store.joinRequests = matching
          saveWorkspaceStore(slug, store)
        }
      } catch {
        // Backend join requests unavailable; retain stored requests
      }

      return store
    },
  })
}

/** Mutate workspace store helper */
function useWorkspaceMutation(slug, mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args) => {
      const current = queryClient.getQueryData(['workspace', slug]) || loadWorkspaceStore(slug)
      const updated = await mutationFn(current, args)
      saveWorkspaceStore(slug, updated)
      return updated
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['workspace', slug], updated)
    },
  })
}

// ── TASK MUTATIONS ──
export function useCreateTask(slug) {
  return useWorkspaceMutation(slug, (store, newTask) => {
    const task = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status || 'todo', // 'todo' | 'in_progress' | 'review' | 'done'
      priority: newTask.priority || 'medium', // 'low' | 'medium' | 'high' | 'urgent'
      assignees: newTask.assignees || [], // Array of member IDs
      dueDate: newTask.dueDate || '',
      checklist: newTask.checklist || [], // [{ id, text, completed }]
      comments: [],
      sourceMeetingId: newTask.sourceMeetingId || null,
      sourceActionItemText: newTask.sourceActionItemText || null,
      createdAt: new Date().toISOString(),
    }

    return {
      ...store,
      tasks: [task, ...store.tasks],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Created task "${task.title}"`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useUpdateTask(slug) {
  return useWorkspaceMutation(slug, (store, { taskId, updates }) => {
    return {
      ...store,
      tasks: store.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }
  })
}

export function useDeleteTask(slug) {
  return useWorkspaceMutation(slug, (store, taskId) => {
    const task = store.tasks.find((t) => t.id === taskId)
    return {
      ...store,
      tasks: store.tasks.filter((t) => t.id !== taskId),
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Deleted task "${task?.title || taskId}"`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

// ── ANNOUNCEMENT MUTATIONS ──
export function useCreateAnnouncement(slug) {
  return useWorkspaceMutation(slug, (store, payload) => {
    const item = {
      id: `ann_${Date.now()}`,
      title: payload.title,
      body: payload.content || payload.body || '',
      content: payload.content || payload.body || '',
      pinned: Boolean(payload.pinned || payload.isPinned),
      isPinned: Boolean(payload.isPinned),
      audience: payload.audience || 'everyone', // 'everyone' | roleId
      authorName: payload.authorName || payload.author?.name || 'Lead',
      author: payload.author || { name: payload.authorName || 'Lead', role: 'Owner' },
      createdAt: new Date().toISOString(),
      poll: payload.poll || null, // { question: '', options: [{ id, text, votes: [] }] }
      reactions: {}, // { '👍': ['userId1'], '❤️': [] }
      seenBy: [payload.author?.userId || 'user_owner'],
      comments: [],
    }

    return {
      ...store,
      announcements: [item, ...store.announcements],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Posted announcement "${item.title}"`,
          actor: payload.author?.name || 'Lead',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useToggleReaction(slug) {
  return useWorkspaceMutation(slug, (store, { announcementId, reaction, userId }) => {
    return {
      ...store,
      announcements: store.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann
        const currentList = ann.reactions[reaction] || []
        const hasReacted = currentList.includes(userId)
        const updatedList = hasReacted
          ? currentList.filter((u) => u !== userId)
          : [...currentList, userId]

        return {
          ...ann,
          reactions: {
            ...ann.reactions,
            [reaction]: updatedList,
          },
        }
      }),
    }
  })
}

export function useVotePoll(slug) {
  return useWorkspaceMutation(slug, (store, { announcementId, optionId, userId }) => {
    return {
      ...store,
      announcements: store.announcements.map((ann) => {
        if (ann.id !== announcementId || !ann.poll) return ann
        const updatedOptions = ann.poll.options.map((opt) => {
          const filtered = opt.votes.filter((u) => u !== userId)
          if (opt.id === optionId) {
            return { ...opt, votes: [...filtered, userId] }
          }
          return { ...opt, votes: filtered }
        })

        return {
          ...ann,
          poll: { ...ann.poll, options: updatedOptions },
        }
      }),
    }
  })
}

// ── MEETING MUTATIONS ──
export function useCreateMeeting(slug) {
  return useWorkspaceMutation(slug, (store, payload) => {
    const meeting = {
      id: `mtg_${Date.now()}`,
      title: payload.title,
      date: payload.date,
      time: payload.time,
      venue: payload.venue || 'Council Room / Google Meet',
      isOnline: Boolean(payload.isOnline),
      meetingLink: payload.meetingLink || '',
      agenda: payload.agenda || '',
      status: 'upcoming', // 'upcoming' | 'past'
      rsvps: {}, // { [userId]: 'attending' | 'declined' | 'tentative' }
      attendance: {}, // { [userId]: true | false }
      minutes: payload.minutes || '',
      minutesState: 'Draft', // 'Draft' | 'Published'
      actionItems: payload.actionItems || [], // [{ id, text, assigneeId, dueDate, convertedToTaskId }]
      createdAt: new Date().toISOString(),
    }

    return {
      ...store,
      meetings: [meeting, ...store.meetings],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Scheduled meeting "${meeting.title}" for ${meeting.date}`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useUpdateMeeting(slug) {
  return useWorkspaceMutation(slug, (store, { meetingId, updates }) => {
    return {
      ...store,
      meetings: store.meetings.map((m) => (m.id === meetingId ? { ...m, ...updates } : m)),
    }
  })
}

export function useConvertActionItemToTask(slug) {
  return useWorkspaceMutation(slug, (store, { meetingId, actionItemId, title, assignee, dueDate }) => {
    const meeting = store.meetings.find((m) => m.id === meetingId)
    if (!meeting) return store
    const item = (meeting.actionItems || []).find((a) => a.id === actionItemId)
    if (!item) return store

    const newTask = {
      id: `task_${Date.now()}`,
      title: title || item.text,
      description: `Action item generated from meeting: ${meeting.title} (${meeting.date})`,
      status: 'todo',
      priority: 'medium',
      assignees: assignee ? [assignee] : (item.assigneeId ? [item.assigneeId] : []),
      dueDate: dueDate || item.dueDate || meeting.date,
      checklist: [],
      comments: [],
      sourceMeetingId: meeting.id,
      sourceActionItemText: item.text,
      createdAt: new Date().toISOString(),
    }

    const updatedMeetings = store.meetings.map((m) => {
      if (m.id !== meetingId) return m
      return {
        ...m,
        actionItems: (m.actionItems || []).map((a) =>
          a.id === actionItemId ? { ...a, convertedToTaskId: newTask.id } : a
        ),
      }
    })

    return {
      ...store,
      tasks: [newTask, ...store.tasks],
      meetings: updatedMeetings,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Converted action item "${item.text}" into Kanban task`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

// ── MEMBER & ROLE MUTATIONS ──
export function useUpdateMember(slug) {
  return useWorkspaceMutation(slug, (store, { memberId, updates }) => {
    return {
      ...store,
      members: store.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Updated member record (${memberId})`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useRemoveMember(slug) {
  return useWorkspaceMutation(slug, (store, memberId) => {
    const mem = store.members.find((m) => m.id === memberId)
    return {
      ...store,
      members: store.members.filter((m) => m.id !== memberId),
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Removed member "${mem?.name || memberId}"`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useSaveRoles(slug) {
  return useWorkspaceMutation(slug, (store, updatedRoles) => {
    return {
      ...store,
      roles: updatedRoles,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: 'Updated role permissions matrix',
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useTransferOwnership(slug) {
  return useWorkspaceMutation(slug, (store, { newOwnerId }) => {
    const newOwner = store.members.find((m) => m.id === newOwnerId || m.userId === newOwnerId)
    if (!newOwner) return store

    const updatedMembers = store.members.map((m) => {
      if (m.id === newOwner.id) {
        return { ...m, roleId: 'role_owner', title: 'President & Owner' }
      }
      if (m.roleId === 'role_owner') {
        return { ...m, roleId: 'role_admin', title: 'Former Owner / Advisor' }
      }
      return m
    })

    return {
      ...store,
      ownerId: newOwner.userId || newOwner.id,
      members: updatedMembers,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `TRANSFERRED PRIMARY OWNERSHIP to ${newOwner.name}`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

// ── INVITES & JOIN REQUESTS ──
export function useCreateInviteLink(slug) {
  return useWorkspaceMutation(slug, (store, payload) => {
    // SECURITY RULE: Invite links can NEVER grant Admin or Owner
    const safeRoleId =
      payload.roleId === 'role_owner' || payload.roleId === 'role_admin'
        ? 'role_member'
        : payload.roleId || 'role_member'

    const invite = {
      id: `inv_${Date.now()}`,
      token: `join_${Math.random().toString(36).substring(2, 10)}`,
      roleId: safeRoleId,
      maxUses: payload.maxUses ? Number(payload.maxUses) : null,
      usedCount: 0,
      expiresAt: payload.expiresAt || null,
      requireApproval: Boolean(payload.requireApproval),
      isRevoked: false,
      createdAt: new Date().toISOString(),
    }

    return {
      ...store,
      invites: [invite, ...store.invites],
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `Generated invite link (${invite.token}) with role ${safeRoleId}`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}

export function useRevokeInvite(slug) {
  return useWorkspaceMutation(slug, (store, inviteId) => {
    return {
      ...store,
      invites: store.invites.map((inv) =>
        inv.id === inviteId ? { ...inv, isRevoked: true } : inv
      ),
    }
  })
}

export function useReviewRequest(slug) {
  return useWorkspaceMutation(slug, async (store, { requestId, action }) => {
    try {
      await reviewJoinRequest({ requestId, action })
    } catch {}

    const req = store.joinRequests.find((r) => r.id === requestId)
    const remainingRequests = store.joinRequests.filter((r) => r.id !== requestId)

    let updatedMembers = store.members
    if (action === 'approve' && req) {
      const newMember = {
        id: `mem_${Date.now()}`,
        userId: `user_${Date.now()}`,
        name: req.name,
        email: req.email,
        title: `${req.domain} Member`,
        roleId: 'role_member',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        initials: req.name.slice(0, 2).toUpperCase(),
        avatar: null,
      }
      updatedMembers = [newMember, ...updatedMembers]
    }

    return {
      ...store,
      joinRequests: remainingRequests,
      members: updatedMembers,
      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: `${action.toUpperCase()} join application from ${req?.name || requestId}`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
        ...store.auditLogs,
      ],
    }
  })
}
