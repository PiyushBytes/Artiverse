import { useState } from 'react'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function RegistrationsPage({ currentUser, onNavigate, onToast }) {
  const reduceMotion = useReducedMotion()
  const [selectedPass, setSelectedPass] = useState(null)

  const passes = currentUser?.registrations || [
    {
      id: 'r1',
      eventTitle: 'Cine-Charcha: Screenwriting & Film Jam',
      passNumber: '#389',
      date: 'March 15, 2026',
      time: '4:00 PM IST',
      venue: 'MSIT Auditorium, Ground Floor',
      status: 'Active QR',
      type: 'Delegate Pass',
    },
    {
      id: 'r2',
      eventTitle: "Kalakriti'26: Annual Cultural Conclave",
      passNumber: '#104',
      date: 'March 28-30, 2026',
      time: '10:00 AM Daily',
      venue: 'MSIT Main Campus Grounds',
      status: 'Pass Issued',
      type: 'All-Access 3-Day Pass',
    },
  ]

  const applications = currentUser?.committees || [
    {
      id: 'c1',
      name: 'Design Committee',
      role: 'UI/UX & Branding',
      status: 'PI Scheduled',
      time: 'Today · 4:30 PM (Room 304)',
      icon: '🎨',
    },
    {
      id: 'c2',
      name: 'Cine Club MSIT',
      role: 'Cinematography',
      status: 'Under Review',
      time: 'Applied 2 days ago',
      icon: '🎬',
    },
  ]

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[#e4e6da] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
              <Ticket size={13} className="text-[#839b3d]" />
              <span>Passes & Applications</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#0d0f08]">
              My Registrations
            </h1>
            <p className="mt-2 text-sm text-[#5e6355]">
              {currentUser
                ? `Active event passes and committee application tracker for ${currentUser.fullName || currentUser.email}.`
                : 'Sign in to access your digital passes and committee application statuses.'}
            </p>
          </div>

          {!currentUser && (
            <button
              onClick={() => onNavigate('/login')}
              className="lime-button glow shrink-0 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              Log in to view passes
            </button>
          )}
        </div>

        {/* Section 1: Event Passes */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">
              Active Event Passes ({passes.length})
            </h2>
            <button
              onClick={() => onNavigate('/events')}
              className="text-xs font-semibold text-[#839b3d] hover:underline"
            >
              Browse more events →
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {passes.map((pass) => (
              <motion.div
                key={pass.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[26px] border border-[#e4e6da] bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Top Strip */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#839b3d] bg-[#d4ff1f]/20 border border-[#d4ff1f] px-2.5 py-0.5 rounded-full">
                    {pass.passNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#414d1e]">
                    <ShieldCheck size={13} />
                    Verified Pass
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="mt-4 font-display text-xl font-semibold text-[#0d0f08]">
                  {pass.eventTitle}
                </h3>
                <p className="text-xs text-[#5e6355] mt-0.5">{pass.type}</p>

                {/* Meta details */}
                <div className="mt-4 space-y-2 border-y border-[#f0f1ea] py-3 text-xs text-[#424638]">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#839b3d]" />
                    <span>{pass.date} · {pass.time || 'Entry at Gate'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#839b3d]" />
                    <span>{pass.venue}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPass(pass)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0d0f08] py-2.5 text-xs font-semibold text-white hover:bg-[#839b3d] transition-colors"
                  >
                    <QrCode size={14} />
                    <span>Show Gate QR</span>
                  </button>
                  <button
                    onClick={() => onToast?.(`Downloading Pass ${pass.passNumber} as PDF...`)}
                    className="grid size-10 place-items-center rounded-xl border border-[#e4e6da] text-[#0d0f08] hover:bg-[#f5f6ef] transition-colors"
                    title="Download Pass PDF"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Committee Applications */}
        <div className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-[#0d0f08] mb-4">
            Committee Applications Tracker ({applications.length})
          </h2>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#e4e6da] bg-white p-4 shadow-sm gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#f5f6ef] text-xl border border-[#e4e6da]">
                    {app.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d0f08]">{app.name}</h4>
                    <p className="text-xs text-[#5e6355]">Applied for: {app.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-[#d4ff1f]/20 border border-[#d4ff1f] px-2.5 py-0.5 text-[11px] font-bold text-[#414d1e]">
                      {app.status}
                    </span>
                    <p className="text-[10px] text-[#5e6355] mt-0.5">{app.time}</p>
                  </div>
                  <button
                    onClick={() => onToast?.(`Opening interview details for ${app.name}`)}
                    className="rounded-xl border border-[#e4e6da] px-3 py-1.5 text-xs font-semibold text-[#0d0f08] hover:bg-[#f5f6ef]"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-Screen QR Pass Modal */}
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm rounded-[32px] border border-[#e4e6da] bg-white p-7 text-center shadow-2xl"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-[#f5f6ef] text-[#5e6355] hover:text-[#0d0f08]"
              >
                ✕
              </button>

              <span className="inline-block rounded-full bg-[#d4ff1f]/30 border border-[#d4ff1f] px-3 py-0.5 text-xs font-bold text-[#414d1e]">
                {selectedPass.passNumber}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-[#0d0f08]">
                {selectedPass.eventTitle}
              </h3>
              <p className="text-xs text-[#5e6355] mt-1">{selectedPass.venue}</p>

              {/* Dynamic QR Mock */}
              <div className="mx-auto my-6 grid size-48 place-items-center rounded-2xl border-2 border-dashed border-[#839b3d] bg-[#fbfbf8] p-3 shadow-inner">
                <QrCode size={140} className="text-[#0d0f08]" />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#839b3d]">
                <CheckCircle2 size={14} />
                <span>Valid once at MSIT Gate Scanner</span>
              </div>

              <button
                onClick={() => {
                  onToast?.(`Pass saved to photos!`)
                  setSelectedPass(null)
                }}
                className="lime-button glow mt-6 w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                Save Pass Image
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

