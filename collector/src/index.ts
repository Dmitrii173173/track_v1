import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const BINANCE_API = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
const BACKEND_API = process.env.BACKEND_API || 'http://localhost:4000'

const collectPrice = async () => {
  try {
    const response = await axios.get(BINANCE_API)
    const price = response.data.price

    await axios.post(`${BACKEND_API}/api/collect`, {
      price
    })

    console.log(`Collected price: ${price} at ${new Date().toISOString()}`)
  } catch (error) {
    console.error('Error collecting price:', error)
  }
}

// Собираем данные каждые 5 секунд
setInterval(collectPrice, 5000)

// Запускаем первый сбор данных
collectPrice() 