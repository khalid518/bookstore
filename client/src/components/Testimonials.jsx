const quotes = [
  { quote: 'I came in for one paperback and left with three, a tea and a new favourite author. Nobody ever recommends the way they do here.', by: 'Amira', note: 'Regular since 2019' },
  { quote: 'They remembered what I loved last time and put the perfect book in my hands before I asked.', by: 'Daniel', note: 'Book club host' },
  { quote: 'The staff picks have never missed for me. It feels like shopping with a friend who reads everything.', by: 'Priya', note: 'Weekend browser' },
]

export default function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-primary py-16 text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold">Kind words</p>
          <h2 id="reviews-title" className="mb-2 font-heading text-3xl leading-tight sm:text-4xl">What Readers Say</h2>
          <p className="text-cream/80">Sample reviews shown for illustration.</p>
        </header>
        <ul className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <li key={q.by}>
              <figure className="flex h-full flex-col rounded-md border border-cream/20 bg-primary-dark p-6">
                <span aria-hidden="true" className="mb-2 font-heading text-5xl leading-none text-gold">“</span>
                <blockquote className="mb-4 flex-1 font-heading text-lg italic leading-snug">{q.quote}</blockquote>
                <figcaption className="text-sm">
                  <span className="font-semibold text-gold">{q.by}</span>
                  <span className="text-cream/70"> · {q.note}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
