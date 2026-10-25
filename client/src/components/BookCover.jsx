import { useState } from 'react'

const palettes = [
  ['#1f3d2f', '#c9a24b'],
  ['#a8482a', '#faf5ea'],
  ['#2f4a6b', '#e8d9a8'],
  ['#5c3d2e', '#e0c58f'],
  ['#4a3a5c', '#e6d5a8'],
]

const pick = (text) => palettes[[...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % palettes.length]

// Open Library answers unknown ISBNs with a 1x1 image, so a tiny natural size counts as a failure too.
export default function BookCover({ title, author, src, className = '', alt = '' }) {
  const [state, setState] = useState('loading')
  const [bg, fg] = pick(title)

  return (
    <div className={`aspect-[2/3] overflow-hidden bg-alt ${state === 'loading' ? 'animate-pulse' : ''} ${className}`}>
      {state !== 'failed' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => setState(e.currentTarget.naturalWidth > 1 ? 'loaded' : 'failed')}
          onError={() => setState('failed')}
          className={`h-full w-full object-cover transition-opacity duration-300 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {state === 'failed' && (
        <div role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-[10%] text-center" style={{ background: bg, color: fg }}>
          <div className="absolute inset-[6%] border" style={{ borderColor: fg, opacity: 0.45 }} />
          <span className="relative break-words font-heading text-[clamp(0.7rem,2.4vw,1.15rem)] font-bold italic leading-tight">{title}</span>
          <span className="relative text-[clamp(0.55rem,1.6vw,0.8rem)] uppercase tracking-widest opacity-80">{author}</span>
        </div>
      )}
    </div>
  )
}
