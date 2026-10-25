import { useEffect, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { useInView } from '../lib/useInView.js'
import { DAYS, HOURS, ADDRESS, EMAIL, openStatus, formatHour } from '../lib/shop.js'

const AXIS_START = 8
const AXIS_END = 20
const span = AXIS_END - AXIS_START
const ticks = [8, 11, 14, 17, 20]
// Monday first, the way most people read a week.
const order = [1, 2, 3, 4, 5, 6, 0]

export default function Visit() {
  const [now, setNow] = useState(() => new Date())
  const [ref, inView] = useInView({ threshold: 0.2 })

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const status = openStatus(now)
  const today = now.getDay()
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS.join(', '))}`

  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-alt py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="visit-title" eyebrow="Come and say hello" title="Plan Your Visit" intro="Browse the shelves, find a chair, and stay as long as you like." />

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="rounded-2xl border border-line bg-surface p-6 shadow-card lg:col-span-3">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-xl font-semibold text-primary">Opening hours</h3>
              <p role="status" className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${status.open ? 'bg-emerald-100 text-emerald-900' : 'bg-alt text-muted'}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-600 motion-safe:animate-pulse' : 'bg-muted'}`} />
                {status.text}
              </p>
            </div>

            <div ref={ref} className="space-y-2.5">
              {order.map((d, i) => {
                const [open, close] = HOURS[d]
                const isToday = d === today
                return (
                  <div key={d} className="grid grid-cols-[3rem_1fr] items-center gap-x-3 gap-y-0.5 sm:grid-cols-[4rem_1fr_8.5rem]">
                    <span className={`text-sm ${isToday ? 'font-bold text-primary' : 'text-muted'}`}>
                      {DAYS[d].slice(0, 3)}
                      {isToday && <span className="sr-only"> (today)</span>}
                    </span>
                    <span className="relative h-6 rounded-full bg-alt" aria-hidden="true">
                      <span
                        className={`absolute inset-y-0 rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none ${isToday ? 'bg-accent' : 'bg-primary'}`}
                        style={{
                          left: `${((open - AXIS_START) / span) * 100}%`,
                          width: inView ? `${((close - open) / span) * 100}%` : '0%',
                          transitionDelay: `${i * 70}ms`,
                        }}
                      />
                    </span>
                    <span className={`col-start-2 text-xs sm:col-start-3 sm:text-right sm:text-sm ${isToday ? 'font-semibold text-primary' : 'text-muted'}`}>
                      {formatHour(open)} – {formatHour(close)}
                    </span>
                  </div>
                )
              })}
              <div className="grid grid-cols-[3rem_1fr] gap-x-3 sm:grid-cols-[4rem_1fr_8.5rem]" aria-hidden="true">
                <span />
                <span className="relative h-4">
                  {ticks.map((t) => (
                    <span key={t} className="absolute -translate-x-1/2 text-[0.7rem] text-muted" style={{ left: `${((t - AXIS_START) / span) * 100}%` }}>{formatHour(t)}</span>
                  ))}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="flex flex-col rounded-2xl bg-primary p-6 text-cream shadow-lift lg:col-span-2">
            <h3 className="mb-4 font-heading text-xl font-semibold text-gold">Find us</h3>
            <address className="mb-4 not-italic leading-relaxed">
              {ADDRESS.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <p className="mb-6 text-cream/80">Tucked between the bakery and the bus stop. Look for the green door.</p>
            <a href={`mailto:${EMAIL}`} className="mb-6 break-all text-cream underline decoration-gold underline-offset-4">{EMAIL}</a>
            <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-primary-dark no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-cream">
              Get directions<span className="sr-only"> (opens in a new tab)</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M8 7h9v9" /></svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
