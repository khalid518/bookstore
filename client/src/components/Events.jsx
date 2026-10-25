import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

export default function Events({ events }) {
  return (
    <section id="events" aria-labelledby="events-title" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="events-title" eyebrow="Join us in the shop" title="Upcoming Events" intro="Sample listings shown for illustration. Dates, guests and details are not real events." />
        <ul className="flex flex-col gap-5">
          {events.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 100}>
              <article className="group flex flex-col items-start gap-5 rounded-2xl border border-line bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift sm:flex-row sm:items-center sm:p-6">
                <time dateTime={e.datetime} className="flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl bg-primary px-3 py-2.5 leading-tight text-cream transition duration-300 group-hover:bg-accent">
                  <span className="text-xs uppercase tracking-widest text-gold transition-colors group-hover:text-cream">{e.month}</span>
                  <span className="font-heading text-3xl font-semibold">{e.day}</span>
                </time>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-heading text-xl font-semibold text-primary">
                    <a href={`#/events/${e.id}`} className="text-primary no-underline transition-colors hover:text-accent">{e.title}</a>
                  </h3>
                  <p className="mb-1 text-sm font-semibold text-accent">{e.when}</p>
                  <p className="text-muted">{e.blurb}</p>
                </div>
                <a
                  href={`#/events/${e.id}`}
                  className="rounded-full border-2 border-primary px-6 py-2.5 text-center font-semibold text-primary no-underline transition duration-300 hover:bg-primary hover:text-cream"
                >
                  Event Details<span className="sr-only">: {e.title}</span>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
