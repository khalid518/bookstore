import QuantityStepper from './QuantityStepper.jsx'
import BookCover from './BookCover.jsx'
import Reveal from './Reveal.jsx'

export default function BookCard({ book, quantity, onQuantityChange, onOpen, index = 0 }) {
  const { title, author, tag, price, coverUrl, url, staffPick } = book
  return (
    <Reveal as="li" delay={(index % 4) * 90} className="min-w-0">
      <article className={`group/card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 ${staffPick ? 'border-t-[3px] border-t-gold' : ''}`}>
        <div className="relative overflow-hidden bg-gradient-to-b from-alt to-cream px-6 pt-6">
          {staffPick && (
            <span className="absolute left-3 top-3 z-[1] rounded-full bg-gold px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-primary-dark">Staff Pick</span>
          )}
          <button type="button" onClick={onOpen} tabIndex={-1} aria-hidden="true" className="block w-full cursor-pointer rounded-t-sm">
            <BookCover title={title} author={author} src={coverUrl} alt={`Cover of ${title} by ${author}`} className="relative w-full rounded-t-sm shadow-lg transition duration-500 group-hover/card:scale-[1.03]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-5">
          {!staffPick && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">{tag}</p>}
          <h3 className="mb-1 break-words font-heading text-xl font-semibold leading-tight text-primary">
            <button type="button" onClick={onOpen} className="text-left transition-colors hover:text-accent">{title}</button>
          </h3>
          <p className="mb-3 text-[0.95rem] text-muted">{author}</p>
          {staffPick && (
            <blockquote className="mb-3 border-l-[3px] border-gold pl-3 font-heading text-[0.95rem] italic">
              <p className="mb-1">“{staffPick.quote}”</p>
              <footer className="font-sans text-xs not-italic text-muted">– {staffPick.by}</footer>
            </blockquote>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <span className="font-heading text-xl font-semibold text-primary">${price.toFixed(2)}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline underline-offset-4 transition-colors hover:text-primary">
              View Book<span className="sr-only">: {title} (opens in a new tab)</span>
            </a>
          </div>
          <div className="mt-3 flex min-h-10 items-center justify-between gap-2">
            {quantity === 0 ? (
              <button type="button" onClick={() => onQuantityChange(1)} className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-cream transition duration-300 hover:bg-primary-dark active:scale-[0.98]">
                Add to basket<span className="sr-only">: {title}</span>
              </button>
            ) : (
              <>
                <span className="whitespace-nowrap text-sm font-semibold text-accent">In basket</span>
                <QuantityStepper label={title} value={quantity} onChange={onQuantityChange} />
              </>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
