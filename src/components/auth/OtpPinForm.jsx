import { ArrowLeft, ArrowRight, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'

export default function OtpPinForm({
  step,
  otpValues,
  otpInputRefs,
  otpTargetEmail,
  otpDetailMessage,
  errors,
  loading,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onBackToForm,
}) {
  const digitCount = step === 'pin' ? 4 : 6

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center">
        <div className="mb-2.5 inline-grid size-12 place-items-center rounded-2xl bg-[#d4ff1f]/30 border border-[#d4ff1f] text-[#414d1e] shadow-sm">
          {step === 'pin' ? <KeyRound size={20} /> : <Mail size={20} />}
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">
          {step === 'pin' ? 'Enter 4-Digit Account PIN' : 'Enter 6-Digit Email OTP'}
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#5e6355]">
          {step === 'pin'
            ? otpDetailMessage || 'Enter your 4-digit PIN to sign in.'
            : otpDetailMessage || 'Verify the OTP sent to your registered email to continue.'}
        </p>
        {step === 'otp' && otpTargetEmail && (
          <span className="mt-2 inline-block rounded-full border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-0.5 font-mono text-xs font-semibold text-[#0d0f08]">
            {otpTargetEmail}
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Code inputs */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {otpValues.slice(0, digitCount).map((val, i) => (
            <input
              key={i}
              ref={(el) => (otpInputRefs.current[i] = el)}
              type={step === 'pin' ? 'password' : 'text'}
              inputMode="numeric"
              maxLength={1}
              autoComplete="off"
              value={val}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
              className="size-11 sm:size-12 rounded-2xl border border-[#e4e6da] bg-[#fafaf7] text-center font-mono text-lg font-bold text-[#0d0f08] outline-none transition-all focus:bg-white focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
              autoFocus={i === 0}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-center text-xs text-red-500 font-medium">{errors.otp}</p>
        )}

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
              <span>{step === 'pin' ? 'Verifying PIN...' : 'Verifying OTP...'}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>{step === 'pin' ? 'Sign In' : 'Verify & Activate Profile'}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>

        {/* Back to form link */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08] hover:underline"
          >
            <ArrowLeft size={13} />
            <span>Edit mobile / email</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}
