import { useState } from 'react'
import { useSession } from '../lib/auth.js'
import AuthDialog from './AuthDialog.jsx'
import BookCover from './BookCover.jsx'
import Reveal from './Reveal.jsx'

const FAN_IDS = ['circe', 'piranesi', 'gentleman-in-moscow']
const FAN_POSITIONS = ['left-[4%] -rotate-[9deg]', 'left-[30%] z-10 -translate-y-[8%]', 'right-[4%] rotate-[9deg]']
const FLOAT_DELAYS = ['0s', '-2.4s', '-4.6s']

const arrow = <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

const NEW_PERKS = ['Free to join', 'Reserve online, pay in store', 'No card details needed']
const MEMBER_PERKS = ['Reserve online, pay in store', 'Cancel or reorder any time', 'Collect during opening hours']

export default function GetStarted({ books }) {
  const { data: session, isPending } = useSession()
  const [authMode, setAuthMode] = useState(null)

  const fan = FAN_IDS.map((id) => books.find((b) => b.id === id)).filter(Boolean)
  const covers = fan.length === 3 ? fan : books.slice(0, 3)
  const firstName = session?.user.name.trim().split(/\s+/)[0]

  return (
    <section id="get-started" aria-labelledby="cta-title" className="relative overflow-hidden bg-gradient-to-br from-primary-soft via-primary to-primary-dark py-20 text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            Get started
          </p>
          <h2 id="cta-title" className="mb-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            {session ? <>Welcome back, <span className="italic text-gold">{firstName}</span></> : <>Your next <span className="italic text-gold">favourite</span> book is waiting</>}
          </h2>
          <p className="mb-8 max-w-xl text-lg text-cream/85">
            {session
              ? 'Pick up where you left off: find something new, or check on the books you have set aside.'
              : 'Create a free account in under a minute, choose what you love, and we will have it set aside for you at the shop.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#/books" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-primary-dark no-underline shadow-lift transition duration-300 hover:-translate-y-0.5 hover:bg-cream">
              Browse all books {arrow}
            </a>
            {isPending ? null : session ? (
              <a href="#/orders" className="inline-flex items-center rounded-full border-2 border-cream/60 px-8 py-3 font-semibold text-cream no-underline transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold">
                View my orders
              </a>
            ) : (
              <button type="button" onClick={() => setAuthMode('signup')} className="inline-flex items-center rounded-full border-2 border-cream/60 px-8 py-3 font-semibold text-cream transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold">
                Create your free account
              </button>
            )}
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/80">
            {(session ? MEMBER_PERKS : NEW_PERKS).map((p) => (
              <li key={p} className="flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                {p}
              </li>
            ))}
          </ul>

          {!session && !isPending && (
            <p className="mt-6 text-sm text-cream/75">
              Already a member?{' '}
              <button type="button" onClick={() => setAuthMode('signin')} className="font-semibold text-gold underline underline-offset-4 hover:text-cream">Sign in</button>
            </p>
          )}
        </Reveal>

        {covers.length > 0 && (
          <Reveal delay={150} aria-hidden="true" className="relative mx-auto hidden aspect-[5/4] w-full max-w-md lg:block">
            {covers.map((b, i) => (
              <div key={b.id} style={{ animationDelay: FLOAT_DELAYS[i] }} className={`absolute bottom-[6%] w-[38%] origin-bottom motion-safe:animate-float ${FAN_POSITIONS[i]}`}>
                <BookCover title={b.title} author={b.author} src={b.coverUrl} className="relative w-full rounded-sm shadow-2xl" />
              </div>
            ))}
          </Reveal>
        )}
      </div>

      {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} />}
    </section>
  )
}
