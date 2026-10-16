import { useState } from 'react'
import BookCard from './BookCard.jsx'
import SectionHead from './SectionHead.jsx'

const filters = ['All', 'Fiction', 'Nonfiction']

export default function Collection({ books, quantities, onQuantityChange }) {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? books : books.filter((b) => b.category === filter)

  return (
    <section id="collection" aria-labelledby="collection-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="collection-title" eyebrow="On our shelves" title="The Collection" intro="Modern classics, myth retold, memoir, history and big ideas, all chosen by hand." />
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full border-2 border-primary px-4 py-1.5 text-sm font-semibold transition ${filter === f ? 'bg-primary text-cream' : 'text-primary hover:bg-alt'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">Showing {visible.length} books</p>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((b) => (
            <BookCard key={b.id} book={b} quantity={quantities[b.id] ?? 0} onQuantityChange={(q) => onQuantityChange(b.id, q)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
