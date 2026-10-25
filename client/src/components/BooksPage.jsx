import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCatalog } from '../lib/api.js'
import BookCard from './BookCard.jsx'
import { CardSkeleton } from './Skeletons.jsx'

const PAGE_SIZE = 8
const SORTS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['title', 'Title: A to Z'],
  ['author', 'Author: A to Z'],
]
const EMPTY = { q: '', category: '', genres: [], min: '', max: '', picks: false, sort: 'featured' }

const fromQuery = (query) => {
  const p = new URLSearchParams(query)
  const num = (v) => (v !== null && v !== '' && Number.isFinite(Number(v)) ? String(Number(v)) : '')
  return {
    q: p.get('q') ?? '',
    category: ['Fiction', 'Nonfiction'].includes(p.get('category')) ? p.get('category') : '',
    genres: (p.get('genre') ?? '').split(',').filter(Boolean),
    min: num(p.get('min')),
    max: num(p.get('max')),
    picks: p.get('picks') === '1',
    sort: SORTS.some(([v]) => v === p.get('sort')) ? p.get('sort') : 'featured',
  }
}

const toQuery = (f) => {
  const p = new URLSearchParams()
  if (f.q.trim()) p.set('q', f.q.trim())
  if (f.category) p.set('category', f.category)
  if (f.genres.length) p.set('genre', f.genres.join(','))
  if (f.min !== '') p.set('min', f.min)
  if (f.max !== '') p.set('max', f.max)
  if (f.picks) p.set('picks', '1')
  if (f.sort !== 'featured') p.set('sort', f.sort)
  return p.toString()
}

function useDebounced(value, ms) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

const money = (n) => `$${n}`
const chip = (on) =>
  `rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition duration-200 ${on ? 'border-primary bg-primary text-cream' : 'border-line bg-surface text-primary hover:border-primary'}`

function Section({ title, children }) {
  return (
    <div role="group" aria-label={title} className="border-t border-line pt-5 first:border-0 first:pt-0">
      <h3 className="mb-3 font-heading text-lg font-semibold text-primary">{title}</h3>
      {children}
    </div>
  )
}

function FilterPanel({ filters, setFilters, facets }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const toggleGenre = (g) => set({ genres: filters.genres.includes(g) ? filters.genres.filter((x) => x !== g) : [...filters.genres, g] })

  const price = facets?.price
  const presets = []
  if (price && price.max > price.min) {
    const a = Math.round(price.min + (price.max - price.min) / 3)
    const b = Math.round(price.min + ((price.max - price.min) * 2) / 3)
    presets.push([`Under ${money(a)}`, '', String(a)], [`${money(a)} – ${money(b)}`, String(a), String(b)], [`${money(b)} & over`, String(b), ''])
  }

  return (
    <div className="space-y-5">
      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!filters.category} onClick={() => set({ category: '', genres: [] })} className={chip(!filters.category)}>All</button>
          {(facets?.categories ?? []).map((c) => (
            <button key={c.value} type="button" aria-pressed={filters.category === c.value} onClick={() => set({ category: filters.category === c.value ? '' : c.value, genres: [] })} className={chip(filters.category === c.value)}>
              {c.value} <span className="opacity-70">({c.count})</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Genre">
        <ul className="space-y-1">
          {(facets?.genres ?? []).map((g) => (
            <li key={g.value}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-alt">
                <input type="checkbox" checked={filters.genres.includes(g.value)} onChange={() => toggleGenre(g.value)} className="h-4 w-4 accent-[var(--color-primary)]" />
                <span className="flex-1 text-primary">{g.value}</span>
                <span className="text-sm tabular-nums text-muted">{g.count}</span>
              </label>
            </li>
          ))}
          {/* Selected genres that the current filters would hide still need to be un-tickable. */}
          {filters.genres.filter((g) => !(facets?.genres ?? []).some((x) => x.value === g)).map((g) => (
            <li key={g}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-alt">
                <input type="checkbox" checked onChange={() => toggleGenre(g)} className="h-4 w-4 accent-[var(--color-primary)]" />
                <span className="flex-1 text-primary">{g}</span>
                <span className="text-sm text-muted">0</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Price">
        {presets.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {presets.map(([label, min, max]) => (
              <button key={label} type="button" aria-pressed={filters.min === min && filters.max === max} onClick={() => set(filters.min === min && filters.max === max ? { min: '', max: '' } : { min, max })} className={chip(filters.min === min && filters.max === max)}>
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="flex-1 text-sm text-muted">
            <span className="sr-only">Minimum price</span>
            <input type="number" inputMode="decimal" min="0" step="1" placeholder={price ? `Min ${money(price.min)}` : 'Min'} value={filters.min} onChange={(e) => set({ min: e.target.value })} className="w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-primary focus:border-primary focus:outline-none" />
          </label>
          <span aria-hidden="true" className="text-muted">–</span>
          <label className="flex-1 text-sm text-muted">
            <span className="sr-only">Maximum price</span>
            <input type="number" inputMode="decimal" min="0" step="1" placeholder={price ? `Max ${money(price.max)}` : 'Max'} value={filters.max} onChange={(e) => set({ max: e.target.value })} className="w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-primary focus:border-primary focus:outline-none" />
          </label>
        </div>
      </Section>

      <Section title="More">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-alt">
          <input type="checkbox" checked={filters.picks} onChange={(e) => set({ picks: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
          <span className="text-primary">Staff picks only</span>
        </label>
      </Section>
    </div>
  )
}

export default function BooksPage({ query, nav, quantities, onQuantityChange, onOpenBook }) {
  const [filters, setFilters] = useState(() => fromQuery(query))
  const [data, setData] = useState({ items: [], total: 0, page: 0, hasMore: false, facets: null })
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [moreState, setMoreState] = useState('idle') // idle | loading | error
  const [drawer, setDrawer] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const requestId = useRef(0)
  const sentinel = useRef(null)
  const drawerRef = useRef(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const debounced = useDebounced(filters, 250)
  const key = toQuery(debounced)

  // Arriving here again through a link (e.g. a search suggestion) replaces the filters with the URL's.
  const firstNav = useRef(nav)
  useEffect(() => {
    if (nav === firstNav.current) return
    firstNav.current = nav
    const hash = window.location.hash
    const next = fromQuery(hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '')
    if (toQuery(next) !== toQuery(filtersRef.current) || next.q !== filtersRef.current.q) setFilters(next)
  }, [nav])

  // First page, whenever the (debounced) filters change.
  useEffect(() => {
    const controller = new AbortController()
    const id = ++requestId.current
    setStatus('loading')
    setMoreState('idle')
    history.replaceState(null, '', `#/books${key ? `?${key}` : ''}`)
    fetchCatalog(`${key}${key ? '&' : ''}page=1&pageSize=${PAGE_SIZE}`, controller.signal)
      .then((r) => {
        if (id !== requestId.current) return
        setData(r)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && id === requestId.current) setStatus('error')
      })
    return () => controller.abort()
  }, [key, attempt])

  const loadMore = useCallback(async () => {
    if (status !== 'ready' || moreState === 'loading' || !data.hasMore) return
    const id = requestId.current
    setMoreState('loading')
    try {
      const r = await fetchCatalog(`${key}${key ? '&' : ''}page=${data.page + 1}&pageSize=${PAGE_SIZE}`)
      if (id !== requestId.current) return
      setData((d) => {
        const seen = new Set(d.items.map((b) => b.id))
        return { ...r, items: [...d.items, ...r.items.filter((b) => !seen.has(b.id))] }
      })
      setMoreState('idle')
    } catch {
      if (id === requestId.current) setMoreState('error')
    }
  }, [status, moreState, data.hasMore, data.page, key])

  // Infinite scroll: load the next page when the sentinel nears the viewport. Re-armed after each
  // page so a tall screen keeps filling until it is full.
  const loadMoreRef = useRef(loadMore)
  loadMoreRef.current = loadMore
  useEffect(() => {
    const el = sentinel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMoreRef.current(), { rootMargin: '500px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [data.items.length, data.hasMore, status, moreState])

  useEffect(() => {
    const dialog = drawerRef.current
    if (!dialog) return
    if (drawer && !dialog.open) dialog.showModal()
  }, [drawer])

  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const clearAll = () => setFilters({ ...EMPTY, sort: filters.sort })

  const active = []
  if (filters.q.trim()) active.push([`“${filters.q.trim()}”`, () => set({ q: '' })])
  if (filters.category) active.push([filters.category, () => set({ category: '' })])
  for (const g of filters.genres) active.push([g, () => set({ genres: filters.genres.filter((x) => x !== g) })])
  if (filters.min !== '' || filters.max !== '') {
    const label = filters.min !== '' && filters.max !== '' ? `$${filters.min} – $${filters.max}` : filters.min !== '' ? `$${filters.min} & over` : `Under $${filters.max}`
    active.push([label, () => set({ min: '', max: '' })])
  }
  if (filters.picks) active.push(['Staff picks', () => set({ picks: false })])

  const loading = status === 'loading'
  const shown = data.items.length

  return (
    <section aria-labelledby="books-title" className="min-h-[70vh] pb-20">
      <div className="bg-gradient-to-b from-alt to-cream">
        <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
          <p className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            The whole shop
          </p>
          <h1 id="books-title" className="mb-2 font-heading text-4xl font-semibold text-primary sm:text-5xl">All Books</h1>
          <p className="mb-6 max-w-xl text-lg text-muted">Search and filter every title on our shelves to find just what you're after.</p>

          <div className="relative max-w-2xl">
            <label htmlFor="books-search" className="sr-only">Search books by title, author or genre</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input
              id="books-search"
              type="search"
              value={filters.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Search by title, author or genre"
              autoComplete="off"
              className="w-full rounded-full border-2 border-line bg-white py-3 pl-12 pr-4 text-primary shadow-card transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-8 sm:px-8 lg:grid-cols-[17rem_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-card">
            <FilterPanel filters={filters} setFilters={setFilters} facets={data.facets} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-muted">
              {loading && shown === 0 ? 'Loading books…' : status === 'error' ? '' : <>Showing <strong className="text-primary">{shown}</strong> of <strong className="text-primary">{data.total}</strong> {data.total === 1 ? 'book' : 'books'}</>}
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-full border-2 border-primary px-4 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-cream lg:hidden">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                Filters{active.length > 0 && <span className="rounded-full bg-accent px-1.5 text-xs text-white">{active.length}</span>}
              </button>
              <label className="flex items-center gap-2 text-sm text-muted">
                Sort
                <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} className="rounded-full border-2 border-line bg-white px-3 py-1.5 font-semibold text-primary focus:border-primary focus:outline-none">
                  {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {active.length > 0 && (
            <ul aria-label="Active filters" className="mb-6 flex flex-wrap items-center gap-2">
              {active.map(([label, remove]) => (
                <li key={label}>
                  <button type="button" onClick={remove} className="group flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-cream transition hover:bg-accent">
                    {label}
                    <span aria-hidden="true" className="text-base leading-none opacity-70 group-hover:opacity-100">×</span>
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
              <li><button type="button" onClick={clearAll} className="px-2 text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary">Clear all</button></li>
            </ul>
          )}

          {status === 'error' ? (
            <div className="rounded-2xl border border-line bg-surface p-10 text-center shadow-card">
              <p className="mb-4 text-primary">We couldn't load the books just now.</p>
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="rounded-full border-2 border-primary px-6 py-2 font-semibold text-primary transition hover:bg-primary hover:text-cream">Try again</button>
            </div>
          ) : loading && shown === 0 ? (
            <ul aria-hidden="true" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</ul>
          ) : data.total === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-16 text-center shadow-card">
              <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-alt text-accent">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M8.5 11h5" /></svg>
              </span>
              <h2 className="font-heading text-2xl font-semibold text-primary">No books match</h2>
              <p className="max-w-sm text-muted">Try a different spelling, remove a filter or widen the price range.</p>
              <button type="button" onClick={clearAll} className="mt-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-cream transition hover:bg-primary-dark">Clear all filters</button>
            </div>
          ) : (
            <>
              <ul className={`grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${loading ? 'opacity-60' : ''}`}>
                {data.items.map((b, i) => (
                  <BookCard key={b.id} index={i} book={b} quantity={quantities[b.id] ?? 0} onQuantityChange={(q) => onQuantityChange(b.id, q)} onOpen={() => onOpenBook(b)} />
                ))}
                {moreState === 'loading' && Array.from({ length: 3 }, (_, i) => <CardSkeleton key={`s${i}`} />)}
              </ul>

              <div ref={sentinel} className="mt-10 flex min-h-12 flex-col items-center gap-2 text-center">
                {data.hasMore ? (
                  moreState === 'error' ? (
                    <>
                      <p className="text-sm text-accent-dark">Couldn't load more books.</p>
                      <button type="button" onClick={loadMore} className="rounded-full border-2 border-primary px-6 py-2 font-semibold text-primary transition hover:bg-primary hover:text-cream">Try again</button>
                    </>
                  ) : (
                    <button type="button" onClick={loadMore} disabled={moreState === 'loading'} className="rounded-full border-2 border-primary px-7 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-cream disabled:opacity-60">
                      {moreState === 'loading' ? 'Loading…' : 'Load more books'}
                    </button>
                  )
                ) : (
                  <p className="text-sm text-muted">You've reached the end · {data.total} {data.total === 1 ? 'book' : 'books'}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {drawer && (
        <dialog
          ref={drawerRef}
          onClose={() => setDrawer(false)}
          onClick={(e) => e.target === e.currentTarget && setDrawer(false)}
          aria-labelledby="filters-title"
          className="m-0 mt-auto max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-surface p-0 text-ink shadow-lift open:motion-safe:animate-rise backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-6 py-4">
            <h2 id="filters-title" className="font-heading text-xl font-semibold text-primary">Filters</h2>
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="text-2xl leading-none text-muted hover:text-primary">×</button>
          </div>
          <div className="px-6 py-5">
            <FilterPanel filters={filters} setFilters={setFilters} facets={data.facets} />
          </div>
          <div className="sticky bottom-0 flex gap-3 border-t border-line bg-surface px-6 py-4">
            <button type="button" onClick={clearAll} className="rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary">Clear</button>
            <button type="button" onClick={() => setDrawer(false)} className="flex-1 rounded-full bg-primary px-5 py-2.5 font-semibold text-cream">
              Show {data.total} {data.total === 1 ? 'book' : 'books'}
            </button>
          </div>
        </dialog>
      )}
    </section>
  )
}
