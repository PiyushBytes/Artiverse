import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Building2, Check, LoaderCircle, Mail, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { createCommittee } from '../../api/committee'

const emptyForm = {
  name: '',
  username: '',
  description: '',
  email: '',
}

function makeHandle(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30)
}

export default function CreateCommitteeWizard({
  isOpen,
  onClose,
  onCreated,
  onOpenCommitteeDashboard,
  onToast,
  userCommittees = [],
}) {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState(emptyForm)
  const [handleEdited, setHandleEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const submitting = useRef(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  useEffect(() => {
    if (isOpen) return
    setForm(emptyForm)
    setHandleEdited(false)
    setLoading(false)
    submitting.current = false
    setError('')
    setCreated(null)
  }, [isOpen])

  const close = () => {
    if (!loading) onClose?.()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting.current) return
    setError('')

    const name = form.name.trim()
    // Read the controlled field at submit time so the request always uses the
    // handle currently visible in the form, including a newly suggested one.
    const handleInput = event.currentTarget.elements.namedItem('committee-handle')
    const username = String(handleInput?.value ?? form.username).trim().toLowerCase()
    const description = form.description.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !username || !description || !email) {
      setError('Complete all four required fields to create your committee.')
      return
    }

    submitting.current = true
    setLoading(true)
    try {
      const response = await createCommittee({
        committee_username: username,
        committee_name: name,
        committee_description: description,
        committee_mail: email,
      })
      const committee = {
        name: response.committee_name || name,
        username: response.committee_username || username,
      }

      setCreated(committee)
      onCreated?.(committee)
      if (!onCreated) onToast?.(`Committee "${committee.name}" created successfully.`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to create the committee. Please try again.')
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  const openDashboard = () => {
    if (created) onOpenCommitteeDashboard?.(created)
    close()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close create committee dialog"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[#0d0f08]/65 backdrop-blur-md"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-committee-title"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="relative z-10 max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#e4e6da] bg-[#fafaf5] p-5 shadow-[0_24px_64px_-18px_rgba(0,0,0,.35)] sm:p-7"
          >
            <header className="flex items-center justify-between gap-4 border-b border-[#e4e6da] pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#d4ff1f] text-[#0d0f08]"><Building2 size={19} /></span>
                <div className="min-w-0">
                  <h2 id="create-committee-title" className="text-base font-bold text-[#0d0f08]">Create a committee</h2>
                  <p className="mt-0.5 text-xs text-[#5e6355]">A simple profile to get your committee started.</p>
                </div>
              </div>
              <button type="button" onClick={close} disabled={loading} aria-label="Close dialog" className="grid size-10 shrink-0 place-items-center rounded-full text-[#5e6355] hover:bg-black/5 disabled:opacity-50"><X size={18} /></button>
            </header>

            {created ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#d4ff1f] text-[#0d0f08]"><Check size={27} strokeWidth={3} /></span>
                <h3 className="mt-4 text-2xl font-semibold text-[#0d0f08]">Committee created</h3>
                <p className="mt-2 text-sm font-semibold text-[#454a3d]">@{created.username}</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#5e6355]">{created.name} is now linked to your account. Continue to its dashboard to manage the committee.</p>
                <button type="button" onClick={openDashboard} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d4ff1f] px-6 text-sm font-bold text-[#0d0f08] hover:-translate-y-0.5">Open committee dashboard <ArrowRight size={16} /></button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 pt-5">
                {error && (
                  <div role="alert" className="space-y-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm leading-5 text-red-800">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={17} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="committee-name" className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">Committee name *</label>
                  <input
                    id="committee-name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value
                      setForm((current) => ({ ...current, name, ...(!handleEdited ? { username: makeHandle(name) } : {}) }))
                      setError('')
                    }}
                    placeholder="e.g. ArtiKon"
                    autoComplete="organization"
                    className="mt-1.5 min-h-12 w-full rounded-2xl border border-[#dfe1d3] bg-white px-4 text-sm font-medium text-[#0d0f08] outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
                  />
                </div>

                <div>
                  <label htmlFor="committee-handle" className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">Unique handle / username *</label>
                  <div className="relative mt-1.5">
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-[#5e6355]">@</span>
                    <input
                      id="committee-handle"
                      required
                      minLength={3}
                      maxLength={30}
                      pattern="[a-zA-Z0-9_]+"
                      title="Use 3–30 letters, numbers, or underscores."
                      value={form.username}
                      onChange={(event) => {
                        setHandleEdited(true)
                        setForm((current) => ({ ...current, username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))
                        setError('')
                      }}
                      placeholder="committee_handle"
                      autoCapitalize="none"
                      autoComplete="off"
                      className="min-h-12 w-full rounded-2xl border border-[#dfe1d3] bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-[#0d0f08] outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-5 text-[#707567]">3–30 characters. Use letters, numbers, and underscores. The server checks availability when you submit.</p>
                </div>

                <div>
                  <label htmlFor="committee-description" className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">Short description *</label>
                  <textarea
                    id="committee-description"
                    required
                    rows={3}
                    maxLength={500}
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="What does your committee do?"
                    className="mt-1.5 w-full resize-y rounded-2xl border border-[#dfe1d3] bg-white px-4 py-3 text-sm leading-6 text-[#0d0f08] outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
                  />
                </div>

                <div>
                  <label htmlFor="committee-email" className="block text-xs font-semibold uppercase tracking-wider text-[#5e6355]">Official committee email *</label>
                  <div className="relative mt-1.5">
                    <Mail size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#707567]" />
                    <input
                      id="committee-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="committee@example.org"
                      autoComplete="email"
                      className="min-h-12 w-full rounded-2xl border border-[#dfe1d3] bg-white py-2.5 pl-11 pr-4 text-sm text-[#0d0f08] outline-none focus:border-[#0d0f08] focus:ring-2 focus:ring-[#0d0f08]/10"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d4ff1f] px-6 text-sm font-bold text-[#0d0f08] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(13,15,8,.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d0f08] disabled:cursor-wait disabled:opacity-70">
                  {loading ? <><LoaderCircle size={17} className="animate-spin" /> Creating committee…</> : <>Create committee <ArrowRight size={17} /></>}
                </button>
                <p className="text-center text-[11px] leading-5 text-[#707567]">Your signed-in account is attached securely to this request.</p>
              </form>
            )}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  )
}
