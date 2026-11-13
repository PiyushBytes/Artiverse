import { useState } from 'react'
import { Check, GraduationCap, Mail, Phone, Save, UserRound } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

function getInitials(name) {
  return typeof name === 'string'
    ? name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : ''
}

const labelClass = 'mb-1.5 block text-[12px] font-medium text-[#5e6355]'
const fieldClass = 'min-h-10 w-full rounded-[10px] border border-[#e4e6da] bg-white px-3.5 py-2.5 text-[13px] text-[#0d0f08] outline-none transition-colors placeholder:text-[#8b907f] focus-visible:border-[#0d0f08] focus-visible:ring-2 focus-visible:ring-[#0d0f08]/10'

export default function ProfilePage({ currentUser, onSignOut, onToast }) {
  const reduceMotion = useReducedMotion()
  const displayName = currentUser?.fullName || [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ')
  const [fullName, setFullName] = useState(displayName || '')
  const [email] = useState(currentUser?.email || '')
  const [phone, setPhone] = useState(currentUser?.phone_number || '')
  const [department, setDepartment] = useState(currentUser?.dept || '')
  const [year, setYear] = useState(currentUser?.year || '')
  const [bio, setBio] = useState(currentUser?.bio || '')
  const [portfolio, setPortfolio] = useState(currentUser?.portfolio || '')
  const avatar = currentUser?.avatar_url || currentUser?.profile_image || currentUser?.avatar || '/pictureb.webp'
  const verified = currentUser?.is_verified === true || currentUser?.verified === true

  const handleSave = (event) => {
    event.preventDefault()
    const updated = {
      ...(currentUser || {}),
      fullName: fullName.trim(),
      phone_number: phone.trim(),
      dept: department.trim(),
      year,
      bio: bio.trim(),
      portfolio: portfolio.trim(),
    }
    localStorage.setItem('artiverse_current_user', JSON.stringify(updated))
    onToast?.('Profile updated successfully.')
  }

  return (
    <section className="min-h-screen bg-[#fafaf5] px-4 pb-14 pt-8 text-[#0d0f08] sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-[960px]">
        <header className="flex flex-col gap-4 border-b border-[#e4e6da] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-[#5e6355]">
              <UserRound size={16} strokeWidth={1.6} /> User profile
            </p>
            <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-.02em] sm:text-[30px]">Account &amp; profile</h1>
          </div>
          {verified && (
            <span className="inline-flex min-h-7 w-fit items-center gap-1.5 rounded-full bg-[#d4ff1f] px-3 text-xs font-medium text-[#0d0f08]">
              <Check size={14} strokeWidth={1.8} /> Verified student
            </span>
          )}
        </header>

        <motion.form
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          onSubmit={handleSave}
          className="mt-6 rounded-[14px] border border-[#e4e6da] bg-white p-4 sm:p-7"
        >
          <div className="flex min-w-0 items-center gap-4 border-b border-[#e4e6da] pb-5">
            {avatar ? (
              <img src={avatar} alt="" className="size-14 shrink-0 rounded-full border border-[#e4e6da] object-cover sm:size-16" />
            ) : (
              getInitials(fullName) && <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full border border-[#e4e6da] bg-[#fafaf5] text-sm font-semibold text-[#0d0f08] sm:size-16">{getInitials(fullName)}</span>
            )}
            <div className="min-w-0">
              {fullName && <h2 className="truncate font-display text-[22px] font-semibold leading-tight sm:text-[26px]">{fullName}</h2>}
              {email && <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-[#5e6355]"><Mail size={14} className="shrink-0" />{email}</p>}
              {currentUser?.college && <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-[#8b907f]"><GraduationCap size={14} className="shrink-0" />{currentUser.college}</p>}
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-4 pt-5 sm:grid-cols-2">
            <div>
              <label htmlFor="full_name" className={labelClass}>Full name</label>
              <input id="full_name" type="text" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} className={fieldClass} />
            </div>

            {email && (
              <div>
                <label htmlFor="email" className={labelClass}>Registered email</label>
                <input id="email" type="email" autoComplete="email" value={email} readOnly className={`${fieldClass} cursor-not-allowed bg-[#f6f7f0] text-[#5e6355]`} />
              </div>
            )}

            <div>
              <label htmlFor="phone_number" className={labelClass}>Mobile number</label>
              <input id="phone_number" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} />
            </div>

            <div>
              <label htmlFor="year" className={labelClass}>Year of study</label>
              <select id="year" value={year} onChange={(event) => setYear(event.target.value)} className={fieldClass}>
                <option value="">Select your year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className={labelClass}>Department / stream</label>
              <input id="department" type="text" value={department} onChange={(event) => setDepartment(event.target.value)} className={fieldClass} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bio" className={labelClass}>Bio / interests</label>
              <textarea id="bio" rows={3} value={bio} onChange={(event) => setBio(event.target.value)} className={`${fieldClass} resize-y`} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="portfolio" className={labelClass}>Portfolio link</label>
              <input id="portfolio" type="url" value={portfolio} onChange={(event) => setPortfolio(event.target.value)} className={fieldClass} />
            </div>
          </div>

          <footer className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e4e6da] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={onSignOut} className="min-h-9 w-fit rounded-[10px] px-2 text-xs font-medium text-[#5e6355] transition-colors hover:bg-[#f6f7f0] hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08]">Sign out</button>
            <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-[#0d0f08] px-4 text-xs font-medium text-white transition-colors hover:bg-[#282b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08]">
              <Save size={15} strokeWidth={1.6} /> Save changes
            </button>
          </footer>
        </motion.form>
      </div>
    </section>
  )
}
