import Reveal from '../common/Reveal'
import FAQItem from './FAQItem'
import { landingFaqs } from '../../config/landingData'

export default function FAQSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 items-start">
        <Reveal className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8b907f]">
            A few useful details
          </p>
          <h2 className="display-font mt-3 text-[clamp(32px,5vw,50px)] font-semibold leading-tight tracking-[-0.03em] text-[#0d0f08]">
            Good to <span className="highlight italic">know.</span>
          </h2>
          <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-[#5e6355]">
            Everything you need to know about Artiverse, committee admissions, and ticketing.
          </p>
        </Reveal>
        
        {/* Sleek individual cards without dividing lines */}
        <div className="space-y-3.5">
          {landingFaqs.map(({ question, answer }, index) => (
            <FAQItem
              key={question}
              question={question}
              answer={answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
