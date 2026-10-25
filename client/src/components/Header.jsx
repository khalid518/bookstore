import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from '../lib/auth.js'
import AuthDialog from './AuthDialog.jsx'
import Logo from './Logo.jsx'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'collection', label: 'Collection' },
  { id: 'staff-picks', label: 'Staff Picks' },
  { id: 'events', label: 'Events' },
]

const linkClass = (active) =>
  `block border-b-2 py-2 text-[0.95rem] font-medium no-underline hover:border-accent md:inline-block md:py-1 ${active ? 'border-accent text-accent' : 'border-transparent text-primary'}`

const iconBtn = 'relative flex h-9 w-9 shrink-0 items-center md:h-10 md:w-10 justify-center rounded-full text-primary transition hover:bg-alt'
const outlineBtn = 'rounded-md border-2 border-primary px-4 py-1 text-[0.95rem] font-semibold text-primary hover:bg-primary hover:text-cream'
const stroke = { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

const SearchIcon = () => (
  <svg {...stroke} className="h-5 w-5">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

const UserIcon = () => (
  <svg {...stroke} className="h-[22px] w-[22px]">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
)

const BagIcon = () => (
  <svg {...stroke} className="h-[22px] w-[22px]">
    <path d="M5 8h14l-1 12H6zM9 8V7a3 3 0 016 0v1" />
  </svg>
)

// The last section whose top has scrolled past the sticky header is the one being read.
function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = 'home'
      for (const { id } of links) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(atBottom && document.getElementById('events') ? 'events' : current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

// Avatar menu when signed in; a user icon offering Sign in / Create account when signed out.
function AccountMenu({ session, onAuth, onOpen }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    onOpen?.()
    setOpen((o) => !o)
  }
  const choose = (mode) => {
    setOpen(false)
    onAuth(mode)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={session ? `Account menu for ${session.user.name}` : 'Account menu'}
        className={iconBtn}
      >
        {session ? (
          <span aria-hidden="true" className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-primary font-heading text-sm font-bold uppercase leading-none text-cream">
            {session.user.name.trim().charAt(0) || '?'}
          </span>
        ) : (
          <UserIcon />
        )}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-60 rounded-md border border-line bg-surface p-4 shadow-lg md:top-12">
          {session ? (
            <>
              <p className="truncate font-semibold text-primary">{session.user.name}</p>
              <p className="mb-3 truncate text-sm text-muted">{session.user.email}</p>
              <div className="mb-3 space-y-1 border-y border-line py-2">
                {[['#/orders', 'My orders'], ['#/profile', 'My profile']].map(([href, label]) => (
                  <a key={href} href={href} role="menuitem" onClick={() => setOpen(false)} className="block rounded-md px-2 py-1.5 font-medium text-primary no-underline transition-colors hover:bg-alt hover:text-accent">{label}</a>
                ))}
              </div>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); signOut() }} className={`${outlineBtn} w-full`}>
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button type="button" role="menuitem" onClick={() => choose('signin')} className={`${outlineBtn} w-full`}>Sign in</button>
              <button type="button" role="menuitem" onClick={() => choose('signup')} className="text-[0.95rem] font-semibold text-accent underline underline-offset-4 hover:text-primary">
                Create an account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Header({ cartCount, onOpenBasket, route = 'home' }) {
  const [open, setOpen] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, isPending } = useSession()
  const scrollActive = useActiveSection()
  const active = route === 'home' ? scrollActive : null
  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSearch = () => {
    close()
    const input = document.getElementById('book-search')
    if (!input) {
      window.location.hash = '#collection'
      return
    }
    input.scrollIntoView({ block: 'center' })
    input.focus({ preventScroll: true })
  }

  const basket = (
    <button type="button" onClick={() => { close(); onOpenBasket() }} className={iconBtn} aria-label={`Open basket, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
      <BagIcon />
      {cartCount > 0 && (
        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-bold leading-none text-white">
          {cartCount}
        </span>
      )}
    </button>
  )

  return (
    <header className={`sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 px-5 py-2.5 sm:px-8">
        <div className="flex w-full min-w-0 items-center justify-between gap-2 md:w-auto">
        <a href="#home" onClick={close} aria-label="The Reading Room, home" className="min-w-0 no-underline">
          <Logo />
        </a>

        <div className="flex shrink-0 items-center md:hidden">
          <button type="button" onClick={goToSearch} className={iconBtn} aria-label="Search books"><SearchIcon /></button>
          {basket}
          <AccountMenu session={session} onAuth={setAuthMode} onOpen={close} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label="Menu"
            className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-md border-2 border-primary text-primary"
          >
            <svg {...stroke} className="h-5 w-5">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        </div>

        <nav id="primary-nav" aria-label="Primary" className={`grid w-full transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:block md:w-auto md:visible ${open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}>
          <div className="min-h-0 overflow-hidden md:overflow-visible">
            <ul className="flex flex-col pt-2 md:flex-row md:items-center md:gap-x-5 md:pt-0">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={close} aria-current={active === l.id ? 'location' : undefined} className={linkClass(active === l.id)}>{l.label}</a>
                </li>
              ))}
              <li className="py-2 md:py-0">
                <a href="#visit" onClick={close} className="inline-block rounded-full bg-accent px-5 py-1.5 text-[0.95rem] font-semibold text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark">
                  Visit Us
                </a>
              </li>

              <li className="hidden items-center gap-1 md:flex md:border-l md:border-line md:pl-4">
                <button type="button" onClick={goToSearch} className={iconBtn} aria-label="Search books"><SearchIcon /></button>
                {basket}
              </li>

              {!isPending && (
                <li className="hidden md:block">
                  {session ? (
                    <AccountMenu session={session} onAuth={setAuthMode} />
                  ) : (
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setAuthMode('signin')} className={outlineBtn}>Sign in</button>
                      <button type="button" onClick={() => setAuthMode('signup')} className="text-[0.95rem] font-semibold text-accent underline underline-offset-4 hover:text-primary">Sign up</button>
                    </div>
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
