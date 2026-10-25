import { useEffect, useMemo, useRef, useState } from 'react'
import BookCover from './BookCover.jsx'

const MAX_RESULTS = 6

const score = (book, terms) => {
  const title = book.title.toLowerCase()
  const author = book.author.toLowerCase()
  const tag = book.tag.toLowerCase()
  let total = 0
  for (const t of terms) {
    if (title.startsWith(t)) total += 4
    else if (title.includes(t)) total += 3
    else if (author.includes(t)) total += 2
    else if (tag.includes(t)) total += 1
    else return 0 // every word has to match something
  }
  return total
}

export default function SearchPalette({ books, onClose, onOpenBook }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Same StrictMode-safe pattern as the other dialogs: no close() in a cleanup.
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    inputRef.current?.focus()
  }, [])

  const trimmed = query.trim()
  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

  const results = useMemo(() => {
    if (terms.length === 0) return []
    return books
      .map((b) => [b, score(b, terms)])
      .filter(([, s]) => s > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([b]) => b)
  }, [books, trimmed]) // eslint-disable-line react-hooks/exhaustive-deps

  const genres = useMemo(() => {
    const counts = new Map()
    for (const b of books) counts.set(b.tag, (counts.get(b.tag) ?? 0) + 1)
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([tag]) => tag)
  }, [books])

  const visible = results.slice(0, MAX_RESULTS)
  // The last row is always "see all results", so there is something to press Enter on.
  const rowCount = trimmed ? visible.length + 1 : 0
  const safeActive = Math.min(active, Math.max(0, rowCount - 1))

  const go = (hash) => {
    onClose()
    window.location.hash = hash
  }
  const allResults = () => go(`#/books?q=${encodeURIComponent(trimmed)}`)
  const pick = (index) => {
    if (index < visible.length) {
      onClose()
      onOpenBook(visible[index])
    } else allResults()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' && rowCount) {
      e.preventDefault()
      setActive((safeActive + 1) % rowCount)
    } else if (e.key === 'ArrowUp' && rowCount) {
      e.preventDefault()
      setActive((safeActive - 1 + rowCount) % rowCount)
    } else if (e.key === 'Enter' && trimmed) {
      e.preventDefault()
      pick(safeActive)
    }
  }

  const rowClass = (on) => `flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${on ? 'bg-alt' : ''}`

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="Search books"
      className="m-0 mx-auto mt-[8dvh] max-h-[84dvh] w-[min(40rem,calc(100%-1.5rem))] overflow-hidden rounded-3xl bg-surface p-0 text-ink shadow-lift open:motion-safe:animate-rise backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={rowCount > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={rowCount ? `search-row-${safeActive}` : undefined}
          aria-label="Search books by title, author or genre"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Search by title, author or genre"
          autoComplete="off"
          spellCheck="false"
          className="min-w-0 flex-1 bg-transparent text-lg text-primary placeholder:text-muted focus:outline-none"
        />
        <button type="button" onClick={onClose} className="rounded-md border border-line px-2 py-0.5 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary">Esc</button>
      </div>

      <div className="max-h-[calc(84dvh-4.5rem)] overflow-y-auto p-2">
        {trimmed ? (
          <ul id="search-results" role="listbox" aria-label="Suggestions">
            {visible.map((b, i) => (
              <li key={b.id} role="presentation">
                <button type="button" role="option" id={`search-row-${i}`} aria-selected={i === safeActive} onMouseEnter={() => setActive(i)} onClick={() => pick(i)} className={rowClass(i === safeActive)}>
                  <BookCover title={b.title} author={b.author} src={b.coverUrl} className="relative w-9 shrink-0 rounded-sm shadow" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading font-semibold text-primary">{b.title}</span>
                    <span className="block truncate text-sm text-muted">{b.author} · {b.tag}</span>
                  </span>
                  <span className="font-semibold tabular-nums text-primary">${b.price.toFixed(2)}</span>
                </button>
              </li>
            ))}
            {visible.length === 0 && <li role="presentation" className="px-3 py-6 text-center text-muted">No books match “{trimmed}”.</li>}
            <li role="presentation" className="mt-1 border-t border-line pt-1">
              <button type="button" role="option" id={`search-row-${visible.length}`} aria-selected={safeActive === visible.length} onMouseEnter={() => setActive(visible.length)} onClick={allResults} className={`${rowClass(safeActive === visible.length)} font-semibold text-accent`}>
                <span className="flex-1">
                  {results.length > MAX_RESULTS ? `See all ${results.length} results` : 'Search with filters'} for “{trimmed}”
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        ) : (
          <div className="space-y-5 p-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Browse by genre</p>
              <ul className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <li key={g}>
                    <button type="button" onClick={() => go(`#/books?genre=${encodeURIComponent(g)}`)} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-cream">{g}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm font-semibold">
              <button type="button" onClick={() => go('#/books?picks=1')} className="text-accent underline underline-offset-4 hover:text-primary">Staff picks</button>
              <button type="button" onClick={() => go('#/books')} className="text-accent underline underline-offset-4 hover:text-primary">Browse all books →</button>
              <span className="ml-auto hidden text-xs font-normal text-muted sm:inline">↑↓ to move · Enter to open · Esc to close</span>
            </div>
          </div>
        )}
      </div>
    </dialog>
  )
}
