import SectionHead from './SectionHead.jsx'

const steps = [
  { title: 'Browse and choose', text: 'Search the shelves or browse by genre, then add what you like to your basket.' },
  { title: 'Reserve online', text: 'Sign in and place a pickup order. We set your books aside the same day.' },
  { title: 'Collect and pay in store', text: 'Pop in during opening hours, say hello, and pay at the counter.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-alt py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="how-title" eyebrow="Simple as a good story" title="How Reserving Works" intro="No card details online. Choose your books, and we'll have them waiting." />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-md border border-line bg-surface p-6">
              <span aria-hidden="true" className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-cream">{i + 1}</span>
              <h3 className="mb-1 font-heading text-xl text-primary">{s.title}</h3>
              <p className="text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
