import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Verified and ready for final deployment

export default defineConfig({
  base: '/turnera/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
