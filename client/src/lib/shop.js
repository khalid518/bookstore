// Single source of truth for opening hours and contact details (used by the Visit section, footer and FAQ).
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Opening and closing hour (24h) for each weekday, indexed like Date#getDay().
export const HOURS = [
  [11, 16], // Sunday
  [9, 19],
  [9, 19],
  [9, 19],
  [9, 19],
  [9, 19],
  [10, 18], // Saturday
]

export const SUMMARY = ['Mon–Fri: 9 am – 7 pm', 'Saturday: 10 am – 6 pm', 'Sunday: 11 am – 4 pm']

export const ADDRESS = ['123 Placeholder Lane', 'Your Town, ST 00000']
export const EMAIL = 'hello@thereadingroom.example'

export const formatHour = (h) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`

// Whether the shop is open at `now`, with a human-readable status line.
export function openStatus(now = new Date()) {
  const day = now.getDay()
  const hour = now.getHours() + now.getMinutes() / 60
  const [open, close] = HOURS[day]
  if (hour >= open && hour < close) return { open: true, text: `Open now · closes at ${formatHour(close)}` }
  if (hour < open) return { open: false, text: `Closed · opens today at ${formatHour(open)}` }
  const next = (day + 1) % 7
  return { open: false, text: `Closed · opens tomorrow at ${formatHour(HOURS[next][0])}` }
}
