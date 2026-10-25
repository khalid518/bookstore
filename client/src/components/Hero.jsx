import BookCover from './BookCover.jsx'

const shelfIds = ['circe', 'piranesi', 'gentleman-in-moscow']
const positions = [
  'left-[7%] -rotate-[8deg]',
  'left-[32%] z-10 -translate-y-[6%]',
  'right-[7%] rotate-[8deg]',
]
const floatDelays = ['0s', '-2.4s', '-4.6s']

const rise = (ms) => ({ animationDelay: `${ms}ms` })

export default function Hero({ books, loading }) {
  const shelf = shelfIds.map((id) => books.find((b) => b.id === id)).filter(Boolean)
  const years = new Date().getFullYear() - 1994

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-alt via-cream to-cream">
      {/* Soft decorative light, kept behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-gold/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:gap-16 lg:py-24">
        <div className="min-w-0 lg:flex-1">
          <p style={rise(0)} className="motion-safe:animate-rise mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Independent bookseller since 1994
          </p>
          <h1 id="hero-title" style={rise(80)} className="motion-safe:animate-rise mb-6 font-heading text-[2.6rem] font-semibold leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
            Find your next <span className="italic text-accent">favourite</span> book
          </h1>
          <p style={rise(180)} className="motion-safe:animate-rise max-w-xl text-lg leading-relaxed text-muted">
            Tucked between the bakery and the bus stop, The Reading Room is a small shop with big opinions about good stories. Every shelf is chosen by hand, and every reader is greeted by name. Come in, stay a while, and let us find the book you didn't know you were looking for.
          </p>
          <div style={rise(280)} className="motion-safe:animate-rise mt-9 flex flex-wrap gap-3">
            <a href="#collection" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-center font-semibold text-cream no-underline shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lift">
              Browse the Collection
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a href="#events" className="inline-flex items-center rounded-full border-2 border-primary px-7 py-3 text-center font-semibold text-primary no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-cream">
              Upcoming Events
            </a>
          </div>

          <dl style={rise(380)} className="motion-safe:animate-rise mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {[
              [`${years}+`, 'years on the high street'],
              [books.length ? String(books.length) : '·', 'titles on the shelves'],
              ['Free', 'in-store pickup'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-heading text-3xl font-semibold leading-none text-primary">{value}</dt>
                <dd className="mt-1 text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          role="img"
          aria-label="A fanned stack of three book covers: Circe, Piranesi and A Gentleman in Moscow, resting on a warm wooden shelf"
          style={rise(200)}
          className="motion-safe:animate-fade relative isolate aspect-square w-full min-w-0 max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-primary-soft via-primary to-primary-dark shadow-lift ring-1 ring-primary-dark/20 lg:max-w-[30rem] lg:flex-[0_1_45%]"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
          {loading && shelf.length === 0 && positions.map((pos, i) => (
            <div key={i} className={`absolute bottom-[14%] aspect-[2/3] w-[36%] origin-bottom rounded-sm bg-cream/20 motion-safe:animate-pulse ${pos}`} />
          ))}
          {shelf.map((b, i) => (
            <div key={b.id} style={{ animationDelay: floatDelays[i] }} className={`absolute bottom-[14%] w-[36%] origin-bottom motion-safe:animate-float ${positions[i]}`}>
              <BookCover title={b.title} author={b.author} src={b.coverUrl} className="relative w-full rounded-sm shadow-2xl" />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-[#8a5a33] to-[#4f311a] shadow-[0_-6px_18px_rgb(0_0_0/0.25)]" />
        </div>
      </div>
    </section>
  )
}
