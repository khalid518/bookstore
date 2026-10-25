import { pool } from '../src/db.js'
import books from './data/books.js'
import events from './data/events.js'

const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const [position, b] of books.entries()) {
    await client.query(
      `INSERT INTO books (id, title, author, tag, category, price, isbn, staff_quote, staff_by, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, author = EXCLUDED.author, tag = EXCLUDED.tag,
         category = EXCLUDED.category, price = EXCLUDED.price, isbn = EXCLUDED.isbn,
         staff_quote = EXCLUDED.staff_quote, staff_by = EXCLUDED.staff_by, position = EXCLUDED.position`,
      [b.id, b.title, b.author, b.tag, b.category, b.price, b.isbn, b.staffPick?.quote ?? null, b.staffPick?.by ?? null, position],
    )
  }
  for (const e of events) {
    await client.query(
      `INSERT INTO events (id, title, starts_at, blurb, description, host, duration_minutes, admission, highlights)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, starts_at = EXCLUDED.starts_at, blurb = EXCLUDED.blurb,
         description = EXCLUDED.description, host = EXCLUDED.host, duration_minutes = EXCLUDED.duration_minutes,
         admission = EXCLUDED.admission, highlights = EXCLUDED.highlights`,
      [e.id, e.title, e.startsAt, e.blurb, e.description, e.host, e.durationMinutes, e.admission, e.highlights],
    )
  }
  await client.query('COMMIT')
  console.log(`Seeded ${books.length} books and ${events.length} events.`)
} catch (err) {
  await client.query('ROLLBACK')
  throw err
} finally {
  client.release()
  await pool.end()
}
