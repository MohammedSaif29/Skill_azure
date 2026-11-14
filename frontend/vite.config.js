import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // In development, /api goes to the Express backend in backend/ (node backend/server.js).
  // Online, the Cloudflare Worker in worker/ answers /api with the same logic.
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
