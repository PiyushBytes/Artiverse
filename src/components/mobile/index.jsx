import { useState } from 'react'
import MobileNavbar from './MobileNavbar'
import MobileBottomBar from './MobileBottomBar'
import MobileProfileSheet from './MobileProfileSheet'

export { MobileNavbar, MobileBottomBar, MobileProfileSheet }

export default function MobileNavigation({
  currentUser,
  onLogin,
  onSignOut,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenContact,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
      <MobileNavbar
        currentUser={currentUser}
        onLogin={onLogin}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={() => setProfileOpen(true)}
        onNavigate={onNavigate}
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
        currentUser={currentUser}
        onClose={() => setProfileOpen(false)}
        onSignOut={onSignOut}
        onNavigate={onNavigate}
      />
    </>
  )
}

