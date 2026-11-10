export default function MobileNavbar({ onHome, onLogin, onSignOut, loggedInUser }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2 lg:hidden">
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault()
          onHome()
        }}
        aria-label="Artiverse home"
        className="inline-flex items-center gap-1.5 py-1"
      >
        <span className="font-display text-[18px] font-semibold leading-none tracking-[.01em] text-white">
          Artiverse
        </span>
        <span
          className="size-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(212,255,36,.55)]"
          aria-hidden="true"
        />
      </a>

      {loggedInUser ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-2.5 py-1 text-[11px] font-bold text-lime">
          <span className="grid size-4 place-items-center rounded-full bg-lime text-[9px] font-extrabold text-ink">
            {loggedInUser.fullName?.charAt(0) || 'U'}
          </span>
          <span>{loggedInUser.fullName?.split(' ')[0]}</span>
          </span>
          <button onClick={onSignOut} className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/65" aria-label="Sign out">
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="lime-button glow !px-3 !py-1 text-[11px] font-bold uppercase tracking-[0.06em]"
          aria-label="Log in"
        >
          <span>LOG IN</span>
        </button>
      )}
    </div>
  )
}
