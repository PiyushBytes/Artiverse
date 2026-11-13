import { useState } from 'react'
import { Calendar, Clock, MapPin, Plus, Trash2, Video, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function CreateMeetingModal({
  isOpen,
  onClose,
  onCreateMeeting,
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [locationType, setLocationType] = useState('in_person') // 'in_person' | 'online'
  const [locationValue, setLocationValue] = useState('')
  const [agendaItems, setAgendaItems] = useState(['', ''])

  if (!isOpen) return null

  const handleAddAgenda = () => {
    setAgendaItems([...agendaItems, ''])
  }

  const handleUpdateAgenda = (idx, val) => {
    const updated = [...agendaItems]
    updated[idx] = val
    setAgendaItems(updated)
  }

  const handleRemoveAgenda = (idx) => {
    if (agendaItems.length > 1) {
      setAgendaItems(agendaItems.filter((_, i) => i !== idx))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !date) return

    const validAgenda = agendaItems
      .filter((item) => item.trim())
      .map((text, i) => ({
        id: `ag_${i + 1}`,
        title: text.trim(),
        durationMin: 15,
      }))

    onCreateMeeting?.({
      title: title.trim(),
      date,
      time: time || '17:00',
      locationType,
      locationValue: locationValue.trim() || (locationType === 'online' ? 'Google Meet link TBD' : 'Campus Main Hall'),
      agenda: validAgenda,
      rsvp: {},
      attendance: {},
      minutes: '',
      minutesState: 'draft', // 'draft' | 'published'
      actionItems: [],
    })

    setTitle('')
    setDate('')
    setTime('')
    setLocationValue('')
    setAgendaItems(['', ''])
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
          className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d0f08]">
              Schedule New Meeting
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
                Meeting Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Core Committee Sync & Review"
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>
            </div>

            {/* Location / Venue */}
            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1.5">
                Venue or Link
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setLocationType('in_person')}
                  className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    locationType === 'in_person'
                      ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                      : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                  }`}
                >
                  <MapPin size={13} />
                  <span>In-Person Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('online')}
                  className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    locationType === 'online'
                      ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                      : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                  }`}
                >
                  <Video size={13} />
                  <span>Online Call (Meet / Zoom)</span>
                </button>
              </div>

              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder={
                  locationType === 'in_person'
                    ? 'e.g. Room 402, Academic Block'
                    : 'e.g. https://meet.google.com/xyz-abc-def'
                }
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            {/* Agenda Items */}
            <div className="space-y-2 pt-2 border-t border-[#e4e6da]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#0d0f08]">
                  Agenda Items
                </label>
                <button
                  type="button"
                  onClick={handleAddAgenda}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0d0f08] hover:underline"
                >
                  <Plus size={12} />
                  <span>Add Topic</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {agendaItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-4 text-center text-xs font-bold text-[#8b907f]">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateAgenda(i, e.target.value)}
                      placeholder="e.g. Budget allocation & venue booking"
                      className="flex-1 rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
                    />
                    {agendaItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAgenda(i)}
                        className="p-1 text-[#8b907f] hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
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
                Schedule Meeting
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

