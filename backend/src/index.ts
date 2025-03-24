import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { RequestHandler } from 'express'
import path from 'path'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Обслуживание статических файлов фронтенда
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

// Корневой маршрут
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

// Получение последней цены
app.get('/api/latest', (async (_req: Request, res: Response) => {
  try {
    const latestPrice = await prisma.price.findFirst({
      orderBy: {
        timestamp: 'desc'
      }
    })
    res.json(latestPrice)
  } catch (error) {
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
    }

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

    res.json(prices)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices' })
  }
}) as RequestHandler)

// Эндпоинт для коллектора
app.post('/api/collect', (async (req: Request, res: Response) => {
  try {
    const { price } = req.body
    const newPrice = await prisma.price.create({
      data: {
        price: parseFloat(price),
        symbol: 'BTCUSDT'
      }
    })
    res.json(newPrice)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save price' })
  }
}) as RequestHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 