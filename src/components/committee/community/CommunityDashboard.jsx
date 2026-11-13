import { useMemo, useState } from 'react'
import CommunityTopBar from './topbar/CommunityTopBar'
import CommunityLeftSidebar from './sidebar/CommunityLeftSidebar'
import CommunityFeed from './feed/CommunityFeed'
import CommunityRightSidebar from './widgets/CommunityRightSidebar'
import { getInitialCommunityData } from '../../../config/committeeData/communityPostsData'

export default function CommunityDashboard({
  committee,
  currentUser,
  viewMode = 'community',
  onToggleViewMode,
  onNavigate,
  onToast,
}) {
  const initialData = useMemo(
    () => getInitialCommunityData(committee?.slug || 'artikon'),
    [committee?.slug]
  )

  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [posts, setPosts] = useState(initialData.posts)

  // Profile data merged with current logged in user
  const profile = useMemo(() => {
    return {
      name: currentUser?.fullName || currentUser?.name || committee?.name || 'Salahudin Jafar',
      handle: currentUser?.username || committee?.handle || 'salahjafar20',
      role: currentUser?.role || 'Core Member & Designer',
      avatar:
        currentUser?.avatar ||
        initialData.currentUserProfile.avatar,
      cover: committee?.cover || initialData.currentUserProfile.cover,
      verified: true,
      stats: {
        posts: posts.length,
        followers: `${committee?.stats?.members || 34}+`,
        following: 12,
      },
    }
  }, [currentUser, committee, posts.length, initialData])

  // Filter posts based on search query or selected channel/domain
  const filteredPosts = useMemo(() => {
    let result = posts
    if (activeFilter && activeFilter !== 'All') {
      const q = activeFilter.toLowerCase().replace(/[^a-z0-9]/g, '')
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [posts, activeFilter, searchQuery])

  // Post Actions
  const handlePublishPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
    onToast?.('Post published to committee community!')
  }

  const handleUpvote = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isUpvoted = !p.isUpvoted
          return {
            ...p,
            isUpvoted,
            upvotes: isUpvoted ? (p.upvotes || 0) + 1 : Math.max(0, (p.upvotes || 0) - 1),
          }
        }
        return p
      })
    )
  }

  const handleAddComment = (postId, commentText) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            author: {
              name: currentUser?.fullName || currentUser?.name || 'You',
              avatar:
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
              time: 'Just now',
            },
            text: commentText,
            likes: 1,
            isLiked: true,
            replies: [],
          }
          return {
            ...p,
            comments: [newComment, ...(p.comments || [])],
            commentsCount: (p.commentsCount || 0) + 1,
          }
        }
        return p
      })
    )
    onToast?.('Comment added!')
  }

  const handleShare = (post) => {
    navigator.clipboard?.writeText(window.location.href)
    onToast?.('Post link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#0f172a]">
      {/* ── 1. Top App Bar ── */}
      <CommunityTopBar
        committee={committee}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={profile}
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
        onNavigate={onNavigate}
      />

      {/* ── 2. Master 3-Column Community Layout ── */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ── LEFT COLUMN (Channels, Favourites, Following) ── */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <CommunityLeftSidebar
                channels={initialData.channels}
                communities={initialData.communities}
                following={initialData.followingList}
                activeFilter={activeFilter}
                onSelectFilter={(name) => {
                  setActiveFilter((prev) => (prev === name ? 'All' : name))
                }}
              />
            </div>
          </div>

          {/* ── CENTER COLUMN (Main Feed / Activity Stream) ── */}
          <div className="lg:col-span-6">
            <CommunityFeed
              posts={filteredPosts}
              currentUser={profile}
              committee={committee}
              onPublishPost={handlePublishPost}
              onUpvote={handleUpvote}
              onAddComment={handleAddComment}
              onShare={handleShare}
            />
          </div>

          {/* ── RIGHT COLUMN (Profile Widget, Recommendations, Topics) ── */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <CommunityRightSidebar
                banner={initialData.banner}
                profile={profile}
                recommendations={initialData.recommendations}
                topics={initialData.topics}
                onOpenCreatePost={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                onConnectMember={(id) => onToast?.('Connected with student!')}
                onSelectTopic={(topic) => {
                  setActiveFilter(topic)
                  onToast?.(`Filtered by ${topic}`)
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

