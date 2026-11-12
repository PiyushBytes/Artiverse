import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { stepsByProduct } from '../../config/landingData'
import Reveal from '../common/Reveal'
import ProcessStepCard from './ProcessStepCard'

export default function HowItWorks() {
  const [product, setProduct] = useState('Events')
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    setActiveStep(0)
    if (reduceMotion || window.innerWidth < 1024) return undefined

    let cancelled = false
    let context
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, triggerModule]) => {
        if (cancelled || !sectionRef.current) return
        const gsap = gsapModule.gsap || gsapModule.default
        const ScrollTrigger = triggerModule.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)
        const cards = gsap.utils.toArray('[data-workflow-step]', sectionRef.current)
        context = gsap.context(() => {
          gsap.set(cards, { opacity: 0.55, y: 8, scale: 0.99 })
          gsap.set(cards[0], { opacity: 1, y: 0, scale: 1 })
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top+=40',
              end: '+=1400',
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const step = Math.min(3, Math.floor(self.progress * 4))
                setActiveStep((current) => (current === step ? current : step))
              },
            },
          })
          cards.forEach((card, index) =>
            timeline.to(
              card,
              { opacity: 1, y: 0, scale: 1.02, duration: 0.8, ease: 'none' },
              index
            )
          )
        }, sectionRef)
      }
    ).catch(() => {})

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [product, reduceMotion])

  return (
    <section ref={sectionRef} id="how-it-works" className="section-pad">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Simple by design</p>
            <h2 className="display-font mt-3 text-[clamp(32px,5vw,52px)] font-semibold leading-tight tracking-[-0.03em] text-[#0d0f08]">
              From idea to <span className="highlight italic">impact.</span>
            </h2>
          </div>
          <div
            role="group"
            aria-label="Choose a product workflow"
            className="inline-flex rounded-full border border-[#e4e6da] bg-[#f6f7f2] p-1"
          >
            {Object.keys(stepsByProduct).map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={product === name}
                onClick={() => setProduct(name)}
                className={`relative min-h-10 rounded-full px-5 text-sm font-semibold transition-colors ${
                  product === name ? 'text-white' : 'text-[#5e6355] hover:text-[#0d0f08]'
                }`}
              >
                {product === name && !reduceMotion && (
                  <motion.span
                    layoutId="workflow-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#0d0f08]"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
                {product === name && reduceMotion && (
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#0d0f08]" />
                )}
                <span className="relative z-10">{name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-9 min-h-[192px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={product}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stepsByProduct[product].map((step, i) => (
                <ProcessStepCard
                  key={step}
                  step={step}
                  index={i}
                  active={activeStep === i}
                  product={product}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

