import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

const milestones = [
  { year: '1994', title: 'The doors open', text: 'Three hundred books, one armchair and a kettle on the back counter.' },
  { year: '2003', title: 'The reading corner', text: 'The back room becomes a quiet corner for tea and an unhurried chapter.' },
  { year: '2011', title: 'Poetry evenings begin', text: 'Candlelight, open mic and a standing-room-only first night.' },
  { year: '2019', title: 'The neighbourhood book club', text: 'A monthly circle that has not missed a meeting since.' },
  { year: String(new Date().getFullYear()), title: 'Reserve online', text: 'Choose your books from home and collect them from the shelf we saved.' },
]

export default function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="story-title" eyebrow="Our story" title="Three decades of good company" intro="Sample history shown for illustration." />

        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {/* The line the milestones sit on: vertical on small screens, horizontal on wide ones. */}
          <span aria-hidden="true" className="absolute bottom-2 left-[1.1rem] top-2 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[1.1rem] md:h-px md:w-auto" />
          {milestones.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="relative pl-12 md:pl-0 md:pt-14">
              <span aria-hidden="true" className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-cream bg-primary text-cream shadow-card">
                <span className="h-2 w-2 rounded-full bg-gold" />
              </span>
              <p className="mb-1 font-heading text-3xl font-semibold leading-none text-accent">{m.year}</p>
              <h3 className="mb-1 font-heading text-lg font-semibold text-primary">{m.title}</h3>
              <p className="text-sm text-muted">{m.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
