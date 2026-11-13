import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  User,
  Users,
  X,
  AlertCircle,
  Video,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const PRIORITY_BADGES = {
  high: 'border-rose-200 bg-rose-50 text-rose-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-blue-200 bg-blue-50 text-blue-800',
}

const STATUS_COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

export default function TaskDrawer({
  isOpen,
  onClose,
  task,
  workspace,
  onUpdateTask,
  onDeleteTask,
  onNavigateMeeting,
}) {
  const [newChecklistText, setNewChecklistText] = useState('')
  const [newCommentText, setNewCommentText] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [descDraft, setDescDraft] = useState('')

  if (!isOpen || !task) return null

  const members = workspace?.members || []
  const meetings = workspace?.meetings || []
  const sourceMeeting = task.meetingId
    ? meetings.find((m) => m.id === task.meetingId)
    : null

  const checklist = task.checklist || []
  const completedChecks = checklist.filter((c) => c.done).length

  const handleToggleCheck = (itemId) => {
    const updated = checklist.map((c) =>
      c.id === itemId ? { ...c, done: !c.done } : c
    )
    onUpdateTask?.(task.id, { checklist: updated })
  }

  const handleAddChecklist = (e) => {
    e.preventDefault()
    if (!newChecklistText.trim()) return
    const newItem = {
      id: `check_${Date.now()}`,
      text: newChecklistText.trim(),
      done: false,
    }
    onUpdateTask?.(task.id, { checklist: [...checklist, newItem] })
    setNewChecklistText('')
  }

  const handleDeleteChecklist = (itemId) => {
    const updated = checklist.filter((c) => c.id !== itemId)
    onUpdateTask?.(task.id, { checklist: updated })
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newCommentText.trim()) return
    const newComment = {
      id: `comm_${Date.now()}`,
      authorName: 'Current User',
      authorAvatar: null,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    }
    const currentComments = task.comments || []
    onUpdateTask?.(task.id, { comments: [...currentComments, newComment] })
    setNewCommentText('')
  }

  const handleStatusChange = (newStatus) => {
    onUpdateTask?.(task.id, { status: newStatus })
  }

  const handlePriorityChange = (newPriority) => {
    onUpdateTask?.(task.id, { priority: newPriority })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/30 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="flex w-screen max-w-xl flex-col border-l border-[#e4e6da] bg-[#ffffff] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#e4e6da] px-6 py-4">
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1 text-xs font-semibold text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                >
                  {STATUS_COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>

                <select
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className={`rounded-[8px] border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                    PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium
                  } focus:outline-none`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this task permanently?')) {
                      onDeleteTask?.(task.id)
                      onClose()
                    }
                  }}
                  className="rounded-[8px] p-1.5 text-[#5e6355] hover:bg-rose-50 hover:text-rose-700 transition"
                  title="Delete Task"
                >
                  <Trash2 size={17} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-[8px] p-1.5 text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08] transition"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Meeting Source Attribution Banner */}
              {sourceMeeting && (
                <div className="flex items-center justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs">
                  <div className="flex items-center gap-2 text-[#0d0f08]">
                    <Video size={15} className="text-[#5e6355]" />
                    <span className="font-semibold">Converted from Meeting action item</span>
                    <span className="text-[#5e6355]">({sourceMeeting.title})</span>
                  </div>
                  {onNavigateMeeting && (
                    <button
                      type="button"
                      onClick={() => onNavigateMeeting(sourceMeeting.id)}
                      className="inline-flex items-center gap-1 font-semibold text-[#0d0f08] hover:underline"
                    >
                      <span>View meeting</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              )}

              {/* Task Title & Meta */}
              <div>
                <h2 className="text-xl font-bold text-[#0d0f08]">{task.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#5e6355]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    <span>Due:</span>
                    <span className="font-semibold text-[#0d0f08]">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users size={15} />
                    <span>Assignees:</span>
                    <span className="font-semibold text-[#0d0f08]">
                      {task.assignees?.length > 0 ? task.assignees.join(', ') : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e6355]">
                    Description
                  </h3>
                  {!isEditingDescription && (
                    <button
                      type="button"
                      onClick={() => {
                        setDescDraft(task.description || '')
                        setIsEditingDescription(true)
                      }}
                      className="text-xs font-semibold text-[#0d0f08] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingDescription ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                      className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingDescription(false)}
                        className="rounded-[8px] border border-[#e4e6da] px-3 py-1 text-xs text-[#5e6355]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateTask?.(task.id, { description: descDraft })
                          setIsEditingDescription(false)
                        }}
                        className="rounded-[8px] bg-[#0d0f08] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-[#5e6355]">
                    {task.description || 'No description provided yet.'}
                  </p>
                )}
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e6355]">
                    Checklist ({completedChecks}/{checklist.length})
                  </h3>
                  {checklist.length > 0 && (
                    <span className="text-[11px] font-semibold text-[#5e6355]">
                      {Math.round((completedChecks / checklist.length) * 100)}%
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {checklist.length > 0 && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f6f7f0]">
                    <div
                      className="h-full bg-[#0d0f08] transition-all duration-300"
                      style={{
                        width: `${(completedChecks / checklist.length) * 100}%`,
                      }}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between rounded-[8px] border border-transparent p-2 hover:border-[#e4e6da] hover:bg-[#fafaf5]"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCheck(item.id)}
                        className="flex items-center gap-2.5 text-left text-xs"
                      >
                        {item.done ? (
                          <CheckCircle2 size={16} className="text-[#0d0f08]" />
                        ) : (
                          <Circle size={16} className="text-[#8b907f]" />
                        )}
                        <span
                          className={`${
                            item.done
                              ? 'line-through text-[#8b907f]'
                              : 'text-[#0d0f08]'
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChecklist(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#8b907f] hover:text-rose-700 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Checklist item form */}
                <form onSubmit={handleAddChecklist} className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    placeholder="Add checklist item..."
                    className="flex-1 rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-[8px] border border-[#e4e6da] bg-[#ffffff] px-2.5 py-1.5 text-xs font-semibold text-[#0d0f08] hover:bg-[#f6f7f0]"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Comments */}
              <div className="space-y-3 pt-4 border-t border-[#e4e6da]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e6355]">
                  Discussion & Updates ({(task.comments || []).length})
                </h3>

                <div className="space-y-3">
                  {(task.comments || []).map((comm) => (
                    <div
                      key={comm.id}
                      className="rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0d0f08]">
                          {comm.authorName}
                        </span>
                        <span className="text-[10px] text-[#8b907f]">
                          {new Date(comm.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[#5e6355] leading-relaxed">{comm.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment input */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-[8px] bg-[#0d0f08] px-3 py-2 text-xs font-semibold text-white hover:bg-[#202419]"
                  >
                    <Send size={14} />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

