import { useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import { ADDRESS, EMAIL } from '../lib/shop.js'
import { downloadIcs, endTime, formatDuration } from '../lib/events.js'

const card = 'rounded-2xl border border-line bg-surface shadow-card'

function Icon({ d, className = 'h-5 w-5' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  ticket: 'M4 8a2 2 0 002-2h12a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 000-4z',
  person: 'M16 8a4 4 0 11-8 0 4 4 0 018 0zM4 21c0-4 3.6-6 8-6s8 2 8 6',
  calendar: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  share: 'M12 3v12M8 7l4-4 4 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  check: 'M5 12l5 5 9-10',
  back: 'M19 12H5M11 6l-6 6 6 6',
}

function Row({ icon, label, children }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-alt text-accent"><Icon d={ICONS[icon]} className="h-[18px] w-[18px]" /></span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <div className="text-primary">{children}</div>
      </div>
    </div>
  )
}

function Message({ title, children }) {
  return (
    <section className="min-h-[60vh] py-24">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-5 text-center">
        <h1 className="font-heading text-3xl font-semibold text-primary">{title}</h1>
        <p className="text-muted">{children}</p>
        <a href="#events" className="rounded-full bg-primary px-6 py-2.5 font-semibold text-cream no-underline transition hover:bg-primary-dark">See all events</a>
      </div>
    </section>
  )
}

export default function EventPage({ event, events, status }) {
  const [shared, setShared] = useState('')

  // Name the browser tab after the event while it is open.
  useEffect(() => {
    if (!event) return
    const previous = document.title
    document.title = `${event.title} · The Reading Room`
    return () => {
      document.title = previous
    }
  }, [event])

  if (!event) {
    if (status === 'loading') {
      return (
        <section aria-busy="true" className="min-h-[60vh]">
          <div className="bg-primary py-20"><div className="mx-auto h-24 w-full max-w-6xl px-5 sm:px-8"><div className="h-full max-w-xl rounded-2xl bg-cream/10 motion-safe:animate-pulse" /></div></div>
          <p role="status" className="sr-only">Loading event…</p>
        </section>
      )
    }
    return status === 'error'
      ? <Message title="We couldn't load this event">Something went wrong reaching the shop. Please try again in a moment.</Message>
      : <Message title="We couldn't find that event">It may have finished, or the link may be mistyped.</Message>
  }

  const location = ADDRESS.join(', ')
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  const paragraphs = event.description.split(/\n\s*\n/)
  const others = events.filter((e) => e.id !== event.id)
  const finished = new Date(`${event.datetime}:00`) < new Date()
  const [, startClock] = event.when.split(' · ')

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: event.title, text: event.blurb, url })
      else {
        await navigator.clipboard.writeText(url)
        setShared('Link copied')
      }
    } catch {
      // A dismissed share sheet throws; nothing to report.
    }
    setTimeout(() => setShared(''), 2500)
  }

  return (
    <article aria-labelledby="event-title">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-soft via-primary to-primary-dark text-cream">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <a href="#events" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cream/80 no-underline transition-colors hover:text-gold">
            <Icon d={ICONS.back} className="h-4 w-4" /> All events
          </a>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <time dateTime={event.datetime} className="motion-safe:animate-rise flex w-24 shrink-0 flex-col items-center rounded-2xl bg-cream px-4 py-3 leading-tight text-primary shadow-lift">
              <span className="text-sm font-semibold uppercase tracking-widest text-accent">{event.month}</span>
              <span className="font-heading text-5xl font-semibold">{event.day}</span>
            </time>
            <div className="min-w-0">
              {finished && <p className="mb-2 inline-block rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">This event has finished</p>}
              <h1 id="event-title" style={{ animationDelay: '80ms' }} className="motion-safe:animate-rise mb-3 font-heading text-3xl font-semibold leading-tight sm:text-5xl">{event.title}</h1>
              <ul style={{ animationDelay: '160ms' }} className="motion-safe:animate-rise flex flex-wrap gap-x-6 gap-y-2 text-cream/90">
                <li className="flex items-center gap-2"><Icon d={ICONS.clock} className="h-4 w-4 text-gold" />{event.when}</li>
                <li className="flex items-center gap-2"><Icon d={ICONS.ticket} className="h-4 w-4 text-gold" />{event.admission}</li>
                <li className="flex items-center gap-2"><Icon d={ICONS.person} className="h-4 w-4 text-gold" />Hosted by {event.host}</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-3 lg:py-16">
        <div className="space-y-8 lg:col-span-2">
          <Reveal>
            <h2 className="mb-4 font-heading text-2xl font-semibold text-primary">About this event</h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              {paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
          </Reveal>

          {event.highlights.length > 0 && (
            <Reveal delay={100} className={`${card} p-6`}>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-primary">What to expect</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {event.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-gold"><Icon d={ICONS.check} className="h-3.5 w-3.5" /></span>
                    <span className="text-primary">{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={150} className={`${card} flex items-center gap-4 p-6`}>
            <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-2xl font-semibold text-white">{event.host.charAt(0)}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your host</p>
              <p className="font-heading text-xl font-semibold text-primary">{event.host}</p>
              <p className="text-sm text-muted">Say hello at the door. They'll show you where to sit.</p>
            </div>
          </Reveal>
        </div>

        <aside aria-label="Event details" className="lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={120} className={`${card} space-y-5 p-6`}>
            <h2 className="font-heading text-xl font-semibold text-primary">Event details</h2>
            <Row icon="calendar" label="When">
              <p className="font-semibold">{event.when.split(' · ')[0]}</p>
              <p className="text-sm text-muted">{startClock} – {endTime(event)} · {formatDuration(event.durationMinutes)}</p>
            </Row>
            <Row icon="pin" label="Where">
              <p className="font-semibold">The Reading Room</p>
              <p className="text-sm text-muted">{location}</p>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
                Get directions<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Row>
            <Row icon="ticket" label="Admission"><p className="font-semibold">{event.admission}</p></Row>

            <div className="space-y-3 border-t border-line pt-5">
              <button type="button" onClick={() => downloadIcs(event, `The Reading Room, ${location}`)} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark">
                <Icon d={ICONS.calendar} className="h-[18px] w-[18px]" /> Add to calendar
              </button>
              <button type="button" onClick={share} className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary transition duration-300 hover:bg-primary hover:text-cream">
                <Icon d={ICONS.share} className="h-[18px] w-[18px]" /> Share this event
              </button>
              <p role="status" className="h-5 text-center text-sm font-semibold text-emerald-800">{shared}</p>
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Question about ${event.title}`)}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">
                <Icon d={ICONS.mail} className="h-4 w-4" /> Ask us a question
              </a>
            </div>
          </Reveal>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-events" className="bg-alt py-14">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <h2 id="more-events" className="mb-6 font-heading text-2xl font-semibold text-primary">More events at the shop</h2>
            <ul className="grid gap-5 md:grid-cols-2">
              {others.map((e, i) => (
                <Reveal as="li" key={e.id} delay={i * 90}>
                  <a href={`#/events/${e.id}`} className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card no-underline transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift">
                    <span className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-primary px-2 py-2 leading-tight text-cream transition-colors group-hover:bg-accent">
                      <span className="text-xs uppercase tracking-widest text-gold group-hover:text-cream">{e.month}</span>
                      <span className="font-heading text-2xl font-semibold">{e.day}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-lg font-semibold leading-tight text-primary">{e.title}</span>
                      <span className="text-sm text-muted">{e.when}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  )
}
