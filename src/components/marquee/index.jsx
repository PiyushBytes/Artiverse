import { useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useVelocity } from 'motion/react'
import { eventNames } from '../../config/landingData'

export default function EventMarquee() {
  const trackRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  useMotionValueEvent(scrollVelocity, 'change', (velocity) => {
    if (reduceMotion || !trackRef.current) return
    const duration = Math.max(12, 34 - Math.min(22, Math.abs(velocity) / 50))
    trackRef.current.style.setProperty('--marquee-duration', `${duration}s`)
  })

  const baseItems = [...eventNames, 'Built for Campus Communities']
  const items = [...baseItems, ...baseItems, ...baseItems]

  return (
    <section aria-label="Featured campus events" className="overflow-hidden border-y border-[#e4e6da] bg-[#f6f7f2] py-4 sm:py-5">
      <div ref={trackRef} className="marquee-track flex w-max items-center gap-7 sm:gap-10" aria-hidden="true">
        {items.map((name, index) => (
          <span key={`${name}-${index}`} className="flex items-center gap-7 whitespace-nowrap sm:gap-10">
            {name === 'Built for Campus Communities' ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dfe1d3] bg-white px-3.5 py-1 text-xs font-bold tracking-tight text-[#0d0f08] shadow-sm sm:text-sm">
                <span className="size-2 rounded-full bg-[#d4ff1f]" />
                {name}
              </span>
            ) : (
              <span className="text-base font-semibold tracking-[-0.02em] text-[#34382c] sm:text-lg">
                {name}
              </span>
            )}
            <span className="text-[#849158]">✦</span>
          </span>
        ))}
      </div>
      <span className="sr-only">{eventNames.join(', ')}, Built for Campus Communities</span>
    </section>
  )
}

