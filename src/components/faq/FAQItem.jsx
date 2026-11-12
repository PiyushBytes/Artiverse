import Reveal from '../common/Reveal'

export default function FAQItem({ question, answer, index }) {
  return (
    <Reveal delay={index * 0.04}>
      <details className="group py-5">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-[#0d0f08] sm:text-base [&::-webkit-details-marker]:hidden">
          <span>{question}</span>
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-[#e4e6da] text-lg font-normal text-[#0d0f08] transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <p className="max-w-2xl pb-1 pr-10 text-sm leading-[1.65] text-[#5e6355]">
          {answer}
        </p>
      </details>
    </Reveal>
  )
}

