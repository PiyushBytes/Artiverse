export default function NavBrand({ onNavigate }) {
  return (
    <a
      href="/"
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault()
          onNavigate('/')
        }
      }}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold tracking-[-0.02em] text-[#0d0f08]"
      aria-label="Artiverse home"
    >
      <span className="size-2.5 rounded-full bg-[#d4ff1f]" />
      <span className="text-lg font-bold">Artiverse</span>
    </a>
  )
}
