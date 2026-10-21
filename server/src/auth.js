import { betterAuth } from 'better-auth'
import { pool } from './db.js'

const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [clientUrl],
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
})
