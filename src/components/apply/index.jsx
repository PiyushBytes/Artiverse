import { useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronRight, LoaderCircle } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ApplySidebar from './ApplySidebar'
import ApplyStepper from './ApplyStepper'
import { StepAcademic, StepCreative, StepPersonal } from './StepFields'
import ApplySuccess from './ApplySuccess'
import { submitApplication } from '../../lib/submitApplication'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  rollNumber: '',
  department: '',
  year: '',
  domain1: '',
  domain2: '',
  why: '',
  portfolio: '',
  website: '', // honeypot
}

export default function ApplyPage({ onBack }) {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const [already, setAlready] = useState(
    () =>
      typeof window !== 'undefined' &&
      (localStorage.getItem('artiverseApplied') === 'yes' ||
        localStorage.getItem('artezaApplied') === 'yes')
  )
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef(null)
  const booking = import.meta.env.VITE_BOOKING_URL

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined })
    }
  }

  const validateStep = (s) => {
    const errs = {}
    if (s === 0) {
      if (!form.fullName.trim()) errs.fullName = 'Please enter your name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
      if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a 10-digit phone number.'
    } else if (s === 1) {
      if (!form.rollNumber.trim()) errs.rollNumber = 'Enter your roll number.'
      if (!form.department) errs.department = 'Select your department.'
      if (!form.year) errs.year = 'Select your year.'
    } else if (s === 2) {
      if (!form.domain1) errs.domain1 = 'Choose a primary domain.'
      if (!form.domain2) errs.domain2 = 'Choose a second preference.'
      if (form.domain1 && form.domain2 && form.domain1 === form.domain2) {
        errs.domain2 = 'Choose a different second preference.'
      }
      if (!form.why.trim()) errs.why = 'Tell us why you want to join.'
    }
    return errs
  }

  const next = () => {
    const errs = validateStep(step)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (step < 2) {
      setStep(step + 1)
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return // Honeypot trigger
    const errs = validateStep(2)
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setSubmitError('')
    try {
      await submitApplication({ ...form })
      setSuccess(true)
      setAlready(true)
      localStorage.setItem('artiverseApplied', 'yes')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('artiverseApplied')
    localStorage.removeItem('artezaApplied')
    setAlready(false)
    setSuccess(false)
    setForm(initialForm)
    setStep(0)
    setErrors({})
  }

  if (success || already) {
    return <ApplySuccess onBack={onBack} onReset={handleReset} bookingUrl={booking} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(21,88,201,0.08),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(212,255,36,0.04),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-stretch">
        <ApplySidebar onBack={onBack} />

        {/* Right Form Panel */}
        <div className="flex flex-1 items-start justify-center px-4 pb-16 sm:px-6 lg:items-center lg:px-8 lg:py-24">
          <div className="w-full max-w-[480px]">
            <ApplyStepper currentStep={step} onSelectStep={setStep} />

            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={update}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && <StepPersonal form={form} onChange={update} errors={errors} />}
                  {step === 1 && <StepAcademic form={form} onChange={update} errors={errors} />}
                  {step === 2 && <StepCreative form={form} onChange={update} errors={errors} />}
                </motion.div>
              </AnimatePresence>

              {submitError && (
                <p className="mt-4 text-center text-[13px] text-red-400">{submitError}</p>
              )}

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prev}
                    className="ghost-button flex items-center gap-1.5 rounded-full px-5 py-3 text-xs uppercase tracking-[0.12em] text-white/50 hover:text-white"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="lime-button glow ml-auto flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={busy}
                    className="lime-button glow ml-auto flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle size={15} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <ArrowUpRight size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

