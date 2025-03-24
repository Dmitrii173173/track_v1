export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  typescript: {
    strict: true,
    typeCheck: true
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
  }
}) 