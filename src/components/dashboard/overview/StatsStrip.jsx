import { motion } from 'motion/react'
import { panelVariants } from './DashboardPanel'
import { isActiveDashboardPass } from '../../../hooks/useDashboardData'

const statCell = 'min-w-0 px-4 py-4 sm:px-5 sm:py-5'

export default function StatsStrip({ committees, verifiedRoles, passes, profile, reduceMotion }) {
  const activePasses = passes.filter((pass) => isActiveDashboardPass(pass))
  const cells = [
    { label: 'Committees', value: committees.all.length, caption: `${committees.owned.length} owned · ${committees.joined.length} joined` },
    { label: 'Verified roles', value: verifiedRoles.length, caption: verifiedRoles.length ? 'From your verified record' : 'No verified roles yet' },
    { label: 'Event passes', value: passes.length, caption: `${activePasses.length} active · ${passes.length - activePasses.length} other` },
    { label: 'Profile completion', value: `${profile.percent}%`, caption: `${profile.completed} of ${profile.total} required fields` },
  ]

  return (
    <motion.section variants={panelVariants(reduceMotion)} className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[#e4e6da] bg-white min-[900px]:grid-cols-4" aria-label="Profile statistics">
      {cells.map((cell, index) => (
        <div key={cell.label} className={`${statCell} ${index % 2 === 0 ? 'border-r border-[#e4e6da]' : ''} ${index < 2 ? 'border-b border-[#e4e6da]' : ''} min-[900px]:border-b-0 ${index > 0 ? 'min-[900px]:border-l' : ''} ${index === 1 ? 'min-[900px]:border-r-0' : ''}`}>
          <p className="text-xs font-medium text-[#5e6355]">{cell.label}</p>
          <p className="mt-1.5 font-sans text-[26px] font-medium leading-none tabular-nums text-[#0d0f08]">{cell.value}</p>
          <p className="mt-2 truncate text-xs leading-4 text-[#8b907f]">{cell.caption}</p>
        </div>
      ))}
    </motion.section>
  )
}
