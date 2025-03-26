import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { RequestHandler } from 'express'

dotenv.config()

console.log('Environment variables:', {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '***' : undefined,
  NODE_ENV: process.env.NODE_ENV
})

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 8080

// Проверка подключения к базе данных
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error)
  })

app.use(cors())
app.use(express.json())

// Эндпоинт для проверки работоспособности
app.get('/health', (async (_req: Request, res: Response): Promise<void> => {
  try {
    // Проверяем подключение к базе данных
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
}) as RequestHandler)

// Получение последней цены
app.get('/api/latest', (async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching latest price...')
    const latestPrice = await prisma.price.findFirst({
      orderBy: {
        timestamp: 'desc'
      }
    })
    
    if (!latestPrice) {
      console.log('No prices found in database')
      res.status(404).json({ error: 'No prices found' })
      return
    }
    
    console.log('Latest price:', latestPrice)
    res.json(latestPrice)
  } catch (error) {
    console.error('Error fetching latest price:', error)
    res.status(500).json({ error: 'Failed to fetch latest price' })
  }
}) as RequestHandler)

// Получение исторических цен
app.get('/api/prices', (async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string || 'day'
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        res.status(400).json({ error: 'Invalid period' })
        return
    }

    console.log(`Fetching prices from ${startDate.toISOString()} to ${now.toISOString()}`)
    const prices = await prisma.price.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    if (!prices.length) {
      console.log('No prices found for the specified period')
      res.status(404).json({ error: 'No prices found for the specified period' })
      return
    }

    console.log(`Found ${prices.length} prices`)
    res.json(prices)
  } catch (error) {
    console.error('Error fetching prices:', error)
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
}) as RequestHandler)

// Эндпоинт для коллектора
app.post('/api/collect', (async (req: Request, res: Response): Promise<void> => {
  try {
    const { price } = req.body

    if (!price || isNaN(parseFloat(price))) {
      console.error('Invalid price received:', price)
      res.status(400).json({ error: 'Invalid price' })
      return
    }

    console.log('Saving new price:', price)
    const newPrice = await prisma.price.create({
      data: {
        price: parseFloat(price),
        symbol: 'BTCUSDT'
      }
    })

    console.log('Price saved successfully:', newPrice)
    res.json(newPrice)
  } catch (error) {
    console.error('Error saving price:', error)
    res.status(500).json({ error: 'Failed to save price' })
  }
}) as RequestHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 