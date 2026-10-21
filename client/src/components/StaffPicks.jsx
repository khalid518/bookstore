import BookCard from './BookCard.jsx'
import SectionHead from './SectionHead.jsx'

export default function StaffPicks({ books, quantities, onQuantityChange }) {
  return (
    <section id="staff-picks" aria-labelledby="staff-title" className="bg-alt py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="staff-title" eyebrow="Handpicked by our booksellers" title="Staff Picks" intro="The books we press into customers' hands. Ask us about any of them." />
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} quantity={quantities[b.id] ?? 0} onQuantityChange={(q) => onQuantityChange(b.id, q)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
