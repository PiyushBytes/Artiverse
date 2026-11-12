import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import MagneticButton from '../common/MagneticButton'
import { heroContent } from '../../config/heroData'

export default function HeroActions({ onApply, fadeVariant }) {
  return (
    <motion.div
      variants={fadeVariant}
      className="mt-8 flex w-full flex-col gap-3 sm:w-auto min-[500px]:flex-row min-[900px]:flex-row"
    >
      <MagneticButton
        onClick={onApply}
        className="group inline-flex h-12 w-full min-[500px]:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#0d0f08] px-6 text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(13,15,8,0.2)] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
      >
        <span>{heroContent.primaryCta}</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </MagneticButton>
      <a
        href="#how-it-works"
        className="inline-flex h-12 w-full min-[500px]:w-auto items-center justify-center gap-2 rounded-[14px] border border-[#e4e6da] bg-white px-6 text-[14px] font-semibold text-[#0d0f08] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0d0f08] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
      >
        <span>{heroContent.secondaryCta}</span>
        <ArrowDown size={15} />
      </a>
    </motion.div>
  )
}

