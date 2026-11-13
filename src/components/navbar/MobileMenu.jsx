import { navLinksLoggedIn, navLinksLoggedOut } from '../../config/navigationData'

export default function MobileMenu({ currentUser, onLinkClick }) {
  const links = currentUser
    ? [
        ...navLinksLoggedIn,
        { label: 'My passes', href: '/registrations?tab=passes' },
        { label: 'Applications', href: '/registrations?tab=applications' },
        { label: 'My Profile', href: '/profile' },
        { label: 'Settings', href: '/settings' },
      ]
    : navLinksLoggedOut

  return (
    <nav
      aria-label="Mobile navigation"
      className="absolute inset-x-3 top-[calc(100%+8px)] z-50 flex max-h-[min(70dvh,32rem)] flex-col overflow-y-auto rounded-[18px] border border-[#e4e6da] bg-[#fafaf5] p-2 shadow-[0_12px_32px_-16px_rgba(0,0,0,.2)] min-[900px]:hidden"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={(e) => onLinkClick(e, link.href)}
          className="flex min-h-11 items-center rounded-[10px] px-4 text-sm font-medium text-[#0d0f08] hover:bg-[#f6f7f2] focus-visible:outline-2 focus-visible:outline-[#0d0f08]"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
