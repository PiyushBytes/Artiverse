import { navLinksLoggedIn, navLinksLoggedOut } from '../../config/navigationData'

export default function NavLinks({ currentUser, onLinkClick }) {
  const links = currentUser ? navLinksLoggedIn : navLinksLoggedOut

  return (
    <nav
      aria-label="Main navigation"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 min-[900px]:flex xl:gap-7"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={(e) => onLinkClick(e, link.href)}
          className="inline-flex min-h-11 items-center px-2 text-xs font-semibold text-[#424638] transition-colors hover:text-[#0d0f08] focus-visible:outline-2 focus-visible:outline-[#0d0f08] xl:px-1 xl:text-sm"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
