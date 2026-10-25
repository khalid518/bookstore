import { useEffect, useState } from 'react'
import { fetchBooks, fetchEvents } from './lib/api.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Collection from './components/Collection.jsx'
import StaffPicks from './components/StaffPicks.jsx'
import Events from './components/Events.jsx'
import Footer from './components/Footer.jsx'
import BasketDialog from './components/BasketDialog.jsx'
import Perks from './components/Perks.jsx'
import Genres from './components/Genres.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Testimonials from './components/Testimonials.jsx'
import Faq from './components/Faq.jsx'
import Newsletter from './components/Newsletter.jsx'
import BookDialog from './components/BookDialog.jsx'
import { ShelfSkeleton, EventsSkeleton } from './components/Skeletons.jsx'

const BASKET_KEY = 'reading-room-basket'

function loadBasket() {
  try {
    const saved = JSON.parse(localStorage.getItem(BASKET_KEY))
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

export default function App() {
  const [quantities, setQuantities] = useState(loadBasket)
  const [basketOpen, setBasketOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    Promise.all([fetchBooks(), fetchEvents()])
      .then(([b, e]) => {
        if (cancelled) return
        setBooks(b)
        setEvents(e)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [attempt])

  useEffect(() => {
    try {
      localStorage.setItem(BASKET_KEY, JSON.stringify(quantities))
    } catch {
      // storage unavailable (private mode); the basket just won't persist
    }
  }, [quantities])

  // Drop saved entries for books that no longer exist so the count matches the basket.
  useEffect(() => {
    if (status !== 'ready') return
    const ids = new Set(books.map((b) => b.id))
    setQuantities((prev) => {
      const kept = Object.fromEntries(Object.entries(prev).filter(([id, q]) => ids.has(id) && q > 0))
      return Object.keys(kept).length === Object.keys(prev).length ? prev : kept
    })
  }, [status, books])

  const setQuantity = (id, qty) => setQuantities((prev) => ({ ...prev, [id]: qty }))
  const cartCount = Object.values(quantities).reduce((sum, q) => sum + q, 0)

  const [selectedId, setSelectedId] = useState(null)
  const selected = books.find((b) => b.id === selectedId)
  const shelf = { quantities, onQuantityChange: setQuantity, onOpenBook: (b) => setSelectedId(b.id) }
  const pickGenre = (tag) => {
    setQuery(tag)
    document.getElementById('collection')?.scrollIntoView()
  }
  const needle = query.trim().toLowerCase()
  const matches = (b) => !needle || [b.title, b.author, b.tag].some((s) => s.toLowerCase().includes(needle))
  const picks = books.filter((b) => b.staffPick && matches(b))

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:bg-primary focus:px-5 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <Header cartCount={cartCount} onOpenBasket={() => setBasketOpen(true)} />
      {basketOpen && (
        <BasketDialog books={books} quantities={quantities} onQuantityChange={setQuantity} onClear={() => setQuantities({})} onClose={() => setBasketOpen(false)} />
      )}
      <main id="main">
        <Hero books={books} loading={status === 'loading'} />
        <Perks />
        {status === 'ready' ? (
          <>
            <Genres books={books} onPick={pickGenre} />
            <Collection books={books.filter((b) => !b.staffPick && matches(b))} query={query} onQueryChange={setQuery} {...shelf} />
            {picks.length > 0 && <StaffPicks books={picks} {...shelf} />}
          </>
        ) : status === 'loading' ? (
          <div aria-busy="true">
            <p role="status" className="sr-only">Loading the shelves…</p>
            <ShelfSkeleton />
          </div>
        ) : (
          <section aria-live="polite" className="mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-8">
            <p className="mb-4 text-primary">We couldn't load the books just now.</p>
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className="rounded-md border-2 border-primary px-5 py-2 font-semibold text-primary hover:bg-primary hover:text-cream">
              Try again
            </button>
          </section>
        )}
        <HowItWorks />
        <Testimonials />
        {status === 'ready' ? <Events events={events} /> : status === 'loading' && <EventsSkeleton />}
        <Faq />
        <Newsletter />
      </main>
      <Footer />
      {selected && (
        <BookDialog book={selected} quantity={quantities[selected.id] ?? 0} onQuantityChange={(q) => setQuantity(selected.id, q)} onClose={() => setSelectedId(null)} />
      )}
    </>
  )
}
