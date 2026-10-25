import { useEffect, useRef, useState } from 'react'
import { fetchBooks, fetchEvents } from './lib/api.js'
import { useRoute } from './lib/route.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Perks from './components/Perks.jsx'
import Collection from './components/Collection.jsx'
import StaffPicks from './components/StaffPicks.jsx'
import Insights from './components/Insights.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Story from './components/Story.jsx'
import Team from './components/Team.jsx'
import Testimonials from './components/Testimonials.jsx'
import Events from './components/Events.jsx'
import Visit from './components/Visit.jsx'
import Faq from './components/Faq.jsx'
import GetStarted from './components/GetStarted.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'
import Account from './components/Account.jsx'
import BooksPage from './components/BooksPage.jsx'
import SearchPalette from './components/SearchPalette.jsx'
import EventPage from './components/EventPage.jsx'
import BasketDialog from './components/BasketDialog.jsx'
import BookDialog from './components/BookDialog.jsx'
import { ShelfSkeleton, EventsSkeleton } from './components/Skeletons.jsx'

const BASKET_KEY = 'reading-room-basket'
const MAX_QTY = 9

function loadBasket() {
  try {
    const saved = JSON.parse(localStorage.getItem(BASKET_KEY))
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

export default function App() {
  const { name: route, id: routeId, query: routeQuery, nav } = useRoute()
  const [quantities, setQuantities] = useState(loadBasket)
  const [basketOpen, setBasketOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
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

  // Moving between the landing page and account pages: start account pages at the top, and when
  // returning home through a section link ("#collection"), scroll to that section once it is rendered.
  const previousRoute = useRef(route)
  useEffect(() => {
    const was = previousRoute.current
    previousRoute.current = route
    if (route !== 'home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    const id = window.location.hash.slice(1)
    if (was !== 'home' && id && !id.startsWith('/')) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    else if (was !== 'home') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [route, routeId])

  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]')
      const slash = e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey
      const combo = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)
      if (slash || combo) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const setQuantity = (id, qty) => setQuantities((prev) => ({ ...prev, [id]: qty }))
  const cartCount = Object.values(quantities).reduce((sum, q) => sum + q, 0)

  // "Order again": add a past order's books back to the basket (only ones still on the shelves) and show it.
  const reorder = (items) => {
    const ids = new Set(books.map((b) => b.id))
    setQuantities((prev) => {
      const next = { ...prev }
      for (const { bookId, quantity } of items) {
        if (ids.has(bookId)) next[bookId] = Math.min(MAX_QTY, (next[bookId] ?? 0) + quantity)
      }
      return next
    })
    setBasketOpen(true)
  }

  const selected = books.find((b) => b.id === selectedId)
  const shelf = { quantities, onQuantityChange: setQuantity, onOpenBook: (b) => setSelectedId(b.id) }
  const picks = books.filter((b) => b.staffPick)
  const ready = status === 'ready'

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:bg-primary focus:px-5 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <Header cartCount={cartCount} onOpenBasket={() => setBasketOpen(true)} onOpenSearch={() => setSearchOpen(true)} route={route} />
      {basketOpen && (
        <BasketDialog books={books} quantities={quantities} onQuantityChange={setQuantity} onClear={() => setQuantities({})} onClose={() => setBasketOpen(false)} />
      )}
      <main id="main">
        {route === 'books' ? (
          <BooksPage query={routeQuery} nav={nav} quantities={quantities} onQuantityChange={setQuantity} onOpenBook={(b) => setSelectedId(b.id)} />
        ) : route === 'event' ? (
          <EventPage event={events.find((e) => e.id === routeId)} events={events} status={status} />
        ) : route === 'orders' || route === 'profile' ? (
          <Account route={route} onReorder={reorder} />
        ) : (
          <>
            <Hero books={books} loading={status === 'loading'} />
            <Perks />
            {ready ? (
              <>
                <Collection books={books.filter((b) => !b.staffPick)} total={books.length} {...shelf} />
                {picks.length > 0 && <StaffPicks books={picks} {...shelf} />}
                <Insights books={books} />
              </>
            ) : status === 'loading' ? (
              <div aria-busy="true">
                <p role="status" className="sr-only">Loading the shelves…</p>
                <ShelfSkeleton />
              </div>
            ) : (
              <section aria-live="polite" className="mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-8">
                <p className="mb-4 text-primary">We couldn't load the books just now.</p>
                <button type="button" onClick={() => setAttempt((n) => n + 1)} className="rounded-full border-2 border-primary px-6 py-2 font-semibold text-primary transition hover:bg-primary hover:text-cream">
                  Try again
                </button>
              </section>
            )}
            <HowItWorks />
            <Story />
            {ready && <Team books={books} onOpenBook={(b) => setSelectedId(b.id)} />}
            <Testimonials />
            {ready ? <Events events={events} /> : status === 'loading' && <EventsSkeleton />}
            <Visit />
            <Faq />
            <GetStarted books={books} />
            <Newsletter />
          </>
        )}
      </main>
      <Footer />
      {searchOpen && <SearchPalette books={books} onClose={() => setSearchOpen(false)} onOpenBook={(b) => setSelectedId(b.id)} />}
      {selected && (
        <BookDialog book={selected} quantity={quantities[selected.id] ?? 0} onQuantityChange={(q) => setQuantity(selected.id, q)} onClose={() => setSelectedId(null)} />
      )}
    </>
  )
}
