import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import AuthHeader from './AuthHeader'
import AuthHero from './AuthHero'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import OtpPinForm from './OtpPinForm'
import {
  checkAccount,
  createProfile,
  loginWithPin,
  persistAuthSession,
  resendOtp,
  verifyOtp,
} from '../../api/auth'

export default function AuthPage({
  mode = 'login', // 'login' | 'register'
  onNavigateLogin,
  onNavigateRegister,
  onBack,
  onLoginSuccess,
}) {
  const [step, setStep] = useState('form') // 'form' | 'pin' | 'otp'

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('')

  // Register Form State
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('role') === 'committee' ? 'lead' : 'student'
    } catch {
      return 'student'
    }
  })
  const [committeeName, setCommitteeName] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPin, setRegPin] = useState('')
  const [showRegPin, setShowRegPin] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(true)

  // OTP / PIN State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpTargetEmail, setOtpTargetEmail] = useState('')
  const [otpDetailMessage, setOtpDetailMessage] = useState('')
  const otpInputRefs = useRef([])

  // Status & Error States
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    setStep('form')
    setErrors({})
    setStatusMessage(null)
    setOtpValues(['', '', '', '', '', ''])
  }, [mode])

  // ── Step 1: Login Submission (Checks database for email/mobile) ──
  const handleLoginSubmit = async (e) => {
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
      setErrors({ loginIdentifier: 'Enter a valid email address or 10-digit mobile number.' })
      return
    }

    setLoading(true)
    try {
      // Probe backend database to check if this user exists
      const checkResult = await checkAccount(identifier)

      if (checkResult.exists) {
        if (checkResult.status === 'pending_otp') {
          // Signup is pending email verification
          setOtpTargetEmail(identifier)
          setOtpDetailMessage('Account found! Your signup is pending email verification.')
          setOtpValues(['', '', '', '', '', ''])
          setStep('otp')
          setStatusMessage({
            type: 'info',
            text: 'Please enter the OTP sent to your email to activate your account.',
          })
          // Automatically trigger resend OTP so the user has a fresh code
          try {
            await resendOtp({ identifier })
          } catch {
            // Non-blocking
          }
        } else {
          // User exists with PIN: Proceed to PIN screen
          setOtpTargetEmail(identifier)
          setOtpDetailMessage(`Account matched for ${identifier}. Enter your 4-digit PIN to sign in.`)
          setOtpValues(['', '', '', '', '', ''])
          setStep('pin')
        }
      } else {
        // User NOT found in database: automatically guide into register flow
        setStatusMessage({
          type: 'info',
          text: 'No account found with this email. Taking you to registration…',
        })
        if (validEmail) setRegEmail(identifier)
        if (validPhone) setRegPhone(identifier)

        setTimeout(() => {
          onNavigateRegister?.()
        }, 700)
      }
    } catch (err) {
      // Backend connectivity or general server error
      setErrors({
        loginIdentifier: err.message || 'Unable to reach backend server. Please verify your connection.',
      })
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Validate 4-Digit PIN & Login ──
  const handlePinLogin = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const enteredPin = otpValues.slice(0, 4).join('')
    if (enteredPin.length !== 4) {
      setErrors({ otp: 'Please enter your 4-digit PIN.' })
      return
    }

    setLoading(true)
    try {
      const response = await loginWithPin({
        identifier: otpTargetEmail || loginIdentifier.trim(),
        pin: enteredPin,
      })

      const user = persistAuthSession(response)
      setStatusMessage({
        type: 'success',
        text: 'Signed in successfully! Opening dashboard…',
      })
      setTimeout(() => {
        onLoginSuccess?.(user)
      }, 600)
    } catch (err) {
      const msg = err.message || 'Incorrect PIN. Please try again.'
      setErrors({ otp: msg })
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Registration Submission (Creates Profile & Sends OTP) ──
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const newErrors = {}

    if (selectedRole === 'lead' && !committeeName.trim()) {
      newErrors.committeeName = 'Committee or organization name is required.'
    }

    if (!regFirstName.trim()) newErrors.regFirstName = 'First name is required.'
    if (!regLastName.trim()) newErrors.regLastName = 'Last name is required.'

    const cleanEmail = regEmail.trim().toLowerCase()
    if (!cleanEmail) {
      newErrors.regEmail = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.regEmail = 'Enter a valid email address.'
    }

    const cleanPhone = regPhone.replace(/\D/g, '')
    if (!cleanPhone) {
      newErrors.regPhone = 'Phone number is required.'
    } else if (cleanPhone.length !== 10) {
      newErrors.regPhone = 'Must be exactly 10 digits.'
    }

    if (!regPin) {
      newErrors.regPin = 'PIN is required.'
    } else if (regPin.length !== 4) {
      newErrors.regPin = 'Must be exactly 4 digits.'
    }

    if (!agreeNewsletter) {
      newErrors.agreeNewsletter = 'Please accept future email alerts to continue.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await createProfile({
        email: cleanEmail,
        phone_number: cleanPhone,
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        pin: regPin,
        role: selectedRole,
        ...(selectedRole === 'lead' ? { committee_name: committeeName.trim() } : {}),
      })

      const target = response.email || cleanEmail
      setOtpTargetEmail(target)
      setOtpDetailMessage(response.detail || 'Verify the OTP sent to your email to create your profile.')
      setOtpValues(['', '', '', '', '', ''])
      setStep('otp')
      setStatusMessage({
        type: 'success',
        text: response.detail || `Verification OTP sent to ${target}!`,
      })
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit registration. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // ── Step 4: Verify 6-Digit Email OTP ──
  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const enteredOtp = otpValues.slice(0, 6).join('')
    if (enteredOtp.length !== 6) {
      setErrors({ otp: 'Please enter all 6 digits of the OTP.' })
      return
    }

    setLoading(true)
    try {
      const response = await verifyOtp({
        identifier: otpTargetEmail,
        otp: enteredOtp,
      })

      const user = persistAuthSession(response, selectedRole)
      setStatusMessage({
        type: 'success',
        text: 'Account verified successfully! Opening dashboard…',
      })
      setTimeout(() => {
        onLoginSuccess?.(user)
      }, 600)
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid or expired OTP. Please check and try again.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Step 5: Resend OTP Handler ──
  const handleResendOtp = async () => {
    if (!otpTargetEmail) return
    setResendLoading(true)
    try {
      const response = await resendOtp({ identifier: otpTargetEmail })
      setStatusMessage({
        type: 'success',
        text: response.detail || 'A new OTP has been sent to your registered email.',
      })
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Unable to resend OTP. Please wait a moment and try again.',
      })
    } finally {
      setResendLoading(false)
    }
  }

  // ── OTP & PIN digit input handling ──
  const handleOtpChange = (index, value) => {
    const digitCount = step === 'pin' ? 4 : 6
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned && value !== '') return

    const newValues = [...otpValues]
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, digitCount).split('')
      digits.forEach((d, i) => {
        if (i < digitCount) newValues[i] = d
      })
      setOtpValues(newValues)
      const nextIdx = Math.min(digits.length, digitCount - 1)
      otpInputRefs.current[nextIdx]?.focus()
      return
    }

    newValues[index] = cleaned.slice(-1)
    setOtpValues(newValues)

    if (cleaned && index < digitCount - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#fafaf7] text-[#0d0f08] selection:bg-lime selection:text-ink lg:h-screen lg:max-h-screen">
      {/* Ambient Radial Lime Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.48, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-1/4 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,#d4ff1f_0%,rgba(212,255,31,0.25)_40%,transparent_70%)] blur-[95px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#0d0f0808_1px,transparent_1px)] opacity-60 [background-size:24px_24px]" />
      </div>

      {/* Top Header */}
      <AuthHeader onBack={onBack} />

      {/* Main Content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 lg:-mt-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Hero & Perks */}
          <AuthHero mode={mode} />

          {/* Right Column: White Auth Card */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[460px] rounded-[28px] border border-[#e4e6da] bg-white p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            >
              {/* Status Banner */}
              <AnimatePresence mode="wait">
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-4 flex items-start gap-2.5 rounded-2xl border p-3 text-xs font-medium ${
                      statusMessage.type === 'success'
                        ? 'border-[#d4ff1f] bg-[#d4ff1f]/20 text-[#414d1e]'
                        : statusMessage.type === 'info'
                        ? 'border-blue-200 bg-blue-50 text-blue-800'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#839b3d]" />
                    ) : statusMessage.type === 'info' ? (
                      <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
                    ) : (
                      <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                    )}
                    <span>{statusMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Routing: Form vs PIN vs OTP */}
              {step === 'pin' || step === 'otp' ? (
                <OtpPinForm
                  step={step}
                  otpValues={otpValues}
                  otpInputRefs={otpInputRefs}
                  otpTargetEmail={otpTargetEmail}
                  otpDetailMessage={otpDetailMessage}
                  errors={errors}
                  loading={loading}
                  resendLoading={resendLoading}
                  onResendOtp={handleResendOtp}
                  onOtpChange={handleOtpChange}
                  onOtpKeyDown={handleOtpKeyDown}
                  onSubmit={step === 'pin' ? handlePinLogin : handleOtpVerify}
                  onBackToForm={() => setStep('form')}
                />
              ) : mode === 'login' ? (
                <LoginForm
                  loginIdentifier={loginIdentifier}
                  setLoginIdentifier={setLoginIdentifier}
                  errors={errors}
                  setErrors={setErrors}
                  loading={loading}
                  onSubmit={handleLoginSubmit}
                  onNavigateRegister={onNavigateRegister}
                />
              ) : (
                <RegisterForm
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                  committeeName={committeeName}
                  setCommitteeName={setCommitteeName}
                  regFirstName={regFirstName}
                  setRegFirstName={setRegFirstName}
                  regLastName={regLastName}
                  setRegLastName={setRegLastName}
                  regEmail={regEmail}
                  setRegEmail={setRegEmail}
                  regPhone={regPhone}
                  setRegPhone={setRegPhone}
                  regPin={regPin}
                  setRegPin={setRegPin}
                  showRegPin={showRegPin}
                  setShowRegPin={setShowRegPin}
                  agreeNewsletter={agreeNewsletter}
                  setAgreeNewsletter={setAgreeNewsletter}
                  errors={errors}
                  setErrors={setErrors}
                  loading={loading}
                  onSubmit={handleRegisterSubmit}
                  onNavigateLogin={onNavigateLogin}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Helpdesk Strip */}
      <div className="relative z-20 border-t border-[#e4e6da] bg-white/60 px-4 py-2.5 text-center text-xs text-[#5e6355] backdrop-blur-md">
        <span>Official portal communications managed via </span>
        <strong className="font-semibold text-[#0d0f08]">connect.arteza@gmail.com</strong>
        <span> · MSIT Kolkata</span>
      </div>
    </div>
  )
}
