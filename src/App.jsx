import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Navbar,
  Hero,
  Products,
  Stats,
  FAQSection,
  Footer,
  ApplyPage,
  AuthPage,
  AuthModal,
  Events,
  Dashboard,
  MobileNavigation,
  Toast,
} from './components'
import {
  AboutPage,
  CommitteeProfilePage,
  CommitteePublicPage,
  CommitteeManagePage,
  CommitteesPage,
  ContactPage,
  ProfilePage,
  RegistrationsPage,
  SearchPage,
  SettingsPage,
  LeaderboardPage,
} from './pages'
import NotificationsDrawer from './components/dock/NotificationsDrawer'
import SearchModal from './components/dock/SearchModal'
import ContactModal from './components/dock/ContactModal'
import DashboardShell from './components/dashboard/overview/DashboardShell'
import { clearAuthSession, logoutFromServer } from './api/auth'

function getRoute(path) {
  if (path.startsWith('/committees/') && path.endsWith('/manage')) return 'committee-manage'
  if (path.startsWith('/committees/') && path !== '/committees') return 'committee-public'
  if (path === '/committees') return 'committees'
  if (path === '/events') return 'events'
  if (path === '/leaderboard') return 'leaderboard'
  if (path === '/apply' || path === '/join' || path === '/students') return 'apply'
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

function workspaceTitle(route, search) {
  if (route === 'registrations') {
    const tab = new URLSearchParams(search).get('tab')
    return tab === 'passes' ? 'My passes' : tab === 'applications' ? 'Applications' : 'My registrations'
  }
  return ({
    dashboard: 'Overview',
    profile: 'My Profile',
    settings: 'Settings',
    events: 'Live Events',
    leaderboard: 'Leaderboard',
    committees: 'Committees',
    'committee-manage': 'Committee workspace',
    'committee-public': 'Committee',
    search: 'Search',
    contact: 'Contact',
  })[route] || 'Overview'
}

export default function App() {
  const location = useLocation()
  const routerNavigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const route = getRoute(location.pathname)
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

    gsap.registerPlugin(ScrollTrigger)

    import('lenis')
      .then((lenisModule) => {
        if (cancelled) return
        const Lenis = lenisModule.default
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
    window.addEventListener('storage', syncUser)
    return () => window.removeEventListener('storage', syncUser)
  }, [])

  const navigate = useCallback((path, options) => {
    setToast('')
    syncUser()
    try {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    } catch {
      // ignore
    }
    routerNavigate(path, options)
    if (!String(path).includes('#')) window.scrollTo(0, 0)
  }, [routerNavigate])

  useEffect(() => { syncUser() }, [location.key])

  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }))
  }, [location.pathname, location.hash, reduceMotion])

  const hasSession = Boolean(currentUser && localStorage.getItem('artiverse_auth_tokens'))
  
  // Auth Modal State (replaces separate auth page with in-place modal)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const isAuthRoute = route === 'login' || route === 'register'

  useEffect(() => {
    if (isAuthRoute) {
      setAuthModalMode(route === 'register' ? 'register' : 'login')
      setAuthModalOpen(true)
    }
  }, [isAuthRoute, route])

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
    if (isAuthRoute) {
      routerNavigate('/', { replace: true })
    }
  }

  useEffect(() => {
    if (route === 'dashboard' && !hasSession) {
      openAuthModal('login')
      routerNavigate('/', { replace: true })
    }
  }, [route, hasSession, routerNavigate])

  const renderCurrentRoute = () => {
    switch (route) {
      case 'apply':
        return <ApplyPage onBack={() => navigate('/')} />
      case 'dashboard':
        if (!hasSession) return null
        return (
          <Dashboard
            currentUser={currentUser}
            onNavigate={navigate}
            onToast={setToast}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenNotifications={() => setNotifOpen(true)}
            onSignOut={signOut}
          />
        )
      case 'events':
        return <Events onJoin={() => navigate('/apply')} />
      case 'committees':
        return (
          <CommitteesPage
            currentUser={currentUser}
            onNavigate={navigate}
            onToast={setToast}
          />
        )
      case 'leaderboard':
        return <LeaderboardPage onNavigate={navigate} />
      case 'committee-manage': {
        const segments = window.location.pathname.replace(/^\/committees\//, '').split('/')
        const slug = segments[0] || 'artikon'
        return (
          <CommitteeManagePage
            slug={slug}
            currentUser={currentUser}
            onNavigate={navigate}
            onToast={setToast}
          />
        )
      }
      case 'committee-public': {
        const slug = window.location.pathname.replace(/^\/committees\//, '').split('/')[0] || 'artikon'
        return (
          <CommitteePublicPage
            slug={slug}
            currentUser={currentUser}
            onNavigate={navigate}
            onToast={setToast}
          />
        )
      }
      case 'about':
        return <AboutPage onNavigate={navigate} />
      case 'registrations':
        return (
          <RegistrationsPage
            currentUser={currentUser}
            onNavigate={navigate}
            tab={new URLSearchParams(location.search).get('tab')}
          />
        )
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            onSignOut={signOut}
            onToast={setToast}
          />
        )
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            onSignOut={signOut}
            onToast={setToast}
          />
        )
      case 'contact':
        return <ContactPage onToast={setToast} />
      case 'search':
        return <SearchPage onNavigate={navigate} />
      case 'home':
      default:
        return (
          <div className="w-full">
            <Hero onApply={() => navigate('/apply')} />
            <Products />
            <Stats />
            <FAQSection />
          </div>
        )
    }
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

  const isDashboard = route === 'dashboard'
  const workspaceRoutes = ['dashboard', 'committees', 'profile', 'settings', 'events', 'registrations', 'leaderboard', 'search', 'contact']
  const isWorkspace = Boolean(hasSession && workspaceRoutes.includes(route))
  const isCommitteeWorkspace = route === 'committee-manage'

  return (
    <div id="top" className={`app-responsive-frame min-h-screen bg-[#fafaf5] text-[#0d0f08] ${isCommitteeWorkspace ? 'app-no-mobile-bar' : ''}`}>
      {/* ── DESKTOP NAVBAR (Landing page navbar properly aligned with the page) ── */}
      {!isCommitteeWorkspace && <div className={`hidden min-[900px]:block transition-[padding] duration-200 ${isWorkspace ? 'min-[900px]:pl-[68px]' : ''}`}>
        <Navbar
          currentUser={currentUser}
          onSignOut={signOut}
          onLogin={() => openAuthModal('login')}
          onOpenNotifications={() => setNotifOpen(true)}
          onNavigate={handleNavTarget}
          onDashboardPage={route === 'dashboard'}
        />
      </div>}

      {/* ── MOBILE NAVBAR & BOTTOM BAR (Dedicated in src/components/mobile) ── */}
      {!isCommitteeWorkspace && <MobileNavigation
        currentUser={currentUser}
        onLogin={() => openAuthModal('login')}
        onSignOut={signOut}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotifOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onDashboardPage={route === 'dashboard'}
      />}

      {/* ── MAIN CONTENT (Keyed by route to cleanly isolate DOM subtrees) ── */}
      <div className="w-full min-w-0">
        {isWorkspace ? (
          <DashboardShell
            user={currentUser}
            sectionTitle={workspaceTitle(route, location.search)}
            onNavigate={navigate}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenNotifications={() => setNotifOpen(true)}
            onSignOut={signOut}
            onToast={setToast}
          >
            <div key={route} className="w-full">{renderCurrentRoute()}</div>
          </DashboardShell>
        ) : (
          <div key={route} className="w-full">{renderCurrentRoute()}</div>
        )}
      </div>

      {/* ── FOOTER ── */}
      {!isCommitteeWorkspace && <Footer />}

      {/* ── AUTH MODAL (Popup login and registration) ── */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
        onLoginSuccess={(user) => {
          setCurrentUser(user)
          navigate('/')
          setToast(`Welcome back, ${user.fullName || 'Member'}!`)
        }}
      />

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

      {/* ── TOAST MESSAGES (Bottom-Right, Auto-dismiss, Protected against stale signed out messages) ── */}
      <Toast
        message={currentUser && toast?.toLowerCase().includes('signed out') ? '' : toast}
        onClose={() => setToast('')}
      />
    </div>
  )
}
