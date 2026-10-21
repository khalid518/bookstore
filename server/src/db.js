import pg from 'pg'

const { DATABASE_URL } = process.env
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set. Copy server/.env.example to server/.env')

// Neon (and most hosted Postgres) requires SSL; local Docker does not.
const local = /localhost|127\.0\.0\.1/.test(DATABASE_URL)

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: local ? false : { rejectUnauthorized: false },
})
