import { Mail } from 'lucide-react'
import { siteConfig } from "../config/siteConfig";
export default function Footer() {
  return (
    <footer className="py-12">
      <div className="container-x flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <a href="#" className="font-display text-4xl italic text-lime">
            Artiverse
          </a>
          <p className="mt-3 text-xs text-white/45">
            Creative Arts & Events · MSIT, Kolkata
          </p>
        </div>
        <div className="flex gap-5 text-white/60">
          <a
            aria-label="Instagram"
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a aria-label="LinkedIn" href={siteConfig.links.linkedin}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.5h3.8v11H3.3v-11Zm6.1 0H13v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7v5.7h-3.8v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.1H9.4v-11Z" />
            </svg>
          </a>
          <a aria-label="Email" href={siteConfig.links.email}>
            <Mail />
          </a>
        </div>
      </div>
      <div className="container-x mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-[10px] tracking-wider text-white/35">
        <span>© {new Date().getFullYear()} Artiverse, MSIT</span>
        <span>MADE BY ARTIVERSE</span>
      </div>
    </footer>
  );
}
