import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5173, // Préfère le port 5173
    strictPort: false, // Trouve un autre port si 5173 est occupé
  }
})
