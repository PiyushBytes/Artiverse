import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import PhoneDevice from './PhoneDevice'

export default function PhoneMockup({ activeRole }) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  // Spring physics for smooth desktop mouse parallax
  const springX = useSpring(pointerX, { stiffness: 90, damping: 24 })
  const springY = useSpring(pointerY, { stiffness: 90, damping: 24 })

  // Max 12px parallax for phone
  const phoneX = useTransform(springX, [-1, 1], [-12, 12])
  const phoneY = useTransform(springY, [-1, 1], [-10, 10])

  const handleMouseMove = (event) => {
    if (
      reduceMotion ||
      (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
    ) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    pointerX.set(px)
    pointerY.set(py)
  }

  const handleMouseLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center py-2"
    >
      {/* Lime glow: opacity 0.45, offset behind and slightly below phone, slow breathing */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          reduceMotion
            ? { scale: 1, opacity: 0.45 }
            : { scale: [1, 1.1, 1], opacity: [0.45, 0.58, 0.45] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-[58%] size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#d4ff1f_0%,rgba(212,255,31,0.45)_42%,transparent_70%)] blur-[85px] sm:size-[430px]"
      />

      {/* Outer Phone Wrapper (248px x 504px) */}
      <motion.div
        style={{ x: reduceMotion ? 0 : phoneX, y: reduceMotion ? 0 : phoneY }}
        className="relative z-10 h-[504px] w-[248px] select-none will-change-transform"
      >
        <PhoneDevice activeRole={activeRole} />
      </motion.div>
    </div>
  )
}

