import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// Обслуживание статических файлов фронтенда
app.use(express.static(path.join(__dirname, '../../frontend/.output/public')))

// Корневой маршрут
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/.output/public/index.html'))
})

// Получение последней цены
app.get('/api/latest', (async (_req: Request, res: Response) => {
  try {
    console.log('Fetching latest price...')
    const latestPrice = await prisma.price.findFirst({
      orderBy: {
        timestamp: 'desc'
      }
    })
    
    if (!latestPrice) {
      console.log('No prices found in database')
      return res.status(404).json({ error: 'No prices found' })
    }
    
    console.log('Latest price:', latestPrice)
    res.json(latestPrice)
  } catch (error) {
    console.error('Error fetching latest price:', error)
    res.status(500).json({ error: 'Failed to fetch latest price' })
  }
}) as RequestHandler)

// Получение исторических цен
app.get('/api/prices', (async (req: Request, res: Response) => {
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
        return res.status(400).json({ error: 'Invalid period' })
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
      return res.status(404).json({ error: 'No prices found for the specified period' })
    }

    console.log(`Found ${prices.length} prices`)
    res.json(prices)
  } catch (error) {
    console.error('Error fetching prices:', error)
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
}) as RequestHandler)

// Эндпоинт для коллектора
app.post('/api/collect', (async (req: Request, res: Response) => {
  try {
    const { price } = req.body

    if (!price || isNaN(parseFloat(price))) {
      console.error('Invalid price received:', price)
      return res.status(400).json({ error: 'Invalid price' })
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

// Обработка всех остальных маршрутов для SPA
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/.output/public/index.html'))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 