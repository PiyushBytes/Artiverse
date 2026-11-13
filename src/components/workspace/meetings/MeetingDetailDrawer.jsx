import { useState } from 'react'
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  Send,
  Trash2,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function MeetingDetailDrawer({
  isOpen,
  onClose,
  meeting,
  workspace,
  currentUserId,
  onUpdateMeeting,
  onConvertActionItemToTask,
}) {
  const [activeTab, setActiveTab] = useState('minutes') // 'minutes' | 'actions' | 'attendance'
  const [minutesDraft, setMinutesDraft] = useState('')
  const [isEditingMinutes, setIsEditingMinutes] = useState(false)
  const [newActionText, setNewActionText] = useState('')
  const [newActionAssignee, setNewActionAssignee] = useState('')
  const [newActionDue, setNewActionDue] = useState('')

  if (!isOpen || !meeting) return null

  const members = workspace?.members || []
  const actionItems = meeting.actionItems || []
  const rsvp = meeting.rsvp || {}
  const attendance = meeting.attendance || {}
  const myRsvp = rsvp[currentUserId]

  const handleSetRsvp = (status) => {
    const updated = { ...rsvp, [currentUserId]: status }
    onUpdateMeeting?.(meeting.id, { rsvp: updated })
  }

  const handleToggleAttendance = (memberId, status) => {
    const updated = { ...attendance, [memberId]: status }
    onUpdateMeeting?.(meeting.id, { attendance: updated })
  }

  const handleSaveMinutes = (newState) => {
    onUpdateMeeting?.(meeting.id, {
      minutes: minutesDraft,
      minutesState: newState || meeting.minutesState || 'draft',
    })
    setIsEditingMinutes(false)
  }

  const handleAddActionItem = (e) => {
    e.preventDefault()
    if (!newActionText.trim()) return

    const newItem = {
      id: `act_${Date.now()}`,
      text: newActionText.trim(),
      assignee: newActionAssignee || null,
      dueDate: newActionDue || null,
      convertedTaskId: null,
    }

    onUpdateMeeting?.(meeting.id, {
      actionItems: [...actionItems, newItem],
    })

    setNewActionText('')
    setNewActionAssignee('')
    setNewActionDue('')
  }

  const handleConvert = (actionItem) => {
    onConvertActionItemToTask?.({
      meetingId: meeting.id,
      actionItemId: actionItem.id,
      title: actionItem.text,
      assignee: actionItem.assignee,
      dueDate: actionItem.dueDate,
    })
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
            className="flex w-screen max-w-2xl flex-col border-l border-[#e4e6da] bg-[#ffffff] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#e4e6da] px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0d0f08]">{meeting.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#5e6355]">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{meeting.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>{meeting.time}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {meeting.locationType === 'online' ? <Video size={13} /> : <MapPin size={13} />}
                    <span>{meeting.locationValue}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-[8px] p-1.5 text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08]"
              >
                <X size={17} />
              </button>
            </div>

            {/* RSVP Banner */}
            <div className="flex items-center justify-between border-b border-[#e4e6da] bg-[#fafaf5] px-6 py-3">
              <span className="text-xs font-semibold text-[#0d0f08]">
                Your RSVP Status:
              </span>
              <div className="flex items-center gap-1.5">
                {['attending', 'tentative', 'declined'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleSetRsvp(status)}
                    className={`rounded-[8px] border px-2.5 py-1 text-xs font-semibold capitalize transition ${
                      myRsvp === status
                        ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                        : 'border-[#e4e6da] bg-[#ffffff] text-[#5e6355] hover:bg-[#fafaf5]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e4e6da] px-6 pt-2">
              {[
                { id: 'minutes', label: 'Minutes of Meeting (MoM)' },
                { id: 'actions', label: `Action Items (${actionItems.length})` },
                { id: 'attendance', label: 'Attendance Roll' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`border-b-2 px-3 py-2 text-xs font-semibold transition ${
                    activeTab === t.id
                      ? 'border-[#0d0f08] text-[#0d0f08]'
                      : 'border-transparent text-[#5e6355] hover:text-[#0d0f08]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Tab: Minutes */}
              {activeTab === 'minutes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5e6355]">
                        Document State:
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          meeting.minutesState === 'published'
                            ? 'border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#0d0f08]'
                            : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                        }`}
                      >
                        {meeting.minutesState || 'Draft'}
                      </span>
                    </div>

                    {!isEditingMinutes && (
                      <button
                        type="button"
                        onClick={() => {
                          setMinutesDraft(meeting.minutes || '')
                          setIsEditingMinutes(true)
                        }}
                        className="text-xs font-semibold text-[#0d0f08] hover:underline"
                      >
                        Edit Notes
                      </button>
                    )}
                  </div>

                  {isEditingMinutes ? (
                    <div className="space-y-3">
                      <textarea
                        rows={10}
                        value={minutesDraft}
                        onChange={(e) => setMinutesDraft(e.target.value)}
                        placeholder="Write meeting summary, key decisions, discussions, next steps..."
                        className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs text-[#0d0f08] font-mono leading-relaxed focus:border-[#0d0f08] focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingMinutes(false)}
                          className="rounded-[8px] border border-[#e4e6da] px-3 py-1.5 text-xs text-[#5e6355]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveMinutes('draft')}
                          className="rounded-[8px] border border-[#0d0f08] px-3 py-1.5 text-xs font-semibold text-[#0d0f08]"
                        >
                          Save as Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveMinutes('published')}
                          className="rounded-[8px] bg-[#0d0f08] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Publish to Members
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-4 text-xs leading-relaxed text-[#5e6355] whitespace-pre-wrap min-h-[160px]">
                      {meeting.minutes ||
                        'No meeting notes documented yet. Click "Edit Notes" to start logging decisions and discussion points.'}
                    </div>
                  )}

                  {/* Agenda summary box */}
                  {meeting.agenda?.length > 0 && (
                    <div className="mt-4 rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-4 space-y-2">
                      <h4 className="text-xs font-bold text-[#0d0f08]">Agenda Overview</h4>
                      <ul className="space-y-1.5 text-xs text-[#5e6355]">
                        {meeting.agenda.map((ag, i) => (
                          <li key={ag.id} className="flex items-center gap-2">
                            <span className="font-bold text-[#0d0f08]">{i + 1}.</span>
                            <span>{ag.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Action Items */}
              {activeTab === 'actions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#5e6355]">
                      Action items agreed during the meeting. Convert any item into a Kanban task with 1-click.
                    </p>
                  </div>

                  {/* Action items list */}
                  <div className="space-y-2">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-semibold text-[#0d0f08]">{item.text}</span>
                          <div className="flex items-center gap-2 text-[11px] text-[#8b907f]">
                            {item.assignee && (
                              <span>Assignee: {item.assignee}</span>
                            )}
                            {item.dueDate && (
                              <span>• Due: {item.dueDate}</span>
                            )}
                          </div>
                        </div>

                        <div>
                          {item.convertedTaskId ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/30 px-2.5 py-1 text-[11px] font-bold text-[#0d0f08]">
                              <CheckCircle2 size={12} />
                              <span>Task Created</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConvert(item)}
                              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0d0f08] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#202419] transition"
                            >
                              <span>Turn into Task</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {actionItems.length === 0 && (
                      <div className="py-8 text-center text-xs text-[#8b907f]">
                        No action items recorded for this meeting.
                      </div>
                    )}
                  </div>

                  {/* Add action item form */}
                  <form onSubmit={handleAddActionItem} className="space-y-2 rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-3">
                    <span className="text-xs font-bold text-[#0d0f08]">Add Action Item</span>
                    <input
                      type="text"
                      required
                      value={newActionText}
                      onChange={(e) => setNewActionText(e.target.value)}
                      placeholder="e.g. Design sponsor deck PDF"
                      className="w-full rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={newActionAssignee}
                        onChange={(e) => setNewActionAssignee(e.target.value)}
                        className="rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                      >
                        <option value="">Select Assignee</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="date"
                        value={newActionDue}
                        onChange={(e) => setNewActionDue(e.target.value)}
                        className="rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-[8px] bg-[#0d0f08] px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Plus size={13} />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: Attendance Roll */}
              {activeTab === 'attendance' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#5e6355]">
                    Mark actual attendance during or after the meeting.
                  </p>

                  <div className="divide-y divide-[#e4e6da] rounded-[10px] border border-[#e4e6da] bg-[#ffffff] overflow-hidden">
                    {members.map((m) => {
                      const status = attendance[m.id] || 'unmarked'
                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 text-xs hover:bg-[#fafaf5]"
                        >
                          <div>
                            <span className="font-semibold text-[#0d0f08]">{m.name}</span>
                            <span className="ml-2 text-[11px] text-[#8b907f]">{m.title}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {['present', 'late', 'absent'].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleToggleAttendance(m.id, st)}
                                className={`rounded-[6px] border px-2 py-0.5 text-[10px] font-semibold capitalize transition ${
                                  status === st
                                    ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                                    : 'border-[#e4e6da] bg-[#ffffff] text-[#5e6355] hover:bg-[#fafaf5]'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

