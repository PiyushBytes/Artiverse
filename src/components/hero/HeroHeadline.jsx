import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const words = ['committees.', 'events.', 'students.', 'stories.']

export default function HeroHeadline() {
  const reduceMotion = useReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState(reduceMotion ? words[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setText(words[0])
      return undefined
    }
    const word = words[wordIndex % words.length]
    let timer
    if (!deleting && text === word) timer = setTimeout(() => setDeleting(true), 1600)
    else if (deleting && text === '') {
      setDeleting(false)
      setWordIndex((index) => index + 1)
    } else timer = setTimeout(() => setText(word.slice(0, text.length + (deleting ? -1 : 1))), deleting ? 40 : 70)
    return () => clearTimeout(timer)
  }, [text, deleting, wordIndex, reduceMotion])

  return (
    <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }} className="hero-headline display-font max-w-none text-[clamp(2rem,7vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.055em] text-[#0d0f08] min-[900px]:text-[clamp(2rem,4.1vw,3.75rem)]">
      <span className="sr-only">The home for campus committees, events, students and stories.</span>
      <span aria-hidden="true">
        <span className="hero-headline-line">The home for campus</span>
        <span className="hero-headline-line"><em className="hero-headline-highlight">{text}{!reduceMotion && <i className="hero-headline-caret" />}</em></span>
      </span>
    </motion.h1>
  )
}

