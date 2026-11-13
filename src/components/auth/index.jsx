
import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import AuthHeader from './AuthHeader'
import AuthHero from './AuthHero'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import OtpPinForm from './OtpPinForm'
import { OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN, OTP_TTL_SECONDS, getOtpDeadline } from '../../config/otpSecurity'
import {
  createProfile,
  loginWithPin,
  persistAuthSession,
  resendOtp,
  verifyOtp,
} from '../../api/auth'

export default function AuthPage({
  mode = 'login',
  onNavigateLogin,
  onNavigateRegister,
  onBack,
  onLoginSuccess,
}) {
  const [step, setStep] = useState('form')

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('')

  // Registration state
  const [selectedRole, setSelectedRole] = useState('student')
  const [committeeName, setCommitteeName] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPin, setRegPin] = useState('')
  const [showRegPin, setShowRegPin] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(false)

  // OTP state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpTargetEmail, setOtpTargetEmail] = useState('')
  const [otpDetailMessage, setOtpDetailMessage] = useState('')
  const [otpExpiresAt, setOtpExpiresAt] = useState(null)
  const [resendAvailableAt, setResendAvailableAt] = useState(null)
  const [attemptsRemaining, setAttemptsRemaining] = useState(OTP_MAX_ATTEMPTS)
  const otpInputRefs = useRef([])

  // Status and errors
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    setStep('form')
    setErrors({})
    setStatusMessage(null)
    setOtpValues(['', '', '', '', '', ''])
    setOtpExpiresAt(null)
    setResendAvailableAt(null)
    setAttemptsRemaining(OTP_MAX_ATTEMPTS)
  }, [mode])

  const startOtpSecurityWindow = (response) => {
    setOtpExpiresAt(getOtpDeadline(response, ['otp_expires_at', 'expires_at'], ['otp_expires_in', 'expires_in'], OTP_TTL_SECONDS))
    setResendAvailableAt(getOtpDeadline(response, ['resend_available_at', 'resend_after_at'], ['resend_after', 'resend_in'], OTP_RESEND_COOLDOWN))
    setAttemptsRemaining(Number(response?.attempts_remaining ?? OTP_MAX_ATTEMPTS))
  }

  // LOGIN: Validate identifier and move directly to PIN screen.
  // No fake PIN request or account-existence probing.
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
      setErrors({
        loginIdentifier: 'Enter a valid email address or 10-digit mobile number.',
      })
      return
    }

    setOtpTargetEmail(identifier)
    setOtpDetailMessage(`Enter your 4-digit PIN to sign in.`)
    setOtpValues(['', '', '', '', '', ''])
    setStep('pin')
  }

  // LOGIN: Send identifier and PIN to backend.
  const handlePinLogin = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const enteredPin = otpValues.slice(0, 4).join('')

    if (!/^\d{4}$/.test(enteredPin)) {
      setErrors({ otp: 'Please enter your 4-digit PIN.' })
      return
    }

    setLoading(true)

    try {
      const response = await loginWithPin({
        identifier: otpTargetEmail,
        pin: enteredPin,
      })

      const user = persistAuthSession(response)

      setStatusMessage({
        type: 'success',
        text: 'Signed in successfully! Opening dashboard...',
      })

      setTimeout(() => {
        onLoginSuccess?.(user)
      }, 600)
    } catch (err) {
      setErrors({
        otp: err.message || 'Incorrect PIN. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // REGISTER: Create profile and request email OTP.
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const newErrors = {}

    if (!regFirstName.trim()) {
      newErrors.regFirstName = 'First name is required.'
    }

    if (!regLastName.trim()) {
      newErrors.regLastName = 'Last name is required.'
    }

    const cleanEmail = regEmail.trim().toLowerCase()

    if (!cleanEmail) {
      newErrors.regEmail = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.regEmail = 'Enter a valid email address.'
    }

    const cleanPhone = regPhone.replace(/\D/g, '')

    if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.regPhone = 'Enter a valid 10-digit mobile number.'
    }

    if (!/^\d{4}$/.test(regPin)) {
      newErrors.regPin = 'PIN must contain exactly 4 digits.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Exact payload required by your backend.
      const response = await createProfile({
        email: cleanEmail,
        phone_number: cleanPhone,
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        pin: regPin,
      })

      const target = response.email || cleanEmail

      setOtpTargetEmail(target)
      setOtpDetailMessage(
        response.detail || 'Verify the OTP sent to your email to create your profile.'
      )
      setOtpValues(['', '', '', '', '', ''])
      startOtpSecurityWindow(response)
      setStep('otp')

      setStatusMessage({
        type: 'success',
        text: response.detail || `Verification OTP sent to ${target}.`,
      })
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Registration failed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // VERIFY: Submit 6-digit OTP.
  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatusMessage(null)

    const enteredOtp = otpValues.slice(0, 6).join('')

    if (!/^\d{6}$/.test(enteredOtp)) {
      setErrors({ otp: 'Please enter all 6 digits of the OTP.' })
      return
    }

    setLoading(true)

    try {
      const response = await verifyOtp({
        identifier: otpTargetEmail,
        otp: enteredOtp,
      })

      const user = persistAuthSession(response)

      setStatusMessage({
        type: 'success',
        text: 'Account verified successfully! Opening dashboard...',
      })

      setTimeout(() => {
        onLoginSuccess?.(user)
      }, 600)
    } catch (err) {
      if (err.status >= 400 && err.status < 500) {
        const remaining = Number(err.data?.attempts_remaining ?? err.data?.remaining_attempts)
        const isWrongOtp = /invalid|incorrect|wrong/i.test(err.message) && !/expired|cooldown|resend/i.test(err.message)
        if (Number.isFinite(remaining)) setAttemptsRemaining(Math.max(0, remaining))
        else if (isWrongOtp) setAttemptsRemaining((current) => Math.max(0, current - 1))
      }
      setErrors({
        otp: err.message || 'Invalid or expired OTP. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // RESEND OTP
  const handleResendOtp = async () => {
    if (!otpTargetEmail) return

    setResendLoading(true)

    try {
      const response = await resendOtp({
        identifier: otpTargetEmail,
      })

      startOtpSecurityWindow(response)
      setOtpValues(['', '', '', '', '', ''])

      setStatusMessage({
        type: 'success',
        text: response.detail || 'A new OTP has been sent to your email.',
      })
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Unable to resend OTP. Please try again.',
      })
    } finally {
      setResendLoading(false)
    }
  }

  // OTP and PIN input handling
  const handleOtpChange = (index, value) => {
    const digitCount = step === 'pin' ? 4 : 6
    const cleaned = value.replace(/\D/g, '')

    if (!cleaned && value !== '') return

    const newValues = [...otpValues]

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, digitCount).split('')

      digits.forEach((digit, i) => {
        newValues[i] = digit
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

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.48, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-1/4 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,#d4ff1f_0%,rgba(212,255,31,0.25)_40%,transparent_70%)] blur-[95px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(#0d0f0808_1px,transparent_1px)] opacity-60 [background-size:24px_24px]" />
      </div>

      <AuthHeader onBack={onBack} />

      {/* Main content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 lg:-mt-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">

          <AuthHero mode={mode} />

          <div className="order-1 flex justify-center lg:order-2 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[460px] rounded-[28px] border border-[#e4e6da] bg-white p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8"
            >

              {/* Status message */}
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

              {/* Form routing */}
              <div key={`${mode}-${step}`} className="w-full">
                {step === 'pin' || step === 'otp' ? (
                  <OtpPinForm
                    step={step}
                    otpValues={otpValues}
                    otpInputRefs={otpInputRefs}
                    otpTargetEmail={otpTargetEmail}
                    otpDetailMessage={otpDetailMessage}
                    otpExpiresAt={otpExpiresAt}
                    resendAvailableAt={resendAvailableAt}
                    attemptsRemaining={attemptsRemaining}
                    errors={errors}
                    loading={loading}
                    resendLoading={resendLoading}
                    onResendOtp={handleResendOtp}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onSubmit={step === 'pin' ? handlePinLogin : handleOtpVerify}
                    onBackToForm={() => {
                      setStep('form')
                      setOtpValues(['', '', '', '', '', ''])
                      setErrors({})
                      setStatusMessage(null)
                    }}
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 border-t border-[#e4e6da] bg-white/60 px-4 py-2.5 text-center text-xs text-[#5e6355] backdrop-blur-md">
        <span>Official portal communications managed via </span>
        <strong className="font-semibold text-[#0d0f08]">connect.arteza@gmail.com</strong>
      </div>
    </div>
  )
}
