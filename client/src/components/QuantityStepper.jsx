export default function QuantityStepper({ label, value, onChange, min = 0, max = 9 }) {
  const btn =
    'h-8 w-8 rounded-full border border-primary text-lg transition-colors leading-none text-primary hover:bg-primary hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary'
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Remove one ${label}`}>−</button>
      <span className="min-w-6 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Add one ${label}`}>+</button>
    </div>
  )
}
