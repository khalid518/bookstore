import { useState } from 'react'
import { subscribe } from '../lib/api.js'
import Reveal from './Reveal.jsx'

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
    <section id="newsletter" aria-labelledby="news-title" className="bg-alt py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface via-surface to-alt p-8 text-center shadow-lift sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-2xl" />
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">The Reading Room letter</p>
          <h2 id="news-title" className="mb-2 font-heading text-3xl font-semibold text-primary sm:text-4xl">New arrivals, event news and staff picks</h2>
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
                className="min-w-0 flex-1 rounded-full border-2 border-line bg-white px-5 py-3 text-primary focus:border-primary focus:outline-none"
              />
              <button type="submit" disabled={state === 'pending'} className="rounded-full bg-accent px-7 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:opacity-60">
                {state === 'pending' ? 'Signing up…' : 'Subscribe'}
              </button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-accent-dark">{error}</p>}
        </Reveal>
      </div>
    </section>
  )
}
