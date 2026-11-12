import Reveal from '../common/Reveal'
import FAQItem from './FAQItem'
import { landingFaqs } from '../../config/landingData'

export default function FAQSection() {
  return (
    <section className="section-pad bg-[#f6f7f2]">
      <div className="container-x grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">A few useful details</p>
          <h2 className="display-font mt-4 text-[clamp(32px,5vw,52px)] font-semibold leading-tight tracking-[-0.03em] text-[#0d0f08]">
            Good to <span className="highlight italic">know.</span>
          </h2>
        </Reveal>
        <div className="divide-y divide-[#e4e6da] border-y border-[#e4e6da]">
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

