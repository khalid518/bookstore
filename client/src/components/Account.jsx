import { useEffect, useState } from 'react'
import { useSession, signOut, updateUser, changePassword } from '../lib/auth.js'
import { fetchOrders, cancelOrder } from '../lib/api.js'
import BookCover from './BookCover.jsx'
import AuthDialog from './AuthDialog.jsx'
import Reveal from './Reveal.jsx'

const money = (n) => `$${n.toFixed(2)}`
const formatDate = (iso, options) => new Intl.DateTimeFormat(undefined, options).format(new Date(iso))

const card = 'rounded-2xl border border-line bg-surface p-6 shadow-card'
const field = 'w-full rounded-xl border-2 border-line bg-white px-4 py-2.5 text-primary transition-colors focus:border-primary focus:outline-none disabled:opacity-60'
const primaryBtn = 'rounded-full bg-primary px-6 py-2.5 font-semibold text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark disabled:translate-y-0 disabled:opacity-60'
const outlineBtn = 'rounded-full border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition duration-300 hover:bg-primary hover:text-cream disabled:opacity-60'

const STATUS = {
  placed: { label: 'Reserved', style: 'bg-emerald-100 text-emerald-900', dot: 'bg-emerald-600' },
  cancelled: { label: 'Cancelled', style: 'bg-alt text-muted', dot: 'bg-muted' },
}

function Notice({ kind, children }) {
  if (!children) return null
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl px-4 py-2.5 text-sm ${kind === 'error' ? 'bg-accent/10 text-accent-dark' : 'bg-emerald-100 text-emerald-900'}`}>
      {children}
    </p>
  )
}

function OrderSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-5">
      {[0, 1].map((i) => (
        <div key={i} className={`${card} space-y-4`}>
          <div className="h-5 w-40 rounded bg-line/70 motion-safe:animate-pulse" />
          <div className="flex gap-4">
            <div className="aspect-[2/3] w-14 rounded bg-line/70 motion-safe:animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-line/70 motion-safe:animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-line/70 motion-safe:animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function OrderCard({ order, onCancelled, onReorder, index }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const status = STATUS[order.status] ?? STATUS.placed
  const count = order.items.reduce((s, i) => s + i.quantity, 0)

  const cancel = async () => {
    setPending(true)
    setError('')
    try {
      await cancelOrder(order.id)
      onCancelled(order.id)
    } catch (err) {
      setError(err.message)
      setConfirming(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <Reveal as="li" delay={Math.min(index, 4) * 80}>
      <article className={`${card} p-0`}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-primary">Order #{order.id}</h3>
            <p className="text-sm text-muted">{formatDate(order.createdAt, { dateStyle: 'medium', timeStyle: 'short' })} · {count} {count === 1 ? 'book' : 'books'}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${status.style}`}>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </header>

        <ul className="divide-y divide-line px-6">
          {order.items.map((item) => (
            <li key={item.bookId} className="flex items-center gap-4 py-4">
              <BookCover title={item.title} author={item.author} src={item.coverUrl} className="relative w-12 shrink-0 rounded-sm shadow" />
              <div className="min-w-0 flex-1">
                <p className="break-words font-heading font-semibold leading-tight text-primary">{item.title}</p>
                <p className="text-sm text-muted">{item.author}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold tabular-nums text-primary">{money(item.unitPrice * item.quantity)}</p>
                <p className="text-muted">{item.quantity} × {money(item.unitPrice)}</p>
              </div>
            </li>
          ))}
        </ul>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-cream/50 px-6 py-4">
          <p className="text-primary">
            <span className="text-sm text-muted">Total </span>
            <span className="font-heading text-xl font-semibold tabular-nums">{money(order.total)}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {confirming ? (
              <>
                <span className="text-sm text-muted">Cancel this order?</span>
                <button type="button" onClick={cancel} disabled={pending} className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60">
                  {pending ? 'Cancelling…' : 'Yes, cancel'}
                </button>
                <button type="button" onClick={() => setConfirming(false)} disabled={pending} className="text-sm font-semibold text-primary underline underline-offset-4">Keep it</button>
              </>
            ) : (
              <>
                {order.status === 'placed' && (
                  <button type="button" onClick={() => setConfirming(true)} className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">Cancel order</button>
                )}
                <button type="button" onClick={() => onReorder(order.items)} className={outlineBtn}>Order again</button>
              </>
            )}
          </div>
        </footer>
        {error && <div className="px-6 pb-4"><Notice kind="error">{error}</Notice></div>}
      </article>
    </Reveal>
  )
}

function Orders({ onReorder }) {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError('')
    setOrders(null)
    fetchOrders()
      .then((o) => !cancelled && setOrders(o))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const markCancelled = (id) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)))

  if (error) {
    return (
      <div className={`${card} text-center`}>
        <p className="mb-4 text-primary">We couldn't load your orders.</p>
        <button type="button" onClick={() => setAttempt((n) => n + 1)} className={outlineBtn}>Try again</button>
      </div>
    )
  }
  if (!orders) return <OrderSkeleton />

  if (orders.length === 0) {
    return (
      <div className={`${card} flex flex-col items-center gap-3 py-14 text-center`}>
        <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-alt text-accent">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6zM9 8V7a3 3 0 016 0v1" /></svg>
        </span>
        <h3 className="font-heading text-2xl font-semibold text-primary">No orders yet</h3>
        <p className="max-w-sm text-muted">When you reserve books for pickup, they'll appear here so you can track, cancel or reorder them.</p>
        <a href="#collection" className="mt-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-cream no-underline transition hover:bg-primary-dark">Browse the Collection</a>
      </div>
    )
  }

  const active = orders.filter((o) => o.status !== 'cancelled')
  const books = active.reduce((s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0), 0)
  const spent = active.reduce((s, o) => s + o.total, 0)

  return (
    <>
      <dl className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          [active.length, 'Orders placed'],
          [books, 'Books reserved'],
          [money(spent), 'Total reserved'],
        ].map(([value, label], i) => (
          <Reveal key={label} delay={i * 80} className="rounded-2xl border border-line bg-surface p-4 text-center shadow-card sm:p-5">
            <dd className="font-heading text-2xl font-semibold leading-none tabular-nums text-primary sm:text-3xl">{value}</dd>
            <dt className="mt-1.5 text-xs text-muted sm:text-sm">{label}</dt>
          </Reveal>
        ))}
      </dl>
      <ul className="space-y-5">
        {orders.map((o, i) => <OrderCard key={o.id} order={o} index={i} onCancelled={markCancelled} onReorder={onReorder} />)}
      </ul>
    </>
  )
}

function Profile({ user }) {
  const [name, setName] = useState(user.name)
  const [nameState, setNameState] = useState({ pending: false, error: '', done: false })
  const [pwState, setPwState] = useState({ pending: false, error: '', done: false })

  const saveName = async (e) => {
    e.preventDefault()
    setNameState({ pending: true, error: '', done: false })
    const { error } = await updateUser({ name: name.trim() })
    setNameState({ pending: false, error: error ? error.message || 'Could not update your name.' : '', done: !error })
  }

  const savePassword = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setPwState({ pending: true, error: '', done: false })
    const { error } = await changePassword({ currentPassword: data.get('current'), newPassword: data.get('next'), revokeOtherSessions: true })
    if (!error) form.reset()
    setPwState({ pending: false, error: error ? error.message || 'Could not change your password.' : '', done: !error })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Reveal as="form" onSubmit={saveName} className={`${card} space-y-4`}>
        <h3 className="font-heading text-xl font-semibold text-primary">Your details</h3>
        <label className="block text-sm font-semibold text-primary">
          Display name
          <input value={name} onChange={(e) => { setName(e.target.value); setNameState((s) => ({ ...s, done: false })) }} required minLength={1} maxLength={80} autoComplete="name" className={`${field} mt-1 font-normal`} />
        </label>
        <label className="block text-sm font-semibold text-primary">
          Email
          <input value={user.email} readOnly disabled autoComplete="email" className={`${field} mt-1 font-normal`} />
        </label>
        <Notice kind="error">{nameState.error}</Notice>
        <Notice kind="ok">{nameState.done ? 'Your name has been updated.' : ''}</Notice>
        <button type="submit" disabled={nameState.pending || !name.trim() || name.trim() === user.name} className={primaryBtn}>
          {nameState.pending ? 'Saving…' : 'Save changes'}
        </button>
      </Reveal>

      <Reveal as="form" delay={100} onSubmit={savePassword} className={`${card} space-y-4`}>
        <h3 className="font-heading text-xl font-semibold text-primary">Change password</h3>
        <label className="block text-sm font-semibold text-primary">
          Current password
          <input name="current" type="password" required autoComplete="current-password" className={`${field} mt-1 font-normal`} />
        </label>
        <label className="block text-sm font-semibold text-primary">
          New password
          <input name="next" type="password" required minLength={8} autoComplete="new-password" className={`${field} mt-1 font-normal`} />
          <span className="mt-1 block text-xs font-normal text-muted">At least 8 characters. Other devices will be signed out.</span>
        </label>
        <Notice kind="error">{pwState.error}</Notice>
        <Notice kind="ok">{pwState.done ? 'Password changed.' : ''}</Notice>
        <button type="submit" disabled={pwState.pending} className={primaryBtn}>{pwState.pending ? 'Updating…' : 'Update password'}</button>
      </Reveal>
    </div>
  )
}

export default function Account({ route, onReorder }) {
  const { data: session, isPending } = useSession()
  const [authMode, setAuthMode] = useState(null)

  const tabs = [
    ['orders', '#/orders', 'My orders'],
    ['profile', '#/profile', 'Profile'],
  ]

  return (
    <section aria-labelledby="account-title" className="min-h-[70vh] bg-gradient-to-b from-alt to-cream py-12 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        {isPending ? (
          <div aria-busy="true" className={`${card} h-40 motion-safe:animate-pulse`} />
        ) : !session ? (
          <Reveal className={`${card} flex flex-col items-center gap-4 py-14 text-center`}>
            <h1 id="account-title" className="font-heading text-3xl font-semibold text-primary">Sign in to your account</h1>
            <p className="max-w-md text-muted">See the books you've reserved, reorder favourites and manage your details.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button type="button" onClick={() => setAuthMode('signin')} className={primaryBtn}>Sign in</button>
              <button type="button" onClick={() => setAuthMode('signup')} className="font-semibold text-accent underline underline-offset-4 hover:text-primary">Create an account</button>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal className="mb-8 flex flex-wrap items-center gap-5">
              <span aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-4xl font-semibold uppercase text-gold shadow-lift ring-4 ring-surface">
                {session.user.name.trim().charAt(0) || '?'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Your account</p>
                <h1 id="account-title" className="break-words font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">{session.user.name}</h1>
                <p className="break-all text-muted">{session.user.email} · Member since {formatDate(session.user.createdAt, { month: 'long', year: 'numeric' })}</p>
              </div>
              <button type="button" onClick={() => signOut().then(() => { window.location.hash = '#home' })} className={outlineBtn}>Sign out</button>
            </Reveal>

            <nav aria-label="Account sections" className="mb-8 flex gap-2 border-b border-line">
              {tabs.map(([key, href, label]) => (
                <a
                  key={key}
                  href={href}
                  aria-current={route === key ? 'page' : undefined}
                  className={`-mb-px border-b-2 px-4 py-2.5 font-semibold no-underline transition-colors ${route === key ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-primary'}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            {route === 'profile' ? <Profile key={session.user.id} user={session.user} /> : <Orders onReorder={onReorder} />}
          </>
        )}
      </div>
      {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} />}
    </section>
  )
}
