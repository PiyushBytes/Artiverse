import { useEffect, useState } from 'react'
import { Calendar, Clock, ExternalLink, MapPin, Sparkles, Video } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function NextUpCard({ nextUp, onToast }) {
  const reduceMotion = useReducedMotion()
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 16, minutes: 22, seconds: 40 })

  useEffect(() => {
    if (reduceMotion) return undefined
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [reduceMotion])

  if (!nextUp) return null

  const handleAddToCalendar = () => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(nextUp.calendarEvent?.title || nextUp.title)
    const details = encodeURIComponent(nextUp.calendarEvent?.description || nextUp.domain)
    const location = encodeURIComponent(nextUp.calendarEvent?.location || nextUp.location)
    // 2026-12-14 16:30 IST to 17:15 IST
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261214T110000Z/20261214T114500Z`
    window.open(gcalUrl, '_blank')
    onToast?.('Added to your calendar!')
  }

  const handleMeetingLink = () => {
    if (nextUp.meetingLink) {
      window.open(nextUp.meetingLink, '_blank')
    } else {
      onToast?.(`Venue: ${nextUp.location}`)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.10)] sm:p-7">
      {/* Soft Ambient Lime Gradient Accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,#d4ff1f_0%,rgba(212,255,31,0.15)_50%,transparent_70%)] opacity-70 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left: Detail & Countdown */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff1f] bg-[#d4ff1f]/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#46630b]">
            <Sparkles size={12} className="text-[#849158]" />
            <span>{nextUp.badge}</span>
          </div>

          <h3 className="mt-3 text-xl font-bold tracking-tight text-[#0d0f08] sm:text-2xl">
            {nextUp.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-[#5e6355] sm:text-sm">{nextUp.domain}</p>

          {/* Time & Location meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#0d0f08]">
            <span className="flex items-center gap-1.5 rounded-xl bg-[#fafaf5] px-3 py-1.5 border border-[#e4e6da]">
              <Calendar size={14} className="text-[#849158]" />
              <span>{nextUp.date} · {nextUp.time}</span>
            </span>

            <span className="flex items-center gap-1.5 rounded-xl bg-[#fafaf5] px-3 py-1.5 border border-[#e4e6da]">
              <MapPin size={14} className="text-[#849158]" />
              <span>{nextUp.location}</span>
            </span>
          </div>
        </div>

        {/* Right: Countdown Units & Actions */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          {/* Countdown Clock */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e6355] lg:text-right">
              Time Remaining
            </p>
            <div className="mt-1.5 flex items-center gap-2 font-mono text-center">
              <div className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1.5">
                <span className="text-base font-bold text-[#0d0f08]">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="block text-[8px] font-semibold text-[#5e6355]">DAYS</span>
              </div>
              <span className="font-bold text-[#849158]">:</span>
              <div className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1.5">
                <span className="text-base font-bold text-[#0d0f08]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[8px] font-semibold text-[#5e6355]">HRS</span>
              </div>
              <span className="font-bold text-[#849158]">:</span>
              <div className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1.5">
                <span className="text-base font-bold text-[#0d0f08]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[8px] font-semibold text-[#5e6355]">MIN</span>
              </div>
              <span className="font-bold text-[#849158]">:</span>
              <div className="rounded-xl border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1.5">
                <span className="text-base font-bold text-[#0d0f08]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[8px] font-semibold text-[#5e6355]">SEC</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-white px-4 py-2 text-xs font-semibold text-[#0d0f08] shadow-sm hover:bg-[#fafaf5]"
            >
              <Calendar size={14} />
              <span>Add to calendar</span>
            </button>

            <button
              type="button"
              onClick={handleMeetingLink}
              className="lime-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <Video size={14} />
              <span>Join / Directions</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

