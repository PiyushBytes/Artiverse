import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  ExternalLink,
  Megaphone,
  UserPlus,
  Users,
} from 'lucide-react'

export default function WorkspaceOverview({
  workspace,
  currentUser,
  onNavigateModule,
  onOpenCreateTask,
  onOpenCreateMeeting,
}) {
  const currentUserId = currentUser?.id || 'user_owner'

  // 1. Pending Join Requests
  const pendingRequests = workspace?.joinRequests || []

  // 2. Tasks assigned to current user
  const myTasks = (workspace?.tasks || []).filter(
    (t) =>
      t.status !== 'done' &&
      (t.assignees?.includes(currentUserId) ||
        t.assignees?.length === 0 ||
        t.assignees?.some(
          (a) => a === currentUser?.name || a === currentUser?.fullName
        ))
  )

  const todayStr = new Date().toISOString().split('T')[0]
  const overdueTasks = myTasks.filter((t) => t.dueDate && t.dueDate < todayStr)

  // 3. Announcements
  const recentAnnouncements = (workspace?.announcements || []).slice(0, 3)

  // 4. Next upcoming meeting
  const upcomingMeetings = (workspace?.meetings || []).filter(
    (m) => m.status === 'upcoming'
  )
  const nextMeeting = upcomingMeetings[0] || null

  // Check if anything needs attention
  const hasAttentionItems =
    pendingRequests.length > 0 ||
    overdueTasks.length > 0 ||
    nextMeeting !== null ||
    recentAnnouncements.length > 0

  return (
    <div className="space-y-6">
      {/* ── Section Title ── */}
      <div>
        <h2 className="text-base font-semibold text-[#0d0f08]">
          Needs your attention
        </h2>
        <p className="mt-0.5 text-xs text-[#5e6355]">
          Important alerts, pending applications, and upcoming deadlines for your council.
        </p>
      </div>

      {/* ── "All caught up" calm message when empty ── */}
      {!hasAttentionItems ? (
        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-8 text-center shadow-xs">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-[#f6f7f0] text-[#5e6355]">
            <Check size={18} strokeWidth={2.5} />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[#0d0f08]">
            All caught up
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-[#5e6355]">
            There are no pending join applications, overdue tasks, or urgent meeting alerts right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Pending Join Requests Card (Hidden if 0) */}
          {pendingRequests.length > 0 && (
            <div className="flex flex-col justify-between rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0d0f08]">
                    <span className="size-2 rounded-full bg-[#d4ff1f]" />
                    <span>Join Applications</span>
                  </span>
                  <span className="rounded-full bg-[#d4ff1f] px-2 py-0.2 font-mono text-[10px] font-bold text-[#0d0f08]">
                    {pendingRequests.length}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#5e6355]">
                  {pendingRequests.length} student{pendingRequests.length > 1 ? 's' : ''} applied to join the committee. Review their profiles to grant membership.
                </p>

                <div className="mt-3 space-y-1.5">
                  {pendingRequests.slice(0, 2).map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-[8px] bg-[#fafaf5] px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-medium text-[#0d0f08] truncate">
                        {req.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#8b907f]">
                        {req.domain}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateModule?.('members')}
                className="mt-4 flex items-center justify-between border-t border-[#e4e6da] pt-3 text-xs font-semibold text-[#0d0f08] hover:text-[#5e6355]"
              >
                <span>Review applications</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* 2. Overdue / Due Tasks Card (Hidden if 0) */}
          {overdueTasks.length > 0 && (
            <div className="flex flex-col justify-between rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <AlertCircle size={14} />
                    <span>Overdue Tasks</span>
                  </span>
                  <span className="rounded-full bg-rose-50 px-2 py-0.2 font-mono text-[10px] font-bold text-rose-700">
                    {overdueTasks.length}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#5e6355]">
                  You have tasks that require completion. Check the board to update status or reassign.
                </p>

                <div className="mt-3 space-y-1.5">
                  {overdueTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-[8px] bg-[#fafaf5] px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-medium text-[#0d0f08] truncate">
                        {task.title}
                      </span>
                      <span className="font-mono text-[10px] text-rose-600">
                        {task.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateModule?.('tasks')}
                className="mt-4 flex items-center justify-between border-t border-[#e4e6da] pt-3 text-xs font-semibold text-[#0d0f08] hover:text-[#5e6355]"
              >
                <span>View Kanban board</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* 3. Next Meeting Card (Hidden if none) */}
          {nextMeeting && (
            <div className="flex flex-col justify-between rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0d0f08]">
                    <Calendar size={14} className="text-[#5e6355]" />
                    <span>Next Meeting</span>
                  </span>
                  <span className="rounded-full bg-[#f6f7f0] px-2 py-0.2 font-mono text-[10px] font-bold text-[#5e6355]">
                    {nextMeeting.date}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-[#0d0f08]">
                  {nextMeeting.title}
                </h4>

                <div className="mt-2 flex items-center gap-3 text-xs text-[#5e6355]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{nextMeeting.time || 'TBD'}</span>
                  </span>
                  <span>{nextMeeting.venue}</span>
                </div>

                {nextMeeting.agenda && (
                  <p className="mt-2 line-clamp-2 text-xs text-[#8b907f]">
                    Agenda: {nextMeeting.agenda}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigateModule?.('meetings')}
                className="mt-4 flex items-center justify-between border-t border-[#e4e6da] pt-3 text-xs font-semibold text-[#0d0f08] hover:text-[#5e6355]"
              >
                <span>Open meeting agenda</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* 4. Latest Announcement Card (Hidden if none) */}
          {recentAnnouncements.length > 0 && (
            <div className="flex flex-col justify-between rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0d0f08]">
                    <Megaphone size={14} className="text-[#5e6355]" />
                    <span>Latest Announcement</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#8b907f]">
                    {recentAnnouncements[0].audience === 'everyone' ? 'All Roles' : 'Restricted'}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-[#0d0f08]">
                  {recentAnnouncements[0].title}
                </h4>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5e6355]">
                  {recentAnnouncements[0].body}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateModule?.('announcements')}
                className="mt-4 flex items-center justify-between border-t border-[#e4e6da] pt-3 text-xs font-semibold text-[#0d0f08] hover:text-[#5e6355]"
              >
                <span>Read announcements</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Summary Counts Row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-2">
        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-4">
          <span className="block text-[11px] font-medium text-[#5e6355]">Active Members</span>
          <span className="mt-1 block font-mono text-2xl font-bold text-[#0d0f08]">
            {(workspace?.members || []).length}
          </span>
        </div>

        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-4">
          <span className="block text-[11px] font-medium text-[#5e6355]">Tasks in Flight</span>
          <span className="mt-1 block font-mono text-2xl font-bold text-[#0d0f08]">
            {(workspace?.tasks || []).filter((t) => t.status !== 'done').length}
          </span>
        </div>

        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-4">
          <span className="block text-[11px] font-medium text-[#5e6355]">Upcoming Meetings</span>
          <span className="mt-1 block font-mono text-2xl font-bold text-[#0d0f08]">
            {upcomingMeetings.length}
          </span>
        </div>

        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-4">
          <span className="block text-[11px] font-medium text-[#5e6355]">Broadcasts</span>
          <span className="mt-1 block font-mono text-2xl font-bold text-[#0d0f08]">
            {(workspace?.announcements || []).length}
          </span>
        </div>
      </div>
    </div>
  )
}

