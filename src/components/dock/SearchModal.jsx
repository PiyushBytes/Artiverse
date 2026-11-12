import { useEffect, useMemo, useRef, useState } from 'react'
import { Building2, Search, Users, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { siteConfig } from '../../config/siteConfig'

const directoryData = [
  { id: 'msit', name: siteConfig.college, type: 'College Campus', detail: 'Kolkata, West Bengal', tag: 'Campus' },
  { id: 'design', name: 'Design Committee', type: 'Creative Committee', detail: 'MSIT Campus', tag: 'Design' },
  { id: 'cine', name: 'Cine Club MSIT', type: 'Film & Media Committee', detail: 'MSIT Campus', tag: 'Film' },
  { id: 'drama', name: 'Rangrekha Drama Club', type: 'Performing Arts', detail: 'MSIT Campus', tag: 'Drama' },
  { id: 'tech', name: 'Tech & Code Society', type: 'Engineering & Web', detail: 'MSIT Campus', tag: 'Tech' },
  { id: 'literary', name: 'Oratoria Debating Society', type: 'Literary & PI', detail: 'MSIT Campus', tag: 'Literary' },
]

export default function SearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return directoryData
    return directoryData.filter((item) =>
      `${item.name} ${item.type} ${item.detail} ${item.tag}`.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className="fixed inset-0 z-[80] flex items-start justify-center bg-[#0d0f08]/50 px-4 pt-[12vh] backdrop-blur-sm"
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          className="w-full max-w-xl overflow-hidden rounded-[24px] border border-[#e4e6da] bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)]"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 border-b border-[#e4e6da] px-5 py-3.5">
            <Search size={18} className="text-[#5e6355]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a committee or college..."
              className="min-h-10 flex-1 bg-transparent text-sm font-medium text-[#0d0f08] outline-none placeholder:text-[#888d80]"
            />
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full text-[#5e6355] hover:bg-[#f6f7f2]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Directory Listings */}
          <div className="max-h-[55vh] overflow-y-auto p-3 sm:p-4">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#777c70]">
              Committees & Colleges
            </p>

            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect?.(item)
                      onClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-[#f6f7f2]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f6f7f2] text-[#0d0f08]">
                      {item.tag === 'Campus' ? <Building2 size={18} /> : <Users size={18} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-bold text-[#0d0f08]">{item.name}</p>
                        <span className="rounded-full bg-[#f0f2eb] px-2 py-0.5 text-[9px] font-semibold text-[#5e6355]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#5e6355]">
                        {item.type} · {item.detail}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f6f7f2] px-4 py-8 text-center text-sm text-[#5e6355]">
                <p className="font-semibold text-[#0d0f08]">No matching committee found</p>
                <p className="mt-1 text-xs">Try searching for "Design", "Cine", or "MSIT".</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

