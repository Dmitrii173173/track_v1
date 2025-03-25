import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const BINANCE_API = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
const BACKEND_API = process.env.BACKEND_API || 'http://localhost:4000'

const loadData = async () => {
  try {
    console.log('Starting data load...')
    
    for (let i = 0; i < 10; i++) {
      console.log(`Fetching price ${i + 1}/10...`)
      const response = await axios.get(BINANCE_API)
      
      if (!response.data || !response.data.price) {
        throw new Error('Invalid response from Binance API')
      }
      
      const price = response.data.price
      console.log(`Received price: ${price}`)

      if (!price || isNaN(parseFloat(price))) {
        throw new Error('Invalid price received from Binance')
      }

      console.log(`Sending price ${price} to backend...`)
      const backendResponse = await axios.post(`${BACKEND_API}/api/collect`, {
        price: parseFloat(price)
      })

      if (backendResponse.status === 200) {
        console.log(`Successfully saved price ${i + 1}/10: ${price}`)
      } else {
        console.error(`Failed to save price ${i + 1}/10:`, backendResponse.status)
      }

      // Ждем 1 секунду между запросами
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('Data load completed!')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        })
      } else if (error.request) {
        console.error('Network Error:', error.message)
      } else {
        console.error('Error:', error.message)
      }
    } else {
      console.error('Error loading data:', error)
    }
  }
}

// Запускаем загрузку данных
loadData() 