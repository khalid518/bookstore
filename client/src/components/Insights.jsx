import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { useInView, useCountUp } from '../lib/useInView.js'

const FICTION = 'var(--color-chart-fiction)'
const NONFICTION = 'var(--color-chart-nonfiction)'
const colorFor = (category) => (category === 'Fiction' ? FICTION : NONFICTION)

function Stat({ label, value, format = (n) => Math.round(n).toString(), delay }) {
  const [ref, inView] = useInView()
  const shown = useCountUp(value, inView)
  return (
    <Reveal delay={delay} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <p ref={ref} className="font-heading text-4xl font-semibold leading-none text-primary tabular-nums">{format(shown)}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Reveal>
  )
}

function Legend() {
  return (
    <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Chart legend">
      {[['Fiction', FICTION], ['Nonfiction', NONFICTION]].map(([name, color]) => (
        <li key={name} className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ background: color }} />
          {name}
        </li>
      ))}
    </ul>
  )
}

function Donut({ fiction, nonfiction }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const total = fiction + nonfiction
  const r = 52
  const c = 2 * Math.PI * r
  const gap = 3
  const fLen = total ? Math.max(0, (fiction / total) * c - gap) : 0
  const nLen = total ? Math.max(0, (nonfiction / total) * c - gap) : 0
  const shownTotal = useCountUp(total, inView)

  return (
    <div ref={ref} className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <svg viewBox="0 0 140 140" role="img" aria-label={`${fiction} fiction and ${nonfiction} nonfiction books`} className="h-44 w-44 shrink-0">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-alt)" strokeWidth="16" />
        <circle
          cx="70" cy="70" r={r} fill="none" transform="rotate(-90 70 70)" stroke={FICTION} strokeWidth="16" strokeLinecap="butt"
          strokeDasharray={`${inView ? fLen : 0} ${c}`}
          className="transition-[stroke-dasharray] duration-1000 ease-out motion-reduce:transition-none"
        />
        <circle
          cx="70" cy="70" r={r} fill="none" transform="rotate(-90 70 70)" stroke={NONFICTION} strokeWidth="16" strokeLinecap="butt"
          strokeDasharray={`${inView ? nLen : 0} ${c}`}
          strokeDashoffset={-(fLen + gap)}
          className="transition-[stroke-dasharray] duration-1000 delay-300 ease-out motion-reduce:transition-none"
        />
        <g>
          <text x="70" y="72" textAnchor="middle" className="fill-primary font-heading text-[26px] font-semibold">{Math.round(shownTotal)}</text>
          <text x="70" y="88" textAnchor="middle" className="fill-muted text-[8px]">titles</text>
        </g>
      </svg>
      <ul className="w-full space-y-3">
        {[['Fiction', fiction, FICTION], ['Nonfiction', nonfiction, NONFICTION]].map(([name, n, color]) => (
          <li key={name} className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-0">
            <span className="flex items-center gap-2 text-primary"><span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ background: color }} />{name}</span>
            <span className="font-heading text-xl font-semibold tabular-nums text-primary">{n} <span className="text-sm font-normal text-muted">({total ? Math.round((n / total) * 100) : 0}%)</span></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GenreBars({ rows }) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <ul ref={ref} className="space-y-3" aria-label="Books per genre">
      {rows.map((r, i) => (
        <li key={r.tag} className="grid grid-cols-[minmax(0,10.5rem)_1fr_1.5rem] items-center gap-3 text-sm">
          <span className="truncate text-primary" title={r.tag}>{r.tag}</span>
          <span className="h-3 rounded-r-full bg-alt">
            <span
              className="block h-3 rounded-r-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
              style={{ width: inView ? `${(r.count / max) * 100}%` : '0%', background: colorFor(r.category), transitionDelay: `${i * 70}ms` }}
            />
          </span>
          <span className="text-right font-semibold tabular-nums text-primary">{r.count}</span>
        </li>
      ))}
    </ul>
  )
}

function PriceColumns({ bins }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const max = Math.max(1, ...bins.map((b) => b.count))
  return (
    <div ref={ref} role="img" aria-label={`Price spread: ${bins.map((b) => `${b.label} has ${b.count}`).join(', ')}`} className="flex h-48 items-end gap-3">
      {bins.map((b, i) => (
        <div key={b.label} className="flex h-full flex-1 flex-col justify-end">
          <span className="mb-1 text-center text-sm font-semibold tabular-nums text-primary">{b.count}</span>
          <div className="flex flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-primary transition-[height] duration-1000 ease-out motion-reduce:transition-none"
              style={{ height: inView ? `${(b.count / max) * 100}%` : '0%', transitionDelay: `${i * 100}ms` }}
            />
          </div>
          <span className="mt-2 border-t border-line pt-1 text-center text-xs text-muted">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Insights({ books }) {
  if (books.length === 0) return null

  const fiction = books.filter((b) => b.category === 'Fiction').length
  const nonfiction = books.length - fiction
  const byTag = new Map()
  for (const b of books) {
    const row = byTag.get(b.tag) ?? { tag: b.tag, category: b.category, count: 0 }
    row.count += 1
    byTag.set(b.tag, row)
  }
  const genres = [...byTag.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))

  const prices = books.map((b) => b.price)
  const lo = Math.floor(Math.min(...prices))
  const hi = Math.ceil(Math.max(...prices))
  const step = Math.max(1, (hi - lo) / 4)
  const bins = Array.from({ length: 4 }, (_, i) => {
    const from = lo + i * step
    const to = i === 3 ? hi + 0.01 : lo + (i + 1) * step
    return {
      label: `$${Math.round(from)}–${Math.round(i === 3 ? hi : to)}`,
      count: prices.filter((p) => p >= from && p < to).length,
    }
  })
  const average = prices.reduce((s, p) => s + p, 0) / prices.length

  return (
    <section id="insights" aria-labelledby="insights-title" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHead id="insights-title" eyebrow="By the numbers" title="The Shelves at a Glance" intro="A live look at what we're stocking right now, straight from our catalogue." />

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Titles on the shelves" value={books.length} delay={0} />
          <Stat label="Genres to explore" value={genres.length} delay={80} />
          <Stat label="Average price" value={average} format={(n) => `$${n.toFixed(2)}`} delay={160} />
          <Stat label="Staff picks" value={books.filter((b) => b.staffPick).length} delay={240} />
        </div>

        <Legend />

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card lg:col-span-2">
            <h3 className="mb-1 font-heading text-xl font-semibold text-primary">Fiction or fact?</h3>
            <p className="mb-5 text-sm text-muted">How our titles split between stories and true accounts.</p>
            <div className="flex flex-1 items-center"><Donut fiction={fiction} nonfiction={nonfiction} /></div>
          </Reveal>

          <Reveal delay={120} className="rounded-2xl border border-line bg-surface p-6 shadow-card lg:col-span-3">
            <h3 className="mb-1 font-heading text-xl font-semibold text-primary">Books per genre</h3>
            <p className="mb-5 text-sm text-muted">Every genre we shelve, from most to fewest titles.</p>
            <GenreBars rows={genres} />
          </Reveal>

          <Reveal delay={200} className="rounded-2xl border border-line bg-surface p-6 shadow-card lg:col-span-5">
            <h3 className="mb-1 font-heading text-xl font-semibold text-primary">What a book costs</h3>
            <p className="mb-5 text-sm text-muted">Number of titles in each price band, from ${lo} to ${hi}.</p>
            <PriceColumns bins={bins} />
          </Reveal>
        </div>

        {/* Same data as the charts, for screen readers. */}
        <table className="sr-only">
          <caption>Catalogue summary</caption>
          <thead><tr><th>Genre</th><th>Category</th><th>Titles</th></tr></thead>
          <tbody>{genres.map((g) => <tr key={g.tag}><td>{g.tag}</td><td>{g.category}</td><td>{g.count}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}
