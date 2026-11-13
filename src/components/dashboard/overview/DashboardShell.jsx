import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useMyApplications } from '../../../hooks/useDashboardData'
import CreateCommitteeWizard from '../CreateCommitteeWizard'
import DashboardIconRail from './DashboardIconRail'

const DashboardActionsContext = createContext(() => {})

export function useOpenCreateCommittee() {
  return useContext(DashboardActionsContext)
}

export default function DashboardShell({
  user,
  sectionTitle,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onSignOut,
  onToast,
  children,
}) {
  const [createCommitteeOpen, setCreateCommitteeOpen] = useState(false)
  const applicationsQuery = useMyApplications(user)
  const queryClient = useQueryClient()
  const openCreateCommittee = useCallback(() => setCreateCommitteeOpen(true), [])

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('artiverse_current_user')
      localStorage.removeItem('artiverse_auth_tokens')
      onNavigate('/login')
    }
    window.addEventListener('artiverse:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('artiverse:unauthorized', handleUnauthorized)
  }, [onNavigate])

  const handleCommitteeCreated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'committees'] })
    setCreateCommitteeOpen(false)
    onToast?.('Committee created.')
  }, [onToast, queryClient])

  return (
    <DashboardActionsContext.Provider value={openCreateCommittee}>
      <div className="relative min-h-screen bg-[#fafaf5] text-[#0d0f08]">
        {/* ── Left Side Icon-Only Navigation Rail ── */}
        <DashboardIconRail
          applicationCount={applicationsQuery.data?.length || 0}
          onNavigate={onNavigate}
        />

        {/* ── Main Content Offset to fit beside 68px Icon Rail ── */}
        <main id="main-content" className="w-full min-[900px]:pl-[68px]">
          {children}
        </main>

        <CreateCommitteeWizard
          isOpen={createCommitteeOpen}
          onClose={() => setCreateCommitteeOpen(false)}
          onCreated={handleCommitteeCreated}
          onToast={onToast}
        />
      </div>
    </DashboardActionsContext.Provider>
  )
}
