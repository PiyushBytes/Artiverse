import { useState } from 'react'
import {
  CheckCircle2,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function ContactPage({ onToast }) {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Committee Partnership')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) {
      onToast?.('Please fill out all required fields.')
      return
    }
    setSubmitted(true)
    onToast?.('Message dispatched to connect.arteza@gmail.com!')
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
            <MessageSquare size={13} className="text-[#839b3d]" />
            <span>Support & Helpdesk</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#0d0f08]">
            Get in touch with Artiverse
          </h1>
          <p className="mt-2 text-sm text-[#5e6355]">
            Have an event query, want to onboard your college committee, or need festival ticketing assistance?
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="mt-12 grid gap-8 md:grid-cols-5">
          {/* Left Column: Direct channels */}
          <div className="md:col-span-2 space-y-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/917534233233?text=Hi%20Artiverse%20team,%20I%20have%20a%20query%20about%20campus%20committees"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-[22px] border border-[#e4e6da] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#d4ff1f]/30 text-[#414d1e]">
                <Phone size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#839b3d]">
                  Instant WhatsApp
                </span>
                <h4 className="text-sm font-bold text-[#0d0f08]">+91 75342 33233</h4>
                <p className="text-[11px] text-[#5e6355]">Student lead helpdesk · 10am - 8pm</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:connect.arteza@gmail.com"
              className="flex items-center gap-4 rounded-[22px] border border-[#e4e6da] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#0d0f08] text-white">
                <Mail size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#839b3d]">
                  Official Email
                </span>
                <h4 className="text-sm font-bold text-[#0d0f08]">connect.arteza@gmail.com</h4>
                <p className="text-[11px] text-[#5e6355]">Responses within 24 hours</p>
              </div>
            </a>

            {/* Location */}
            <div className="rounded-[22px] border border-[#e4e6da] bg-white p-5 shadow-sm">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#f5f6ef] border border-[#e4e6da] text-[#0d0f08]">
                <MapPin size={20} />
              </span>
              <h4 className="mt-3 text-sm font-bold text-[#0d0f08]">Campus Desk</h4>
              <p className="mt-1 text-xs text-[#5e6355] leading-relaxed">
                Meghnad Saha Institute of Technology, Madurdaha, Kolkata, West Bengal 700150.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="md:col-span-3 rounded-[28px] border border-[#e4e6da] bg-white p-7 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 size={48} className="mx-auto text-[#839b3d]" />
                <h3 className="mt-4 font-display text-2xl font-bold text-[#0d0f08]">
                  Message Received!
                </h3>
                <p className="mt-2 text-xs text-[#5e6355] max-w-sm mx-auto">
                  Thank you, {name}. Our team at connect.arteza@gmail.com will review your query and reply promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-[#0d0f08] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#839b3d]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[#0d0f08]">
                  Send an official query
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sen"
                      className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs outline-none focus:border-[#0d0f08]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@msit.edu"
                      className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs outline-none focus:border-[#0d0f08]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                    Subject / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs outline-none focus:border-[#0d0f08]"
                  >
                    <option value="Committee Partnership">Committee Onboarding / Partnership</option>
                    <option value="Event Ticketing">Event Pass / QR Entry Issue</option>
                    <option value="Recruitment Query">Student Recruitment Support</option>
                    <option value="College Council">College Administration / Council Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can assist you..."
                    className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3.5 py-2.5 text-xs outline-none focus:border-[#0d0f08]"
                  />
                </div>

                <button
                  type="submit"
                  className="lime-button glow w-full flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
                >
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

