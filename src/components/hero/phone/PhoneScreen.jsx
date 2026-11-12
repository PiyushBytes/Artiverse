import {
  Award,
  Calendar,
  Camera,
  Check,
  Flashlight,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { heroRolesData } from '../../../config/heroData'

function renderIcon(type) {
  switch (type) {
    case 'ticket':
      return <TicketCheck size={13} className="text-[#0d0f08]" />
    case 'star':
      return <Sparkles size={13} className="text-[#0d0f08]" />
    case 'calendar':
      return <Calendar size={13} className="text-[#0d0f08]" />
    case 'users':
      return <Users size={13} className="text-[#0d0f08]" />
    case 'shield':
      return <ShieldCheck size={13} className="text-[#0d0f08]" />
    case 'trending':
      return <TrendingUp size={13} className="text-[#0d0f08]" />
    case 'qr':
      return <QrCode size={13} className="text-[#0d0f08]" />
    case 'award':
      return <Award size={13} className="text-[#0d0f08]" />
    default:
      return <Check size={13} className="text-[#0d0f08]" />
  }
}

export default function PhoneScreen({ activeRole }) {
  const reduceMotion = useReducedMotion()
  const previousRole = useRef(activeRole)
  const notificationSound = useRef(null)
  const roleConfig = heroRolesData[activeRole] || heroRolesData.Student

  useEffect(() => {
    if (previousRole.current === activeRole) return undefined
    previousRole.current = activeRole
    const sound = new Audio('/sounds/soundsforyou-notifications-sound-127856.mp3')
    sound.volume = 0.18
    sound.loop = true
    notificationSound.current = sound
    sound.play().catch(() => {})

    return () => {
      sound.pause()
      sound.currentTime = 0
      if (notificationSound.current === sound) notificationSound.current = null
    }
  }, [activeRole])

  const stopNotificationSound = () => {
    const sound = notificationSound.current
    if (!sound) return
    sound.pause()
    sound.currentTime = 0
    notificationSound.current = null
  }

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.16 } },
  }
  const notificationVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : -14 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[40px] bg-gradient-to-b from-[#101b2b] via-[#0d1522] to-[#070b12] text-white">
      {/* Subtle Glass Gloss Sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent z-20" />

      {/* Top Bar / Dynamic Island */}
      <div className="relative z-30 pt-2 px-3">
        <div className="mx-auto flex h-[19px] w-[76px] items-center justify-between rounded-full bg-black px-2 shadow-inner">
          <span className="size-2 rounded-full bg-[#1b2230]" />
          <span className="size-2.5 rounded-full bg-[#111622] ring-1 ring-white/10" />
        </div>

        {/* Status Header: Lock + Date + Clock */}
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1 text-white/60">
            <Lock size={10} />
            <span className="text-[10px] font-medium tracking-tight">Sunday, March 10</span>
          </div>
          <div className="mt-0.5 text-[34px] font-semibold tracking-tight text-white leading-none">
            1:47
          </div>
        </div>
      </div>

      {/* Middle Section: 3 Notifications / Dashboard (Dynamic by Role) */}
      <div className="relative z-20 flex-1 px-2.5 pt-2 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            className="flex flex-col gap-2"
          >
            {/* If Organiser: show mini dashboard strip + 2 notifications */}
            {activeRole === 'Organiser' && (
              <motion.div variants={notificationVariants} className="rounded-[14px] border border-white/10 bg-white/[0.08] p-2 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between text-[9px] font-semibold text-white/70">
                  <span>LIVE TICKETING</span>
                  <span className="text-[#d4ff1f] font-bold">97% CAPACITY</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white tracking-tight">₹48,200</span>
                  <span className="text-[10px] text-white/80">389 / 400 sold</span>
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[97%] rounded-full bg-[#d4ff1f]" />
                </div>
              </motion.div>
            )}

            {/* Notifications list: Always showing 3 items */}
            {roleConfig.notifications
              .slice(0, activeRole === 'Organiser' ? 2 : 3)
              .map((notif) => (
                <motion.div
                  key={notif.id}
                  variants={notificationVariants}
                  onAnimationComplete={notif.id === roleConfig.notifications.slice(0, activeRole === 'Organiser' ? 2 : 3).at(-1)?.id ? stopNotificationSound : undefined}
                  className="rounded-[14px] border border-white/10 bg-white/[0.07] p-2 backdrop-blur-md shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="grid size-4 place-items-center rounded-full bg-[#d4ff1f]">
                        {renderIcon(notif.type)}
                      </span>
                      <span className="text-[10px] font-semibold tracking-tight text-white/90">
                        {notif.app}
                      </span>
                    </div>
                    <span className="text-[8px] text-white/50">{notif.time}</span>
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] font-bold leading-tight text-white tracking-tight">
                      {notif.title}
                    </p>
                    <p className="mt-0.5 text-[9px] leading-tight text-white/70">
                      {notif.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section: "Next up" widget + Flashlight & Camera shortcuts */}
      <div className="relative z-20 pb-2.5 px-3">
        {/* Next up: Kalakriti'26 widget */}
        <div className="mb-3 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#d4ff1f]" />
            <span className="text-[9px] font-medium text-white/85">Next: Kalakriti'26</span>
          </div>
          <span className="text-[8px] font-bold text-[#d4ff1f]">Mar 28-30</span>
        </div>

        {/* Flashlight & Camera icons */}
        <div className="flex items-center justify-between px-2">
          <div className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.12] backdrop-blur-md text-white/80 shadow-sm">
            <Flashlight size={13} />
          </div>
          <div className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.12] backdrop-blur-md text-white/80 shadow-sm">
            <Camera size={13} />
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-white/60" />
      </div>
    </div>
  )
}

