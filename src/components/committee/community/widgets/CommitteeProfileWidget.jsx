import { CheckCircle2, Edit3 } from 'lucide-react'

export default function CommitteeProfileWidget({ profile, onOpenCreatePost }) {
  if (!profile) return null

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e9ecef] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* ── Cover Image ── */}
      <div className="relative h-20 w-full overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900">
        {profile.cover && (
          <img
            src={profile.cover}
            alt="Cover"
            className="h-full w-full object-cover opacity-80"
          />
        )}
      </div>

      {/* ── Avatar & Identity ── */}
      <div className="relative px-5 pb-5 pt-0 text-center">
        {/* Overlapping Avatar */}
        <div className="-mt-10 mx-auto relative inline-block">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-16 rounded-2xl object-cover ring-4 ring-white shadow-md mx-auto"
          />
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-center gap-1">
            <h3 className="font-bold text-sm text-[#0f172a]">{profile.name}</h3>
            {profile.verified && (
              <CheckCircle2 size={13} className="text-[#2563eb] fill-current" />
            )}
          </div>
          <p className="font-mono text-xs text-[#94a3b8]">@{profile.handle}</p>
        </div>

        {/* ── 3-Column Stats ── */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[#f1f5f9] py-3 text-center">
          <div>
            <span className="block font-display text-base font-bold text-[#0f172a]">
              {profile.stats?.posts || 201}
            </span>
            <span className="block text-[10px] font-semibold text-[#94a3b8] uppercase">
              Posts
            </span>
          </div>
          <div>
            <span className="block font-display text-base font-bold text-[#0f172a]">
              {profile.stats?.followers || '11.2K'}
            </span>
            <span className="block text-[10px] font-semibold text-[#94a3b8] uppercase">
              Followers
            </span>
          </div>
          <div>
            <span className="block font-display text-base font-bold text-[#0f172a]">
              {profile.stats?.following || 501}
            </span>
            <span className="block text-[10px] font-semibold text-[#94a3b8] uppercase">
              Following
            </span>
          </div>
        </div>

        {/* ── Primary Action Button ── */}
        <button
          type="button"
          onClick={onOpenCreatePost}
          className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#1d4ed8]"
        >
          <Edit3 size={14} />
          <span>Create Post</span>
        </button>
      </div>
    </div>
  )
}

