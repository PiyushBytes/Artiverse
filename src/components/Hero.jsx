import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import BrandDuotoneVideo from './BrandDuotoneVideo'

const words = [
  { text: 'Create', className: 'italic text-lime' },
  { text: 'Every', className: 'text-lime' },
  { text: 'Story.', className: 'font-body font-light text-cobalt-soft' },
]

function ApplyBadge({ onApply }) {
  return <button onClick={onApply} aria-label="Apply now for the Artiverse personal interview" className="apply-badge absolute bottom-[14%] left-[2%] z-20 grid size-28 place-items-center rounded-full text-lime sm:size-28">
    <svg viewBox="0 0 140 140" className="absolute inset-0 size-full" aria-hidden="true">
      <defs><path id="apply-badge-circle" d="M70,70 m-51,0 a51,51 0 1,1 102,0 a51,51 0 1,1 -102,0" /></defs>
      <text className="badge-text"><textPath href="#apply-badge-circle">APPLY NOW • PI IS OPEN • ARTIVERSE 2026 •</textPath></text>
    </svg>
    <span className="grid size-11 place-items-center rounded-full border border-lime/40 bg-ink/75 backdrop-blur"><ArrowUpRight size={20}/></span>
  </button>
}

export default function Hero({ onApply }) {
  const imageRef = useRef(null)
  const glowRef = useRef(null)
  const ctaRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const reveal = { hidden: { y: '105%' }, show: { y: '0%' } }

  const movePointer = (event) => {
    if (reduceMotion || !imageRef.current) return
    const bounds = imageRef.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    imageRef.current.style.setProperty('--parallax-x', `${x * 14}px`)
    imageRef.current.style.setProperty('--parallax-y', `${y * 14}px`)
    if (glowRef.current) {
      glowRef.current.style.left = `${event.clientX - bounds.left}px`
      glowRef.current.style.top = `${event.clientY - bounds.top}px`
      glowRef.current.style.opacity = '1'
    }
  }
  const resetPointer = () => {
    if (!imageRef.current) return
    imageRef.current.style.setProperty('--parallax-x', '0px')
    imageRef.current.style.setProperty('--parallax-y', '0px')
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }
  const moveCta = (event) => {
    if (reduceMotion || !ctaRef.current) return
    const bounds = ctaRef.current.getBoundingClientRect()
    ctaRef.current.style.setProperty('--magnet-x', `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`)
    ctaRef.current.style.setProperty('--magnet-y', `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`)
  }

  return <section className="hero relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32 pb-10">
    <div className="hero-glow pointer-events-none absolute right-[5%] top-[20%] size-[520px] rounded-full bg-cobalt/35 blur-[140px]"/>
    <div className="relative mx-auto grid w-full max-w-7xl items-center gap-7 px-4 sm:gap-8 sm:px-6 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
      <div className="relative z-10">
        <div className="mb-6 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-lime/25 bg-lime/[.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/85 sm:gap-2.5 sm:px-4 sm:text-[10px] sm:tracking-[0.18em]">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70"/><span className="relative inline-flex size-2 rounded-full bg-lime"/></span>
          Recruitments open <span className="text-lime">·</span> Apply by {siteConfig.recruitment.closeDate}
        </div>
        <motion.h1 initial="hidden" animate="show" className="font-display text-[clamp(3.5rem,min(7vw,13vh),7rem)] leading-[.95] tracking-[-.055em]">
          {words.map((word, index) => <span key={word.text} className="-mb-[.18em] block overflow-hidden pb-[.18em]"><motion.span variants={reveal} transition={{ duration: reduceMotion ? 0 : .72, delay: reduceMotion ? 0 : index * .12, ease: [0.22, 1, 0.36, 1] }} className={`block ${word.className}`}>{word.text}</motion.span></span>)}
        </motion.h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-white/60 md:text-base">Make the ideas, images and moments that shape campus culture. Find your people at Artiverse.</p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button ref={ctaRef} onMouseMove={moveCta} onMouseLeave={() => { ctaRef.current?.style.setProperty('--magnet-x', '0px'); ctaRef.current?.style.setProperty('--magnet-y', '0px') }} onClick={onApply} className="lime-button glow magnetic-cta">Apply for PI <ArrowUpRight size={16}/></button>
          <a href="#process" className="ghost-button text-sm text-white/80">See how it works <ArrowDown size={15}/></a>
        </div>
        <div className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-4 sm:mt-10 sm:pt-5">
          {[['15 MIN', 'Online PI'], ['6', 'Domains'], ['0', 'Experience needed']].map(([value, label]) => <div key={label} className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-4"><p className="font-display text-xl text-lime md:text-2xl">{value}</p><p className="mt-1 text-[9px] uppercase leading-4 tracking-[.08em] text-white/50 sm:text-[10px] sm:tracking-[.12em]">{label}</p></div>)}
        </div>
      </div>

      <div ref={imageRef} onMouseMove={movePointer} onMouseLeave={resetPointer} className="hero-art relative isolate mx-auto min-h-[360px] w-full max-w-[610px] overflow-visible sm:min-h-[430px] lg:min-h-[500px]">
        <div ref={glowRef} className="pointer-events-none absolute z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/35 opacity-0 blur-[90px] transition-opacity duration-500"/>
        <BrandDuotoneVideo className="hero-video absolute inset-[-4%] h-[108%] w-[108%] object-cover" autoPlay muted loop playsInline aria-hidden="true"/>
        <div className="absolute inset-0 flex flex-col justify-around py-8 pr-7 text-right sm:py-10 sm:pr-8">
          {['PAINTING · DESIGN', 'WRITING · MAGAZINE', 'EVENTS · PR'].map((label, index) => <div key={label} className="domain-label ml-auto w-fit"><span className="mr-2 text-lime">0{index + 1}</span><span>{label}</span><i/></div>)}
        </div>
        <ApplyBadge onApply={onApply}/>
      </div>
    </div>
  </section>
}
