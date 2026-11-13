import { Sparkles } from 'lucide-react'
import CreatePostCard from './CreatePostCard'
import CommunityPostCard from './CommunityPostCard'

export default function CommunityFeed({
  posts = [],
  currentUser,
  committee,
  onPublishPost,
  onUpvote,
  onAddComment,
  onShare,
}) {
  return (
    <div className="space-y-4">
      {/* ── Top Create Post Box ── */}
      <CreatePostCard
        currentUser={currentUser}
        committee={committee}
        onPublishPost={onPublishPost}
      />

      {/* ── Posts Stream ── */}
      <div className="space-y-4">
        {posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onUpvote={onUpvote}
            onAddComment={onAddComment}
            onShare={onShare}
          />
        ))}

        {posts.length === 0 && (
          <div className="rounded-[24px] border border-[#e9ecef] bg-white p-8 text-center text-[#64748b]">
            <Sparkles size={28} className="mx-auto text-[#94a3b8]" />
            <h4 className="mt-2 text-sm font-bold text-[#0f172a]">No posts found in this stream</h4>
            <p className="mt-1 text-xs">Be the first to share an update with the committee!</p>
          </div>
        )}
      </div>
    </div>
  )
}

