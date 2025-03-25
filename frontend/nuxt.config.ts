export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      title: 'BTC Price Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bitcoin price tracking application' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:4000'
    }
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true
        }
      }
    }
  },

  compatibilityDate: '2025-03-25'
})