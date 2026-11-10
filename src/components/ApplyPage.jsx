import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Shield,
  Users,
  Zap,
  Star,
} from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import { submitApplication } from '../lib/submitApplication'

/* ─── form state ─── */
const initial = {
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

const steps = [
  { id: 'personal', title: 'About You', subtitle: 'Tell us who you are' },
  { id: 'academic', title: 'Academics', subtitle: 'Your academic details' },
  { id: 'creative', title: 'Creative Side', subtitle: 'Show us your passion' },
]

const departments = ['CSE', 'IT', 'ECE', 'EE', 'Mechanical', 'Civil', 'Other']
const years = ['1st', '2nd', '3rd']

export default function ApplyPage({ onBack }) {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const [already, setAlready] = useState(
    () =>
      localStorage.getItem('artiverseApplied') === 'yes' ||
      localStorage.getItem('artezaApplied') === 'yes',
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
    const x = {}
    if (s === 0) {
      if (!form.fullName.trim()) x.fullName = 'Please enter your name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        x.email = 'Enter a valid email.'
      if (!/^\d{10}$/.test(form.phone))
        x.phone = 'Enter a 10-digit phone number.'
    } else if (s === 1) {
      if (!form.rollNumber.trim()) x.rollNumber = 'Enter your roll number.'
      if (!form.department) x.department = 'Select your department.'
      if (!form.year) x.year = 'Select your year.'
    } else if (s === 2) {
      if (!form.domain1) x.domain1 = 'Choose a primary domain.'
      if (!form.domain2) x.domain2 = 'Choose a second preference.'
      if (form.domain1 && form.domain2 && form.domain1 === form.domain2)
        x.domain2 = 'Choose a different second preference.'
      if (!form.why.trim()) x.why = 'Tell us why you want to join.'
    }
    return x
  }

  const next = () => {
    const x = validateStep(step)
    setErrors(x)
    if (Object.keys(x).length) return
    if (step < 2) {
      setStep(step + 1)
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (form.website) return
    const x = validateStep(2)
    setErrors(x)
    if (Object.keys(x).length) return
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

  const reset = () => {
    localStorage.removeItem('artiverseApplied')
    localStorage.removeItem('artezaApplied')
    setAlready(false)
    setSuccess(false)
    setForm(initial)
    setStep(0)
    setErrors({})
  }

  /* ── field renderers ── */
  const fieldClasses =
    'w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-white/30 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_#D4FF24,0_0_24px_rgba(212,255,36,0.08)]'
  const fieldBorder = (name) =>
    errors[name] ? 'border-red-400/60' : 'border-white/[0.1] hover:border-white/25'

  const renderInput = (name, label, placeholder, type = 'text') => (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[13px] font-medium uppercase tracking-[0.12em] text-white/60"
      >
        {label}
      </label>
      <input
        id={name}
        className={`${fieldClasses} ${fieldBorder(name)}`}
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-[12px] text-red-400">{errors[name]}</p>
      )}
    </div>
  )

  const renderSelect = (name, label, options) => (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[13px] font-medium uppercase tracking-[0.12em] text-white/60"
      >
        {label}
      </label>
      <select
        id={name}
        className={`${fieldClasses} ${fieldBorder(name)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
        name={name}
        value={form[name]}
        onChange={update}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0a0d14]">
            {o}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-[12px] text-red-400">{errors[name]}</p>
      )}
    </div>
  )

  /* ── step content ── */
  const stepContent = [
    // Step 0 — Personal
    <div key="personal" className="space-y-5">
      {renderInput('fullName', 'Full Name', 'Your full name')}
      {renderInput('email', 'College Email', 'you@msit.edu', 'email')}
      {renderInput('phone', 'Phone / WhatsApp', '10-digit number', 'tel')}
    </div>,
    // Step 1 — Academic
    <div key="academic" className="space-y-5">
      {renderInput('rollNumber', 'Roll Number', 'Your roll number')}
      {renderSelect('department', 'Department', departments)}
      {renderSelect('year', 'Year', years)}
    </div>,
    // Step 2 — Creative
    <div key="creative" className="space-y-5">
      {renderSelect(
        'domain1',
        'Domain Preference 1',
        siteConfig.domains.map((d) => d.name),
      )}
      {renderSelect(
        'domain2',
        'Domain Preference 2',
        siteConfig.domains.map((d) => d.name),
      )}
      <div className="space-y-2">
        <label
          htmlFor="why"
          className="block text-[13px] font-medium uppercase tracking-[0.12em] text-white/60"
        >
          Why do you want to join Artiverse?
        </label>
        <textarea
          id="why"
          className={`${fieldClasses} ${fieldBorder('why')} min-h-[120px] resize-none`}
          name="why"
          maxLength="400"
          value={form.why}
          onChange={update}
          placeholder="Tell us what inspires you..."
        />
        <div className="flex items-center justify-between">
          {errors.why ? (
            <p className="text-[12px] text-red-400">{errors.why}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] tabular-nums text-white/30">
            {form.why.length}/400
          </span>
        </div>
      </div>
      {renderInput(
        'portfolio',
        'Portfolio / Drive / Instagram (optional)',
        'https://',
      )}
    </div>,
  ]

  /* ── success state ── */
  if (success || already) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-ink">
        {/* ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(212,255,36,0.06),transparent_65%)] blur-3xl" />

        <div className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg text-center"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto mb-8 grid size-20 place-items-center rounded-full border border-lime/30 bg-lime/[0.08] shadow-[0_0_60px_rgba(212,255,36,0.12)]"
            >
              <CheckCircle2 className="size-10 text-lime" />
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl">
              Application <i className="text-lime">received.</i>
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-white/55">
              You've already applied. Book your personal interview slot to
              complete the next step.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              {booking ? (
                <a
                  className="lime-button glow rounded-full px-8 py-4 text-sm font-bold"
                  href={booking}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book PI Slot <ExternalLink size={16} />
                </a>
              ) : (
                <p className="rounded-full border border-cobalt/40 bg-cobalt/[0.06] px-6 py-3 text-sm text-cobalt-soft">
                  PI booking link will be available soon.
                </p>
              )}

              <button
                onClick={onBack}
                className="ghost-button rounded-full px-6 py-3 text-sm text-white/70 hover:text-white"
              >
                <ArrowLeft size={15} /> Back to Home
              </button>

              <button
                onClick={reset}
                className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/35 transition hover:text-white/60"
              >
                Apply again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      {/* ── Ambient Background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(21,88,201,0.08),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(212,255,36,0.04),transparent_65%)] blur-3xl" />
      </div>

      {/* ── Main Layout ── */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-stretch">
        {/* ── Left Panel — Info ── */}
        <div className="flex flex-col justify-center px-6 pt-28 pb-10 sm:px-10 lg:w-[42%] lg:px-12 lg:pt-32 lg:pb-16 xl:px-16">
          <button
            onClick={onBack}
            className="group mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white/50 transition-all hover:border-white/25 hover:text-white/80 lg:mb-12"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-lime/80">
            Recruitment {siteConfig.recruitment.closeDate.split(' ').pop()}
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.02] tracking-tight">
            Join{' '}
            <i className="text-lime">Artiverse.</i>
          </h1>

          <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/50">
            Apply for a personal interview and become part of MSIT's
            creative community. Shape the art, ideas and moments that
            define campus culture.
          </p>

          {/* Feature pills */}
          <div className="mt-10 space-y-3 lg:mt-14">
            {[
              {
                icon: Users,
                label: '240+ applied this season',
              },
              {
                icon: Zap,
                label: `Apply by ${siteConfig.recruitment.closeDate}`,
              },
              {
                icon: Star,
                label: `PI scheduled ${siteConfig.recruitment.piDateRange}`,
              },
              {
                icon: Shield,
                label: 'Info used only for recruitment',
              },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-[13px] text-white/45"
              >
                <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Icon size={14} className="text-white/50" />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Domains grid */}
          <div className="mt-10 hidden lg:block">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Domains
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.domains.map((d) => (
                <span
                  key={d.name}
                  className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/45"
                >
                  {d.icon} {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel — Form ── */}
        <div className="flex flex-1 items-start justify-center px-4 pb-16 sm:px-6 lg:items-center lg:px-8 lg:py-24">
          <div className="w-full max-w-[480px]">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center gap-1">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (i < step) setStep(i)
                      }}
                      disabled={i > step}
                      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                        i === step
                          ? 'bg-lime/[0.1] text-lime border border-lime/30'
                          : i < step
                            ? 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:text-white/70 cursor-pointer'
                            : 'bg-transparent text-white/25 border border-transparent cursor-default'
                      }`}
                    >
                      <span
                        className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                          i === step
                            ? 'bg-lime text-ink'
                            : i < step
                              ? 'bg-white/20 text-white/70'
                              : 'bg-white/10 text-white/30'
                        }`}
                      >
                        {i < step ? '✓' : i + 1}
                      </span>
                      <span className="hidden sm:inline">{s.title}</span>
                    </button>
                    {i < steps.length - 1 && (
                      <div
                        className={`mx-1 h-px w-4 sm:w-6 transition-colors ${
                          i < step ? 'bg-lime/40' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#080a10]/80 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl">
              {/* Card Header */}
              <div className="border-b border-white/[0.06] px-6 py-5 sm:px-8 sm:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="font-display text-2xl tracking-tight sm:text-[28px]">
                      {steps[step].title}
                    </h2>
                    <p className="mt-1.5 text-[13px] text-white/45">
                      {steps[step].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Body */}
              <form onSubmit={submit} noValidate>
                {/* honeypot */}
                <input
                  name="website"
                  value={form.website}
                  onChange={update}
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div ref={formRef} className="px-6 py-6 sm:px-8 sm:py-7">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={
                        reduceMotion ? false : { opacity: 0, y: 16 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {stepContent[step]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="mx-6 mb-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[13px] text-red-400 sm:mx-8">
                    {submitError}
                  </div>
                )}

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-5 sm:px-8 sm:py-6">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={prev}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-white/60 transition-all hover:border-white/25 hover:text-white"
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
                      className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-2.5 text-[13px] font-bold text-ink shadow-[0_0_24px_rgba(212,255,36,0.2)] transition-all hover:shadow-[0_0_36px_rgba(212,255,36,0.4)] active:scale-[0.97]"
                    >
                      Continue
                      <ChevronRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={busy}
                      className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3 text-[13px] font-bold text-ink shadow-[0_0_28px_rgba(212,255,36,0.25)] transition-all hover:shadow-[0_0_40px_rgba(212,255,36,0.5)] disabled:opacity-60 active:scale-[0.97]"
                    >
                      {busy ? (
                        <>
                          <LoaderCircle
                            className="animate-spin"
                            size={16}
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          Submit Application
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Privacy note */}
            <p className="mt-5 text-center text-[11px] leading-5 text-white/25">
              Your information will be used solely for Artiverse recruitment
              and interview coordination.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

