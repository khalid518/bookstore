import { useEffect, useRef } from 'react'
import QuantityStepper from './QuantityStepper.jsx'
import BookCover from './BookCover.jsx'

export default function BookDialog({ book, quantity, onQuantityChange, onClose }) {
  const dialogRef = useRef(null)
  const { title, author, tag, category, price, coverUrl, url, staffPick } = book

  useEffect(() => {
    // Same StrictMode-safe pattern as the other dialogs: no close() in a cleanup.
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()} aria-labelledby="book-title" className="m-auto max-h-[calc(100dvh-2rem)] w-[min(44rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-surface p-0 text-ink shadow-lift open:motion-safe:animate-rise backdrop:bg-black/50 backdrop:backdrop-blur-sm">
      <div className="relative grid gap-6 p-6 sm:grid-cols-[13rem_1fr] sm:gap-8 sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-3 text-2xl leading-none text-muted hover:text-primary">×</button>

        <div className="mx-auto w-44 sm:w-full">
          <BookCover title={title} author={author} src={coverUrl} alt={`Cover of ${title} by ${author}`} className="relative w-full rounded-sm shadow-lg" />
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">{tag} · {category}</p>
          <h2 id="book-title" className="mb-1 break-words font-heading text-3xl font-semibold leading-tight text-primary">{title}</h2>
          <p className="mb-4 text-lg text-muted">by {author}</p>

          {staffPick && (
            <blockquote className="mb-4 border-l-[3px] border-gold pl-3 font-heading italic">
              <p className="mb-1">“{staffPick.quote}”</p>
              <footer className="font-sans text-sm not-italic text-muted">– {staffPick.by}, Staff Pick</footer>
            </blockquote>
          )}

          <p className="mb-5 font-heading text-2xl font-bold text-primary">${price.toFixed(2)}</p>

          <div className="mb-4 flex min-h-10 items-center gap-3">
            {quantity === 0 ? (
              <button type="button" onClick={() => onQuantityChange(1)} className="rounded-full bg-primary px-7 py-3 font-semibold text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark">
                Add to basket
              </button>
            ) : (
              <>
                <span className="text-sm font-semibold text-accent">In your basket</span>
                <QuantityStepper label={title} value={quantity} onChange={onQuantityChange} />
              </>
            )}
          </div>

          <a href={url} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
            More about this book on Open Library<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </dialog>
  )
}
