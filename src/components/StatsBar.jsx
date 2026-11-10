import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import { events } from '../config/events'
import { siteConfig } from '../config/siteConfig'

function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.65 })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 55, damping: 18, mass: 0.7 })
  useMotionValueEvent(spring, 'change', current => setDisplay(Math.round(current)))

  useEffect(() => {
    if (inView && !reduceMotion) progress.set(value)
  }, [inView, progress, reduceMotion, value])

  if (reduceMotion) return <span ref={ref}>{value}</span>
  return <span ref={ref}>{display}</span>
}

const stats = [
  { value: events.length, label: 'Events', count: true },
  { value: siteConfig.domains.length, label: 'Domains', count: true },
  { value: siteConfig.foundedYear, label: 'Founded', count: false },
]

export default function StatsBar() {
  const reduceMotion = useReducedMotion()
  return <motion.section
    aria-label="Artiverse facts"
    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className="container-x grid grid-cols-3 border-y border-white/10 py-7"
  >
    {stats.map(({ value, label, count }, index) => <motion.div
      key={label}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center ${index ? 'border-l border-white/10' : ''}`}
    >
      <div className="font-display text-2xl text-lime md:text-3xl">{count ? <CountUp value={value}/> : value}</div>
      <div className="eyebrow mt-2">{label}</div>
    </motion.div>)}
  </motion.section>
}
