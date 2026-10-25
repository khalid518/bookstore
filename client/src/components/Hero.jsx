import BookCover from './BookCover.jsx'

const shelfIds =['circe', 'piranesi', 'gentleman-in-moscow']
const positions = [
  'left-[8%] -rotate-[8deg]',
  'left-[32%] z-10 -translate-y-[6%]',
  'right-[8%] rotate-[8deg]',
]

export default function Hero({ books, loading }) {
  const shelf = shelfIds.map((id) => books.find((b) => b.id === id)).filter(Boolean)
  return (
    <section id="home" aria-labelledby="hero-title" className="bg-gradient-to-b from-alt to-cream py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 sm:px-8 lg:flex-row lg:gap-16">
        <div className="min-w-0 lg:flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Independent bookseller since 1994</p>
          <h1 id="hero-title" className="mb-5 font-heading text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
            Find Your Next Favorite Book
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Tucked between the bakery and the bus stop, The Reading Room is a small shop with big opinions about good stories. Every shelf is chosen by hand, and every reader is greeted by name. Come in, stay a while, and let us find the book you didn't know you were looking for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#collection" className="rounded-md border-2 border-primary bg-primary px-5 py-3 text-center font-semibold text-cream no-underline transition hover:-translate-y-0.5 hover:bg-primary-dark">
              Browse the Collection
            </a>
            <a href="#events" className="rounded-md border-2 border-primary px-5 py-3 text-center font-semibold text-primary no-underline transition hover:-translate-y-0.5 hover:bg-primary hover:text-cream">
              Upcoming Events
            </a>
          </div>
        </div>
        <div
          role="img"
          aria-label="A fanned stack of three book covers: Circe, Piranesi and A Gentleman in Moscow, resting on a warm wooden shelf"
          className="relative isolate aspect-square w-full max-w-md min-w-0 overflow-hidden rounded-md bg-primary lg:max-w-[30rem] lg:flex-[0_1_45%]"
        >
          {loading && shelf.length === 0 && positions.map((pos, i) => (
            <div key={i} className={`absolute bottom-[14%] aspect-[2/3] w-[36%] origin-bottom rounded-sm bg-cream/20 motion-safe:animate-pulse ${pos}`} />
          ))}
          {shelf.map((b, i) => (
            <BookCover key={b.id} title={b.title} author={b.author} src={b.coverUrl} className={`absolute bottom-[14%] w-[36%] origin-bottom rounded-sm shadow-xl ${positions[i]}`} />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-[#8a5a33] to-[#5e3b1f]" />
        </div>
      </div>
    </section>
  )
}
