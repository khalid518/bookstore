import { useEffect, useRef, useState } from 'react'
import { useSession } from '../lib/auth.js'
import { placeOrder } from '../lib/api.js'
import QuantityStepper from './QuantityStepper.jsx'
import AuthDialog from './AuthDialog.jsx'
import BookCover from './BookCover.jsx'

const money = (n) => `$${n.toFixed(2)}`

export default function BasketDialog({ books, quantities, onQuantityChange, onClear, onClose }) {
  const dialogRef = useRef(null)
  const { data: session } = useSession()
  const [signingIn, setSigningIn] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const items = books.filter((b) => (quantities[b.id] ?? 0) > 0)
  const count = items.reduce((sum, b) => sum + quantities[b.id], 0)
  const subtotal = items.reduce((sum, b) => sum + b.price * quantities[b.id], 0)

  useEffect(() => {
    // Unmounting removes the dialog from the DOM, which closes it. Calling close() in a cleanup
    // would fire a stale `close` event after StrictMode re-runs this effect and dismiss the panel.
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  const checkout = async () => {
    setError('')
    setPending(true)
    try {
      const order = await placeOrder(Object.fromEntries(items.map((b) => [b.id, quantities[b.id]])))
      setConfirmation(order)
      onClear()
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  const empty = items.length === 0

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()} aria-labelledby="basket-title" className="m-0 ml-auto h-dvh max-h-none w-[min(26rem,100%)] bg-surface p-0 text-ink shadow-lift open:motion-safe:animate-slide backdrop:bg-black/50 backdrop:backdrop-blur-sm">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <h2 id="basket-title" className="font-heading text-2xl font-semibold text-primary">{confirmation ? 'Order placed' : 'Your basket'}</h2>
          <button type="button" onClick={onClose} aria-label="Close basket" className="text-2xl leading-none text-muted hover:text-primary">×</button>
        </div>

        {confirmation ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center" role="status">
            <p className="font-heading text-xl text-primary">Thank you!</p>
            <p>
              Order <strong>#{confirmation.id}</strong> ({confirmation.itemCount} {confirmation.itemCount === 1 ? 'item' : 'items'}, {money(confirmation.total)}) is being set aside for you.
            </p>
            <p className="text-sm text-muted">Pay when you collect it in store.</p>
            <button type="button" onClick={onClose} className="mt-2 rounded-full border-2 border-primary px-5 py-2 font-semibold text-primary hover:bg-primary hover:text-cream">
              Keep browsing
            </button>
          </div>
        ) : empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-muted">Your basket is empty.</p>
            <button type="button" onClick={onClose} className="rounded-full border-2 border-primary px-5 py-2 font-semibold text-primary hover:bg-primary hover:text-cream">
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((b) => (
                <li key={b.id} className="flex gap-4 py-4">
                  <BookCover title={b.title} author={b.author} src={b.coverUrl} className="relative w-16 shrink-0 rounded-sm shadow" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="break-words font-heading leading-tight text-primary">{b.title}</h3>
                    <p className="mb-2 text-sm text-muted">{b.author}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                      <QuantityStepper label={b.title} value={quantities[b.id]} onChange={(q) => onQuantityChange(b.id, q)} />
                      <span className="font-semibold tabular-nums text-primary">{money(b.price * quantities[b.id])}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-muted">{count} {count === 1 ? 'item' : 'items'}</span>
                <span className="font-heading text-xl font-bold tabular-nums text-primary">{money(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">Reserve online and pay in store when you collect. Tax isn't included.</p>
              {error && <p role="alert" className="mb-3 rounded-xl bg-accent/10 px-3 py-2 text-sm text-accent-dark">{error}</p>}
              {session ? (
                <button type="button" onClick={checkout} disabled={pending} className="w-full rounded-full bg-accent px-4 py-2.5 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
                  {pending ? 'Placing order…' : 'Place pickup order'}
                </button>
              ) : (
                <button type="button" onClick={() => setSigningIn(true)} className="w-full rounded-full bg-accent px-4 py-2.5 font-semibold text-white hover:bg-accent-dark">
                  Sign in to place your order
                </button>
              )}
              <button type="button" onClick={onClear} className="mt-3 text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
                Empty basket
              </button>
            </div>
          </>
        )}
      </div>
      {signingIn && !session && <AuthDialog mode="signin" onClose={() => setSigningIn(false)} />}
    </dialog>
  )
}
