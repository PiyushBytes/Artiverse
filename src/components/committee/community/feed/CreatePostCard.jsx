import { useState } from 'react'
import {
  Image as ImageIcon,
  Send,
} from 'lucide-react'

export default function CreatePostCard({ currentUser, committee, onPublishPost }) {
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [showMediaInput, setShowMediaInput] = useState(false)
  const [selectedTag, setSelectedTag] = useState('#DesignSprint')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    onPublishPost?.({
      id: `post_${Date.now()}`,
      author: {
        name: currentUser?.fullName || currentUser?.name || 'Salahudin Jafar',
        role: currentUser?.role || 'Core Member',
        location: `${committee?.college || 'MSIT'} • Just now`,
        avatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        time: 'Just now',
      },
      content: content.trim(),
      tags: [selectedTag, `#${committee?.slug || 'artikon'}`],
      upvotes: 1,
      isUpvoted: true,
      commentsCount: 0,
      sharesCount: 0,
      media: mediaUrl ? [mediaUrl] : [],
      comments: [],
    })

    setContent('')
    setMediaUrl('')
    setShowMediaInput(false)
  }

  return (
    <div className="rounded-[24px] border border-[#e9ecef] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
            }
            alt="You"
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share an update, design, or question with @${committee?.handle || 'community'}...`}
              className="w-full resize-none text-xs sm:text-sm font-medium text-[#0f172a] placeholder-[#94a3b8] outline-none"
            />

            {showMediaInput && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Paste image / design preview URL..."
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#0f172a] outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer controls: Attachments & Post Button */}
        <div className="mt-3 flex items-center justify-between border-t border-[#f1f5f9] pt-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowMediaInput((prev) => !prev)}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
            >
              <ImageIcon size={14} className="text-[#2563eb]" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextTags = ['#DesignSprint', '#3DBlender', '#Photography', '#Announcement']
                const next = nextTags[(nextTags.indexOf(selectedTag) + 1) % nextTags.length]
                setSelectedTag(next)
              }}
              className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-bold text-[#2563eb] hover:bg-[#e2e8f0] transition"
            >
              {selectedTag}
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#2563eb] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={13} />
            <span>Create Post</span>
          </button>
        </div>
      </form>
    </div>
  )
}

