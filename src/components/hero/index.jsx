import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import HeroHeadline from './HeroHeadline'
import HeroActions from './HeroActions'
import HeroProof from './HeroProof'
import RoleSwitcher from './RoleSwitcher'
import PhoneMockup from './phone'
import { heroContent } from '../../config/heroData'

export default function Hero({ onApply }) {
  const reduceMotion = useReducedMotion()
  const [activeRole, setActiveRole] = useState('Student')

  // Live registration counter that ticks upward every few seconds
  const [liveCount, setLiveCount] = useState(312)

  useEffect(() => {
    if (reduceMotion) return undefined
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + 1)
    }, 4500)
    return () => clearInterval(interval)
  }, [reduceMotion])

  const fadeUpVariant = {
    hidden: { y: 16, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const leftBlockVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.2,
      },
    },
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1200px] items-center justify-center overflow-x-clip px-6 pb-16 pt-12">
      <div className="grid w-full items-center gap-10 min-[900px]:grid-cols-[1.1fr_0.9fr] min-[900px]:gap-16">
        
        {/* Left Column: Headline, Subtext, CTAs, Proof Row */}
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          variants={leftBlockVariants}
          className="relative z-10 w-full"
        >
          {/* Chip */}
          <motion.div variants={fadeUpVariant} className="mb-6">
            <div className="inline-flex min-h-10 items-center gap-2.5 rounded-full border border-[#dfe1d3] bg-[#f5f6ef] px-4 py-2 text-xs font-semibold text-[#35392d]">
              <span className="size-2 rounded-full bg-[#839b3d]" />
              {heroContent.chip}
            </div>
          </motion.div>

          {/* Headline */}
          <HeroHeadline />

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariant}
            className="mt-6 max-w-[44ch] text-[18px] leading-[1.6] text-[#5e6355]"
          >
            {heroContent.subtext}
          </motion.p>

          {/* CTAs */}
          <HeroActions onApply={onApply} fadeVariant={fadeUpVariant} />

          {/* Proof Row */}
          <HeroProof liveCount={liveCount} fadeVariant={fadeUpVariant} />
        </motion.div>

        {/* Right Column: Role Switcher + Phone Mockup (Middle Aligned Together) */}
        <div className="flex w-full flex-col items-center justify-center">
          <RoleSwitcher activeRole={activeRole} onRoleChange={setActiveRole} />
          <PhoneMockup activeRole={activeRole} />
        </div>

      </div>
    </section>
  )
}

