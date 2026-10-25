import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

// Genres are the books' own tags, so this section stays in step with the catalogue.
export default function Genres({ books, onPick }) {
  const counts = new Map()
  for (const b of books) counts.set(b.tag, (counts.get(b.tag) ?? 0) + 1)
  const genres = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  if (genres.length === 0) return null

  return (
    <section id="genres" aria-labelledby="genres-title" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="genres-title" eyebrow="Find your corner" title="Browse by Genre" intro="Pick a shelf and we'll show you what's on it." />
        <Reveal as="ul" className="flex flex-wrap gap-3">
          {genres.map(([tag, count]) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => onPick(tag)}
                className="flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-semibold text-primary shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-cream hover:shadow-lift active:scale-[0.98]"
              >
                {tag}
                <span className="rounded-full bg-alt px-2 py-0.5 text-xs text-muted">{count}<span className="sr-only"> {count === 1 ? 'book' : 'books'}</span></span>
              </button>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
