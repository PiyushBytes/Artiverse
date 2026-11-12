import { ArrowRight, Mail, Phone, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'

export default function LoginForm({
  loginIdentifier,
  setLoginIdentifier,
  errors,
  setErrors,
  loading,
  onSubmit,
  onNavigateRegister,
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d0f08]">Sign In to Artiverse</h2>
        <p className="mt-1 text-xs text-[#5e6355]">
          Enter your mobile number or registered email to sign in.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-identifier"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5e6355]"
          >
            Mobile Number or Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5e6355]">
              {/^\d+$/.test(loginIdentifier.trim()) ? <Phone size={15} /> : <Mail size={15} />}
            </div>
            <input
              id="login-identifier"
              type="text"
              value={loginIdentifier}
              onChange={(e) => {
                setLoginIdentifier(e.target.value)
                if (errors.loginIdentifier) setErrors({ ...errors, loginIdentifier: undefined })
              }}
              placeholder="e.g. 7534233233 or aa@gmail.com"
              className={`w-full rounded-2xl border bg-[#fafaf7] py-3 pl-10 pr-3 text-xs font-medium text-[#0d0f08] outline-none transition-all placeholder:text-[#5e6355]/40 focus:bg-white focus:border-[#0d0f08] focus:ring-1 focus:ring-[#0d0f08] ${
                errors.loginIdentifier ? 'border-red-400' : 'border-[#e4e6da] hover:border-[#0d0f08]/30'
              }`}
              autoComplete="username"
              autoFocus
            />
          </div>
          {errors.loginIdentifier && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.loginIdentifier}</p>
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
              <span>Checking account...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Continue to Verification</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>

        {/* Security badge note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5e6355] pt-1">
          <ShieldCheck size={13} className="text-[#839b3d]" />
          <span>Single-use OTP / 4-digit PIN verification</span>
        </div>

        {/* Register redirect */}
        <div className="border-t border-[#f0f1ea] pt-3 text-center text-xs text-[#5e6355]">
          Not a member yet?{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="ml-1 font-semibold text-[#839b3d] hover:underline"
          >
            Register for free →
          </button>
        </div>
      </form>
    </motion.div>
  )
}
