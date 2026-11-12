import { siteConfig } from '../../config/siteConfig'

export default function Footer() {
  return (
    <footer className="border-t border-[#e4e6da] bg-white py-8">
      <div className="container-x flex flex-col gap-5 text-sm text-[#5e6355] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Artiverse · Campus events and committees</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`${siteConfig.links.email}?subject=Privacy`} className="hover:text-[#0d0f08] transition-colors">
            Privacy
          </a>
          <a href={`${siteConfig.links.email}?subject=Terms`} className="hover:text-[#0d0f08] transition-colors">
            Terms
          </a>
          <a href={siteConfig.links.email} className="hover:text-[#0d0f08] transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

