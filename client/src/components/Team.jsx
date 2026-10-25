import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

const tints = ['bg-primary text-cream', 'bg-accent text-white', 'bg-gold text-primary-dark', 'bg-primary-soft text-cream']

// Booksellers are derived from the staff-pick bylines ("Name, Role"), so this section never drifts from the shelves.
export default function Team({ books, onOpenBook }) {
  const people = new Map()
  for (const b of books) {
    if (!b.staffPick) continue
    const [name, ...rest] = b.staffPick.by.split(',')
    const key = name.trim()
    const person = people.get(key) ?? { name: key, role: rest.join(',').trim() || 'Bookseller', picks: [] }
    person.picks.push(b)
    people.set(key, person)
  }
  const team = [...people.values()]
  if (team.length === 0) return null

  return (
    <section id="team" aria-labelledby="team-title" className="bg-alt py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="team-title" eyebrow="The people behind the shelves" title="Meet the Booksellers" intro="Ask any of us what to read next. These are the books we keep pressing into hands." />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 90}>
              <article className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span aria-hidden="true" className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full font-heading text-2xl font-semibold ${tints[i % tints.length]}`}>{p.name.charAt(0)}</span>
                <h3 className="font-heading text-xl font-semibold text-primary">{p.name}</h3>
                <p className="mb-4 text-sm text-accent">{p.role}</p>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{p.picks.length === 1 ? 'Currently recommends' : `${p.picks.length} current picks`}</p>
                <ul className="space-y-1">
                  {p.picks.map((b) => (
                    <li key={b.id}>
                      <button type="button" onClick={() => onOpenBook(b)} className="text-left font-heading text-primary underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-accent">{b.title}</button>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
