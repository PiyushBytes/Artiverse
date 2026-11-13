import { ArrowUpRight, Check } from 'lucide-react'
import Reveal from '../common/Reveal'

export default function ProductCard({ title, audience, items, id, lime = false }) {
  return (
    <Reveal
      className="group min-h-[380px] rounded-[24px] border border-[#e4e6da]/70 bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0d0f08]/30 hover:shadow-lg flex flex-col justify-between"
      id={id}
    >
      <div>
        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${lime ? 'bg-[#d4ff1f]/30 text-[#0d0f08]' : 'bg-[#fafaf5] text-[#5e6355] border border-[#e4e6da]'}`}>
          {audience}
        </span>
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#0d0f08]">
            {title}
          </h3>
          <span className="grid size-10 place-items-center rounded-full border border-[#e4e6da] text-[#0d0f08] transition-transform group-hover:rotate-45 group-hover:border-[#0d0f08]">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <ul className="mt-7 space-y-3.5">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-[#5e6355]">
              <Check className="mt-0.5 size-4 shrink-0 text-[#0d0f08]" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
