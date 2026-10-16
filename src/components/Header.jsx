const links = [
  { href: '#home', label: 'Home' },
  { href: '#collection', label: 'Collection' },
  { href: '#staff-picks', label: 'Staff Picks' },
  { href: '#events', label: 'Events' },
]

export default function Header({ cartCount }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-3 sm:px-8">
        <a href="#home" aria-label="The Reading Room, home" className="font-heading text-2xl font-bold italic text-primary no-underline">
          The Reading Room
        </a>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-block border-b-2 border-transparent py-1 text-[0.95rem] font-medium text-primary no-underline hover:border-accent">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#visit" className="inline-block rounded-md bg-accent px-4 py-1.5 text-[0.95rem] font-medium text-white no-underline hover:bg-accent-dark">
                Visit Us
              </a>
            </li>
            <li className="text-sm font-semibold text-primary" aria-live="polite">
              Basket: {cartCount}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
