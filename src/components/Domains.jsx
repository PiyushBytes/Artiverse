import { motion, useReducedMotion } from 'motion/react'
import { siteConfig } from '../config/siteConfig'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
}
const card = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function Domains() {
  const reduceMotion = useReducedMotion()
  return <section className="section overflow-hidden">
    <div className="container-x">
      <motion.p initial={reduceMotion ? false : { opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="eyebrow">FIND YOUR SPACE</motion.p>
      <motion.h2 initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }} className="mt-4 font-display text-4xl sm:text-5xl">Six ways to <i className="text-lime">create.</i></motion.h2>
      <motion.div variants={list} initial={reduceMotion ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {siteConfig.domains.map((domain) => <motion.article key={domain.name} variants={card} whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }} className="panel group relative overflow-hidden rounded-2xl p-5 transition-colors duration-300 hover:border-cobalt-soft/70 hover:shadow-[0_0_34px_rgba(21,88,201,.2)] sm:p-6">
          <span className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-cobalt/0 blur-3xl transition-colors duration-500 group-hover:bg-cobalt/30" />
          <div className="relative text-3xl text-lime transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">{domain.icon}</div>
          <h3 className="relative mt-4 text-lg font-semibold sm:mt-5">{domain.name}</h3>
          <p className="relative mt-2 text-sm leading-6 text-white/55">{domain.description}</p>
        </motion.article>)}
      </motion.div>
    </div>
  </section>
}
