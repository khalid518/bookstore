export default function SectionHead({ id, eyebrow, title, intro }) {
  return (
    <header className="mb-8 max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>
      <h2 id={id} className="mb-2 font-heading text-3xl leading-tight text-primary sm:text-4xl">{title}</h2>
      <p className="text-muted">{intro}</p>
    </header>
  )
}
