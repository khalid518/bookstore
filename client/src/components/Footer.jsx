import Logo from './Logo.jsx'
import { SUMMARY, ADDRESS, EMAIL } from '../lib/shop.js'

const explore = [
  ['#home', 'Home'],
  ['#collection', 'Collection'],
  ['#staff-picks', 'Staff Picks'],
  ['#story', 'Our Story'],
  ['#events', 'Events'],
  ['#visit', 'Visit Us'],
]
const account = [
  ['#/profile', 'My profile'],
  ['#/orders', 'My orders'],
]

const heading = 'mb-3 font-heading text-lg font-semibold text-gold'
const link = 'text-cream/90 no-underline transition-colors hover:text-gold hover:underline'

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary-dark pt-16 text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="min-w-0">
          <h2 className="mb-4"><Logo onDark /></h2>
          <p className="max-w-xs text-cream/80">A small, independent bookshop for curious readers. Books, tea and good company since 1994.</p>
        </div>
        <nav aria-label="Footer" className="min-w-0">
          <h3 className={heading}>Explore</h3>
          <ul className="space-y-1.5">
            {explore.map(([href, label]) => <li key={href}><a href={href} className={link}>{label}</a></li>)}
          </ul>
        </nav>
        <nav aria-label="Account" className="min-w-0">
          <h3 className={heading}>Your account</h3>
          <ul className="space-y-1.5">
            {account.map(([href, label]) => <li key={href}><a href={href} className={link}>{label}</a></li>)}
          </ul>
        </nav>
        <div className="min-w-0">
          <h3 className={heading}>Opening hours</h3>
          <ul className="mb-5 space-y-1.5 text-cream/90">{SUMMARY.map((h) => <li key={h}>{h}</li>)}</ul>
          <address className="not-italic text-cream/90">
            <p className="mb-1">{ADDRESS[0]}<br />{ADDRESS[1]}</p>
            <a href={`mailto:${EMAIL}`} className={`${link} break-words`}>{EMAIL}</a>
          </address>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-cream/15 px-5 py-6 text-sm text-cream/70 sm:px-8">
        <p>&copy; {new Date().getFullYear()} The Reading Room. Sample content for demonstration; prices and details are illustrative.</p>
        <a href="#home" className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-1.5 font-semibold text-cream no-underline transition hover:border-gold hover:text-gold">
          Back to top
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </a>
      </div>
    </footer>
  )
}
