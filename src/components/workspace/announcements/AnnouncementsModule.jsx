import { useState } from 'react'
import {
  Check,
  CheckCircle,
  Eye,
  Heart,
  MessageSquare,
  Pin,
  Plus,
  Rocket,
  Send,
  Smile,
  Sparkles,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react'
import CreateAnnouncementModal from './CreateAnnouncementModal'

const REACTION_TYPES = [
  { id: 'thumbs_up', label: '👍', name: 'Thumbs Up' },
  { id: 'heart', label: '❤️', name: 'Heart' },
  { id: 'rocket', label: '🚀', name: 'Rocket' },
  { id: 'clap', label: '👏', name: 'Clap' },
  { id: 'tada', label: '🎉', name: 'Celebration' },
]

export default function AnnouncementsModule({
  workspace,
  currentUserId,
  onCreateAnnouncement,
  onToggleReaction,
  onVotePoll,
  onAddComment,
  canPostAnnouncements = true,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [commentDrafts, setCommentDrafts] = useState({})
  const [activeCommentsId, setActiveCommentsId] = useState(null)
  const [viewingReceiptsId, setViewingReceiptsId] = useState(null)

  const announcements = workspace?.announcements || []
  const members = workspace?.members || []
  const roles = workspace?.roles || []

  // Sort: pinned first, then by createdAt desc
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })

  const getRoleNames = (roleIds) => {
    if (!Array.isArray(roleIds)) return 'All Members'
    return roleIds
      .map((id) => roles.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Selected Roles'
  }

  const handleCommentSubmit = (announcementId, e) => {
    e.preventDefault()
    const text = (commentDrafts[announcementId] || '').trim()
    if (!text) return

    onAddComment?.(announcementId, {
      id: `comm_${Date.now()}`,
      authorName: 'Current User',
      authorAvatar: null,
      content: text,
      createdAt: new Date().toISOString(),
    })

    setCommentDrafts((prev) => ({ ...prev, [announcementId]: '' }))
  }

  return (
    <div className="space-y-6">
      {/* Header action strip */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0d0f08]">
            Committee Feed & Announcements
          </h2>
          <p className="text-xs text-[#5e6355]">
            Official updates, pinned broadcasts, read receipts, and member polls.
          </p>
        </div>

        {canPostAnnouncements && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0d0f08] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#202419] transition"
          >
            <Plus size={15} />
            <span>Publish Update</span>
          </button>
        )}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {sortedAnnouncements.map((ann) => {
          const poll = ann.poll
          const totalPollVotes = poll?.options?.reduce((sum, o) => sum + (o.votes || 0), 0) || 0
          const hasVoted = poll?.voterIds?.includes(currentUserId)
          const reactions = ann.reactions || {}
          const comments = ann.comments || []
          const seenCount = (ann.seenBy || []).length

          return (
            <article
              key={ann.id}
              className={`rounded-[14px] border bg-[#ffffff] p-5 shadow-sm transition ${
                ann.pinned ? 'border-[#0d0f08]/30 ring-1 ring-[#0d0f08]/10' : 'border-[#e4e6da]'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f7f0] border border-[#e4e6da] font-semibold text-[#0d0f08] text-xs">
                    {ann.authorName ? ann.authorName.slice(0, 2).toUpperCase() : 'LE'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0d0f08]">
                        {ann.authorName || 'Committee Lead'}
                      </span>
                      {ann.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#d4ff1f] px-2 py-0.5 text-[10px] font-bold text-[#0d0f08]">
                          <Pin size={10} />
                          <span>PINNED</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8b907f]">
                      <span>
                        {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Today'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        <span>
                          {ann.audience === 'everyone'
                            ? 'All Members'
                            : getRoleNames(ann.audience)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read Receipts Count */}
                <button
                  type="button"
                  onClick={() => setViewingReceiptsId(viewingReceiptsId === ann.id ? null : ann.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1 text-[11px] font-semibold text-[#5e6355] hover:text-[#0d0f08]"
                  title="View members who opened this announcement"
                >
                  <Eye size={12} />
                  <span>Seen by {seenCount}</span>
                </button>
              </div>

              {/* Seen By Popover/Panel */}
              {viewingReceiptsId === ann.id && (
                <div className="my-3 rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#0d0f08]">
                      Read Receipts ({seenCount} members)
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewingReceiptsId(null)}
                      className="text-[#8b907f] hover:text-[#0d0f08]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  {ann.seenBy?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {ann.seenBy.map((uid) => {
                        const m = members.find((mem) => mem.id === uid)
                        return (
                          <span
                            key={uid}
                            className="rounded-full border border-[#e4e6da] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#5e6355]"
                          >
                            {m?.name || uid}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8b907f]">No read receipts recorded yet.</p>
                  )}
                </div>
              )}

              {/* Post Body */}
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-bold text-[#0d0f08]">{ann.title}</h3>
                <p className="text-xs leading-relaxed text-[#5e6355] whitespace-pre-wrap">
                  {ann.content}
                </p>
              </div>

              {/* Interactive Single-Question Poll */}
              {poll && (
                <div className="mt-4 rounded-[12px] border border-[#e4e6da] bg-[#fafaf5] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#0d0f08]">{poll.question}</h4>
                    <span className="text-[11px] font-semibold text-[#8b907f]">
                      {totalPollVotes} {totalPollVotes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {poll.options?.map((opt) => {
                      const percentage =
                        totalPollVotes > 0
                          ? Math.round(((opt.votes || 0) / totalPollVotes) * 100)
                          : 0

                      return (
                        <div
                          key={opt.id}
                          onClick={() => onVotePoll?.(ann.id, opt.id)}
                          className="relative cursor-pointer overflow-hidden rounded-[8px] border border-[#e4e6da] bg-[#ffffff] p-2.5 transition hover:border-[#0d0f08]"
                        >
                          {/* Percentage progress bar */}
                          <div
                            className="absolute inset-y-0 left-0 bg-[#d4ff1f]/35 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#0d0f08]">{opt.text}</span>
                            <span className="font-bold text-[#0d0f08]">{percentage}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Reactions Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f6f7f0] pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {REACTION_TYPES.map((type) => {
                    const count = reactions[type.id] || 0
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => onToggleReaction?.(ann.id, type.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                          count > 0
                            ? 'border-[#0d0f08] bg-[#0d0f08] text-white'
                            : 'border-[#e4e6da] bg-[#ffffff] text-[#5e6355] hover:bg-[#fafaf5]'
                        }`}
                      >
                        <span>{type.label}</span>
                        {count > 0 && <span className="font-bold text-[10px]">{count}</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Comment Counter Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentsId(activeCommentsId === ann.id ? null : ann.id)
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08]"
                >
                  <MessageSquare size={14} />
                  <span>
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                  </span>
                </button>
              </div>

              {/* Comments Thread Accordion */}
              {activeCommentsId === ann.id && (
                <div className="mt-4 space-y-3 border-t border-[#e4e6da] pt-4">
                  <div className="space-y-2">
                    {comments.map((comm) => (
                      <div
                        key={comm.id}
                        className="rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[#0d0f08]">
                            {comm.authorName}
                          </span>
                          <span className="text-[10px] text-[#8b907f]">
                            {new Date(comm.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[#5e6355]">{comm.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(ann.id, e)}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={commentDrafts[ann.id] || ''}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({
                          ...prev,
                          [ann.id]: e.target.value,
                        }))
                      }
                      placeholder="Reply to this announcement..."
                      className="flex-1 rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-[8px] bg-[#0d0f08] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#202419]"
                    >
                      <Send size={13} />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              )}
            </article>
          )
        })}

        {/* Designed Empty State */}
        {sortedAnnouncements.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e4e6da] bg-[#ffffff] p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fafaf5] text-[#5e6355] mb-3">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#0d0f08]">No announcements yet</h3>
            <p className="mt-1 max-w-sm text-xs text-[#5e6355]">
              Publish updates, meeting summaries, or polls to keep the committee synchronized.
            </p>
            {canPostAnnouncements && (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 rounded-[10px] bg-[#0d0f08] px-4 py-2 text-xs font-semibold text-white hover:bg-[#202419]"
              >
                Publish First Announcement
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        roles={roles}
        onCreateAnnouncement={onCreateAnnouncement}
      />
    </div>
  )
}

