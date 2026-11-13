import { useMemo } from 'react'
import { getCommitteeBySlug } from '../config/committeeData'
import CommunityDashboard from '../components/committee/community/CommunityDashboard'

export default function CommitteePublicPage({
  slug = 'artikon',
  currentUser,
  onNavigate,
  onToast,
}) {
  const committee = useMemo(() => getCommitteeBySlug(slug), [slug])

  return (
    <CommunityDashboard
      committee={committee}
      currentUser={currentUser}
      onNavigate={onNavigate}
      onToast={onToast}
    />
  )
}
