export default defineNuxtConfig({
  ssr: true,

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
      apiBase: process.env.API_BASE || 'https://trackv1-production.up.railway.app'
    }
  },

  nitro: {
    preset: 'node',
    serverAssets: [
      {
        baseName: 'public',
        dir: '.output/public'
      }
    ]
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.API_BASE || 'https://trackv1-production.up.railway.app',
          changeOrigin: true
        }
      }
    }
  },

  compatibilityDate: '2025-03-25'
})