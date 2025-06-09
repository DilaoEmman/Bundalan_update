import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '192.168.104.51',
    // port: 3000,
    proxy: {
      '/api': 'http://localhost:8000', // development
      // '/api': 'http://192.168.104.51:8000', //production
    },
  },
})
