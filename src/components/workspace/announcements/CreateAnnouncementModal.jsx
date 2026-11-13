import { useState } from 'react'
import { Check, Pin, Plus, Trash2, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  roles = [],
  onCreateAnnouncement,
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [audience, setAudience] = useState('everyone') // 'everyone' | 'roles'
  const [selectedRoleIds, setSelectedRoleIds] = useState([])
  const [hasPoll, setHasPoll] = useState(false)
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])

  if (!isOpen) return null

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ''])
    }
  }

  const handleUpdateOption = (index, value) => {
    const updated = [...pollOptions]
    updated[index] = value
    setPollOptions(updated)
  }

  const handleRemoveOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const handleToggleRole = (roleId) => {
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId))
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    let pollData = null
    if (hasPoll && pollQuestion.trim()) {
      const validOptions = pollOptions
        .filter((opt) => opt.trim())
        .map((text, idx) => ({
          id: `opt_${idx + 1}`,
          text: text.trim(),
          votes: 0,
        }))

      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions,
          voterIds: [],
        }
      }
    }

    onCreateAnnouncement?.({
      title: title.trim(),
      content: content.trim(),
      pinned,
      audience: audience === 'everyone' ? 'everyone' : selectedRoleIds,
      poll: pollData,
      reactions: {},
      seenBy: [],
      comments: [],
    })

    // Reset
    setTitle('')
    setContent('')
    setPinned(false)
    setAudience('everyone')
    setSelectedRoleIds([])
    setHasPoll(false)
    setPollQuestion('')
    setPollOptions(['', ''])
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
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d0f08]">
              Publish Announcement
            </h2>
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
                Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory meeting before ArtFest inauguration"
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Announcement Content *
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share the full update with your committee members..."
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            {/* Audience selection */}
            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1.5">
                Audience
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setAudience('everyone')}
                  className={`rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    audience === 'everyone'
                      ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                      : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                  }`}
                >
                  All Committee Members
                </button>
                <button
                  type="button"
                  onClick={() => setAudience('roles')}
                  className={`rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    audience === 'roles'
                      ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                      : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                  }`}
                >
                  Specific Roles
                </button>
              </div>

              {audience === 'roles' && (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-[10px] border border-[#e4e6da] bg-[#fafaf5]">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleToggleRole(r.id)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                        selectedRoleIds.includes(r.id)
                          ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                          : 'border-[#e4e6da] bg-[#ffffff] text-[#5e6355]'
                      }`}
                    >
                      {selectedRoleIds.includes(r.id) && <Check size={12} />}
                      <span>{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pin to top */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pin-check"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="h-4 w-4 rounded border-[#e4e6da] text-[#0d0f08] accent-[#0d0f08]"
              />
              <label
                htmlFor="pin-check"
                className="text-xs font-semibold text-[#0d0f08] flex items-center gap-1 cursor-pointer"
              >
                <Pin size={13} />
                <span>Pin this announcement to top of feed</span>
              </label>
            </div>

            {/* Single Question Poll Toggle */}
            <div className="pt-2 border-t border-[#e4e6da]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0d0f08]">
                  Attach Single-Question Poll
                </span>
                <button
                  type="button"
                  onClick={() => setHasPoll(!hasPoll)}
                  className={`text-xs font-semibold ${
                    hasPoll ? 'text-rose-600' : 'text-[#0d0f08] underline'
                  }`}
                >
                  {hasPoll ? 'Remove Poll' : '+ Add Poll'}
                </button>
              </div>

              {hasPoll && (
                <div className="mt-3 space-y-2 rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3">
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Poll question (e.g. Which date works best for rehearsal?)"
                    className="w-full rounded-[8px] border border-[#e4e6da] bg-[#ffffff] px-3 py-1.5 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                  />

                  <div className="space-y-1.5 pt-1">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 rounded-[8px] border border-[#e4e6da] bg-[#ffffff] px-2.5 py-1 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(i)}
                            className="p-1 text-[#8b907f] hover:text-rose-600"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {pollOptions.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0d0f08] hover:underline pt-1"
                    >
                      <Plus size={12} />
                      <span>Add option</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
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
                Publish Now
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

