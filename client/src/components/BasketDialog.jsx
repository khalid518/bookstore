import { useEffect, useRef } from 'react'
import QuantityStepper from './QuantityStepper.jsx'

export default function BasketDialog({ books, quantities, onQuantityChange, onClear, onClose }) {
  const dialogRef = useRef(null)
  const items = books.filter((b) => (quantities[b.id] ?? 0) > 0)
  const count = items.reduce((sum, b) => sum + quantities[b.id], 0)
  const subtotal = items.reduce((sum, b) => sum + b.price * quantities[b.id], 0)

  useEffect(() => {
    // Unmounting removes the dialog from the DOM, which closes it. Calling close() in a cleanup
    // would fire a stale `close` event after StrictMode re-runs this effect and dismiss the panel.
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()} aria-labelledby="basket-title" className="m-0 ml-auto h-dvh max-h-none w-[min(26rem,100%)] bg-surface p-0 text-ink backdrop:bg-black/50">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <h2 id="basket-title" className="font-heading text-2xl text-primary">Your basket</h2>
          <button type="button" onClick={onClose} aria-label="Close basket" className="text-2xl leading-none text-muted hover:text-primary">×</button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-muted">Your basket is empty.</p>
            <button type="button" onClick={onClose} className="rounded-md border-2 border-primary px-5 py-2 font-semibold text-primary hover:bg-primary hover:text-cream">
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((b) => (
                <li key={b.id} className="flex gap-4 py-4">
                  <img src={b.coverUrl} alt="" className="aspect-[2/3] w-16 shrink-0 rounded-sm bg-alt object-cover shadow" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="break-words font-heading leading-tight text-primary">{b.title}</h3>
                    <p className="mb-2 text-sm text-muted">{b.author}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                      <QuantityStepper label={b.title} value={quantities[b.id]} onChange={(q) => onQuantityChange(b.id, q)} />
                      <span className="font-semibold tabular-nums text-primary">${(b.price * quantities[b.id]).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-muted">{count} {count === 1 ? 'item' : 'items'}</span>
                <span className="font-heading text-xl font-bold tabular-nums text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">Subtotal. Tax and shipping aren't included.</p>
              <button type="button" onClick={onClear} className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
                Empty basket
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
