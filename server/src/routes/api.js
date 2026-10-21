import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const toBook = (r) => ({
  id: r.id,
  title: r.title,
  author: r.author,
  tag: r.tag,
  category: r.category,
  price: Number(r.price),
  isbn: r.isbn,
  coverUrl: `https://covers.openlibrary.org/b/isbn/${r.isbn}-L.jpg`,
  url: `https://openlibrary.org/isbn/${r.isbn}`,
  staffPick: r.staff_quote ? { quote: r.staff_quote, by: r.staff_by } : null,
})

// `datetime` is a timezone-less 'YYYY-MM-DDTHH:mm' string, so format it without Date to avoid shifts.
const toEvent = (r) => {
  const [date, time] = r.datetime.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  const clock = `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'am' : 'pm'}`
  return {
    id: r.id,
    title: r.title,
    blurb: r.blurb,
    datetime: r.datetime,
    month: MONTHS[m - 1],
    day: d,
    when: `${weekday}, ${FULL_MONTHS[m - 1]} ${d} · ${clock}`,
  }
}

router.get('/health', (req, res) => res.json({ ok: true }))

router.get('/books', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY position')
    res.json(rows.map(toBook))
  } catch (err) {
    next(err)
  }
})

router.get('/events', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, blurb, to_char(starts_at, 'YYYY-MM-DD"T"HH24:MI') AS datetime FROM events ORDER BY starts_at`,
    )
    res.json(rows.map(toEvent))
  } catch (err) {
    next(err)
  }
})

export default router
