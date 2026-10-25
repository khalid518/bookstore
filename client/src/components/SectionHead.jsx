import Reveal from './Reveal.jsx'

export default function SectionHead({ id, eyebrow, title, intro, light = false, center = false }) {
  return (
    <Reveal as="header" className={`mb-10 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] ${light ? 'text-gold' : 'text-accent'}`}>
        <span aria-hidden="true" className={`h-px w-8 ${light ? 'bg-gold' : 'bg-accent'}`} />
        {eyebrow}
      </p>
      <h2 id={id} className={`mb-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem] ${light ? 'text-cream' : 'text-primary'}`}>{title}</h2>
      {intro && <p className={`text-lg ${light ? 'text-cream/80' : 'text-muted'}`}>{intro}</p>}
    </Reveal>
  )
}
