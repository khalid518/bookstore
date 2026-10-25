const bar = 'rounded bg-line/70 motion-safe:animate-pulse'

export function CardSkeleton() {
  return (
    <li className="flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface shadow-sm">
      <div className="bg-alt px-5 pt-5">
        <div className="aspect-[2/3] w-full rounded-t-sm bg-line/70 motion-safe:animate-pulse" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className={`${bar} h-3 w-1/3`} />
        <div className={`${bar} h-5 w-4/5`} />
        <div className={`${bar} h-4 w-1/2`} />
        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <div className={`${bar} h-5 w-16`} />
          <div className={`${bar} h-4 w-20`} />
        </div>
        <div className={`${bar} h-10 w-full`} />
      </div>
    </li>
  )
}

function HeadSkeleton() {
  return (
    <div className="mb-8 max-w-2xl">
      <div className={`${bar} mb-3 h-3 w-28`} />
      <div className={`${bar} mb-3 h-9 w-64 max-w-full`} />
      <div className={`${bar} h-4 w-full`} />
    </div>
  )
}

export function ShelfSkeleton() {
  return (
    <section aria-hidden="true" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <HeadSkeleton />
        <div className={`${bar} mb-6 h-10 w-full max-w-md`} />
        <div className="mb-8 flex gap-2">
          {[24, 28, 32].map((w) => <div key={w} className={`${bar} h-9 rounded-full`} style={{ width: `${w * 4}px` }} />)}
        </div>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}
        </ul>
      </div>
    </section>
  )
}

export function EventsSkeleton() {
  return (
    <section aria-hidden="true" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <HeadSkeleton />
        <ul className="flex flex-col gap-5">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="flex flex-col items-start gap-5 rounded-md border border-l-4 border-line border-l-line bg-surface p-5 sm:flex-row sm:items-center">
              <div className={`${bar} h-16 w-16 shrink-0`} />
              <div className="flex w-full min-w-0 flex-1 flex-col gap-2">
                <div className={`${bar} h-5 w-1/2`} />
                <div className={`${bar} h-4 w-1/3`} />
                <div className={`${bar} h-4 w-3/4`} />
              </div>
              <div className={`${bar} h-12 w-36 shrink-0`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
