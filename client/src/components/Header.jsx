import { useState } from 'react'
import { useSession, signOut } from '../lib/auth.js'
import AuthDialog from './AuthDialog.jsx'
import Logo from './Logo.jsx'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#collection', label: 'Collection' },
  { href: '#staff-picks', label: 'Staff Picks' },
  { href: '#events', label: 'Events' },
]

const linkClass = 'block border-b-2 border-transparent py-2 text-[0.95rem] font-medium text-primary no-underline hover:border-accent md:inline-block md:py-1'

const basketBtn = 'text-sm font-semibold text-primary underline-offset-4 hover:underline'

export default function Header({ cartCount, onOpenBasket }) {
  const [open, setOpen] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const { data: session, isPending } = useSession()
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 px-5 py-3 sm:px-8">
        <a href="#home" onClick={close} aria-label="The Reading Room, home" className="no-underline">
          <Logo />
        </a>

        <div className="flex items-center gap-3 md:hidden">
          <button type="button" onClick={onOpenBasket} className={basketBtn} aria-live="polite">Basket: {cartCount}</button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="primary-nav"
            className="flex h-10 items-center gap-2 rounded-md border-2 border-primary px-3 text-sm font-semibold text-primary"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
            Menu
          </button>
        </div>

        <nav id="primary-nav" aria-label="Primary" className={`grid w-full transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:block md:w-auto md:visible ${open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}>
          <div className="min-h-0 overflow-hidden md:overflow-visible">
          <ul className="flex flex-col pt-2 md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-1 md:pt-0">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close} className={linkClass}>{l.label}</a>
              </li>
            ))}
            <li className="py-2 md:py-0">
              <a href="#visit" onClick={close} className="inline-block rounded-md bg-accent px-4 py-1.5 text-[0.95rem] font-medium text-white no-underline hover:bg-accent-dark">
                Visit Us
              </a>
            </li>
            <li className="hidden md:block">
              <button type="button" onClick={onOpenBasket} className={basketBtn} aria-live="polite">Basket: {cartCount}</button>
            </li>
            {!isPending && (
              <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 md:border-l md:border-line md:py-0 md:pl-5">
                {session ? (
                  <>
                    <span className="text-sm text-muted">Hi, {session.user.name}</span>
                    <button type="button" onClick={() => { close(); signOut() }} className="rounded-md border-2 border-primary px-4 py-1 text-[0.95rem] font-semibold text-primary hover:bg-primary hover:text-cream">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => { close(); setAuthMode('signin') }} className="rounded-md border-2 border-primary px-4 py-1 text-[0.95rem] font-semibold text-primary hover:bg-primary hover:text-cream">
                      Sign in
                    </button>
                    <button type="button" onClick={() => { close(); setAuthMode('signup') }} className="text-[0.95rem] font-semibold text-accent underline underline-offset-4 hover:text-primary">
                      Sign up
                    </button>
                  </>
                )}
              </li>
            )}
          </ul>
          </div>
        </nav>
      </div>
      {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} />}
    </header>
  )
}
