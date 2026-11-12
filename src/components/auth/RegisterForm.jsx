import { ArrowRight, Building2, Eye, EyeOff, GraduationCap, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'

export default function RegisterForm({
  selectedRole = 'student',
  setSelectedRole,
  committeeName,
  setCommitteeName,
  regFirstName,
  setRegFirstName,
  regLastName,
  setRegLastName,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regPin,
  setRegPin,
  showRegPin,
  setShowRegPin,
  agreeNewsletter,
  setAgreeNewsletter,
  errors,
  setErrors,
  loading,
  onSubmit,
  onNavigateLogin,
}) {
  const isLead = selectedRole === 'lead'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">Create Your Profile</h2>
        <p className="mt-1 text-xs text-[#5e6355]">
          Select your campus role and fill your details to receive verification OTP.
        </p>

        {/* Role Selector Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#e4e6da] bg-[#fafaf7] p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedRole?.('student')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
              !isLead
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            <GraduationCap size={14} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole?.('lead')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
              isLead
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            <Building2 size={14} />
            <span>Committee Lead</span>
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* If Committee Lead: Organization name */}
        {isLead && (
          <div>
            <label
              htmlFor="committee_name"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
            >
              Committee / Organization Name *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5e6355]">
                <Building2 size={14} />
              </div>
              <input
                id="committee_name"
                type="text"
                value={committeeName}
                onChange={(e) => {
                  setCommitteeName?.(e.target.value)
                  if (errors.committeeName) setErrors({ ...errors, committeeName: undefined })
                }}
                placeholder="e.g. Design Committee MSIT"
                className={`w-full rounded-2xl border bg-[#fafaf7] py-2.5 pl-10 pr-3 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                  errors.committeeName ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
                }`}
              />
            </div>
            {errors.committeeName && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.committeeName}</p>
            )}
          </div>
        )}

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="first_name"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
            >
              First Name *
            </label>
            <input
              id="first_name"
              type="text"
              value={regFirstName}
              onChange={(e) => {
                setRegFirstName(e.target.value)
                if (errors.regFirstName) setErrors({ ...errors, regFirstName: undefined })
              }}
              placeholder="e.g. Aarav"
              className={`w-full rounded-2xl border bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                errors.regFirstName ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
              }`}
            />
            {errors.regFirstName && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.regFirstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
            >
              Last Name *
            </label>
            <input
              id="last_name"
              type="text"
              value={regLastName}
              onChange={(e) => {
                setRegLastName(e.target.value)
                if (errors.regLastName) setErrors({ ...errors, regLastName: undefined })
              }}
              placeholder="e.g. Sharma"
              className={`w-full rounded-2xl border bg-[#fafaf7] px-3.5 py-2.5 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                errors.regLastName ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
              }`}
            />
            {errors.regLastName && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.regLastName}</p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
          >
            Email Address *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5e6355]">
              <Mail size={14} />
            </div>
            <input
              id="email"
              type="email"
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value)
                if (errors.regEmail) setErrors({ ...errors, regEmail: undefined })
              }}
              placeholder="aa@gmail.com"
              className={`w-full rounded-2xl border bg-[#fafaf7] py-2.5 pl-10 pr-3 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                errors.regEmail ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
              }`}
            />
          </div>
          {errors.regEmail && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.regEmail}</p>}
        </div>

        {/* Phone & 4-Digit PIN */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="phone_number"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
            >
              Mobile (+91) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-[#5e6355]">
                +91
              </div>
              <input
                id="phone_number"
                type="tel"
                maxLength={10}
                value={regPhone}
                onChange={(e) => {
                  setRegPhone(e.target.value.replace(/\D/g, ''))
                  if (errors.regPhone) setErrors({ ...errors, regPhone: undefined })
                }}
                placeholder="7534233233"
                className={`w-full rounded-2xl border bg-[#fafaf7] py-2.5 pl-11 pr-2 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                  errors.regPhone ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
                }`}
              />
            </div>
            {errors.regPhone && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.regPhone}</p>}
          </div>

          <div>
            <label
              htmlFor="pin"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
            >
              4-Digit PIN *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6355]">
                <KeyRound size={14} />
              </div>
              <input
                id="pin"
                type={showRegPin ? 'text' : 'password'}
                autoComplete="new-password"
                maxLength={4}
                inputMode="numeric"
                value={regPin}
                onChange={(e) => {
                  setRegPin(e.target.value.replace(/\D/g, ''))
                  if (errors.regPin) setErrors({ ...errors, regPin: undefined })
                }}
                placeholder="••••"
                className={`w-full rounded-2xl border bg-[#fafaf7] py-2.5 pl-9 pr-8 text-xs font-mono font-bold text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                  errors.regPin ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRegPin(!showRegPin)}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#5e6355] hover:text-[#0d0f08]"
              >
                {showRegPin ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {errors.regPin && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.regPin}</p>}
          </div>
        </div>

        {/* Newsletter agreement */}
        <div className="pt-1">
          <label className="flex cursor-pointer select-none items-start gap-2.5 text-xs leading-snug text-[#5e6355] hover:text-[#0d0f08]">
            <input
              type="checkbox"
              checked={agreeNewsletter}
              onChange={(e) => setAgreeNewsletter(e.target.checked)}
              className="mt-0.5 size-4 rounded border-[#e4e6da] text-[#0d0f08] focus:ring-[#0d0f08]"
            />
            <span>
              I agree to receive event passes and announcements sent through{' '}
              <strong className="text-[#0d0f08] font-semibold">connect.arteza@gmail.com</strong>
            </span>
          </label>
          {errors.agreeNewsletter && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.agreeNewsletter}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.015, boxShadow: '0 0 24px rgba(212,255,36,0.45)' }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={loading}
          className="lime-button glow group relative w-full !py-3.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08] transition-all disabled:opacity-60 rounded-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-3.5 animate-spin rounded-full border-2 border-[#0d0f08] border-t-transparent" />
              <span>Sending verification OTP...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>{isLead ? 'Register Committee & Verify OTP' : 'Register as Student & Verify OTP'}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>

        {/* Login redirect */}
        <div className="border-t border-[#f0f1ea] pt-2 text-center text-xs text-[#5e6355]">
          Already registered?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="ml-1 font-semibold text-[#839b3d] hover:underline"
          >
            Sign in here →
          </button>
        </div>
      </form>
    </motion.div>
  )
}
