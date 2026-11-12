import StatCard from './StatCard'
import { impactStats } from '../../config/landingData'

export default function Stats() {
  return (
    <section className="border-y border-[#e4e6da] bg-[#f6f7f2] py-14 sm:py-16">
      <div className="container-x grid gap-9 sm:grid-cols-3 sm:gap-5">
        {impactStats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}

