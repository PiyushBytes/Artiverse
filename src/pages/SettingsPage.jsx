import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Moon,
  Shield,
  Trash2,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export default function SettingsPage({ currentUser, onSignOut, onToast }) {
  const reduceMotion = useReducedMotion()

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [recruitmentUpdates, setRecruitmentUpdates] = useState(true)
  const [eventPassReminders, setEventPassReminders] = useState(true)

  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')

  const handlePinUpdate = (e) => {
    e.preventDefault()
    if (newPin.length !== 4) {
      onToast?.('New PIN must be exactly 4 digits.')
      return
    }
    onToast?.('Account PIN updated successfully!')
    setCurrentPin('')
    setNewPin('')
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#0d0f08] px-4 pb-20 pt-8 min-[900px]:px-6 min-[900px]:pt-28">
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div className="border-b border-[#e4e6da] pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-3.5 py-1 text-xs font-semibold text-[#35392d]">
            <Lock size={13} className="text-[#839b3d]" />
            <span>Preferences & Privacy</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0d0f08]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-[#5e6355]">
            Manage notifications, communications from connect.arteza@gmail.com, and account security.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Notifications & Communications */}
          <div className="rounded-[24px] border border-[#e4e6da] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#0d0f08] mb-4">
              <Bell size={16} className="text-[#839b3d]" />
              <span>Email & Push Notifications</span>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between py-2 border-b border-[#f0f1ea] cursor-pointer">
                <div>
                  <p className="font-semibold text-[#0d0f08]">Recruitment Status Updates</p>
                  <p className="text-[#5e6355]">Get notified when your PI slot is scheduled or application status changes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={recruitmentUpdates}
                  onChange={(e) => {
                    setRecruitmentUpdates(e.target.checked)
                    onToast?.('Preference updated.')
                  }}
                  className="size-4 rounded border-gray-300 text-[#0d0f08] focus:ring-[#0d0f08]"
                />
              </label>

              <label className="flex items-center justify-between py-2 border-b border-[#f0f1ea] cursor-pointer">
                <div>
                  <p className="font-semibold text-[#0d0f08]">Official Alerts from connect.arteza@gmail.com</p>
                  <p className="text-[#5e6355]">Receive festival lineups, emergency schedule updates, and gate passes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.checked)
                    onToast?.('Email preference updated.')
                  }}
                  className="size-4 rounded border-gray-300 text-[#0d0f08] focus:ring-[#0d0f08]"
                />
              </label>

              <label className="flex items-center justify-between py-2 cursor-pointer">
                <div>
                  <p className="font-semibold text-[#0d0f08]">Event Gate Reminders</p>
                  <p className="text-[#5e6355]">Receive reminders 2 hours before auditorium entry opens.</p>
                </div>
                <input
                  type="checkbox"
                  checked={eventPassReminders}
                  onChange={(e) => {
                    setEventPassReminders(e.target.checked)
                    onToast?.('Reminder preference updated.')
                  }}
                  className="size-4 rounded border-gray-300 text-[#0d0f08] focus:ring-[#0d0f08]"
                />
              </label>
            </div>
          </div>

          {/* Security & 4-Digit PIN */}
          <div className="rounded-[24px] border border-[#e4e6da] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#0d0f08] mb-4">
              <KeyRound size={16} className="text-[#839b3d]" />
              <span>Change Account PIN</span>
            </div>

            <form onSubmit={handlePinUpdate} className="grid gap-4 sm:grid-cols-2 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                  Current 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3 py-2 text-xs font-mono outline-none focus:border-[#0d0f08]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5e6355] mb-1">
                  New 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full rounded-xl border border-[#e4e6da] bg-[#fafaf7] px-3 py-2 text-xs font-mono outline-none focus:border-[#0d0f08]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[#0d0f08] px-5 py-2 text-xs font-semibold text-white hover:bg-[#839b3d] transition-colors"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-[24px] border border-red-200 bg-red-50/30 p-7">
            <h3 className="text-sm font-bold text-red-700">Account Session</h3>
            <p className="mt-1 text-xs text-[#5e6355]">
              Terminate your active session and remove tokens cached on this browser.
            </p>
            <button
              onClick={onSignOut}
              className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out from Device
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

