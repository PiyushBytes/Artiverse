import Reveal from '../common/Reveal'

export default function FAQItem({ question, answer, index }) {
  return (
    <Reveal delay={index * 0.04}>
      <details className="group rounded-[16px] border border-[#e4e6da]/70 bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.015)] transition-all duration-200 hover:border-[#0d0f08]/30 hover:shadow-md">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#0d0f08] sm:text-base [&::-webkit-details-marker]:hidden">
          <span>{question}</span>
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-[#e4e6da] bg-[#fafaf5] text-sm font-normal text-[#0d0f08] transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <p className="max-w-2xl pt-3 text-xs sm:text-sm leading-relaxed text-[#5e6355]">
          {answer}
        </p>
      </details>
    </Reveal>
  )
}
