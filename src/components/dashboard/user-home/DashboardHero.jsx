import { ArrowDownRight, CalendarDays, Crown, Plus, Search } from 'lucide-react'

function Metric({ value, label, last = false }) {
  return (
    <div className={`flex flex-col justify-center px-4 py-4 sm:px-5 lg:px-6 ${last ? '' : 'border-r border-[#ded8cf] lg:border-r-0 lg:border-b'}`}>
      <span className="font-display text-3xl leading-none tracking-tight text-[#171614] sm:text-4xl">{value}</span>
      <span className="mt-2 text-xs font-medium text-[#77736d]">{label}</span>
    </div>
  )
}

export default function DashboardHero({
  user,
  committeesCount,
  passesCount,
  profileCompleteness,
  isSubscribed,
  onOpenSubscription,
  currentRoleView,
  onToggleRoleView,
  onCreateCommittee,
  onCreateEvent,
  onOpenCommandPalette,
  onNavigate,
}) {
  const fullName = user?.fullName || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.name || 'Your profile'
  const isLead = user?.role === 'lead' || user?.role === 'committee'
  const avatar = user?.avatarUrl || user?.avatar_url || user?.profile_image || user?.avatar
  const initials = fullName.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U'

  return (
    <section className="overflow-hidden border border-[#ded8cf] bg-[#fcfbf8]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,.66fr)_210px]">
        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#65615b]">
                <span className="size-1.5 rounded-full bg-[#ef6b3b]" />
                {isLead ? 'Member workspace' : 'Student overview'}
              </span>
              <button
                type="button"
                onClick={onOpenSubscription}
                className={`inline-flex min-h-7 items-center gap-1.5 text-xs font-medium transition-colors ${
                  isSubscribed
                    ? 'text-[#a9431e]'
                    : 'text-[#65615b] hover:text-[#171614]'
                }`}
              >
                <Crown size={14} />
                {isSubscribed ? 'Council Pro active' : `${committeesCount}/5 free committees · Upgrade`}
              </button>
            </div>

            <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] tracking-[-.03em] text-[#171614]">
              Your committees<br />and events
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#65615b] sm:text-base">
              Manage your campus groups and keep your event passes close.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onCreateCommittee}
              className="inline-flex min-h-11 items-center gap-2 bg-[#171614] px-4 text-xs font-semibold text-white transition hover:bg-[#38332f]"
            >
              <Plus size={15} /> Create committee
            </button>
            <button
              type="button"
              onClick={onCreateEvent}
              className="inline-flex min-h-11 items-center gap-2 border border-[#ded8cf] bg-white px-4 text-xs font-semibold text-[#171614] transition hover:border-[#ef6b3b]"
            >
              <CalendarDays size={15} /> Publish event
            </button>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open quick search"
              className="grid size-11 place-items-center border border-[#ded8cf] bg-white text-[#65615b] transition hover:border-[#ef6b3b] hover:text-[#171614]"
            >
              <Search size={15} />
            </button>
          </div>

          {isLead && (
            <div className="mt-6 flex w-fit items-center gap-1 border border-[#ded8cf] bg-white p-1">
              {['student', 'lead'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => onToggleRoleView(view)}
                  aria-pressed={currentRoleView === view}
              className={`min-h-8 px-3 text-xs font-medium transition-colors ${
                    currentRoleView === view ? 'bg-[#ef6b3b] text-white' : 'text-[#65615b] hover:text-[#171614]'
                  }`}
                >
                  {view === 'lead' ? 'Committee' : 'Student'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden min-h-[300px] overflow-hidden border-x border-[#ded8cf] bg-[#eeeae3] lg:flex lg:flex-col lg:justify-between lg:p-6">
          <p className="text-xs font-medium text-[#65615b]">Your profile</p>
          <div className="mx-auto grid size-36 place-items-center overflow-hidden rounded-full border-4 border-[#fcfbf8] bg-[#d9d1c6]">
            {avatar ? (
              <img src={avatar} alt={`${fullName} profile`} className="size-full object-cover" />
            ) : (
              <span className="font-display text-5xl text-[#a9431e]">{initials}</span>
            )}
          </div>
          <div className="flex items-end justify-between gap-2 border-t border-[#cfc8bd] pt-4">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-[#171614]">{fullName}</p>
              <p className="mt-0.5 truncate text-[10px] text-[#65615b]">{user?.college || user?.dept || (isLead ? 'Committee lead' : 'Student member')}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('/profile')}
              aria-label="Edit profile"
              className="grid size-8 shrink-0 place-items-center border border-[#cfc8bd] text-[#171614] transition hover:bg-[#ef6b3b] hover:text-white"
            >
              <ArrowDownRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-[#ded8cf] sm:grid-cols-3 lg:grid-cols-1 lg:border-t-0">
          <Metric value={committeesCount} label="Committees" />
          <Metric value={passesCount} label="Event passes" />
          <Metric value={`${profileCompleteness}%`} label="Profile complete" last />
        </div>
      </div>
    </section>
  )
}
