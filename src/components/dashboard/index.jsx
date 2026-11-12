import { ArrowLeft } from 'lucide-react'
import StudentDashboard from './StudentDashboard'
import LeadDashboard from './LeadDashboard'

export default function Dashboard({ currentUser, onBack, onToast }) {
  const isLead = currentUser?.role === 'lead'

  return (
    <div className="min-h-screen bg-[#fafbf7] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Dashboard Top Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e6da] bg-white px-4 py-2 text-xs font-semibold text-[#0d0f08] shadow-sm hover:bg-[#f6f7f2]"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <span className="rounded-full bg-[#e8f4cc] px-3.5 py-1 text-xs font-bold text-[#46630b]">
            {isLead ? 'Lead Portal' : 'Student Portal'}
          </span>
        </div>

        {/* Dynamic View based on Role */}
        {isLead ? (
          <LeadDashboard user={currentUser} onToast={onToast} />
        ) : (
          <StudentDashboard user={currentUser} onToast={onToast} />
        )}
      </div>
    </div>
  )
}

