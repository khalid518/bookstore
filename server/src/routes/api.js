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
    description: r.description ?? r.blurb,
    host: r.host,
    durationMinutes: r.duration_minutes,
    admission: r.admission,
    highlights: r.highlights ?? [],
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

// ---- Catalogue: search, filters, sorting and pagination for the All Books page -------------------

const SORTS = {
  featured: 'position ASC',
  'price-asc': 'price ASC, position ASC',
  'price-desc': 'price DESC, position ASC',
  title: 'title ASC',
  author: 'author ASC, title ASC',
}
const PAGE_SIZE = 8
const MAX_PAGE_SIZE = 24
const CATEGORIES = ['Fiction', 'Nonfiction']

const escapeLike = (term) => `%${term.replace(/[\\%_]/g, '\\$&')}%`
const toNumber = (v) => (v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v))

function parseCatalogQuery(query) {
  const text = (v) => (typeof v === 'string' ? v : '')
  const q = text(query.q).trim().slice(0, 100)
  const page = Math.max(1, Math.floor(toNumber(query.page) ?? 1))
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(toNumber(query.pageSize) ?? PAGE_SIZE)))
  return {
    terms: q.split(/\s+/).filter(Boolean).slice(0, 6),
    category: CATEGORIES.includes(query.category) ? query.category : null,
    genres: text(query.genre).split(',').map((g) => g.trim()).filter(Boolean).slice(0, 12),
    min: toNumber(query.min),
    max: toNumber(query.max),
    picks: query.picks === '1',
    sort: Object.hasOwn(SORTS, query.sort) ? query.sort : 'featured',
    page,
    pageSize,
  }
}

// Builds a parameterised WHERE clause. `omit` leaves one filter out so facet counts can show
// what each option would return if chosen (e.g. genre counts ignore the genre filter itself).
function catalogWhere(f, omit = '') {
  const params = []
  const parts = []
  const add = (value) => params.push(value) && `$${params.length}`
  if (omit !== 'q') {
    for (const term of f.terms) {
      const p = add(escapeLike(term))
      parts.push(`(title ILIKE ${p} OR author ILIKE ${p} OR tag ILIKE ${p} OR category ILIKE ${p})`)
    }
  }
  if (f.category && omit !== 'category') parts.push(`category = ${add(f.category)}`)
  if (f.genres.length && omit !== 'genre') parts.push(`tag = ANY(${add(f.genres)})`)
  if (omit !== 'price') {
    if (f.min !== null) parts.push(`price >= ${add(f.min)}`)
    if (f.max !== null) parts.push(`price <= ${add(f.max)}`)
  }
  if (f.picks && omit !== 'picks') parts.push('staff_quote IS NOT NULL')
  return { sql: parts.length ? `WHERE ${parts.join(' AND ')}` : '', params }
}

router.get('/catalog', async (req, res, next) => {
  try {
    const f = parseCatalogQuery(req.query)
    const main = catalogWhere(f)
    const byCategory = catalogWhere(f, 'category')
    const byGenre = catalogWhere(f, 'genre')

    const [items, total, categories, genres, bounds] = await Promise.all([
      pool.query(`SELECT * FROM books ${main.sql} ORDER BY ${SORTS[f.sort]} LIMIT ${f.pageSize} OFFSET ${(f.page - 1) * f.pageSize}`, main.params),
      pool.query(`SELECT COUNT(*)::int AS n FROM books ${main.sql}`, main.params),
      pool.query(`SELECT category AS value, COUNT(*)::int AS count FROM books ${byCategory.sql} GROUP BY category ORDER BY category`, byCategory.params),
      pool.query(`SELECT tag AS value, COUNT(*)::int AS count FROM books ${byGenre.sql} GROUP BY tag ORDER BY count DESC, tag`, byGenre.params),
      pool.query('SELECT MIN(price) AS min, MAX(price) AS max FROM books'),
    ])

    const count = total.rows[0].n
    res.json({
      items: items.rows.map(toBook),
      total: count,
      page: f.page,
      pageSize: f.pageSize,
      hasMore: f.page * f.pageSize < count,
      facets: {
        categories: categories.rows,
        genres: genres.rows,
        price: { min: Math.floor(Number(bounds.rows[0].min ?? 0)), max: Math.ceil(Number(bounds.rows[0].max ?? 0)) },
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/events', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, blurb, description, host, duration_minutes, admission, highlights, to_char(starts_at, 'YYYY-MM-DD"T"HH24:MI') AS datetime FROM events ORDER BY starts_at`,
    )
    res.json(rows.map(toEvent))
  } catch (err) {
    next(err)
  }
})

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Newsletter signup. Repeat signups are accepted silently so the endpoint can't be used to probe the list.
router.post('/subscribe', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    if (email.length > 254 || !EMAIL.test(email)) return res.status(400).json({ error: 'Please enter a valid email address' })
    await pool.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email])
    res.status(201).json({ ok: true })
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

const currentUser = async (req) => (await auth.api.getSession({ headers: fromNodeHeaders(req.headers) }))?.user

// The signed-in user's orders, newest first, each with its line items.
router.get('/orders', async (req, res, next) => {
  try {
    const user = await currentUser(req)
    if (!user) return res.status(401).json({ error: 'Sign in to see your orders' })

    const { rows } = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at AT TIME ZONE 'UTC' AS created_at,
              json_agg(json_build_object(
                'bookId', b.id, 'title', b.title, 'author', b.author, 'isbn', b.isbn,
                'quantity', oi.quantity, 'unitPrice', oi.unit_price
              ) ORDER BY b.title) AS items
         FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         JOIN books b ON b.id = oi.book_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 50`,
      [user.id],
    )
    res.json(
      rows.map((r) => ({
        id: r.id,
        status: r.status,
        total: Number(r.total),
        createdAt: r.created_at.toISOString(),
        items: r.items.map((i) => ({
          ...i,
          unitPrice: Number(i.unitPrice),
          coverUrl: `https://covers.openlibrary.org/b/isbn/${i.isbn}-M.jpg`,
        })),
      })),
    )
  } catch (err) {
    next(err)
  }
})

// Cancel one of your own orders while it is still only reserved.
router.post('/orders/:id/cancel', async (req, res, next) => {
  try {
    const user = await currentUser(req)
    if (!user) return res.status(401).json({ error: 'Sign in to manage your orders' })
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order' })

    const { rowCount } = await pool.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = $1 AND user_id = $2 AND status = 'placed'`,
      [id, user.id],
    )
    if (rowCount === 0) return res.status(409).json({ error: 'This order can no longer be cancelled' })
    res.json({ id, status: 'cancelled' })
  } catch (err) {
    next(err)
  }
})

export default router
