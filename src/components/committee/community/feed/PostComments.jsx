import { useState } from 'react'
import { CornerDownRight, Send, ThumbsUp } from 'lucide-react'

export default function PostComments({
  comments = [],
  currentUser,
  onAddComment,
  onToggleLike,
}) {
  const [commentText, setCommentText] = useState('')
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment?.(commentText.trim())
    setCommentText('')
  }

  const visibleComments = expanded ? comments : comments.slice(0, 2)

  return (
    <div className="mt-4 border-t border-[#f1f5f9] pt-4">
      {/* ── 1. Write Comment Input Row ── */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <img
          src={
            currentUser?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
          }
          alt="You"
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <div className="relative flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-10 w-full rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-4 pr-10 text-xs font-medium text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-xl bg-[#2563eb] text-white disabled:opacity-40 transition"
          >
            <Send size={12} />
          </button>
        </div>
      </form>

      {/* ── 2. Comments Thread List ── */}
      <div className="mt-4 space-y-3">
        {visibleComments.map((com) => (
          <div key={com.id} className="space-y-2">
            {/* Top Comment */}
            <div className="flex items-start gap-2.5">
              <img
                src={com.author?.avatar}
                alt={com.author?.name}
                className="size-7 shrink-0 rounded-full object-cover mt-0.5"
              />
              <div className="flex-1 rounded-2xl bg-[#f8fafc] p-3 text-xs border border-[#f1f5f9]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0f172a]">{com.author?.name}</span>
                  <span className="text-[10px] text-[#94a3b8]">{com.author?.time}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#334155]">{com.text}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-[#64748b]">
                  <button
                    type="button"
                    onClick={() => onToggleLike?.(com.id)}
                    className="flex items-center gap-1 hover:text-[#2563eb] transition-colors"
                  >
                    <ThumbsUp size={11} className={com.isLiked ? 'fill-current text-[#2563eb]' : ''} />
                    <span>{com.likes || 12}</span>
                  </button>
                  <button type="button" className="hover:text-[#2563eb] transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Replies */}
            {com.replies?.map((rep) => (
              <div key={rep.id} className="ml-8 flex items-start gap-2.5">
                <CornerDownRight size={13} className="text-[#cbd5e1] mt-2 shrink-0" />
                <img
                  src={rep.author?.avatar}
                  alt={rep.author?.name}
                  className="size-6 shrink-0 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 rounded-2xl bg-white p-2.5 text-xs border border-[#e2e8f0] shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0f172a]">{rep.author?.name}</span>
                    <span className="text-[10px] text-[#94a3b8]">{rep.author?.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#334155]">{rep.text}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] font-semibold text-[#64748b]">
                    <span className="flex items-center gap-1 text-[#2563eb]">
                      <ThumbsUp size={10} className="fill-current" />
                      <span>{rep.likes || 12}</span>
                    </span>
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* View All Comments Pill Button */}
        {comments.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 block w-full rounded-2xl bg-[#eff6ff] py-2 text-center text-xs font-bold text-[#2563eb] transition hover:bg-[#dbeafe]"
          >
            {expanded ? 'Collapse Comments' : `View All Comments (${comments.length})`}
          </button>
        )}
      </div>
    </div>
  )
}

