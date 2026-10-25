import Logo from './Logo.jsx'

const explore = [
  ['#home', 'Home'],
  ['#collection', 'Collection'],
  ['#staff-picks', 'Staff Picks'],
  ['#events', 'Events'],
]
const hours = ['Mon–Fri: 9 am – 7 pm', 'Saturday: 10 am – 6 pm', 'Sunday: 11 am – 4 pm']

const heading = 'mb-2 font-heading text-lg text-gold'

export default function Footer() {
  return (
    <footer id="visit" className="bg-primary pt-16 text-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:flex-wrap sm:px-8 lg:flex-nowrap">
        <div className="min-w-0 sm:flex-[2_1_18rem]">
          <h2 className="mb-3"><Logo onDark /></h2>
          <p>A small, independent bookshop for curious readers. Books, tea and good company since 1994.</p>
        </div>
        <nav aria-label="Footer" className="min-w-0 sm:flex-[1_1_12rem]">
          <h3 className={heading}>Explore</h3>
          <ul>
            {explore.map(([href, label]) => (
              <li key={href} className="mb-1"><a href={href} className="text-cream">{label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 sm:flex-[1_1_12rem]">
          <h3 className={heading}>Opening Hours</h3>
          <ul>{hours.map((h) => <li key={h} className="mb-1">{h}</li>)}</ul>
        </div>
        <address className="min-w-0 not-italic sm:flex-[1_1_12rem]">
          <h3 className={heading}>Visit Us</h3>
          <p className="mb-2">123 Placeholder Lane<br />Your Town, ST 00000</p>
          <p><a href="mailto:hello@thereadingroom.example" className="break-words text-cream">hello@thereadingroom.example</a></p>
        </address>
      </div>
      <p className="mx-auto mt-8 w-full max-w-6xl border-t border-cream/20 px-5 py-5 text-sm opacity-85 sm:px-8">
        &copy; 2026 The Reading Room. Sample content for demonstration; prices and details are illustrative.
      </p>
    </footer>
  )
}
