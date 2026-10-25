import { Router } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { pool } from '../db.js'
import { auth } from '../auth.js'

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

const MAX_QTY = 9
const MAX_LINES = 50

// Places a pickup order. The client only sends { bookId: quantity }; prices come from the database.
router.post('/orders', async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    if (!session) return res.status(401).json({ error: 'Sign in to place an order' })

    const raw = req.body?.items
    const lines = raw && typeof raw === 'object' && !Array.isArray(raw) ? Object.entries(raw) : []
    if (lines.length === 0 || lines.length > MAX_LINES) return res.status(400).json({ error: 'Your basket is empty' })
    if (lines.some(([, q]) => !Number.isInteger(q) || q < 1 || q > MAX_QTY)) {
      return res.status(400).json({ error: `Quantities must be between 1 and ${MAX_QTY}` })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const { rows: books } = await client.query('SELECT id, title, price FROM books WHERE id = ANY($1)', [lines.map(([id]) => id)])
      if (books.length !== lines.length) {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: 'Some books in your basket are no longer available' })
      }
      const price = new Map(books.map((b) => [b.id, Number(b.price)]))
      const totalCents = lines.reduce((sum, [id, q]) => sum + Math.round(price.get(id) * 100) * q, 0)

      const { rows: [order] } = await client.query(
        'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, created_at',
        [session.user.id, totalCents / 100],
      )
      for (const [id, q] of lines) {
        await client.query('INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', [order.id, id, q, price.get(id)])
      }
      await client.query('COMMIT')
      res.status(201).json({ id: order.id, total: totalCents / 100, itemCount: lines.reduce((s, [, q]) => s + q, 0) })
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {})
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    next(err)
  }
})

export default router
