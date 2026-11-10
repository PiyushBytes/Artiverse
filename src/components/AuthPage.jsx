import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Palette,
  Star,
  RefreshCw,
  ShieldCheck
} from 'lucide-react'
import { createProfile, loginWithPin, persistAuthSession, verifyOtp } from '../api/auth'

export default function AuthPage({
  mode = 'login', // 'login' | 'register'
  onNavigateLogin,
  onNavigateRegister,
  onBack,
  onLoginSuccess
}) {
  // Step in the current flow: identifier/details form, sign-in PIN, or registration OTP.
  const [step, setStep] = useState('form')

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('')

  // Register Form State
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPin, setRegPin] = useState('')
  const [showRegPin, setShowRegPin] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(true)

  // OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpTargetEmail, setOtpTargetEmail] = useState('')
  const [otpDetailMessage, setOtpDetailMessage] = useState('')
  const otpInputRefs = useRef([])

  // UI / Submission States
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  // Reset step whenever mode changes
  useEffect(() => {
    setStep('form')
    setErrors({})
    setStatusMessage(null)
    setOtpValues(['', '', '', '', '', ''])
  }, [mode])

  // Validate the sign-in identifier before asking for the account PIN.
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const rawIdentifier = loginIdentifier.trim()
    const identifier = rawIdentifier.includes('@')
      ? rawIdentifier.toLowerCase()
      : rawIdentifier.replace(/\D/g, '')
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    const validPhone = /^\d{10}$/.test(identifier)
    if (!validEmail && !validPhone) {
      setErrors({ loginIdentifier: 'Enter a valid email or 10-digit mobile number.' })
      return
    }

    setOtpValues(['', '', '', '', '', ''])
    setOtpTargetEmail(identifier)
    setOtpDetailMessage('Enter the 4-digit PIN you created when registering.')
    setStep('pin')
    setStatusMessage(null)
  }

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const newErrors = {}
    const trimmedFirst = regFirstName.trim()
    const trimmedLast = regLastName.trim()
    const trimmedEmail = regEmail.trim().toLowerCase()
    const cleanPhone = regPhone.trim().replace(/\D/g, '')
    const trimmedPin = regPin.trim()

    if (!trimmedFirst) newErrors.regFirstName = 'Enter your first name.'
    if (!trimmedLast) newErrors.regLastName = 'Enter your last name.'
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.regEmail = 'Enter a valid email address.'
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.regPhone = 'Enter a valid 10-digit mobile number.'
    }
    if (!trimmedPin || trimmedPin.length !== 4 || !/^\d{4}$/.test(trimmedPin)) {
      newErrors.regPin = 'PIN must be exactly 4 digits.'
    }
    if (!agreeNewsletter) {
      newErrors.agreeNewsletter = 'Please accept the newsletter and alerts agreement.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const payload = {
      email: trimmedEmail,
      phone_number: cleanPhone,
      first_name: trimmedFirst,
      last_name: trimmedLast,
      pin: trimmedPin
    }

    try {
      const response = await createProfile(payload)
      setOtpDetailMessage(
        response.detail || 'Verify the OTP sent to your email to create your profile.'
      )
      setOtpTargetEmail(response.email || trimmedEmail)
      setStep('otp')
      setStatusMessage({
        type: 'success',
        text: response.detail || 'Verification code sent to your email.'
      })
    } catch (err) {
      const fieldNames = {
        first_name: 'regFirstName',
        last_name: 'regLastName',
        email: 'regEmail',
        phone_number: 'regPhone',
        pin: 'regPin',
      }
      const fieldErrors = Object.fromEntries(
        Object.entries(err.fieldErrors || [])
          .filter(([field]) => fieldNames[field])
          .map(([field, message]) => [fieldNames[field], message])
      )
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors)
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to create profile. Please check details.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP Digit Input
  const handleOtpChange = (index, value) => {
    const clean = value.replace(/\D/g, '')
    const updated = [...otpValues]
    const digitCount = step === 'pin' ? 4 : 6

    if (clean.length > 1) {
      // Handle paste
      const digits = clean.slice(0, digitCount).split('')
      for (let i = 0; i < digitCount; i++) {
        updated[i] = digits[i] || ''
      }
      setOtpValues(updated)
      const nextIndex = Math.min(digits.length, digitCount - 1)
      otpInputRefs.current[nextIndex]?.focus()
      return
    }

    updated[index] = clean ? clean.slice(-1) : ''
    setOtpValues(updated)

    if (clean && index < digitCount - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Handle OTP Verification Submit
  const handleOtpVerify = async (e) => {
    e.preventDefault()
    const code = otpValues.join('')
    const digitCount = 6
    if (code.length !== digitCount) {
      setErrors({ otp: `Please enter all ${digitCount} digits.` })
      return
    }

    setLoading(true)
    setErrors({})
    setStatusMessage(null)
    try {
      const response = await verifyOtp({ identifier: otpTargetEmail, otp: code })
      const user = persistAuthSession(response)
      setStatusMessage({ type: 'success', text: 'Verified. Signing you in…' })
      onLoginSuccess?.(user)
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid or expired OTP.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePinLogin = async (e) => {
    e.preventDefault()
    const pin = otpValues.slice(0, 4).join('')
    if (!/^\d{4}$/.test(pin)) {
      setErrors({ otp: 'Enter your 4-digit PIN to sign in.' })
      return
    }

    setLoading(true)
    setErrors({})
    setStatusMessage(null)
    try {
      const response = await loginWithPin({ identifier: otpTargetEmail, pin })
      const user = persistAuthSession(response)
      onLoginSuccess?.(user)
    } catch (err) {
      setErrors({ otp: err.message || 'Unable to sign in. Check your email/mobile and PIN.' })
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo fill
  const handleQuickDemoFill = (email) => {
    setLoginIdentifier(email)
    setErrors({})
  }

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-ink text-white selection:bg-lime selection:text-ink overflow-x-hidden">
      {/* ── Background Ambient Illumination ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.17, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-0 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(21,88,201,0.22),transparent_65%)] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/4 -left-28 h-[450px] w-[450px] rounded-full bg-[radial-gradient(ellipse,rgba(212,255,36,0.08),transparent_65%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      {/* ── Top Header Bar (Relative, Not Fixed) ── */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-full shrink-0 border-b border-white/[0.07] bg-[#05070d]/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          {/* Left: Back to Home */}
          <div className="flex items-center justify-start flex-1">
            <motion.button
              whileHover={{ scale: 1.03, x: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft
                size={13}
                className="transition-transform duration-150 group-hover:-translate-x-1"
              />
              <span className="hidden xs:inline">Back to Home</span>
              <span className="xs:hidden">Back</span>
            </motion.button>
          </div>

          {/* Middle: Artiverse Community */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/[0.08] px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-lime shadow-[0_0_20px_rgba(212,255,36,0.12)] backdrop-blur-xl"
            >
              <Sparkles size={11} className="text-lime" />
              <span>Artiverse Community</span>
            </motion.div>
          </div>

          {/* Right Corner: Secure Member Portal */}
          <div className="flex items-center justify-end flex-1">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#080a10]/80 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 backdrop-blur-xl"
            >
              <span className="size-1.5 rounded-full bg-lime animate-pulse" />
              <span className="hidden sm:inline">Secure Member Portal</span>
              <span className="sm:hidden">Secure Portal</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ── Main Layout Body: Shifted slightly upper, strictly 0-scroll on desktop ── */}
      <div className="relative mx-auto flex max-w-7xl flex-1 flex-col justify-center px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:-mt-4 w-full">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Side: Brand Story & Perks (Compact & Shifted Upper) */}
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[26px] xs:text-[30px] sm:text-[34px] lg:text-[38px] leading-[1.08] tracking-tight text-white"
            >
              {mode === 'register' ? (
                <>
                  Create your <i className="text-lime">creator profile.</i>
                </>
              ) : (
                <>
                  One account for your entire <i className="text-lime">creative journey.</i>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-2 text-[13px] leading-relaxed text-white/60 max-w-sm"
            >
              {mode === 'register'
                ? 'Join Artiverse to access Kalakriti’26 workshops, recruitment interviews, and exhibitions.'
                : 'Enter your email or phone to receive a single-use login passcode and access your profile.'}
            </motion.p>

            {/* Perks items: Compact list */}
            <div className="mt-4 space-y-2">
              {[
                {
                  icon: Sparkles,
                  title: 'Interview & PI Tracking',
                  desc: 'Real-time updates on your application status.'
                },
                {
                  icon: Star,
                  title: 'Kalakriti’26 Exclusive Access',
                  desc: 'Member badges and exhibition passes.'
                },
                {
                  icon: Palette,
                  title: 'Digital Creator Portfolio',
                  desc: 'Showcase photography, design and media work.'
                }
              ].map(({ icon: Icon, title, desc }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + idx * 0.08 }}
                  whileHover={{ scale: 1.015, x: 3, transition: { duration: 0.15 } }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-md transition-colors hover:border-lime/30 hover:bg-white/[0.04]"
                >
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg border border-lime/20 bg-lime/[0.08] text-lime">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[12px] font-semibold text-white/90 leading-none">{title}</h2>
                    <p className="mt-0.5 text-[11px] text-white/45 truncate">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Demo Fillers on Login */}
            {mode === 'login' && step === 'form' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-2"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Quick fill:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('member@artiverse.in')}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/60 hover:border-lime/40 hover:text-lime transition-all"
                >
                  member@artiverse.in
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Side: Auth Card (No Login & Register together tabs) */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[440px] rounded-2xl sm:rounded-3xl border border-white/15 bg-[#080a10]/90 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(212,255,36,0.03)] backdrop-blur-2xl"
            >
              {/* Status Message Banner */}
              <AnimatePresence mode="wait">
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-3.5 flex items-start gap-2 rounded-xl border p-2.5 text-[12px] ${
                      statusMessage.type === 'success'
                        ? 'border-lime/30 bg-lime/[0.08] text-lime'
                        : 'border-red-500/30 bg-red-500/[0.08] text-red-300'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    )}
                    <span className="leading-tight">{statusMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ─────────────────────────────────────────────────────────── */}
              {/* STEP: Four-digit sign-in PIN or six-digit registration OTP */}
              {/* ─────────────────────────────────────────────────────────── */}
              {step === 'otp' || step === 'pin' ? (
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="inline-grid size-11 place-items-center rounded-2xl border border-lime/30 bg-lime/10 text-lime mb-2 shadow-[0_0_20px_rgba(212,255,36,0.2)]">
                      <Mail size={18} />
                    </div>
                    <h2 className="text-[17px] font-bold text-white font-display">
                      {step === 'pin' ? 'Enter Your PIN' : 'Verify Your Code'}
                    </h2>
                    <p className="mt-1 text-[12px] text-white/60 leading-relaxed max-w-xs mx-auto">
                      {step === 'pin'
                        ? otpDetailMessage
                        : otpDetailMessage || 'Verify the OTP sent to your registered email to continue.'}
                    </p>
                    {step === 'otp' && otpTargetEmail && (
                      <span className="mt-1 inline-block rounded-full bg-white/[0.05] border border-white/10 px-3 py-0.5 text-[11px] font-mono text-lime">
                        {otpTargetEmail}
                      </span>
                    )}
                  </div>

                  <form onSubmit={step === 'pin' ? handlePinLogin : handleOtpVerify} className="space-y-4">
                    {/* Four-digit account PIN for login; six-digit OTP for registration. */}
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpValues.slice(0, step === 'pin' ? 4 : 6).map((val, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpInputRefs.current[i] = el)}
                          type={step === 'pin' ? 'password' : 'text'}
                          inputMode="numeric"
                          maxLength={1}
                          autoComplete="off"
                          value={val}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="size-10 sm:size-11 rounded-xl border border-white/15 bg-white/[0.04] text-center font-mono text-base font-bold text-white outline-none transition-all focus:border-lime focus:bg-white/[0.08] focus:shadow-[0_0_0_1px_#D4FF24,0_0_16px_rgba(212,255,36,0.18)]"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <p className="text-center text-[11px] text-red-400">{errors.otp}</p>
                    )}

                    {step === 'otp' && <p className="text-center text-[11px] text-white/45">If the email doesn’t arrive, go back and check your details.</p>}

                    {/* Verify Button */}
                    <motion.button
                      whileHover={{ scale: 1.015, boxShadow: '0 0 28px rgba(212,255,36,0.38)' }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={loading}
                      className="lime-button glow group relative w-full !py-3 text-[12px] font-bold uppercase tracking-[0.12em] transition-all disabled:opacity-60"
                    >
                          {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="size-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                              {step === 'pin' ? 'Signing In…' : 'Verifying Code…'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>{step === 'pin' ? 'Sign In' : 'Verify & Create Account'}</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="w-full text-center text-[11px] text-white/40 hover:text-white transition-colors"
                    >
                      ← Back to edit credentials
                    </button>
                  </form>
                </motion.div>
              ) : mode === 'login' ? (
                /* ─────────────────────────────────────────────────────────── */
                /* MODE: LOGIN (No Register tab together) */
                /* ─────────────────────────────────────────────────────────── */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h2 className="text-[19px] font-bold text-white font-display">Sign In</h2>
                    <p className="mt-0.5 text-[12px] text-white/50">
                      Enter your mobile number or email, then sign in with your 4-digit PIN.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    <div>
                      <label
                        htmlFor="login-identifier"
                        className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70 mb-1"
                      >
                        Mobile Number or Email
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                          {/^\d+$/.test(loginIdentifier.trim()) ? (
                            <Phone size={15} />
                          ) : (
                            <Mail size={15} />
                          )}
                        </div>
                        <input
                          id="login-identifier"
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => {
                            setLoginIdentifier(e.target.value)
                            if (errors.loginIdentifier)
                              setErrors({ ...errors, loginIdentifier: undefined })
                          }}
                          placeholder="e.g. 7534233233 or aa@gmail.com"
                          className={`w-full rounded-xl border bg-white/[0.035] pl-9 pr-3 py-2.5 text-[13px] text-white outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-white/25 focus:bg-white/[0.06] focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24,0_0_20px_rgba(212,255,36,0.12)] ${
                            errors.loginIdentifier
                              ? 'border-red-400/70'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                          autoComplete="username"
                        />
                      </div>
                      {errors.loginIdentifier && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.loginIdentifier}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.015, boxShadow: '0 0 28px rgba(212,255,36,0.4)' }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={loading}
                      className="lime-button glow group relative w-full !py-3 text-[12px] font-bold uppercase tracking-[0.12em] transition-all disabled:opacity-60"
                    >
                      {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="size-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                            Continue...
                          </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>Continue</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </motion.button>

                    {/* "If not user then register for free" redirect link */}
                    <div className="pt-2 text-center text-[12px] text-white/50 border-t border-white/[0.06]">
                      Not a member yet?{' '}
                      <button
                        type="button"
                        onClick={onNavigateRegister}
                        className="font-semibold text-lime hover:underline transition-colors ml-1"
                      >
                        Register for free →
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* ─────────────────────────────────────────────────────────── */
                /* MODE: REGISTER (first_name, last_name, email, phone, 4-digit pin) */
                /* ─────────────────────────────────────────────────────────── */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3">
                    <h2 className="text-[18px] font-bold text-white font-display">Create Profile</h2>
                    <p className="mt-0.5 text-[11px] text-white/50">
                      Fill your details to get your OTP and activate your creator profile.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                    {/* First Name & Last Name (2 Columns) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 mb-1"
                        >
                          First Name
                        </label>
                        <input
                          id="first_name"
                          type="text"
                          value={regFirstName}
                          onChange={(e) => {
                            setRegFirstName(e.target.value)
                            if (errors.regFirstName)
                              setErrors({ ...errors, regFirstName: undefined })
                          }}
                          placeholder="e.g. Aarav"
                          className={`w-full rounded-xl border bg-white/[0.035] px-3 py-2 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24] ${
                            errors.regFirstName
                              ? 'border-red-400/70'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                        />
                        {errors.regFirstName && (
                          <p className="mt-0.5 text-[10px] text-red-400">{errors.regFirstName}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          id="last_name"
                          type="text"
                          value={regLastName}
                          onChange={(e) => {
                            setRegLastName(e.target.value)
                            if (errors.regLastName)
                              setErrors({ ...errors, regLastName: undefined })
                          }}
                          placeholder="e.g. Sharma"
                          className={`w-full rounded-xl border bg-white/[0.035] px-3 py-2 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24] ${
                            errors.regLastName
                              ? 'border-red-400/70'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                        />
                        {errors.regLastName && (
                          <p className="mt-0.5 text-[10px] text-red-400">{errors.regLastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
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
                          className={`w-full rounded-xl border bg-white/[0.035] pl-8 pr-3 py-2 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24] ${
                            errors.regEmail
                              ? 'border-red-400/70'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                        />
                      </div>
                      {errors.regEmail && (
                        <p className="mt-0.5 text-[10px] text-red-400">{errors.regEmail}</p>
                      )}
                    </div>

                    {/* Mobile Number & 4-digit PIN (2 Columns) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label
                          htmlFor="phone_number"
                          className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 mb-1"
                        >
                          Mobile Number
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-[11px] font-bold text-white/45">
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
                            className={`w-full rounded-xl border bg-white/[0.035] pl-10 pr-2 py-2 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24] ${
                              errors.regPhone
                                ? 'border-red-400/70'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                          />
                        </div>
                        {errors.regPhone && (
                          <p className="mt-0.5 text-[10px] text-red-400">{errors.regPhone}</p>
                        )}
                      </div>

                      {/* 4-digit PIN (No confirm PIN needed) */}
                      <div>
                        <label
                          htmlFor="pin"
                          className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 mb-1"
                        >
                          Create 4-Digit PIN
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-white/40">
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
                            placeholder="4-digit PIN"
                            className={`w-full rounded-xl border bg-white/[0.035] pl-8 pr-7 py-2 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-lime focus:shadow-[0_0_0_1px_#D4FF24] ${
                              errors.regPin
                                ? 'border-red-400/70'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPin(!showRegPin)}
                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-white/40 hover:text-white"
                          >
                            {showRegPin ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                        {errors.regPin && (
                          <p className="mt-0.5 text-[10px] text-red-400">{errors.regPin}</p>
                        )}
                      </div>
                    </div>

                    {/* Agreement for Newsletter & Event Alerts from connect.arteza@gmail.com */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer text-[11px] text-white/65 hover:text-white/85 select-none leading-tight">
                        <input
                          type="checkbox"
                          checked={agreeNewsletter}
                          onChange={(e) => setAgreeNewsletter(e.target.checked)}
                          className="mt-0.5 size-3.5 rounded border-white/20 bg-white/5 text-lime focus:ring-lime"
                        />
                        <span>
                          I agree to receive future newsletters and event alerts sent through{' '}
                          <span className="text-lime font-medium">connect.arteza@gmail.com</span>
                        </span>
                      </label>
                      {errors.agreeNewsletter && (
                        <p className="mt-0.5 text-[10px] text-red-400">{errors.agreeNewsletter}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.015, boxShadow: '0 0 28px rgba(212,255,36,0.4)' }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={loading}
                      className="lime-button glow group relative w-full !py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="size-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                          Sending Verification OTP...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>Register & Verify OTP</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </motion.button>

                    {/* Already have an account? Sign in */}
                    <div className="pt-1.5 text-center text-[11.5px] text-white/50 border-t border-white/[0.06]">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={onNavigateLogin}
                        className="font-semibold text-lime hover:underline transition-colors ml-1"
                      >
                        Sign in here →
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
