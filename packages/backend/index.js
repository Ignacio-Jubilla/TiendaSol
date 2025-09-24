import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import pedidosRouter  from './routes/pedidosRoutes.js'
import middleware from './utils/middleware.js'
import config from './utils/config.js'

import { DBConnector } from './utils/dbConnector.js'

const app = express()

const connector = new DBConnector()
connector.connect()

app.use(express.json())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : true,
  }),
)
//loggear requests
app.use(middleware.requestLogger)
app.use('/api/pedidos', pedidosRouter)
app.get('/api/health', (req,res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Tienda sol API Health Check EXITOSO',
        timestamp: new Date().toLocaleString()
    })
})
app.get('/hello', (req, res) => {
  res.json({ message: 
    'hello world' })
})

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const { PORT } = config
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`)
})
