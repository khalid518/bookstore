export function LogoMark({ onDark = false, className = 'h-10 w-10' }) {
  const tile = onDark ? '#faf5ea' : '#1f3d2f'
  const book = onDark ? '#1f3d2f' : '#faf5ea'
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <rect width="64" height="64" rx="14" fill={tile} />
      <path d="M32 19c-5-3.5-12-4.5-19-3.5v28c7-1 14 0 19 3.5 5-3.5 12-4.5 19-3.5v-28c-7-1-14 0-19 3.5z" fill={book} />
      <path d="M32 19v28" stroke={tile} strokeWidth="2.5" />
      <path d="M38 13h8v21l-4-3.5-4 3.5z" fill="#c9a24b" />
    </svg>
  )
}

export default function Logo({ onDark = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark onDark={onDark} />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-accent">The</span>
        <span className={`font-heading text-2xl font-bold italic ${onDark ? 'text-gold' : 'text-primary'}`}>Reading Room</span>
      </span>
    </span>
  )
}
