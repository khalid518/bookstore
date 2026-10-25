import { useState } from 'react'
import { subscribe } from '../lib/api.js'

export default function Newsletter() {
  const [state, setState] = useState('idle') // idle | pending | done
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setError('')
    setState('pending')
    try {
      await subscribe(email)
      setState('done')
    } catch (err) {
      setError(err.message)
      setState('idle')
    }
  }

  return (
    <section id="newsletter" aria-labelledby="news-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="rounded-md border border-line border-t-4 border-t-accent bg-surface p-8 text-center sm:p-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">The Reading Room letter</p>
          <h2 id="news-title" className="mb-2 font-heading text-3xl text-primary sm:text-4xl">New arrivals, event news and staff picks</h2>
          <p className="mx-auto mb-6 max-w-xl text-muted">One short email now and then. No spam, and you can leave any time.</p>

          {state === 'done' ? (
            <p role="status" className="font-heading text-xl text-primary">Thank you, you're on the list.</p>
          ) : (
            <form onSubmit={submit} className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row" noValidate>
              <label className="sr-only" htmlFor="news-email">Email address</label>
              <input
                id="news-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-md border-2 border-line bg-white px-4 py-2.5 text-primary focus:border-primary focus:outline-none"
              />
              <button type="submit" disabled={state === 'pending'} className="rounded-md bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
                {state === 'pending' ? 'Signing up…' : 'Subscribe'}
              </button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-accent-dark">{error}</p>}
        </div>
      </div>
    </section>
  )
}
