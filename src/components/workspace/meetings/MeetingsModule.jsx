import { useState } from 'react'
import {
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  Users,
  Video,
} from 'lucide-react'
import CreateMeetingModal from './CreateMeetingModal'
import MeetingDetailDrawer from './MeetingDetailDrawer'

export default function MeetingsModule({
  workspace,
  currentUserId,
  onCreateMeeting,
  onUpdateMeeting,
  onConvertActionItemToTask,
  canManageMeetings = true,
}) {
  const [subTab, setSubTab] = useState('upcoming') // 'upcoming' | 'past'
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  const meetings = workspace?.meetings || []
  const todayStr = new Date().toISOString().split('T')[0]

  const upcomingMeetings = meetings
    .filter((m) => (m.date || '') >= todayStr)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  const pastMeetings = meetings
    .filter((m) => (m.date || '') < todayStr)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  const displayedMeetings = subTab === 'upcoming' ? upcomingMeetings : pastMeetings

  return (
    <div className="space-y-6">
      {/* Module Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-[10px] border border-[#e4e6da] bg-[#ffffff] p-1">
          <button
            type="button"
            onClick={() => setSubTab('upcoming')}
            className={`rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition ${
              subTab === 'upcoming'
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            Upcoming Meetings ({upcomingMeetings.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('past')}
            className={`rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition ${
              subTab === 'past'
                ? 'bg-[#0d0f08] text-white shadow-sm'
                : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            Past Archive ({pastMeetings.length})
          </button>
        </div>

        {canManageMeetings && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0d0f08] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#202419] transition"
          >
            <Plus size={15} />
            <span>Schedule Meeting</span>
          </button>
        )}
      </div>

      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedMeetings.map((meeting) => {
          const actionItems = meeting.actionItems || []
          const rsvp = meeting.rsvp || {}
          const attendingCount = Object.values(rsvp).filter((v) => v === 'attending').length

          return (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="group cursor-pointer rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-5 shadow-sm transition hover:border-[#0d0f08] hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        meeting.minutesState === 'published'
                          ? 'border-[#d4ff1f] bg-[#d4ff1f]/30 text-[#0d0f08]'
                          : 'border-[#e4e6da] bg-[#fafaf5] text-[#5e6355]'
                      }`}
                    >
                      {meeting.minutesState === 'published' ? 'Minutes Published' : 'Draft MoM'}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#0d0f08] group-hover:text-black">
                      {meeting.title}
                    </h3>
                  </div>

                  <div className="rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-2.5 py-1.5 text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b907f]">
                      {new Date(meeting.date).toLocaleDateString([], { month: 'short' })}
                    </span>
                    <span className="block text-sm font-black text-[#0d0f08]">
                      {new Date(meeting.date).getDate()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5 text-xs text-[#5e6355]">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#8b907f]" />
                    <span>{meeting.time || '17:00'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.locationType === 'online' ? (
                      <Video size={13} className="text-[#8b907f]" />
                    ) : (
                      <MapPin size={13} className="text-[#8b907f]" />
                    )}
                    <span className="truncate">{meeting.locationValue}</span>
                  </div>
                </div>

                {/* Agenda points */}
                {meeting.agenda?.length > 0 && (
                  <div className="mt-4 border-t border-[#f6f7f0] pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b907f]">
                      Key Agenda ({meeting.agenda.length})
                    </span>
                    <ul className="mt-1 space-y-1 text-xs text-[#5e6355]">
                      {meeting.agenda.slice(0, 2).map((item) => (
                        <li key={item.id} className="truncate">
                          • {item.title}
                        </li>
                      ))}
                      {meeting.agenda.length > 2 && (
                        <li className="text-[11px] text-[#8b907f]">
                          +{meeting.agenda.length - 2} more agenda items...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-[#f6f7f0] pt-3 text-xs text-[#5e6355]">
                <div className="flex items-center gap-1.5">
                  <Users size={13} />
                  <span>{attendingCount} Attending</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-[#0d0f08] group-hover:underline">
                  <FileText size={13} />
                  <span>
                    {actionItems.length > 0 ? `${actionItems.length} Actions` : 'Open MoM'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Designed Empty State */}
      {displayedMeetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e4e6da] bg-[#ffffff] p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fafaf5] text-[#5e6355] mb-3">
            <Calendar size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#0d0f08]">
            No {subTab === 'upcoming' ? 'upcoming' : 'past'} meetings
          </h3>
          <p className="mt-1 max-w-sm text-xs text-[#5e6355]">
            Keep council meetings organized with agenda points, attendance roll, and MoM action items.
          </p>
          {canManageMeetings && subTab === 'upcoming' && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 rounded-[10px] bg-[#0d0f08] px-4 py-2 text-xs font-semibold text-white hover:bg-[#202419]"
            >
              Schedule Meeting
            </button>
          )}
        </div>
      )}

      {/* Meeting Detail Drawer */}
      <MeetingDetailDrawer
        isOpen={Boolean(selectedMeeting)}
        onClose={() => setSelectedMeeting(null)}
        meeting={selectedMeeting}
        workspace={workspace}
        currentUserId={currentUserId}
        onUpdateMeeting={onUpdateMeeting}
        onConvertActionItemToTask={onConvertActionItemToTask}
      />

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateMeeting={onCreateMeeting}
      />
    </div>
  )
}

