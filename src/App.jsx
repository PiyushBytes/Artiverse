import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import {
  Navbar,
  Hero,
  EventMarquee,
  Products,
  HowItWorks,
  Stats,
  FAQSection,
  CTA,
  Footer,
  ApplyPage,
  AuthPage,
  Events,
  Dashboard,
  SideDock,
  MobileNavigation,
  Toast,
} from './components'
import {
  AboutPage,
  CommitteesPage,
  ContactPage,
  HowItWorksPage,
  ProfilePage,
  RegistrationsPage,
  SearchPage,
  SettingsPage,
} from './pages'
import NotificationsDrawer from './components/dock/NotificationsDrawer'
import SearchModal from './components/dock/SearchModal'
import ContactModal from './components/dock/ContactModal'
import { clearAuthSession, logoutFromServer } from './api/auth'

function getRoute() {
  const path = window.location.pathname
  if (path === '/events') return 'events'
  if (path === '/apply' || path === '/join' || path === '/students') return 'apply'
  if (path === '/committees') return 'committees'
  if (path === '/how-it-works') return 'how-it-works'
  if (path === '/about') return 'about'
  if (path === '/registrations' || path === '/my-registrations') return 'registrations'
  if (path === '/profile') return 'profile'
  if (path === '/settings') return 'settings'
  if (path === '/contact') return 'contact'
  if (path === '/search') return 'search'
  if (path === '/register') return 'register'
  if (path === '/login' || path === '/auth') return 'login'
  if (path === '/dashboard') return 'dashboard'
  return 'home'
}

export default function App() {
  const reduceMotion = useReducedMotion()
  const [route, setRoute] = useState(getRoute)
  const [toast, setToast] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('artiverse_current_user') || 'null')
    } catch {
      return null
    }
  })

  // Smooth scroll Lenis & GSAP setup
  useEffect(() => {
    if (reduceMotion) return undefined
    let cancelled = false
    let cleanup = () => {}
    Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')])
      .then(([lenisModule, gsapModule, triggerModule]) => {
        if (cancelled) return
        const Lenis = lenisModule.default
        const gsap = gsapModule.gsap || gsapModule.default
        const ScrollTrigger = triggerModule.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ autoRaf: false, smoothWheel: true, anchors: true })
        const raf = (time) => lenis.raf(time * 1000)
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
        cleanup = () => {
          lenis.off('scroll', ScrollTrigger.update)
          gsap.ticker.remove(raf)
          gsap.ticker.lagSmoothing(500, 33)
          lenis.destroy()
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
      cleanup()
    }
  }, [reduceMotion])

  const syncUser = () => {
    try {
      setCurrentUser(JSON.parse(localStorage.getItem('artiverse_current_user') || 'null'))
    } catch {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    const sync = () => {
      setRoute(getRoute())
      syncUser()
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('storage', syncUser)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const navigate = (path) => {
    const cleanPath = path.split('?')[0]
    if (window.location.pathname !== cleanPath) {
      window.history.pushState({}, '', path)
    }
    setRoute(getRoute())
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const signOut = async () => {
    let message = 'You have been signed out.'
    try {
      await logoutFromServer()
    } catch (error) {
      message = `Signed out on this device. Server logout failed: ${error.message}`
    }
    clearAuthSession()
    setCurrentUser(null)
    navigate('/')
    setToast(message)
  }

  const handleNavTarget = (href) => {
    if (href === '#dashboard' || href === '/dashboard') {
      navigate('/dashboard')
      return
    }
    if (href === '#registrations' || href === '/registrations') {
      navigate('/registrations')
      return
    }
    if (href === '#students' || href === '/students' || href === '/apply') {
      navigate('/apply')
      return
    }
    if (href === '#committees' || href === '/committees') {
      navigate('/committees')
      return
    }
    if (href === '#how-it-works' || href === '/how-it-works') {
      navigate('/how-it-works')
      return
    }
    if (href === '#about' || href === '/about') {
      navigate('/about')
      return
    }
    if (href.startsWith('#')) {
      const el = document.getElementById(href.replace('#', ''))
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
        return
      }
    }
    navigate(href)
  }

  const isAuth = route === 'login' || route === 'register'

  return (
    <div id="top" className="min-h-screen bg-white text-[#0d0f08]">
      {/* ── DESKTOP NAVBAR (min-[900px]:block hidden) ── */}
      {!isAuth && (
        <div className="hidden min-[900px]:block">
          <Navbar
            currentUser={currentUser}
            onSignOut={signOut}
            onLogin={() => navigate('/login')}
            onOpenNotifications={() => setNotifOpen(true)}
            onOpenProfile={() => navigate('/profile')}
            onOpenSettings={() => navigate('/settings')}
            onNavigate={handleNavTarget}
          />
        </div>
      )}

      {/* ── MOBILE NAVBAR & BOTTOM BAR (Dedicated in src/components/mobile) ── */}
      {!isAuth && (
        <MobileNavigation
          currentUser={currentUser}
          onLogin={() => navigate('/login')}
          onSignOut={signOut}
          onNavigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
          onOpenContact={() => setContactOpen(true)}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className={!isAuth ? 'pb-[calc(84px+env(safe-area-inset-bottom))] min-[900px]:pb-0' : ''}>
        {route === 'login' || route === 'register' ? (
          <AuthPage
            mode={route}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onBack={() => navigate('/')}
            onLoginSuccess={(user) => {
              setCurrentUser(user)
              navigate('/')
            }}
          />
        ) : null}

        {route === 'apply' ? <ApplyPage onBack={() => navigate('/')} /> : null}

        {route === 'dashboard' ? (
          <Dashboard
            currentUser={currentUser}
            onBack={() => navigate('/')}
            onToast={setToast}
          />
        ) : null}

        {route === 'events' ? <Events onJoin={() => navigate('/apply')} /> : null}

        {route === 'committees' ? (
          <CommitteesPage onNavigate={navigate} onToast={setToast} />
        ) : null}

        {route === 'how-it-works' ? (
          <HowItWorksPage onNavigate={navigate} />
        ) : null}

        {route === 'about' ? (
          <AboutPage onNavigate={navigate} />
        ) : null}

        {route === 'registrations' ? (
          <RegistrationsPage
            currentUser={currentUser}
            onNavigate={navigate}
            onToast={setToast}
          />
        ) : null}

        {route === 'profile' ? (
          <ProfilePage
            currentUser={currentUser}
            onSignOut={signOut}
            onToast={setToast}
          />
        ) : null}

        {route === 'settings' ? (
          <SettingsPage
            currentUser={currentUser}
            onSignOut={signOut}
            onToast={setToast}
          />
        ) : null}

        {route === 'contact' ? (
          <ContactPage onToast={setToast} />
        ) : null}

        {route === 'search' ? (
          <SearchPage onNavigate={navigate} />
        ) : null}

        {route === 'home' && (
          <>
            <Hero onApply={() => navigate('/apply')} />
            <EventMarquee />
            <Products />
            <HowItWorks />
            <Stats />
            <FAQSection />
            <CTA onApply={() => navigate('/apply')} />
          </>
        )}
      </main>

      {/* ── DESKTOP SIDE DOCK (Strictly 4 buttons, min-[900px]:flex hidden) ── */}
      {!isAuth && (
        <SideDock
          currentUser={currentUser}
          onNavigate={navigate}
          onToast={setToast}
        />
      )}

      {/* ── FOOTER ── */}
      {!isAuth && <Footer />}

      {/* ── GLOBAL MODALS ── */}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onSelect={(entry) => setToast(`Selected: ${entry.name}`)}
        />
      )}

      {notifOpen && (
        <NotificationsDrawer
          currentUser={currentUser}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* ── TOAST MESSAGES ── */}
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
