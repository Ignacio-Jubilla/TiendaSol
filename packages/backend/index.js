import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import pedidosRouter  from './routes/pedidosRoutes.js'
import middleware from './utils/middleware.js'
import config from './utils/config.js'
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : true,
  }),
)

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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


const { PORT } = config
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`)
})
