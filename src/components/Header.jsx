import { useState } from 'react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#collection', label: 'Collection' },
  { href: '#staff-picks', label: 'Staff Picks' },
  { href: '#events', label: 'Events' },
]

const linkClass = 'block border-b-2 border-transparent py-2 text-[0.95rem] font-medium text-primary no-underline hover:border-accent md:inline-block md:py-1'

export default function Header({ cartCount }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 px-5 py-3 sm:px-8">
        <a href="#home" onClick={close} aria-label="The Reading Room, home" className="font-heading text-2xl font-bold italic text-primary no-underline">
          The Reading Room
        </a>

        <div className="flex items-center gap-3 md:hidden">
          <span className="text-sm font-semibold text-primary" aria-live="polite">Basket: {cartCount}</span>
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
            <li className="hidden text-sm font-semibold text-primary md:block">Basket: {cartCount}</li>
          </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}
