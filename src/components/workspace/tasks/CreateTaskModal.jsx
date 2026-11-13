import { useState } from 'react'
import { Calendar, Plus, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function CreateTaskModal({
  isOpen,
  onClose,
  workspace,
  onCreateTask,
  initialStatus = 'todo',
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')

  if (!isOpen) return null

  const members = workspace?.members || []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreateTask?.({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: initialStatus,
      dueDate: dueDate || null,
      assignees: assignee ? [assignee] : [],
      checklist: [],
      comments: [],
    })

    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setAssignee('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/30 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d0f08]">Create Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] p-1 text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finalize sponsorship brochure for ArtFest"
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details or scope for this task..."
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Assignee
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e4e6da]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[10px] border border-[#e4e6da] px-4 py-2 text-xs font-semibold text-[#5e6355] hover:bg-[#f6f7f0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[10px] bg-[#0d0f08] px-4 py-2 text-xs font-semibold text-white hover:bg-[#202419]"
              >
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

