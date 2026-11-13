import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Filter,
  Kanban,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Video,
} from 'lucide-react'
import TaskDrawer from './TaskDrawer'
import CreateTaskModal from './CreateTaskModal'

const COLUMNS = [
  { id: 'todo', label: 'To Do', countColor: 'bg-[#fafaf5] text-[#5e6355]' },
  { id: 'in_progress', label: 'In Progress', countColor: 'bg-blue-50 text-blue-700' },
  { id: 'review', label: 'Review', countColor: 'bg-amber-50 text-amber-700' },
  { id: 'done', label: 'Done', countColor: 'bg-[#d4ff1f]/30 text-[#0d0f08]' },
]

const PRIORITY_BADGES = {
  high: 'border-rose-200 bg-rose-50 text-rose-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-blue-200 bg-blue-50 text-blue-800',
}

export default function TasksModule({
  workspace,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onNavigateMeeting,
  canManageTasks = true,
}) {
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list'
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialStatus, setCreateInitialStatus] = useState('todo')

  const tasks = workspace?.tasks || []
  const members = workspace?.members || []

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesPriority =
      priorityFilter === 'All' || t.priority === priorityFilter.toLowerCase()
    const matchesAssignee =
      assigneeFilter === 'All' || (t.assignees || []).includes(assigneeFilter)
    return matchesSearch && matchesPriority && matchesAssignee
  })

  // Group by status column
  const tasksByColumn = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    review: filteredTasks.filter((t) => t.status === 'review'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  }

  const handleOpenCreate = (colId = 'todo') => {
    setCreateInitialStatus(colId)
    setIsCreateOpen(true)
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onUpdateTask?.(taskId, { status: targetStatus })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and View Switcher Strip */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b907f]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-[10px] border border-[#e4e6da] bg-[#ffffff] pl-9 pr-3 py-1.5 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-[10px] border border-[#e4e6da] bg-[#ffffff] px-2.5 py-1.5 text-xs text-[#5e6355] focus:border-[#0d0f08] focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-[10px] border border-[#e4e6da] bg-[#ffffff] px-2.5 py-1.5 text-xs text-[#5e6355] focus:border-[#0d0f08] focus:outline-none"
          >
            <option value="All">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle & Create button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-1">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-[8px] transition ${
                viewMode === 'kanban'
                  ? 'bg-[#0d0f08] text-white shadow-sm'
                  : 'text-[#5e6355] hover:text-[#0d0f08]'
              }`}
              title="Kanban Board"
            >
              <Kanban size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-[8px] transition ${
                viewMode === 'list'
                  ? 'bg-[#0d0f08] text-white shadow-sm'
                  : 'text-[#5e6355] hover:text-[#0d0f08]'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          {canManageTasks && (
            <button
              type="button"
              onClick={() => handleOpenCreate('todo')}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0d0f08] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#202419] transition"
            >
              <Plus size={15} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colTasks = tasksByColumn[col.id] || []
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex flex-col rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e4e6da]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0d0f08]">
                      {col.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${col.countColor}`}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  {canManageTasks && (
                    <button
                      type="button"
                      onClick={() => handleOpenCreate(col.id)}
                      className="rounded-[6px] p-1 text-[#8b907f] hover:bg-[#fafaf5] hover:text-[#0d0f08]"
                    >
                      <Plus size={15} />
                    </button>
                  )}
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-2.5">
                  {colTasks.map((task) => {
                    const checklist = task.checklist || []
                    const completed = checklist.filter((c) => c.done).length

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className="group cursor-pointer rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-3 transition hover:border-[#0d0f08] hover:shadow-sm"
                      >
                        {/* Tags */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              PRIORITY_BADGES[task.priority] ||
                              PRIORITY_BADGES.medium
                            }`}
                          >
                            {task.priority}
                          </span>

                          {task.meetingId && (
                            <span
                              title="Meeting Action Item"
                              className="text-[#8b907f] hover:text-[#0d0f08]"
                            >
                              <Video size={13} />
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-[#0d0f08] line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Checklist progress preview */}
                        {checklist.length > 0 && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#5e6355]">
                            <CheckSquare size={13} />
                            <span>
                              {completed}/{checklist.length}
                            </span>
                          </div>
                        )}

                        {/* Footer (Due date & assignees) */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#f6f7f0] text-[11px] text-[#8b907f]">
                          {task.dueDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            </div>
                          ) : (
                            <span />
                          )}

                          {task.assignees?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users size={12} />
                              <span className="font-semibold text-[#5e6355]">
                                {task.assignees[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {colTasks.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-[10px] border border-dashed border-[#e4e6da] p-4 text-center">
                      <p className="text-xs text-[#8b907f]">No tasks in {col.label}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e4e6da] bg-[#fafaf5] text-[11px] font-semibold text-[#5e6355]">
              <tr>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Checklist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6da]">
              {filteredTasks.map((task) => {
                const checklist = task.checklist || []
                const completed = checklist.filter((c) => c.done).length

                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="cursor-pointer hover:bg-[#fafaf5] transition"
                  >
                    <td className="py-3 px-4 font-semibold text-[#0d0f08]">
                      {task.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-[#5e6355]">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5e6355]">
                      {task.assignees?.join(', ') || '—'}
                    </td>
                    <td className="py-3 px-4 text-[#8b907f]">
                      {task.dueDate || '—'}
                    </td>
                    <td className="py-3 px-4 text-[#5e6355]">
                      {checklist.length > 0 ? `${completed}/${checklist.length}` : '—'}
                    </td>
                  </tr>
                )
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8b907f]">
                    No tasks found. Click &quot;Create Task&quot; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail Slide-Over */}
      <TaskDrawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        workspace={workspace}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onNavigateMeeting={onNavigateMeeting}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspace={workspace}
        onCreateTask={onCreateTask}
        initialStatus={createInitialStatus}
      />
    </div>
  )
}

