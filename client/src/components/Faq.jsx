import SectionHead from './SectionHead.jsx'

const faqs = [
  { q: 'Do I need an account to order?', a: 'You can browse and fill a basket without one. To reserve your books for pickup you need to sign in, so we know whose order it is.' },
  { q: 'How do I pay?', a: 'Not online. Reserve your books here and pay at the counter when you collect them.' },
  { q: 'When can I collect my order?', a: 'Any time we are open: Mon–Fri 9 am – 7 pm, Saturday 10 am – 6 pm and Sunday 11 am – 4 pm.' },
  { q: 'Where is the shop?', a: 'You will find our address and hours in the Visit Us section at the bottom of the page.' },
]

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-alt py-16">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <SectionHead id="faq-title" eyebrow="Good to know" title="Questions, Answered" intro="The things readers ask us most." />
        <div className="divide-y divide-line rounded-md border border-line bg-surface">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg text-primary [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
