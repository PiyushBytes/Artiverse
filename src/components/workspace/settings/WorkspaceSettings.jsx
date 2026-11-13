import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Eye,
  Globe,
  Lock,
  Palette,
  Save,
  Shield,
  Trash2,
} from 'lucide-react'

export default function WorkspaceSettings({
  committee,
  workspace,
  currentUserId,
  onUpdateCommittee,
  onTransferOwnership,
  onToast,
}) {
  const isOwner = workspace?.ownerId === currentUserId

  const [name, setName] = useState(committee?.name || '')
  const [handle, setHandle] = useState(committee?.handle || '')
  const [tagline, setTagline] = useState(committee?.tagline || '')
  const [description, setDescription] = useState(committee?.description || '')
  const [category, setCategory] = useState(committee?.category || 'Design & Arts')
  const [isPublic, setIsPublic] = useState(committee?.isPublic ?? true)
  const [allowPublicApplications, setAllowPublicApplications] = useState(
    committee?.allowPublicApplications ?? true
  )

  const [typedConfirmation, setTypedConfirmation] = useState('')
  const [transferTargetId, setTransferTargetId] = useState('')
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const members = workspace?.members || []

  const handleSaveGeneral = (e) => {
    e.preventDefault()
    onUpdateCommittee?.({
      ...committee,
      name,
      handle,
      tagline,
      description,
      category,
      isPublic,
      allowPublicApplications,
    })
    onToast?.('Committee settings updated successfully')
  }

  const handleConfirmTransfer = () => {
    if (typedConfirmation.trim().toUpperCase() !== 'TRANSFER OWNERSHIP') {
      alert('Please type "TRANSFER OWNERSHIP" in capital letters to confirm.')
      return
    }
    if (!transferTargetId) {
      alert('Please select a member to transfer ownership to.')
      return
    }
    onTransferOwnership?.(transferTargetId)
    setIsTransferOpen(false)
    setTypedConfirmation('')
    onToast?.('Ownership transferred successfully.')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* General Settings */}
      <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0d0f08]">General Settings</h3>
        <p className="mt-1 text-xs text-[#5e6355]">
          Manage committee public profile information and discovery parameters.
        </p>

        <form onSubmit={handleSaveGeneral} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Committee Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
              One-Line Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
              About & Mission
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-2 text-xs text-[#0d0f08] focus:border-[#0d0f08] focus:outline-none"
              >
                <option value="Design & Arts">Design & Arts</option>
                <option value="Technical & Coding">Technical & Coding</option>
                <option value="Cultural & Music">Cultural & Music</option>
                <option value="Literary & Debating">Literary & Debating</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Social & Community">Social & Community</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#e4e6da]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0d0f08] px-4 py-2 text-xs font-semibold text-white hover:bg-[#202419]"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Visibility Settings */}
      <div className="rounded-[14px] border border-[#e4e6da] bg-[#ffffff] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0d0f08]">Visibility & Access</h3>
        <p className="mt-1 text-xs text-[#5e6355]">
          Control how visitors and students interact with this committee on Artiverse.
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3.5">
            <div>
              <span className="text-xs font-bold text-[#0d0f08]">Public Community Hub</span>
              <p className="text-[11px] text-[#5e6355]">
                Allow students to view announcements, events, and follow your committee.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                isPublic
                  ? 'bg-[#d4ff1f] text-[#0d0f08]'
                  : 'bg-[#e4e6da] text-[#5e6355]'
              }`}
            >
              {isPublic ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-[10px] border border-[#e4e6da] bg-[#fafaf5] p-3.5">
            <div>
              <span className="text-xs font-bold text-[#0d0f08]">Open Join Applications</span>
              <p className="text-[11px] text-[#5e6355]">
                Show the &quot;Join / Apply&quot; button on public profile and accept member requests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAllowPublicApplications(!allowPublicApplications)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                allowPublicApplications
                  ? 'bg-[#d4ff1f] text-[#0d0f08]'
                  : 'bg-[#e4e6da] text-[#5e6355]'
              }`}
            >
              {allowPublicApplications ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      {isOwner && (
        <div className="rounded-[14px] border border-rose-200 bg-rose-50/30 p-6">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle size={17} />
            <h3 className="text-sm font-bold">Danger Zone</h3>
          </div>
          <p className="mt-1 text-xs text-rose-700">
            Ownership grants complete administrative and permission control over all workspace modules.
          </p>

          <div className="mt-4 flex items-center justify-between rounded-[10px] border border-rose-200 bg-white p-4">
            <div>
              <span className="text-xs font-bold text-[#0d0f08]">Transfer Committee Ownership</span>
              <p className="text-[11px] text-[#5e6355]">
                Transfer full Owner lock and permissions to another active committee member.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              className="rounded-[10px] border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
            >
              Transfer...
            </button>
          </div>

          {/* Transfer Ownership Modal */}
          {isTransferOpen && (
            <div className="mt-4 rounded-[10px] border border-rose-300 bg-white p-4 space-y-3">
              <span className="text-xs font-bold text-rose-900">
                Confirm Ownership Transfer
              </span>
              <p className="text-[11px] text-rose-700">
                This action cannot be undone. You will lose Owner privileges and become a Member.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Select Successor
                </label>
                <select
                  value={transferTargetId}
                  onChange={(e) => setTransferTargetId(e.target.value)}
                  className="w-full rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs text-[#0d0f08]"
                >
                  <option value="">Choose a member...</option>
                  {members
                    .filter((m) => m.id !== currentUserId)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0d0f08] mb-1">
                  Type <span className="font-mono text-rose-800">TRANSFER OWNERSHIP</span> to confirm
                </label>
                <input
                  type="text"
                  value={typedConfirmation}
                  onChange={(e) => setTypedConfirmation(e.target.value)}
                  placeholder="TRANSFER OWNERSHIP"
                  className="w-full rounded-[8px] border border-[#e4e6da] bg-[#fafaf5] px-3 py-1.5 text-xs text-[#0d0f08] font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="rounded-[8px] border border-[#e4e6da] px-3 py-1 text-xs text-[#5e6355]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={typedConfirmation.trim().toUpperCase() !== 'TRANSFER OWNERSHIP'}
                  onClick={handleConfirmTransfer}
                  className="rounded-[8px] bg-rose-700 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

