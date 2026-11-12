
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, Phone, User } from 'lucide-react'
import { motion } from 'motion/react'

export default function RegisterForm({
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
  const updateField = (field, setter, value) => {
    setter(value)
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const inputClass = (field) =>
    `w-full rounded-2xl border bg-[#fafaf7] px-3.5 py-3 text-sm font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:border-[#0d0f08] focus:bg-white focus:ring-1 focus:ring-[#0d0f08] ${
      errors[field]
        ? 'border-red-400'
        : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
    }`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">
          Create Your Profile
        </h2>
        <p className="mt-1 text-xs text-[#5e6355]">
          Join the Arteza creative community at MSIT.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* First and Last Name */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="first_name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
              First Name *
            </label>
            <input
              id="first_name"
              type="text"
              autoComplete="given-name"
              value={regFirstName}
              onChange={(e) => updateField('regFirstName', setRegFirstName, e.target.value)}
              placeholder="First name"
              className={inputClass('regFirstName')}
            />
            {errors.regFirstName && (
              <p className="mt-1 text-[11px] text-red-500">{errors.regFirstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
              Last Name *
            </label>
            <input
              id="last_name"
              type="text"
              autoComplete="family-name"
              value={regLastName}
              onChange={(e) => updateField('regLastName', setRegLastName, e.target.value)}
              placeholder="Last name"
              className={inputClass('regLastName')}
            />
            {errors.regLastName && (
              <p className="mt-1 text-[11px] text-red-500">{errors.regLastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
            Email Address *
          </label>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6355]" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={regEmail}
              onChange={(e) => updateField('regEmail', setRegEmail, e.target.value)}
              placeholder="yourname@gmail.com"
              className={`${inputClass('regEmail')} pl-10`}
            />
          </div>
          {errors.regEmail && (
            <p className="mt-1 text-[11px] text-red-500">{errors.regEmail}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone_number" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
            Mobile Number *
          </label>
          <div className="relative">
            <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6355]" />
            <input
              id="phone_number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={regPhone}
              onChange={(e) => updateField('regPhone', setRegPhone, e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className={`${inputClass('regPhone')} pl-10`}
            />
          </div>
          {errors.regPhone && (
            <p className="mt-1 text-[11px] text-red-500">{errors.regPhone}</p>
          )}
        </div>

        {/* PIN */}
        <div>
          <label htmlFor="pin" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">
            Create 4-Digit PIN *
          </label>
          <div className="relative">
            <KeyRound size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6355]" />
            <input
              id="pin"
              type={showRegPin ? 'text' : 'password'}
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={4}
              value={regPin}
              onChange={(e) => updateField('regPin', setRegPin, e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              className={`${inputClass('regPin')} pl-10 pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowRegPin(!showRegPin)}
              aria-label={showRegPin ? 'Hide PIN' : 'Show PIN'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5e6355]"
            >
              {showRegPin ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.regPin && (
            <p className="mt-1 text-[11px] text-red-500">{errors.regPin}</p>
          )}
        </div>

        {/* Optional newsletter consent */}
        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-[#5e6355]">
          <input
            type="checkbox"
            checked={agreeNewsletter}
            onChange={(e) => setAgreeNewsletter(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[#839b3d]"
          />
          <span>
            I'd like to receive optional event updates and announcements from
            <strong className="text-[#0d0f08]"> connect.arteza@gmail.com</strong>.
          </span>
        </label>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={loading}
          className="lime-button glow group w-full rounded-full !py-3.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08] transition-all disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-3.5 animate-spin rounded-full border-2 border-[#0d0f08] border-t-transparent" />
              Sending verification OTP...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Register for Free
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>

        {/* Login link */}
        <div className="border-t border-[#f0f1ea] pt-3 text-center text-xs text-[#5e6355]">
          Already have an account?
          <button
            type="button"
            onClick={onNavigateLogin}
            className="ml-1 font-semibold text-[#839b3d] hover:underline"
          >
            Log in
          </button>
        </div>
      </form>
    </motion.div>
  )
}
