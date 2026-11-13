import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Command,
  LayoutDashboard,
  Megaphone,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { getCommitteeBySlug } from '../config/committeeData'
import {
  useWorkspace,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCreateAnnouncement,
  useToggleReaction,
  useVotePoll,
  useCreateMeeting,
  useUpdateMeeting,
  useConvertActionItemToTask,
  useUpdateMember,
  useRemoveMember,
  useSaveRoles,
  useTransferOwnership,
  useCreateInviteLink,
  useRevokeInvite,
  useReviewRequest,
} from '../components/workspace/api/workspaceApi'

import WorkspaceSidebar from '../components/workspace/shell/WorkspaceSidebar'
import WorkspaceTopBar from '../components/workspace/shell/WorkspaceTopBar'
import CommandSearchModal from '../components/workspace/shell/CommandSearchModal'

import WorkspaceOverview from '../components/workspace/overview/WorkspaceOverview'
import MembersModule from '../components/workspace/members/MembersModule'
import TasksModule from '../components/workspace/tasks/TasksModule'
import AnnouncementsModule from '../components/workspace/announcements/AnnouncementsModule'
import MeetingsModule from '../components/workspace/meetings/MeetingsModule'
import WorkspaceSettings from '../components/workspace/settings/WorkspaceSettings'

import CreateTaskModal from '../components/workspace/tasks/CreateTaskModal'
import CreateAnnouncementModal from '../components/workspace/announcements/CreateAnnouncementModal'
import CreateMeetingModal from '../components/workspace/meetings/CreateMeetingModal'
import InviteDrawer from '../components/workspace/members/InviteDrawer'

export default function CommitteeManagePage({
  slug = 'artikon',
  currentUser,
  onNavigate,
  onToast,
}) {
  const committeeData = useMemo(() => getCommitteeBySlug(slug), [slug])
  const [committee, setCommittee] = useState(committeeData)

  const [activeModule, setActiveModule] = useState('overview')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Quick action modals
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false)
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // TanStack Query workspace store hook
  const { data: workspace, isLoading } = useWorkspace(slug, currentUser)

  // Typed mutations
  const createTaskMutation = useCreateTask(slug)
  const updateTaskMutation = useUpdateTask(slug)
  const deleteTaskMutation = useDeleteTask(slug)

  const createAnnouncementMutation = useCreateAnnouncement(slug)
  const toggleReactionMutation = useToggleReaction(slug)
  const votePollMutation = useVotePoll(slug)

  const createMeetingMutation = useCreateMeeting(slug)
  const updateMeetingMutation = useUpdateMeeting(slug)
  const convertActionItemMutation = useConvertActionItemToTask(slug)

  const updateMemberMutation = useUpdateMember(slug)
  const removeMemberMutation = useRemoveMember(slug)
  const saveRolesMutation = useSaveRoles(slug)
  const transferOwnershipMutation = useTransferOwnership(slug)

  const createInviteMutation = useCreateInviteLink(slug)
  const revokeInviteMutation = useRevokeInvite(slug)
  const reviewRequestMutation = useReviewRequest(slug)

  // Current user identification & permissions
  const currentUserId = currentUser?.id || 'user_owner'
  const isOwner = workspace?.ownerId === currentUserId || !workspace?.ownerId

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Skeletons during initial load
  if (isLoading || !workspace) {
    return (
      <div className="flex min-h-screen bg-[#fafaf5]">
        <div className="hidden w-[248px] space-y-4 border-r border-[#e4e6da] bg-[#fafaf5] p-4 lg:block">
          <div className="h-8 w-3/4 rounded-[8px] bg-[#f6f7f0] animate-pulse" />
          <div className="h-4 w-1/2 rounded-[6px] bg-[#f6f7f0] animate-pulse" />
          <div className="space-y-2 pt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-full rounded-[10px] bg-[#f6f7f0] animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="h-10 w-full rounded-[10px] bg-[#ffffff] border border-[#e4e6da] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-[14px] bg-[#ffffff] border border-[#e4e6da] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#fafaf5] text-[#0d0f08] font-sans antialiased selection:bg-[#d4ff1f] selection:text-[#0d0f08]">
      {/* 236px Sidebar Shell */}
      <WorkspaceSidebar
        workspace={workspace}
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod)
          setIsMobileSidebarOpen(false)
        }}
        onNavigate={onNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Sticky Top Bar */}
        <WorkspaceTopBar
          workspace={workspace}
          activeModule={activeModule}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
          onOpenCreateMeeting={() => setIsCreateMeetingOpen(true)}
          onOpenInviteMember={() => setIsInviteOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Workspace Body Area with staggered motion */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeModule === 'overview' && (
                <WorkspaceOverview
                  workspace={workspace}
                  currentUser={currentUser}
                  onNavigateModule={(mod) => setActiveModule(mod)}
                  onOpenCreateTask={() => setIsCreateTaskOpen(true)}
                  onOpenCreateMeeting={() => setIsCreateMeetingOpen(true)}
                />
              )}

              {activeModule === 'members' && (
                <MembersModule
                  workspace={workspace}
                  currentUserId={currentUserId}
                  onUpdateMember={(memberId, updates) =>
                    updateMemberMutation.mutate({ memberId, updates })
                  }
                  onRemoveMember={(memberId) =>
                    removeMemberMutation.mutate(memberId)
                  }
                  onSaveRoles={(roles) => saveRolesMutation.mutate(roles)}
                  onTransferOwnership={(targetId) =>
                    transferOwnershipMutation.mutate({ newOwnerId: targetId })
                  }
                  onCreateInvite={(payload) =>
                    createInviteMutation.mutate(payload)
                  }
                  onRevokeInvite={(inviteId) =>
                    revokeInviteMutation.mutate(inviteId)
                  }
                  onReviewRequest={({ requestId, action }) =>
                    reviewRequestMutation.mutate({ requestId, action })
                  }
                  onToast={onToast}
                  canManageMembers={true}
                  canManageRoles={isOwner}
                />
              )}

              {activeModule === 'tasks' && (
                <TasksModule
                  workspace={workspace}
                  onCreateTask={(newTask) => {
                    createTaskMutation.mutate(newTask)
                    onToast?.(`Task "${newTask.title}" created.`)
                  }}
                  onUpdateTask={(taskId, updates) =>
                    updateTaskMutation.mutate({ taskId, updates })
                  }
                  onDeleteTask={(taskId) => {
                    deleteTaskMutation.mutate(taskId)
                    onToast?.('Task deleted.')
                  }}
                  onNavigateMeeting={(meetingId) => {
                    setActiveModule('meetings')
                  }}
                  canManageTasks={true}
                />
              )}

              {activeModule === 'announcements' && (
                <AnnouncementsModule
                  workspace={workspace}
                  currentUserId={currentUserId}
                  onCreateAnnouncement={(payload) => {
                    createAnnouncementMutation.mutate(payload)
                    onToast?.('Announcement published to members.')
                  }}
                  onToggleReaction={(announcementId, reaction) =>
                    toggleReactionMutation.mutate({
                      announcementId,
                      reaction,
                      userId: currentUserId,
                    })
                  }
                  onVotePoll={(announcementId, optionId) =>
                    votePollMutation.mutate({
                      announcementId,
                      optionId,
                      userId: currentUserId,
                    })
                  }
                  onAddComment={(announcementId, comment) => {
                    const ann = workspace.announcements.find((a) => a.id === announcementId)
                    if (ann) {
                      createAnnouncementMutation.mutate({
                        ...ann,
                        comments: [...(ann.comments || []), comment],
                      })
                    }
                  }}
                  canPostAnnouncements={true}
                />
              )}

              {activeModule === 'meetings' && (
                <MeetingsModule
                  workspace={workspace}
                  currentUserId={currentUserId}
                  onCreateMeeting={(payload) => {
                    createMeetingMutation.mutate(payload)
                    onToast?.(`Meeting "${payload.title}" scheduled.`)
                  }}
                  onUpdateMeeting={(meetingId, updates) =>
                    updateMeetingMutation.mutate({ meetingId, updates })
                  }
                  onConvertActionItemToTask={(payload) => {
                    convertActionItemMutation.mutate(payload)
                    onToast?.('Action item successfully converted into a Kanban task!')
                  }}
                  canManageMeetings={true}
                />
              )}

              {activeModule === 'settings' && (
                <WorkspaceSettings
                  committee={committee}
                  workspace={workspace}
                  currentUserId={currentUserId}
                  onUpdateCommittee={(updated) => setCommittee(updated)}
                  onTransferOwnership={(targetId) =>
                    transferOwnershipMutation.mutate({ newOwnerId: targetId })
                  }
                  onToast={onToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        workspace={workspace}
        onSelectAction={(action, payload) => {
          if (action === 'toggleSearch') setIsSearchOpen(true)
          if (action === 'navigate') {
            setActiveModule(payload)
            setIsSearchOpen(false)
          }
          if (action === 'openTask') {
            setActiveModule('tasks')
            setIsSearchOpen(false)
          }
          if (action === 'openMeeting') {
            setActiveModule('meetings')
            setIsSearchOpen(false)
          }
        }}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        workspace={workspace}
        onCreateTask={(task) => {
          createTaskMutation.mutate(task)
          onToast?.(`Task "${task.title}" created.`)
        }}
      />

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        roles={workspace.roles}
        onCreateAnnouncement={(ann) => {
          createAnnouncementMutation.mutate(ann)
          onToast?.('Announcement published.')
        }}
      />

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateMeetingOpen}
        onClose={() => setIsCreateMeetingOpen(false)}
        onCreateMeeting={(mtg) => {
          createMeetingMutation.mutate(mtg)
          onToast?.(`Meeting "${mtg.title}" scheduled.`)
        }}
      />

      {/* Invite Member Drawer */}
      <InviteDrawer
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspace={workspace}
        roles={workspace.roles}
        onCreateInvite={(payload) => createInviteMutation.mutate(payload)}
        onRevokeInvite={(invId) => revokeInviteMutation.mutate(invId)}
        onReviewRequest={({ requestId, action }) =>
          reviewRequestMutation.mutate({ requestId, action })
        }
        onToast={onToast}
      />
    </div>
  )
}
