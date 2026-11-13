import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from 'lucide-react'
import PostComments from './PostComments'

export default function CommunityPostCard({
  post,
  currentUser,
  onUpvote,
  onAddComment,
  onShare,
}) {
  const [showComments, setShowComments] = useState(true)
  const isUpvoted = post.isUpvoted

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#e9ecef] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#cbd5e1]">
      {/* ── 1. Author Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="size-10 rounded-full object-cover shadow-sm ring-1 ring-black/5"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#0f172a] hover:text-[#2563eb] cursor-pointer">
                {post.author?.name}
              </h3>
            </div>
            <p className="flex items-center gap-1 text-[11px] text-[#94a3b8]">
              <span className="font-medium text-[#64748b]">{post.author?.location}</span>
              <span>•</span>
              <span>{post.author?.time}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="grid size-8 place-items-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* ── 2. Post Content Text ── */}
      <div className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[#1e293b]">
        <p className="whitespace-pre-line">{post.content}</p>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-semibold text-[#2563eb]">
            {post.tags.map((tag) => (
              <span key={tag} className="hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Media Gallery Grid (If photos attached) ── */}
      {post.media && post.media.length > 0 && (
        <div className={`mt-3.5 grid gap-2 overflow-hidden rounded-2xl ${
          post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {post.media.map((imgUrl, idx) => (
            <div key={idx} className="relative h-52 sm:h-60 overflow-hidden bg-black/5">
              <img
                src={imgUrl}
                alt="Post attachment"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── 4. Interaction Bar (Upvote Pill, Comments, Share) ── */}
      <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3 text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          {/* Upvote Pill (▲ 4,124 ▼) */}
          <div
            onClick={() => onUpvote?.(post.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold cursor-pointer transition-all ${
              isUpvoted
                ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]'
                : 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
            }`}
          >
            <ChevronUp size={14} className={isUpvoted ? 'text-[#2563eb]' : ''} />
            <span className="font-mono text-xs font-semibold">
              {(post.upvotes || 0).toLocaleString()}
            </span>
            <ChevronDown size={14} className="text-[#94a3b8]" />
          </div>

          {/* Comments Pill */}
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition"
          >
            <MessageCircle size={14} />
            <span>{post.comments?.length || post.commentsCount || 0} Comments</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => onShare?.(post)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ── 5. Embedded Comments Thread ── */}
      {showComments && (
        <PostComments
          comments={post.comments || []}
          currentUser={currentUser}
          onAddComment={(text) => onAddComment?.(post.id, text)}
        />
      )}
    </article>
  )
}

