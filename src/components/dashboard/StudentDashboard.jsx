import { Calendar, CheckCircle2, Clock, Sparkles, TicketCheck, Users } from 'lucide-react'

export default function StudentDashboard({ user }) {
  const committees = user?.committees || [
    { id: 'c1', name: 'Design Committee', role: 'Applicant · Shortlisted', status: 'PI Scheduled', icon: '🎨' },
    { id: 'c2', name: 'Cine Club MSIT', role: 'Active Member', status: 'Confirmed', icon: '🎬' },
  ]

  const registrations = user?.registrations || [
    { id: 'r1', eventTitle: 'Cine-Charcha', passNumber: '#389', date: 'March 15, 2026', venue: 'MSIT Auditorium', status: 'Active QR' },
    { id: 'r2', eventTitle: "Kalakriti'26 Early Bird", passNumber: '#104', date: 'March 28-30, 2026', venue: 'Main Ground', status: 'Pass Issued' },
  ]

  return (
    <div className="space-y-8">
      {/* 1. Joined Committees */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#0d0f08]" />
          <h2 className="font-display text-xl font-bold text-[#0d0f08]">Joined Committees</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {committees.map((comm) => (
            <div
              key={comm.id}
              className="flex items-center gap-3.5 rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-[#f6f7f2] text-xl">
                {comm.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0d0f08]">{comm.name}</p>
                <p className="text-xs text-[#5e6355]">{comm.role}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#849158]">
                  <CheckCircle2 size={12} />
                  <span>{comm.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Apni Requests (Application Status) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-[#0d0f08]" />
          <h2 className="font-display text-xl font-bold text-[#0d0f08]">Apni Requests</h2>
        </div>

        <div className="rounded-2xl border border-[#e4e6da] bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3">
            <div>
              <p className="text-xs font-bold text-[#0d0f08]">Design Committee · UI/UX Domain</p>
              <p className="text-[11px] text-[#5e6355]">Application ID: #APP-2026-084</p>
            </div>
            <span className="rounded-full bg-[#d4ff1f] px-3 py-1 text-[10px] font-bold text-[#0d0f08]">
              PI Scheduled
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#5e6355]">
            <span>Slot: March 14, 4:30 PM (Room 302, MSIT)</span>
            <span className="text-[#0d0f08] font-semibold">Slot Confirmed ✓</span>
          </div>
        </div>
      </section>

      {/* 3. Registrations (Event Passes) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TicketCheck size={18} className="text-[#0d0f08]" />
          <h2 className="font-display text-xl font-bold text-[#0d0f08]">My Registrations</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f6f7f2] px-2.5 py-0.5 text-[10px] font-bold text-[#0d0f08]">
                  {reg.passNumber}
                </span>
                <span className="text-[10px] font-semibold text-[#849158] flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#849158]" />
                  {reg.status}
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-[#0d0f08]">{reg.eventTitle}</h3>
              <p className="mt-1 text-xs text-[#5e6355] flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{reg.date} · {reg.venue}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

