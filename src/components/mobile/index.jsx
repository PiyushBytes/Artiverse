import { useState } from 'react'
import MobileNavbar from './MobileNavbar'
import MobileBottomBar from './MobileBottomBar'
import MobileProfileSheet from './MobileProfileSheet'
import './responsive.css'

export { MobileNavbar, MobileBottomBar, MobileProfileSheet }

export default function MobileNavigation({
  currentUser,
  onLogin,
  onSignOut,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenContact,
  onDashboardPage = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLink = (event, href) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const target = document.getElementById(href.slice(1))
      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    if (href.startsWith('/')) {
      event.preventDefault()
      onNavigate(href)
    }
  }

  return (
    <>
      <MobileNavbar
        currentUser={currentUser}
        onLogin={onLogin}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={() => setProfileOpen(true)}
        onLinkClick={handleLink}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <MobileBottomBar
        currentUser={currentUser}
        onNavigate={onNavigate}
        onOpenSearch={onOpenSearch}
        onOpenNotifications={onOpenNotifications}
        onOpenContact={onOpenContact}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <MobileProfileSheet
        isOpen={profileOpen}
        currentUser={currentUser}
        onClose={() => setProfileOpen(false)}
        onSignOut={onSignOut}
        onNavigate={onNavigate}
        onDashboardPage={onDashboardPage}
      />
    </>
  )
}

