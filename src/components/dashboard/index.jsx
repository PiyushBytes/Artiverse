import DashboardOverview from './overview/DashboardOverview'

export default function Dashboard({ currentUser, onNavigate, onToast, onOpenSearch, onOpenNotifications, onSignOut }) {
  return <DashboardOverview user={currentUser} onNavigate={onNavigate} onToast={onToast} onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} onSignOut={onSignOut} />
}
