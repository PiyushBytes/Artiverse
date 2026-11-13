import { CalendarDays } from 'lucide-react'

export default function Events() {
  return (
    <section className="min-h-[70vh] bg-[#fafaf5] px-4 py-14 text-[#0d0f08] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[960px]">
        <div className="flex items-center gap-3 text-[#5e6355]">
          <CalendarDays size={19} strokeWidth={1.6} aria-hidden="true" />
          <p className="text-xs font-semibold">Campus community</p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Live Events</h1>
        <div className="mt-8 rounded-[14px] border border-dashed border-[#e4e6da] bg-white px-5 py-10 text-center sm:px-8 sm:py-14">
          <p className="mx-auto max-w-md text-sm leading-6 text-[#5e6355]">
            Event listings will appear here when they’re available.
          </p>
        </div>
      </div>
    </section>
  )
}
