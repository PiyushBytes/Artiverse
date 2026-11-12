import { ArrowUpRight, Check } from 'lucide-react'
import Reveal from '../common/Reveal'

export default function ProductCard({ title, audience, items, id, lime = false }) {
  return (
    <Reveal
      className="group min-h-[390px] rounded-[24px] border border-[#e4e6da] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.12)] transition-transform duration-300 hover:-translate-y-1.5 sm:p-8"
      id={id}
    >
      <span className={`text-[11px] font-bold uppercase tracking-[.16em] ${lime ? 'text-[#414d1e]' : 'text-[#5e6355]'}`}>
        {audience}
      </span>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl text-[#0d0f08]">
          {title}
        </h3>
        <span className="grid size-11 place-items-center rounded-full border border-current/15 text-[#0d0f08]">
          <ArrowUpRight size={19} />
        </span>
      </div>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 sm:text-base text-[#424638]">
            <Check className="mt-1 size-4 shrink-0 text-[#5e6355]" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

