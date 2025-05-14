import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/factops/',
  plugins: [react()],
  server: {
    port: 5000,        
    strictPort: true,  
  }
})
