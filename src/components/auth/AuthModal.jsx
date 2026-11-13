import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Lock, Mail, Phone, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  createProfile,
  loginWithPin,
  persistAuthSession,
  verifyOtp,
} from '../../api/auth'

export default function AuthModal({
  isOpen,
  initialMode = 'login', // 'login' | 'register'
  onClose,
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register' | 'otp'
  
  // Login fields
  const [identifier, setIdentifier] = useState('')
  const [loginPin, setLoginPin] = useState('')

  // Register fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPin, setRegPin] = useState('')

  // OTP step
  const [otpTargetEmail, setOtpTargetEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')

  // Status
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setSuccessMsg('')
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const cleanId = identifier.trim()
    if (!cleanId) {
      setError('Please enter your email or 10-digit mobile number.')
      return
    }

    if (!/^\d{4}$/.test(loginPin.trim())) {
      setError('Please enter your 4-digit PIN.')
      return
    }

    setLoading(true)
    try {
      const response = await loginWithPin({
        identifier: cleanId,
        pin: loginPin.trim(),
      })

      const user = persistAuthSession(response)
      setSuccessMsg('Signed in successfully!')
      setTimeout(() => {
        onLoginSuccess?.(user)
        onClose?.()
      }, 500)
    } catch (err) {
      setError(err.message || 'Incorrect credentials or PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 2. Handle Register
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both your first and last name.')
      return
    }

    const cleanEmail = regEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    const cleanPhone = regPhone.replace(/\D/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!/^\d{4}$/.test(regPin.trim())) {
      setError('PIN must be exactly 4 digits.')
      return
    }

    setLoading(true)
    try {
      const response = await createProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: cleanEmail,
        phone_number: cleanPhone,
        pin: regPin.trim(),
      })

      // If backend returns tokens directly, persist and login
      if (response.tokens || response.user) {
        const user = persistAuthSession(response)
        setSuccessMsg('Account created successfully!')
        setTimeout(() => {
          onLoginSuccess?.(user)
          onClose?.()
        }, 500)
      } else {
        // OTP verification step
        setOtpTargetEmail(cleanEmail)
        setMode('otp')
        setSuccessMsg(response.detail || 'OTP sent to your email for verification.')
      }
    } catch (err) {
      setError(err.message || 'Unable to register. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  // 3. Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    const cleanOtp = otpCode.trim()
    if (cleanOtp.length < 4) {
      setError('Please enter the verification code.')
      return
    }

    setLoading(true)
    try {
      const response = await verifyOtp({
        identifier: otpTargetEmail,
        otp: cleanOtp,
      })

      const user = persistAuthSession(response)
      setSuccessMsg('Verification complete! Opening dashboard...')
      setTimeout(() => {
        onLoginSuccess?.(user)
        onClose?.()
      }, 500)
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0d0f08]/30 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-[16px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6da] pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d0f08]">
              {mode === 'login'
                ? 'Sign in'
                : mode === 'register'
                ? 'Create Account'
                : 'Verify Email OTP'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] p-1 text-[#5e6355] hover:bg-[#f6f7f0] hover:text-[#0d0f08] transition"
            >
              <X size={17} />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── MODE: SIGN IN ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Email or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@college.edu or 9876543210"
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#0d0f08]">
                    4-Digit Account PIN *
                  </label>
                </div>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs tracking-widest text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#e4e6da]">
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setSuccessMsg('')
                    setMode('register')
                  }}
                  className="text-xs text-[#5e6355] hover:text-[#0d0f08] underline underline-offset-2"
                >
                  Create new account
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[10px] border border-[#e4e6da] px-3.5 py-1.5 text-xs font-semibold text-[#5e6355] hover:bg-[#f6f7f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-[10px] bg-[#0d0f08] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#202419] disabled:opacity-50 transition"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── MODE: REGISTER ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aarav"
                    className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sharma"
                    className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@msit.edu"
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                    4-Digit PIN *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs tracking-widest text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#e4e6da]">
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setSuccessMsg('')
                    setMode('login')
                  }}
                  className="text-xs text-[#5e6355] hover:text-[#0d0f08] underline underline-offset-2"
                >
                  Already have an account?
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[10px] border border-[#e4e6da] px-3.5 py-1.5 text-xs font-semibold text-[#5e6355] hover:bg-[#f6f7f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-[10px] bg-[#0d0f08] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#202419] disabled:opacity-50 transition"
                  >
                    {loading ? 'Creating...' : 'Register'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── MODE: OTP VERIFICATION ── */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Enter 6-Digit Email Code *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.trim())}
                  placeholder="e.g. 123456"
                  className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-center text-sm font-mono tracking-widest text-[#0d0f08] placeholder-[#8b907f] focus:border-[#0d0f08] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e4e6da]">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-[#5e6355] hover:text-[#0d0f08]"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[10px] border border-[#e4e6da] px-3.5 py-1.5 text-xs font-semibold text-[#5e6355] hover:bg-[#f6f7f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-[10px] bg-[#0d0f08] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#202419] disabled:opacity-50 transition"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

