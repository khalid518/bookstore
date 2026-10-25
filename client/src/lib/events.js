// Helpers for the event pages. Event times are the shop's local wall-clock time ("YYYY-MM-DDTHH:mm").

const pad = (n) => String(n).padStart(2, '0')

// Add minutes to a "YYYY-MM-DDTHH:mm" string without involving the visitor's time zone.
function addMinutes(datetime, minutes) {
  const [date, time] = datetime.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d, hh, mm + minutes))
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`
}

const icsStamp = (datetime) => datetime.replace(/[-:]/g, '') + '00'
// RFC 5545 text escaping: backslash, newline, comma and semicolon.
const icsEscape = (text) => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => `\\${c}`)

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(' ')
}

export function endTime(event) {
  const [, time] = addMinutes(event.datetime, event.durationMinutes).split('T')
  const [hh, mm] = time.split(':').map(Number)
  return `${hh % 12 || 12}:${pad(mm)} ${hh < 12 ? 'am' : 'pm'}`
}

// A minimal iCalendar file, using "floating" local times so it lands at the right hour in any calendar.
export function buildIcs(event, location) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Reading Room//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@thereadingroom`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${icsStamp(event.datetime)}`,
    `DTEND:${icsStamp(addMinutes(event.datetime, event.durationMinutes))}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.blurb)}`,
    `LOCATION:${icsEscape(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadIcs(event, location) {
  const blob = new Blob([buildIcs(event, location)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.id}.ics`
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
