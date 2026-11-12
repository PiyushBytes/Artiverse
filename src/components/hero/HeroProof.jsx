import { motion } from 'motion/react'
import AvatarStack from '../common/AvatarStack'
import { heroContent } from '../../config/heroData'

export default function HeroProof({ liveCount, fadeVariant }) {
  return (
    <motion.div variants={fadeVariant} className="mt-8 flex items-center gap-3">
      <AvatarStack />
      <p className="text-sm text-[#5e6355]">
        <strong className="font-bold text-[#0d0f08] tabular-nums">
          {liveCount}+ students
        </strong>{' '}
        {heroContent.proofText}
      </p>
    </motion.div>
  )
}

