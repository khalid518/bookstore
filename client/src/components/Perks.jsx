import Reveal from './Reveal.jsx'

const icon = 'h-6 w-6'
const svg = { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const perks = [
  {
    title: 'Chosen by hand',
    text: 'Every shelf is curated by our booksellers, not an algorithm.',
    icon: <svg {...svg} className={icon}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>,
  },
  {
    title: 'Reserve online',
    text: 'Set books aside from your basket and pay when you collect.',
    icon: <svg {...svg} className={icon}><path d="M6 7h12l-1 12H7zM9 7a3 3 0 016 0" /></svg>,
  },
  {
    title: 'Independent since 1994',
    text: 'A neighbourhood shop that knows its readers by name.',
    icon: <svg {...svg} className={icon}><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" /></svg>,
  },
  {
    title: 'Tea and good company',
    text: 'Stay a while. There is always a pot on and a chair free.',
    icon: <svg {...svg} className={icon}><path d="M5 9h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5zM16 10h1.5a2.5 2.5 0 010 5H16M8 3v2M12 3v2" /></svg>,
  },
]

export default function Perks() {
  return (
    <section aria-label="Why shop with us" className="relative z-10 -mt-px border-y border-line bg-surface">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-5 py-9 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {perks.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 80} className="group flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-alt text-accent transition duration-300 group-hover:-rotate-6 group-hover:bg-accent group-hover:text-white">{p.icon}</span>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold leading-tight text-primary">{p.title}</h3>
              <p className="mt-0.5 text-sm text-muted">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
