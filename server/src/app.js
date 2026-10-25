import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import apiRouter from './routes/api.js'

export const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: clientUrl, credentials: true }))

const limiter = (windowMinutes, limit) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again in a little while.' },
  })

// Better Auth must be mounted before express.json(), it reads the raw body itself.
app.all('/api/auth/*splat', toNodeHandler(auth))

// Generous overall limit, and tighter ones on endpoints that write data.
app.use('/api', limiter(15, 600))
app.use('/api/subscribe', limiter(60, 10))
app.post('/api/orders', limiter(60, 30))
app.use('/api', express.json({ limit: '10kb' }), apiRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
