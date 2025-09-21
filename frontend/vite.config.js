import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  server : {
    proxy:{
      '/api' : {
        target : process.env.BACKEND_URL,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})



