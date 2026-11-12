
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
  RefreshCw,
} from 'lucide-react'

import { motion } from 'motion/react'

export default function OtpPinForm({
  step,
  otpValues,
  otpInputRefs,
  otpTargetEmail,
  otpDetailMessage,
  errors,
  loading,
  resendLoading = false,
  onResendOtp,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onBackToForm,
}) {
  const isPinStep = step === 'pin'
  const digitCount = isPinStep ? 4 : 6

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <div className="mb-2.5 inline-grid size-12 place-items-center rounded-2xl border border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#414d1e] shadow-sm">
          {isPinStep ? (
            <KeyRound size={20} />
          ) : (
            <Mail size={20} />
          )}
        </div>

        <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">
          {isPinStep
            ? 'Enter 4-Digit Account PIN'
            : 'Enter 6-Digit Email OTP'}
        </h2>

        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#5e6355]">
          {otpDetailMessage ||
            (isPinStep
              ? 'Enter your 4-digit PIN to sign in.'
              : 'Verify the OTP sent to your registered email to continue.')}
        </p>

        {!isPinStep && otpTargetEmail && (
          <span className="mt-2 inline-block rounded-full border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-0.5 font-mono text-xs font-semibold text-[#0d0f08]">
            {otpTargetEmail}
          </span>
        )}
      </div>

      {/* PIN / OTP Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Digit Inputs */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {otpValues.slice(0, digitCount).map((val, i) => (
            <input
              key={`${step}-${i}`}
              ref={(el) => {
                otpInputRefs.current[i] = el
              }}
              type={isPinStep ? 'password' : 'text'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete="off"
              value={val}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
              className="size-11 rounded-2xl border border-[#e4e6da] bg-[#fafaf7] text-center font-mono text-lg font-bold text-[#0d0f08] outline-none transition-all focus:border-[#0d0f08] focus:bg-white focus:ring-2 focus:ring-[#0d0f08]/10 sm:size-12"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error Message */}
        {errors?.otp && (
          <p className="text-center text-xs font-medium text-red-500">
            {errors.otp}
          </p>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{
            scale: 1.015,
            boxShadow: '0 0 24px rgba(212,255,36,0.45)',
          }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={loading}
          className="lime-button glow group relative w-full rounded-full !py-3.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08] transition-all disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-3.5 animate-spin rounded-full border-2 border-[#0d0f08] border-t-transparent" />

              <span>
                {isPinStep
                  ? 'Verifying PIN...'
                  : 'Verifying OTP...'}
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>
                {isPinStep
                  ? 'Sign In'
                  : 'Verify & Open Dashboard'}
              </span>

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          )}
        </motion.button>

        {/* Resend OTP */}
        {!isPinStep && onResendOtp && (
          <div className="pt-1 text-center">
            <button
              type="button"
              disabled={resendLoading}
              onClick={onResendOtp}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5e6355] hover:text-[#0d0f08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={resendLoading ? 'animate-spin' : ''}
              />

              <span>
                {resendLoading
                  ? 'Resending OTP...'
                  : 'Didn’t receive code? Resend OTP'}
              </span>
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e6355] hover:text-[#0d0f08] hover:underline"
          >
            <ArrowLeft size={13} />

            <span>
              {isPinStep
                ? 'Back to login'
                : 'Change email / mobile'}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}
