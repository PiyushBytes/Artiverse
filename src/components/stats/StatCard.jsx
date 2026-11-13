import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import Reveal from '../common/Reveal'

function CountUp({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setCount(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.6,
      onUpdate: (latest) => setCount(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value])

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function StatCard({ stat, index }) {
  return (
    <Reveal delay={index * 0.06} className="text-center px-4">
      <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] text-[#0d0f08]">
        <CountUp value={stat.value} suffix={stat.suffix} />
      </p>
      <p className="mt-2 text-xs sm:text-sm font-medium text-[#5e6355]">
        {stat.label}
      </p>
    </Reveal>
  )
}
