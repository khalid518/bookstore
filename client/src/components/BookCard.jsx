import QuantityStepper from './QuantityStepper.jsx'
import BookCover from './BookCover.jsx'

export default function BookCard({ book, quantity, onQuantityChange }) {
  const { title, author, tag, price, coverUrl, url, staffPick } = book
  return (
    <li className={`motion-safe:animate-rise flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 ${staffPick ? 'border-t-[3px] border-t-gold' : ''}`}>
      <div className="relative bg-alt px-5 pt-5">
        {staffPick && (
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-gold px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-primary-dark">Staff Pick</span>
        )}
        <BookCover title={title} author={author} src={coverUrl} alt={`Cover of ${title} by ${author}`} className="relative w-full rounded-t-sm shadow-md" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {!staffPick && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">{tag}</p>}
        <h3 className="mb-1 break-words font-heading text-lg leading-tight text-primary">{title}</h3>
        <p className="mb-3 text-[0.95rem] text-muted">{author}</p>
        {staffPick && (
          <blockquote className="mb-3 border-l-[3px] border-gold pl-3 font-heading text-[0.95rem] italic">
            <p className="mb-1">“{staffPick.quote}”</p>
            <footer className="font-sans text-xs not-italic text-muted">– {staffPick.by}</footer>
          </blockquote>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <span className="font-heading text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
            View Book<span className="sr-only">: {title} (opens in a new tab)</span>
          </a>
        </div>
        <div className="mt-3 flex min-h-10 items-center justify-between gap-2">
          {quantity === 0 ? (
            <button type="button" onClick={() => onQuantityChange(1)} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-cream transition hover:bg-primary-dark">
              Add to basket<span className="sr-only">: {title}</span>
            </button>
          ) : (
            <>
              <span className="text-sm font-semibold text-accent">In your basket</span>
              <QuantityStepper label={title} value={quantity} onChange={onQuantityChange} />
            </>
          )}
        </div>
      </div>
    </li>
  )
}
