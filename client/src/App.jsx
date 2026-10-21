import { useState } from 'react'
import books from './data/books.js'
import events from './data/events.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Collection from './components/Collection.jsx'
import StaffPicks from './components/StaffPicks.jsx'
import Events from './components/Events.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [quantities, setQuantities] = useState({})
  const setQuantity = (id, qty) => setQuantities((prev) => ({ ...prev, [id]: qty }))
  const cartCount = Object.values(quantities).reduce((sum, q) => sum + q, 0)

  const shelf = { quantities, onQuantityChange: setQuantity }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:bg-primary focus:px-5 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <Header cartCount={cartCount} />
      <main id="main">
        <Hero />
        <Collection books={books.filter((b) => !b.staffPick)} {...shelf} />
        <StaffPicks books={books.filter((b) => b.staffPick)} {...shelf} />
        <Events events={events} />
      </main>
      <Footer />
    </>
  )
}
