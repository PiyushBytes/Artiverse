import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import { ArrowDown, ArrowUpRight, Play, Volume2, VolumeX } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import BrandDuotoneVideo from './BrandDuotoneVideo'

const rotatingWords = ['Limits', 'Boundaries', 'Imagination', 'Expectations', 'Ordinary', 'Possibilities']

function getDaysLeft() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(siteConfig.recruitment.deadline)
  deadline.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((deadline - today) / 86400000))
}

function useTypewriter(words, paused) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const word = words[index]
    const delay = !deleting && text === word ? 1600 : deleting ? 45 : 90
    const timer = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex(current => (current + 1) % words.length)
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [text, deleting, index, paused, words])

  return text
}

export default function Hero({ onApply }) {
  const figureRef = useRef(null)
  const figureVideoRef = useRef(null)
  const glowRef = useRef(null)
  const audioRef = useRef(null)
  const userMutedRef = useRef(false)
  const applicantsRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [displayedApplicants, setDisplayedApplicants] = useState(0)
  const typedWord = useTypewriter(rotatingWords, reduceMotion)
  const word = reduceMotion ? 'Possibilities' : typedWord
  const daysLeft = getDaysLeft()
  const applicantsInView = useInView(applicantsRef, { once: true, amount: 0.8 })
  const applicantValue = useMotionValue(0)
  const applicantSpring = useSpring(applicantValue, { stiffness: 48, damping: 18, mass: 0.7 })
  useMotionValueEvent(applicantSpring, 'change', value => setDisplayedApplicants(Math.round(value)))
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const videoX = useSpring(pointerX, { stiffness: 45, damping: 20 })
  const videoY = useSpring(pointerY, { stiffness: 45, damping: 20 })

  useEffect(() => {
    if (applicantsInView) applicantValue.set(240)
  }, [applicantsInView, applicantValue])

  // Ensure background video plays automatically and loops continuously without being interrupted
  useEffect(() => {
    const video = figureVideoRef.current
    if (!video) return
    if (!reduceMotion) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [reduceMotion])

  // Automatic music playback upon opening website + user gesture fallback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.65

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMusicPlaying(true)
        })
        .catch(() => {
          // If browser blocks autoplay before user gesture, start immediately on first interaction
          const handleFirstGesture = () => {
            if (!userMutedRef.current && audio.paused) {
              audio.play().then(() => setIsMusicPlaying(true)).catch(() => {})
            }
            window.removeEventListener('click', handleFirstGesture)
            window.removeEventListener('touchstart', handleFirstGesture)
            window.removeEventListener('scroll', handleFirstGesture)
            window.removeEventListener('keydown', handleFirstGesture)
            window.removeEventListener('pointerdown', handleFirstGesture)
          }

          window.addEventListener('click', handleFirstGesture, { once: true })
          window.addEventListener('touchstart', handleFirstGesture, { once: true })
          window.addEventListener('scroll', handleFirstGesture, { once: true })
          window.addEventListener('keydown', handleFirstGesture, { once: true })
          window.addEventListener('pointerdown', handleFirstGesture, { once: true })
        })
    }

    return () => {
      audio.pause()
    }
  }, [])

  // Audio pause button ONLY controls music, never stops background video!
  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isMusicPlaying) {
      audio.pause()
      setIsMusicPlaying(false)
      userMutedRef.current = true
    } else {
      userMutedRef.current = false
      audio.play().then(() => {
        setIsMusicPlaying(true)
      }).catch(() => {})
    }
  }

  const movePointer = (event) => {
    if (reduceMotion || !figureRef.current) return
    const bounds = figureRef.current.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
    pointerX.set(Math.max(-1, Math.min(1, x)) * -12)
    pointerY.set(Math.max(-1, Math.min(1, y)) * -8)
    if (glowRef.current) {
      glowRef.current.style.left = `${event.clientX - bounds.left}px`
      glowRef.current.style.top = `${event.clientY - bounds.top}px`
      glowRef.current.style.opacity = '1'
    }
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <section className="hero relative flex min-h-[100svh] items-center overflow-hidden bg-[#05060a] px-4 pb-12 pt-28 sm:px-6 sm:pt-36">
      <audio ref={audioRef} src="/sounds/sonican-dramatic-classical-art-music-30-seconds-478122.mp3" autoPlay loop preload="auto" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl lg:max-w-[1380px] items-center gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-14">
        <div className="relative z-10 flex w-full max-w-[36rem] flex-col items-start text-left">
          <div className="mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-lime/30 bg-ink/45 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[.15em] text-white/85 backdrop-blur sm:mb-10 sm:gap-2.5 sm:px-5 sm:text-[10px] sm:tracking-[.19em]">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-lime" />
            </span>
            <span>Recruitments open <span className="px-1 text-lime">·</span> Apply by {siteConfig.recruitment.closeDate}</span>
          </div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-left font-display text-[clamp(2.55rem,5.2vw,5rem)] font-semibold leading-[1.04] tracking-[-.01em] text-white"
          >
            <span className="block whitespace-nowrap">Create Beyond</span>
            <span className="mt-1 block min-h-[1.08em] whitespace-nowrap italic text-lime sm:mt-2">
              {word}
              <span className="hero-type-caret ml-1.5 inline-block h-[0.9em] w-[2.5px] sm:w-[3px] translate-y-[0.06em] rounded-full bg-lime shadow-[0_0_8px_#D4FF24]" aria-hidden="true" />
            </span>
          </motion.h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/70 sm:text-base">
            Make the ideas, images and moments that shape campus culture.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-3 sm:mt-10 sm:gap-4">
            <button onClick={onApply} className="lime-button hero-shine rounded-full px-7 py-3.5 font-semibold sm:px-8 sm:py-4">
              Apply for PI <ArrowUpRight size={17} />
            </button>
            <a href="#process" className="ghost-button rounded-full border-white/25 px-6 py-3.5 text-sm text-white transition-colors hover:bg-white/10 sm:px-7 sm:py-4">
              See how it works <ArrowDown size={15} />
            </a>
          </div>

          <div className="mt-10 flex w-full max-w-[min(100%,36rem)] items-center gap-3 sm:mt-12 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[.05] px-3.5 py-2.5 sm:px-4 sm:py-3 text-white/80 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="flex shrink-0 -space-x-2" aria-hidden="true">
                {[
                  { letter: 'A', bg: '#d4ff24' },
                  { letter: 'R', bg: '#6f9bff' },
                  { letter: 'T', bg: '#ff8ca5' },
                  { letter: 'I', bg: '#c084fc' },
                  { letter: 'V', bg: '#38bdf8' },
                ].map(({ letter, bg }) => (
                  <span
                    key={letter}
                    className="grid size-7 place-items-center rounded-full border-2 border-[#05060a] text-[8px] font-bold text-ink sm:size-8 sm:text-[9px]"
                    style={{ backgroundColor: bg }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs sm:text-[13px] text-white/80">
                <span className="flex items-baseline gap-1">
                  <strong ref={applicantsRef} className="font-display text-base sm:text-lg font-bold leading-none text-white">
                    {reduceMotion ? 240 : displayedApplicants}+
                  </strong>
                  <span className="text-white/75">applied</span>
                </span>
                <span className="text-white/35 font-bold">·</span>
                <span className="text-white/65">{daysLeft} days left</span>
              </div>
            </div>

            {/* Dedicated Audio Control: Pauses/Resumes ONLY music, video keeps playing */}
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isMusicPlaying ? 'Pause background music' : 'Play background music'}
              title={isMusicPlaying ? 'Pause soundtrack (video continues)' : 'Play soundtrack'}
              aria-pressed={!isMusicPlaying}
              className="group relative grid size-12 shrink-0 place-items-center rounded-full border border-white/20 bg-[#080a10]/85 text-white shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:border-lime/60 hover:text-lime hover:shadow-[0_0_24px_rgba(212,255,36,0.35)] focus-visible:outline-lime sm:size-14"
            >
              {isMusicPlaying ? (
                <div className="flex items-center gap-[3px]" aria-hidden="true">
                  <span className="h-3.5 w-[3px] animate-[music-bar_0.75s_ease-in-out_infinite] rounded-full bg-lime" />
                  <span className="h-5 w-[3px] animate-[music-bar_0.75s_ease-in-out_0.2s_infinite] rounded-full bg-lime" />
                  <span className="h-3 w-[3px] animate-[music-bar_0.75s_ease-in-out_0.4s_infinite] rounded-full bg-lime" />
                </div>
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5 text-white/80 group-hover:text-lime transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Video Canvas: Always continues playing */}
        <div
          ref={figureRef}
          onMouseMove={movePointer}
          onMouseLeave={resetPointer}
          className="hero-art relative isolate mx-auto mt-2 min-h-[300px] w-full max-w-[38rem] overflow-visible sm:min-h-[380px] lg:mx-0 lg:ml-auto lg:mt-0 lg:min-h-[540px] lg:translate-x-6 lg:-translate-y-8"
        >
          <div className="pointer-events-none absolute inset-[8%] z-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(21,88,201,.28),rgba(111,155,255,.08)_38%,transparent_72%)] blur-[70px]" />
          <div
            ref={glowRef}
            className="pointer-events-none absolute z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/35 opacity-0 blur-[90px] transition-opacity duration-500"
          />
          <motion.div
            className="hero-video-wrapper absolute inset-[-4%] -right-20 overflow-hidden lg:inset-y-[-4%] lg:left-0 lg:-right-20"
            style={{
              x: reduceMotion ? 0 : videoX,
              y: reduceMotion ? 0 : videoY,
              mixBlendMode: 'screen',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, #000 25%, #000 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 20%, #000 70%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, #000 25%, #000 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 20%, #000 70%, transparent 100%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          >
            <BrandDuotoneVideo
              ref={figureVideoRef}
              className="hero-video absolute inset-0 h-full w-full scale-110 object-cover object-[center_30%]"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
