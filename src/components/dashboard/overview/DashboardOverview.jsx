import { motion, useReducedMotion } from 'motion/react'
import { useMe, useMyApplications, useMyCommittees, useMyPasses, useUpcoming, useVerifiedRecord, getProfileCompletion } from '../../../hooks/useDashboardData'
import { useOpenCreateCommittee } from './DashboardShell'
import ApplicationsPanel from './ApplicationsPanel'
import CommitteesPanel from './CommitteesPanel'
import { DashboardPanel } from './DashboardPanel'
import FirstTimePanel from './FirstTimePanel'
import PassesPanel from './PassesPanel'
import ProfileCompletionPanel from './ProfileCompletionPanel'
import ProfileHeader from './ProfileHeader'
import StatsStrip from './StatsStrip'
import UpcomingPanel from './UpcomingPanel'
import VerifiedRecordPanel from './VerifiedRecordPanel'

const reveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export default function DashboardOverview({ user, onNavigate, onOpenSearch, onOpenNotifications, onSignOut, onToast }) {
  const reduceMotion = useReducedMotion()
  const openCreateCommittee = useOpenCreateCommittee()

  const meQuery = useMe(user)
  const committeesQuery = useMyCommittees(user)
  const applicationsQuery = useMyApplications(user)
  const passesQuery = useMyPasses(user)
  const verifiedQuery = useVerifiedRecord(user)
  const upcomingQuery = useUpcoming(user)

  const committees = committeesQuery.data || { owned: [], joined: [], all: [] }
  const applications = applicationsQuery.data || []
  const passes = passesQuery.data || []
  const verified = verifiedQuery.data || []
  const profile = getProfileCompletion(meQuery.data)
  const loadingMain = committeesQuery.isPending || upcomingQuery.isPending
  const isFirstTime = !loadingMain && committeesQuery.isSuccess && upcomingQuery.isSuccess && committees.all.length === 0 && upcomingQuery.data.length === 0

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-12 pt-6 sm:px-6">
      <motion.div variants={reveal} initial="hidden" animate="show" className="space-y-6">
        <ProfileHeader user={meQuery.data} onNavigate={onNavigate} reduceMotion={reduceMotion} />
            {committeesQuery.isPending || verifiedQuery.isPending || passesQuery.isPending || meQuery.isPending ? (
              <div className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[#e4e6da] bg-white min-[900px]:grid-cols-4" aria-label="Loading profile statistics" aria-busy="true">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[102px] border-b border-r border-[#e4e6da] p-5 last:border-r-0"><div className="h-3 w-20 animate-pulse rounded bg-[#f6f7f0] motion-reduce:animate-none" /><div className="mt-4 h-6 w-12 animate-pulse rounded bg-[#f6f7f0] motion-reduce:animate-none" /></div>)}
              </div>
            ) : committeesQuery.isError || verifiedQuery.isError || passesQuery.isError ? (
              <DashboardPanel id="stats-error" title="Profile statistics"><p className="p-5 text-sm text-[#5e6355]">Some profile counts could not be loaded. Retry the affected sections below.</p></DashboardPanel>
            ) : (
              <StatsStrip committees={committees} verifiedRoles={verified.filter((record) => record.role && record.verified === true || record.role && record.is_verified === true || record.role && String(record.status || '').toLowerCase() === 'verified')} passes={passes} profile={profile} reduceMotion={reduceMotion} />
            )}

            <div className="grid min-w-0 grid-cols-1 items-start gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_320px] sm:gap-6">
              <div className="min-w-0 space-y-5 sm:space-y-6">
                {isFirstTime ? (
                  <FirstTimePanel onCreateCommittee={openCreateCommittee} reduceMotion={reduceMotion} />
                ) : (
                  <>
                    <CommitteesPanel query={committeesQuery} onNavigate={onNavigate} onCreateCommittee={openCreateCommittee} />
                    <ApplicationsPanel query={applicationsQuery} onNavigate={onNavigate} />
                    <VerifiedRecordPanel query={verifiedQuery} onNavigate={onNavigate} />
                  </>
                )}
              </div>
              <aside aria-label="Profile details" className="min-w-0 space-y-5 sm:space-y-6">
                <ProfileCompletionPanel query={meQuery} profile={profile} />
                <UpcomingPanel query={upcomingQuery} onNavigate={onNavigate} />
                <PassesPanel query={passesQuery} onNavigate={onNavigate} />
              </aside>
            </div>
          </motion.div>
    </div>
  )
}
