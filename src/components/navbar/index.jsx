import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import NavBrand from './NavBrand'
import NavLinks from './NavLinks'
import NavActions from './NavActions'
import MobileMenu from './MobileMenu'

export default function Navbar({
  onLogin = () => {},
  currentUser = null,
  onSignOut = () => {},
  onOpenNotifications = () => {},
  onOpenProfile = () => {},
  onOpenSettings = () => {},
  onNavigate = () => {},
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (reduceMotion) {
      setVisible(true)
      lastY.current = current
      return
    }
    if (current < 80) setVisible(true)
    else if (current - lastY.current > 4) setVisible(false)
    else if (lastY.current - current > 4) setVisible(true)
    lastY.current = current
  })

  const closeMenu = () => setMenuOpen(false)
  const handleLink = (event, href) => {
    closeMenu()
    if (href.startsWith('#')) {
      const targetId = href.slice(1)
      const el = document.getElementById(targetId)
      if (el) {
        event.preventDefault()
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      } else {
        onNavigate(href)
      }
    } else {
      onNavigate(href)
    }
  }

  return (
    <motion.header
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
        scale: scrolled ? 0.985 : 1,
      }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
      className="sticky top-4 z-50 mt-4 px-3 sm:px-5"
    >
      <div
        className={`relative mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between rounded-full border px-4 transition-all sm:px-6 ${
          scrolled
            ? 'border-[#e4e6da]/80 bg-white/90 shadow-[0_1px_2px_rgba(0,0,0,.04),0_18px_40px_-14px_rgba(0,0,0,.16)] backdrop-blur-xl'
            : 'border-[#e4e6da] bg-white/85 backdrop-blur-md'
        }`}
      >
        <NavBrand onNavigate={onNavigate} />
        <NavLinks currentUser={currentUser} onLinkClick={handleLink} />
        <NavActions
          currentUser={currentUser}
          onLogin={onLogin}
          onSignOut={onSignOut}
          onOpenNotifications={onOpenNotifications}
          onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        {menuOpen && <MobileMenu currentUser={currentUser} onLinkClick={handleLink} />}
      </div>
    </motion.header>
  )
}
