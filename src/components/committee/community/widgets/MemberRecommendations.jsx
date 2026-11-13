import { useState } from 'react'
import { Check, UserPlus } from 'lucide-react'

export default function MemberRecommendations({ recommendations = [], onConnect }) {
  const [connectedIds, setConnectedIds] = useState({})

  const handleConnect = (id) => {
    setConnectedIds((prev) => ({ ...prev, [id]: !prev[id] }))
    onConnect?.(id)
  }

  return (
    <div className="rounded-[24px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <h4 className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
        Recommendation
      </h4>

      <div className="mt-3 space-y-3">
        {recommendations.map((rec) => {
          const isConnected = connectedIds[rec.id]
          return (
            <div key={rec.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={rec.avatar}
                  alt={rec.name}
                  className="size-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="truncate text-xs font-bold text-[#0f172a]">
                    {rec.name}
                  </h5>
                  <p className="truncate text-[10px] text-[#94a3b8]">
                    {rec.mutuals}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleConnect(rec.id)}
                className={`grid size-7 place-items-center rounded-xl transition ${
                  isConnected
                    ? 'bg-[#eff6ff] text-[#2563eb]'
                    : 'text-[#2563eb] hover:bg-[#eff6ff]'
                }`}
                title={isConnected ? 'Connected' : 'Connect'}
              >
                {isConnected ? <Check size={14} /> : <UserPlus size={14} />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

