import { navLinksLoggedIn, navLinksLoggedOut } from '../../config/navigationData'

export default function MobileMenu({ currentUser, onLinkClick }) {
  const links = currentUser ? navLinksLoggedIn : navLinksLoggedOut

  return (
    <nav
      aria-label="Mobile navigation"
      className="absolute inset-x-0 top-[calc(100%+8px)] z-50 flex flex-col rounded-[24px] border border-[#e4e6da] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.12)] min-[900px]:hidden"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={(e) => onLinkClick(e, link.href)}
          className="flex min-h-12 items-center rounded-2xl px-4 text-sm font-semibold text-[#0d0f08] hover:bg-[#f6f7f2]"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
