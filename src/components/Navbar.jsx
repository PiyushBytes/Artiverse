import { useState } from 'react'
import { Menu, X } from 'lucide-react'
export default function Navbar({ onApply, onComingSoon, onEvents, onHome, isEventsPage }) {
  const [open,setOpen] = useState(false)
  const links = ['Events','Gallery','Magazine','Team']
  const items = <>{links.map(x=><button key={x} aria-current={x === 'Events' && isEventsPage ? 'page' : undefined} onClick={()=>{if(x==='Events') onEvents(); else onComingSoon(x);setOpen(false)}} className={`nav-link text-[11px] uppercase tracking-[0.25em] hover:text-white ${x === 'Events' && isEventsPage ? 'text-lime' : 'text-white/70'}`}>{x}</button>)}{!isEventsPage && <button onClick={()=>{onApply();setOpen(false)}} className="lime-button glow">JOIN NOW</button>}</>
  return <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-ink/85 backdrop-blur-xl"><nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:px-8 lg:px-10"><a href="/" onClick={(event)=>{event.preventDefault();onHome()}} className="font-display text-2xl font-bold tracking-tight text-lime sm:text-3xl">Artiverse</a><div className="hidden items-center gap-5 lg:flex lg:gap-7">{items}</div><button className="grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/5 lg:hidden" onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open?<X/>:<Menu/>}</button></nav>{open&&<div className="flex min-h-[calc(100svh-64px)] flex-col items-center justify-center gap-6 bg-ink px-6 pb-10 sm:min-h-[calc(100svh-80px)] lg:hidden">{items}</div>}</header>
}
