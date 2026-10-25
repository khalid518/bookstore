import { useState } from 'react'
import BookCard from './BookCard.jsx'
import SectionHead from './SectionHead.jsx'

const filters = ['All', 'Fiction', 'Nonfiction']

export default function Collection({ books, quantities, onQuantityChange, query, onQueryChange }) {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? books : books.filter((b) => b.category === filter)

  return (
    <section id="collection" aria-labelledby="collection-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="collection-title" eyebrow="On our shelves" title="The Collection" intro="Modern classics, myth retold, memoir, history and big ideas, all chosen by hand." />
        <div className="mb-6">
          <label htmlFor="book-search" className="sr-only">Search books by title, author or genre</label>
          <div className="relative max-w-md">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              id="book-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by title, author or genre"
              autoComplete="off"
              className="w-full rounded-md border-2 border-line bg-white py-2 pl-10 pr-3 text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>
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
        {visible.length === 0 && (
          <p className="py-8 text-center text-muted">
            {query.trim() ? `No books match “${query.trim()}”.` : 'No books in this category yet.'}
          </p>
        )}
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((b) => (
            <BookCard key={b.id} book={b} quantity={quantities[b.id] ?? 0} onQuantityChange={(q) => onQuantityChange(b.id, q)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
