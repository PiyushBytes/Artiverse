import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Users } from 'lucide-react'
import { panelVariants } from './DashboardPanel'

export default function FirstTimePanel({ onCreateCommittee, onCreateEvent, reduceMotion }) {
  return (
    <motion.section variants={panelVariants(reduceMotion)} className="rounded-[14px] border border-[#e4e6da] bg-white p-5 sm:p-7" aria-labelledby="getting-started-heading">
      <p className="text-xs font-medium text-[#5e6355]">Overview</p>
      <h2 id="getting-started-heading" className="mt-1 text-2xl font-semibold text-[#0d0f08]">Get started on campus</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-[#5e6355]">Create a committee or event, or explore campus as a student.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onCreateCommittee} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]"><Users size={16} strokeWidth={1.6} /> Create a committee</button>
        <button type="button" onClick={onCreateEvent} disabled={!onCreateEvent} title={!onCreateEvent ? 'Event publishing is not connected yet' : undefined} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[#e4e6da] bg-white px-3.5 text-xs font-medium text-[#0d0f08] transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08] disabled:cursor-not-allowed disabled:text-[#8b907f]"><CalendarDays size={16} strokeWidth={1.6} /> Create an event</button>
      </div>
      <Link to="/apply" className="mt-5 inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-[#5e6355] underline underline-offset-4 transition-colors hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">Explore as a student <ArrowRight size={14} /></Link>
    </motion.section>
  )
}
