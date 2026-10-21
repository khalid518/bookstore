import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import apiRouter from './routes/api.js'

export const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'

const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: clientUrl, credentials: true }))

// Better Auth must be mounted before express.json(), it reads the raw body itself.
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use('/api', express.json(), apiRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
