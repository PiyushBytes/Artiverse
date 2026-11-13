import CommitteeProfileWidget from './CommitteeProfileWidget'
import MemberRecommendations from './MemberRecommendations'
import TopicsWidget from './TopicsWidget'

export default function CommunityRightSidebar({
  banner,
  profile,
  recommendations = [],
  topics = [],
  onOpenCreatePost,
  onConnectMember,
  onSelectTopic,
}) {
  return (
    <aside className="w-full space-y-4">
      {/* ── 1. Top Highlight / Visitor Strip ── */}
      {banner && (
        <div className="flex items-center gap-2.5 rounded-[20px] bg-gradient-to-r from-[#dbeafe] via-[#eff6ff] to-[#f8fafc] px-4 py-3 text-xs font-bold text-[#1e40af] border border-[#bfdbfe]/60 shadow-sm">
          <span className="grid size-6 place-items-center rounded-lg bg-[#2563eb] text-white text-xs">
            👑
          </span>
          <span className="truncate">{banner.text}</span>
        </div>
      )}

      {/* ── 2. Member / Identity Profile Card ── */}
      <CommitteeProfileWidget
        profile={profile}
        onOpenCreatePost={onOpenCreatePost}
      />

      {/* ── 3. Recommendations Widget ── */}
      <MemberRecommendations
        recommendations={recommendations}
        onConnect={onConnectMember}
      />

      {/* ── 4. Topics You Follow ── */}
      <TopicsWidget
        topics={topics}
        onSelectTopic={onSelectTopic}
      />
    </aside>
  )
}

