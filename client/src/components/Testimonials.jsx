import Reveal from './Reveal.jsx'

const quotes = [
  { quote: 'I came in for one paperback and left with three, a tea and a new favourite author. Nobody ever recommends the way they do here.', by: 'Amira', note: 'Regular since 2019' },
  { quote: 'They remembered what I loved last time and put the perfect book in my hands before I asked.', by: 'Daniel', note: 'Book club host' },
  { quote: 'The staff picks have never missed for me. It feels like shopping with a friend who reads everything.', by: 'Priya', note: 'Weekend browser' },
]

const Stars = () => (
  <span role="img" aria-label="5 out of 5 stars" className="mb-3 flex gap-0.5 text-gold">
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>
    ))}
  </span>
)

export default function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-primary py-20 text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />Kind words
          </p>
          <h2 id="reviews-title" className="mb-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem]">What Readers Say</h2>
          <p className="text-lg text-cream/80">Sample reviews shown for illustration.</p>
        </header>
        <ul className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal as="li" key={q.by} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border border-cream/15 bg-primary-dark/70 p-7 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/50">
                <Stars />
                <blockquote className="mb-5 flex-1 font-heading text-lg leading-snug">“{q.quote}”</blockquote>
                <figcaption className="flex items-center gap-3 text-sm">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-heading text-lg font-semibold text-primary-dark">{q.by.charAt(0)}</span>
                  <span>
                    <span className="block font-semibold text-gold">{q.by}</span>
                    <span className="text-cream/70">{q.note}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
