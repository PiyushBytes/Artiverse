import { ArrowRight, Mail } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import MagneticButton from '../common/MagneticButton'
import Reveal from '../common/Reveal'

export default function CTA({ onApply }) {
  return (
    <section className="container-x py-20 sm:py-32">
      <Reveal className="relative overflow-hidden rounded-[24px] bg-[#0d0f08] px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
        <div className="absolute -right-16 -top-28 size-72 rounded-full border border-white/10 sm:size-96" />
        <div className="absolute -right-8 -top-20 size-56 rounded-full border border-white/10 sm:size-72" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.17em] text-white/55">
            Make campus culture happen
          </p>
          <h2 className="display-font mt-4 text-[clamp(34px,5vw,56px)] font-semibold leading-tight tracking-[-0.03em]">
            Bring your campus into one universe.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-[1.65] text-white/70 sm:text-base">
            Recruitment closes 30 November 2026. Join the people shaping what happens next on campus.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <MagneticButton onClick={onApply} className="button-primary">
              Apply now <ArrowRight size={16} />
            </MagneticButton>
            <a
              href={`${siteConfig.links.email}?subject=Partner%20with%20Artiverse`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Mail size={15} />
              Partner with us
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

