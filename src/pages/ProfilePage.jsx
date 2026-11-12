import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function ProfilePage({ currentUser, onSignOut, onToast }) {
  const reduceMotion = useReducedMotion()

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Aarav Sharma')
  const [email] = useState(currentUser?.email || 'aarav.sharma@msit.edu')
  const [phone, setPhone] = useState(currentUser?.phone_number || '9876543210')
  const [department, setDepartment] = useState(currentUser?.dept || 'Computer Science & Engineering')
  const [year, setYear] = useState(currentUser?.year || '2nd Year')
  const [bio, setBio] = useState(currentUser?.bio || 'UI Designer & creative tech enthusiast at MSIT.')
  const [portfolio, setPortfolio] = useState(currentUser?.portfolio || 'https://bento.me/aarav')

  const role = currentUser?.role || 'student'
  const isLead = role === 'lead' || role === 'committee'

  const handleSave = (e) => {
    e.preventDefault()
    const updated = {
      ...(currentUser || {}),
      fullName,
      phone_number: phone,
      dept: department,
      year,
      bio,
      portfolio,
    }
    localStorage.setItem('artiverse_current_user', JSON.stringify(updated))
    onToast?.('Profile updated successfully!')
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#e4e6da] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
              <User size={13} className="text-[#839b3d]" />
              <span>User Profile</span>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0d0f08]">
              Account & Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isLead
                  ? 'bg-[#d4ff1f] text-[#0d0f08] shadow-sm'
                  : 'bg-[#0d0f08] text-white'
              }`}
            >
              {isLead ? <Building2 size={13} /> : <GraduationCap size={13} />}
              <span>{isLead ? 'Committee Lead' : 'Student Creator'}</span>
            </span>
          </div>
        </div>

        {/* Profile Card Form */}
        <form onSubmit={handleSave} className="mt-8 space-y-6 rounded-[28px] border border-[#e4e6da] bg-white p-7 sm:p-10 shadow-sm">
          {/* Top Info Strip */}
          <div className="flex items-center gap-4 border-b border-[#f0f1ea] pb-6">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#0d0f08] text-2xl font-bold text-[#d4ff1f]">
              {fullName.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0d0f08]">{fullName}</h2>
              <p className="text-xs text-[#5e6355] flex items-center gap-2 mt-0.5">
                <span>{email}</span>
                <span>•</span>
                <span>Meghnad Saha Institute of Technology</span>
              </p>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Registered Email (Verified)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-[#e4e6da] bg-[#f0f1ea] px-3.5 py-2.5 text-xs font-medium text-[#5e6355] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Department / Stream
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Bio / Interests
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355] mb-1.5">
                Portfolio / GitHub / Bento Link
              </label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08]"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-[#f0f1ea] pt-6">
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Sign out from this device
            </button>

            <button
              type="submit"
              className="lime-button glow flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

