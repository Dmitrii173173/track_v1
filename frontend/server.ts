import { createServer } from 'http'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { serveStatic } from '@h3/node-server'
import { join } from 'path'

const app = createApp()

// Обработка статических файлов
app.use('/_nuxt', eventHandler(async (event) => {
  return serveStatic(event, {
    root: join(process.cwd(), '.output/public/_nuxt')
  })
}))

// Обработка всех остальных запросов
app.use('*', eventHandler(async (event) => {
  return serveStatic(event, {
    root: join(process.cwd(), '.output/public'),
    index: 'index.html'
  })
}))

const server = createServer(toNodeListener(app))
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 