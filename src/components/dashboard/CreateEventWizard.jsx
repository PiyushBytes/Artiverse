import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Image,
  MapPin,
  Sparkles,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export default function CreateEventWizard({
  isOpen,
  onClose,
  userCommittees = [],
  onCreated,
  onToast,
}) {
  const [step, setStep] = useState(1) // 1: Details, 2: Committee, 3: Registration, 4: Preview & Publish, 5: Done
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('artiverse_event_draft')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      title: '',
      date: '',
      time: '',
      venue: '',
      committeeId: userCommittees[0]?.id || 'independent',
      committeeName: userCommittees[0]?.name || 'Independent Organiser',
      isPaid: false,
      price: '0',
      capacity: '100',
      description: '',
    }
  })

  // Autosave draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('artiverse_event_draft', JSON.stringify(formData))
    } catch {}
  }, [formData])

  if (!isOpen) return null

  const handleNext = (e) => {
    e?.preventDefault()
    if (step === 1 && !formData.title.trim()) {
      onToast?.('Please enter an event title.')
      return
    }
    if (step < 4) {
      setStep((s) => s + 1)
    } else {
      // Publish event
      setStep(5)
      localStorage.removeItem('artiverse_event_draft')
      onCreated?.({
        id: `pass_${Date.now()}`,
        eventTitle: formData.title,
        passNumber: `#${Math.floor(100 + Math.random() * 900)}-PUB`,
        committeeName: formData.committeeName,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        gate: 'Main Festival Entry',
        ticketType: formData.isPaid ? 'Standard Paid Pass' : 'Complimentary Pass',
        price: formData.isPaid ? `₹${formData.price}` : 'Free',
        status: 'CONFIRMED',
        qrPayload: `ARTIVERSE:PASS:${Date.now()}:EVENT`,
      })
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/65 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-[#e4e6da] bg-[#fafaf5] p-6 shadow-2xl sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[#d4ff1f] text-[#0d0f08]">
                <Calendar size={16} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#0d0f08]">Publish an Event</h3>
                <p className="text-[11px] text-[#5e6355]">Step {Math.min(step, 4)} of 4 · Auto-saving draft</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-7 place-items-center rounded-full text-[#5e6355] hover:bg-black/5 hover:text-[#0d0f08]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stepper Bar */}
          {step <= 4 && (
            <div className="my-5 flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#d4ff1f]' : 'bg-[#e4e6da]'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HackHeritage'27 or Winter Unplugged"
                  className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-4 py-2.5 text-xs font-semibold text-[#0d0f08] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="lime-button inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <span>Organisers</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Committee & Organisers */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Under which committee is this event hosted?
                </label>
                <p className="mt-0.5 text-xs text-[#5e6355]">
                  Linking events to a verified committee establishes authenticity and automatic council attendance sync.
                </p>

                <div className="mt-3 space-y-2">
                  {userCommittees.map((comm) => (
                    <label
                      key={comm.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                        formData.committeeId === comm.id
                          ? 'border-[#0d0f08] bg-white shadow-sm ring-2 ring-[#d4ff1f]'
                          : 'border-[#e4e6da] bg-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{comm.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-[#0d0f08]">{comm.name}</p>
                          <p className="text-[10px] text-[#5e6355]">{comm.roleTitle || 'Member Council'}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="committee"
                        checked={formData.committeeId === comm.id}
                        onChange={() => setFormData({ ...formData, committeeId: comm.id, committeeName: comm.name })}
                        className="size-4 text-[#0d0f08]"
                      />
                    </label>
                  ))}

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                      formData.committeeId === 'independent'
                        ? 'border-[#0d0f08] bg-white shadow-sm ring-2 ring-[#d4ff1f]'
                        : 'border-[#e4e6da] bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌟</span>
                      <div>
                        <p className="text-xs font-bold text-[#0d0f08]">Independent Organiser</p>
                        <p className="text-[10px] text-[#5e6355]">Host without an official club affiliation</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="committee"
                      checked={formData.committeeId === 'independent'}
                      onChange={() => setFormData({ ...formData, committeeId: 'independent', committeeName: 'Independent Organiser' })}
                      className="size-4 text-[#0d0f08]"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  className="lime-button inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <span>Ticketing</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Registration & Capacity */}
          {step === 3 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Ticketing Model
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPaid: false, price: '0' })}
                    className={`rounded-2xl border p-3 text-center transition-all ${
                      !formData.isPaid
                        ? 'border-[#0d0f08] bg-white shadow-sm ring-2 ring-[#d4ff1f]'
                        : 'border-[#e4e6da] bg-white/60'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#0d0f08]">Free Registration</span>
                    <span className="block text-[10px] text-[#5e6355]">Single-click QR pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPaid: true, price: '99' })}
                    className={`rounded-2xl border p-3 text-center transition-all ${
                      formData.isPaid
                        ? 'border-[#0d0f08] bg-white shadow-sm ring-2 ring-[#d4ff1f]'
                        : 'border-[#e4e6da] bg-white/60'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#0d0f08]">Paid Pass</span>
                    <span className="block text-[10px] text-[#5e6355]">Fee per attendee</span>
                  </button>
                </div>
              </div>

              {formData.isPaid && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                    Ticket Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="99"
                    className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
                  Attendee Capacity Limit
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="350"
                  className="mt-1.5 w-full rounded-2xl border border-[#e4e6da] bg-white px-3 py-2 text-xs font-semibold text-[#0d0f08] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  className="lime-button inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <span>Preview</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Preview & Publish */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#e4e6da] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#d4ff1f] px-2.5 py-0.5 text-[10px] font-bold text-[#0d0f08]">
                    {formData.isPaid ? `₹${formData.price}` : 'FREE PASS'}
                  </span>
                  <span className="font-mono text-xs text-[#5e6355]">Cap: {formData.capacity} seats</span>
                </div>

                <h4 className="mt-2 text-lg font-bold text-[#0d0f08]">{formData.title}</h4>
                <p className="text-xs text-[#5e6355]">{formData.committeeName}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#0d0f08] border-t border-[#f0f1ea] pt-2.5">
                  <div>
                    <span className="text-[10px] text-[#5e6355]">Date</span>
                    <p className="font-semibold">{formData.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5e6355]">Venue</span>
                    <p className="font-semibold truncate">{formData.venue}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="lime-button inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <Sparkles size={14} />
                  <span>Publish Event Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Published Moment */}
          {step === 5 && (
            <div className="py-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#d4ff1f] text-[#0d0f08] shadow-[0_0_24px_rgba(212,255,31,0.5)]"
              >
                <Check size={28} strokeWidth={3} />
              </motion.div>
              <h3 className="font-display mt-4 text-xl font-bold text-[#0d0f08]">
                Event Published Successfully!
              </h3>
              <p className="mt-1 text-xs text-[#5e6355]">
                {formData.title} is now open for campus student registrations.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="lime-button mt-6 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                <span>View My Passes</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

