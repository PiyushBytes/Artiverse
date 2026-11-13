import { useState } from 'react'
import { Check, Copy, Pencil, Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import { panelVariants } from './DashboardPanel'

function initialsFor(user) {
  const parts = [user?.first_name, user?.last_name].filter((value) => typeof value === 'string' && value.trim())
  if (parts.length) return parts.map((part) => part.trim()[0]).join('').slice(0, 2).toUpperCase()
  const name = typeof user?.fullName === 'string' && !user.fullName.includes('@') ? user.fullName : user?.name
  return typeof name === 'string' ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : ''
}

export default function ProfileHeader({ user, onNavigate, reduceMotion }) {
  const [copied, setCopied] = useState(false)
  const fullName = typeof user?.fullName === 'string' && !user.fullName.includes('@')
    ? user.fullName.trim()
    : [user?.first_name, user?.last_name].filter((value) => typeof value === 'string' && value.trim()).join(' ')
  const avatar = user?.avatar_url || user?.profile_image || user?.avatar || '/pictureb.webp'
  const verified = user?.is_verified === true || user?.verified === true
  const meta = [user?.course || user?.dept, user?.college].filter((value) => typeof value === 'string' && value.trim())
  const spotlightUrl = user?.spotlight_url || user?.public_profile_url

  const shareSpotlight = async () => {
    if (!spotlightUrl) return
    try {
      if (navigator.share) {
        await navigator.share({ url: spotlightUrl })
        return
      }
      await navigator.clipboard.writeText(spotlightUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      if (error?.name !== 'AbortError') setCopied(false)
    }
  }

  return (
    <motion.section variants={panelVariants(reduceMotion)} className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Profile overview">
      <div className="flex min-w-0 items-center gap-4">
        {(avatar || initialsFor(user)) && (
          <div className="grid size-[72px] shrink-0 place-items-center overflow-hidden rounded-full border border-[#e4e6da] bg-white sm:size-20">
            {avatar ? (
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              <span aria-hidden="true" className="font-sans text-lg font-semibold text-[#0d0f08]">{initialsFor(user)}</span>
            )}
          </div>
        )}
        <div className="min-w-0">
          <h1 className={`truncate text-[30px] font-semibold leading-tight text-[#0d0f08] ${fullName ? 'font-display' : 'font-sans'}`}>{fullName || 'Overview'}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {verified && (
              <span className="inline-flex min-h-6 items-center gap-1.5 rounded-full bg-[#d4ff1f] px-2.5 text-xs font-medium text-[#0d0f08]">
                <Check size={14} strokeWidth={1.6} /> Verified student
              </span>
            )}
            {meta.length > 0 && <p className="text-xs leading-5 text-[#5e6355]">{meta.join(' · ')}</p>}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {spotlightUrl && (
          <button type="button" onClick={shareSpotlight} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[#e4e6da] bg-white px-3.5 text-xs font-medium text-[#0d0f08] transition-colors hover:bg-[#f6f7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
            {copied ? <Copy size={16} strokeWidth={1.6} /> : <Share2 size={16} strokeWidth={1.6} />}
            {copied ? 'Link copied' : 'Share Spotlight'}
          </button>
        )}
        <button type="button" onClick={() => onNavigate('/profile')} className="inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-[#0d0f08] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
          <Pencil size={15} strokeWidth={1.6} /> Edit profile
        </button>
      </div>
    </motion.section>
  )
}
