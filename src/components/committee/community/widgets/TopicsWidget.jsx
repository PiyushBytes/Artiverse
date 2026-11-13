import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export default function TopicsWidget({ topics: initialTopics = [], onSelectTopic }) {
  const [topics, setTopics] = useState(initialTopics)

  const handleRemove = (topic, e) => {
    e.stopPropagation()
    setTopics((prev) => prev.filter((t) => t !== topic))
  }

  return (
    <div className="rounded-[24px] border border-[#e9ecef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          Topics You Follow
        </h4>
        <SlidersHorizontal size={13} className="text-[#94a3b8]" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onSelectTopic?.(t)}
            className="group flex items-center gap-1 rounded-xl bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#2563eb] hover:bg-[#dbeafe] transition"
          >
            <span>{t}</span>
            <span
              onClick={(e) => handleRemove(t, e)}
              className="rounded-full p-0.5 text-[#93c5fd] hover:text-[#1d4ed8]"
            >
              <X size={10} />
            </span>
          </button>
        ))}

        {topics.length === 0 && (
          <p className="text-xs text-[#94a3b8]">No topics selected.</p>
        )}
      </div>
    </div>
  )
}

