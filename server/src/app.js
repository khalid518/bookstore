import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api.js'

export const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'

const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: clientUrl, credentials: true }))

app.use('/api', express.json(), apiRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
