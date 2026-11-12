import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

export default function MagneticButton({ children, onClick, className = '', ...props }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 150, damping: 16 })
  const y = useSpring(my, { stiffness: 150, damping: 16 })

  const move = (event) => {
    if (reduceMotion || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) || !ref.current) {
      return
    }
    const bounds = ref.current.getBoundingClientRect()
    mx.set(Math.max(-8, Math.min(8, (event.clientX - bounds.left - bounds.width / 2) * 0.18)))
    my.set(Math.max(-6, Math.min(6, (event.clientY - bounds.top - bounds.height / 2) * 0.18)))
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      onMouseMove={move}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

