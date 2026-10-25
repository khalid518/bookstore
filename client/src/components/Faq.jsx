import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { SUMMARY } from '../lib/shop.js'

const faqs = [
  { q: 'Do I need an account to order?', a: 'You can browse and fill a basket without one. To reserve your books for pickup you need to sign in, so we know whose order it is.' },
  { q: 'How do I pay?', a: 'Not online. Reserve your books here and pay at the counter when you collect them.' },
  { q: 'When can I collect my order?', a: `Any time we are open: ${SUMMARY.join('; ')}.` },
  { q: 'Where is the shop?', a: 'You will find our address and hours in the Plan Your Visit section, just above the footer.' },
]

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <SectionHead id="faq-title" eyebrow="Good to know" title="Questions, Answered" intro="The things readers ask us most." />
        <Reveal className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5 transition-colors open:bg-cream/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold text-primary [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-muted motion-safe:animate-fade">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
