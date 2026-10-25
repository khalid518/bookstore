import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

const svg = { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-7 w-7' }

const steps = [
  {
    title: 'Browse and choose',
    text: 'Search the shelves or browse by genre, then add what you like to your basket.',
    icon: <svg {...svg}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>,
  },
  {
    title: 'Reserve online',
    text: 'Sign in and place a pickup order. We set your books aside the same day.',
    icon: <svg {...svg}><path d="M6 7h12l-1 12H7zM9 7a3 3 0 016 0" /></svg>,
  },
  {
    title: 'Collect and pay in store',
    text: 'Pop in during opening hours, say hello, and pay at the counter.',
    icon: <svg {...svg}><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" /></svg>,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-alt py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="how-title" eyebrow="Simple as a good story" title="How Reserving Works" intro="No card details online. Choose your books, and we'll have them waiting." />
        <ol className="relative grid gap-8 md:grid-cols-3">
          {/* Dashed route linking the three steps on wide screens. */}
          <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-gold md:block" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 140} className="relative">
              <div className="h-full rounded-2xl border border-line bg-surface p-7 pt-12 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-gold shadow-lift ring-8 ring-alt">
                  {s.icon}
                </span>
                <span aria-hidden="true" className="mb-1 block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent">Step {i + 1}</span>
                <h3 className="mb-2 font-heading text-xl font-semibold text-primary">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
