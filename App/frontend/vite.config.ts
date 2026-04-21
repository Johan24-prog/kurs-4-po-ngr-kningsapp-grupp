import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:63276',
        changeOrigin: true,
        secure: false,
      },
      '/gamehub': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:63276',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    // Output directly into the ASP.NET Core backend's wwwroot
    outDir: '../backend/wwwroot',
    emptyOutDir: true,
  },
})
