import StatCard from './StatCard'
import { impactStats } from '../../config/landingData'

export default function Stats() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container-x">
        <div className="mx-auto max-w-5xl rounded-[24px] bg-white border border-[#e4e6da]/70 px-6 py-10 sm:px-12 sm:py-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {impactStats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
