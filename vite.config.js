import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace this base with your EXACT GitHub repository name!
  base: '/ink-and-splash/', 
})
