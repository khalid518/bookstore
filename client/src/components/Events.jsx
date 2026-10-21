import SectionHead from './SectionHead.jsx'

export default function Events({ events }) {
  return (
    <section id="events" aria-labelledby="events-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="events-title" eyebrow="Join us in the shop" title="Upcoming Events" intro="Sample listings shown for illustration. Dates, guests and details are not real events." />
        <ul className="flex flex-col gap-5">
          {events.map((e) => (
            <li key={e.id} className="flex flex-col items-start gap-5 rounded-md border border-l-4 border-line border-l-accent bg-surface p-5 sm:flex-row sm:items-center">
              <time dateTime={e.datetime} className="flex min-w-16 shrink-0 flex-col items-center rounded-md bg-primary px-3 py-2 leading-tight text-cream">
                <span className="text-xs uppercase tracking-widest">{e.month}</span>
                <span className="font-heading text-3xl font-bold">{e.day}</span>
              </time>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 font-heading text-xl text-primary">{e.title}</h3>
                <p className="mb-1 font-semibold text-accent">{e.when}</p>
                <p>{e.blurb}</p>
              </div>
              <a
                href={`mailto:hello@thereadingroom.example?subject=${encodeURIComponent(e.title)}`}
                className="rounded-md border-2 border-primary px-5 py-3 text-center font-semibold text-primary no-underline transition hover:-translate-y-0.5 hover:bg-primary hover:text-cream"
              >
                Event Details<span className="sr-only">: {e.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
