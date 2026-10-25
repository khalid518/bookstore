import { useState } from 'react'
import BookCard from './BookCard.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

const filters = ['All', 'Fiction', 'Nonfiction']

export default function Collection({ books, total, quantities, onQuantityChange, onOpenBook }) {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? books : books.filter((b) => b.category === filter)

  return (
    <section id="collection" aria-labelledby="collection-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="collection-title" eyebrow="On our shelves" title="The Collection" intro="Modern classics, myth retold, memoir, history and big ideas, all chosen by hand." />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border-2 border-primary px-5 py-1.5 text-sm font-semibold transition duration-300 ${filter === f ? 'bg-primary text-cream shadow-card' : 'text-primary hover:bg-alt'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <a href="#/books" className="text-sm font-semibold text-accent underline underline-offset-4 transition-colors hover:text-primary">Search and filter all {total} books →</a>
        </div>
        <p className="sr-only" aria-live="polite">Showing {visible.length} books</p>
        {visible.length === 0 && <p className="py-8 text-center text-muted">No books in this category yet.</p>}
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((b, i) => (
            <BookCard key={b.id} index={i} book={b} quantity={quantities[b.id] ?? 0} onQuantityChange={(q) => onQuantityChange(b.id, q)} onOpen={() => onOpenBook(b)} />
          ))}
        </ul>
        <Reveal className="mt-12 text-center">
          <a href="#/books" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-cream no-underline shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lift">
            Browse all {total} books
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
