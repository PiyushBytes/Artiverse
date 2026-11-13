import { ArrowUpRight, CheckCircle2, Clock, Palette } from 'lucide-react'

export default function CommitteeCard({ committee, onClick, onSelect, onManage }) {
  const rawSlug = committee.slug || committee.username || committee.name || 'artikon'
  const slug = String(rawSlug).toLowerCase().replace(/^@/, '').includes('artikon')
    ? 'artikon'
    : String(rawSlug).toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_-]/g, '') || 'artikon'

  const handleClick = () => {
    if (onClick) onClick(committee)
    else if (onSelect) onSelect(committee)
    else if (onManage) onManage(committee)
  }

  const role = committee.roleTitle || committee.role || 'Member'
  const rawStatus = committee.status || 'Active'
  const isActive = rawStatus.toLowerCase() === 'active' || rawStatus.toLowerCase() === 'open'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`Open ${committee.name || 'committee'} profile`}
      className="group relative flex cursor-pointer flex-col justify-between bg-[#fcfbf8] p-5 transition-colors hover:bg-[#f5f1eb] focus-visible:outline-2 focus-visible:outline-[#ef6b3b] sm:p-6"
    >
      {/* Committee identity and status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="grid size-12 shrink-0 place-items-center border border-[#ded8cf] bg-[#eeeae3] text-[#65615b]">
            <Palette size={20} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-[#171614] transition-colors group-hover:text-[#a9431e] sm:text-xl">
              {committee.name}
            </h3>
            <p className="truncate font-mono text-xs font-semibold text-[#5e6355]">
              @{committee.username || slug}
            </p>
          </div>
        </div>

        {/* Small Status Chip */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium ${
            isActive
              ? 'text-[#47714a]'
              : 'text-[#65615b]'
          }`}
        >
          {isActive ? <CheckCircle2 size={11} className="text-[#839b3d]" /> : <Clock size={11} />}
          <span>{isActive ? 'Active' : 'Pending'}</span>
        </span>
      </div>

      {/* Role Title & Hover Arrow */}
      <div className="mt-5 flex items-center justify-between border-t border-[#ded8cf] pt-3 text-xs">
        <span className="font-semibold text-[#0d0f08]">
          {role}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#5e6355] transition-colors group-hover:text-[#171614]">
          <span className="text-[11px]">View Committee</span>
          <ArrowUpRight size={14} className="text-[#65615b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </div>
  )
}
