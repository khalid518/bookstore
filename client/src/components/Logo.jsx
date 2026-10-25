export function LogoMark({ onDark = false, className = 'h-9 w-9 sm:h-11 sm:w-11' }) {
  const tile = onDark ? '#faf5ea' : '#1f3d2f'
  const book = onDark ? '#1f3d2f' : '#faf5ea'
  const arch = onDark ? '#a8482a' : '#c9a24b'
  const ribbon = onDark ? '#c9a24b' : '#a8482a'
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={`shrink-0 ${className}`}>
      <rect width="64" height="64" rx="14" fill={tile} />
      <path d="M15 31V25a17 17 0 0134 0v6" fill="none" stroke={arch} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 33c-4-2.6-9.5-3.4-15-2.6v18c5.5-.8 11 0 15 2.6 4-2.6 9.5-3.4 15-2.6v-18c-5.5-.8-11 0-15 2.6z" fill={book} />
      <path d="M32 33v18" stroke={tile} strokeWidth="2.2" />
      <path d="M38 22h7v17l-3.5-3-3.5 3z" fill={ribbon} />
    </svg>
  )
}

// A single-line wordmark with a small-caps tagline; the tagline is hidden on very narrow screens.
export default function Logo({ onDark = false }) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-3">
      <LogoMark onDark={onDark} />
      <span className="flex flex-col leading-none">
        <span className={`font-heading text-base font-bold italic leading-[1.1] sm:text-2xl ${onDark ? 'text-gold' : 'text-primary'}`}>The Reading Room</span>
        <span className={`mt-1 hidden text-[0.62rem] font-semibold uppercase tracking-[0.28em] min-[400px]:block ${onDark ? 'text-cream/80' : 'text-accent'}`}>Independent Booksellers</span>
      </span>
    </span>
  )
}
