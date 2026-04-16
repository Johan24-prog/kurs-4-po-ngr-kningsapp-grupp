import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directly into the ASP.NET Core backend's wwwroot
    outDir: '../backend/wwwroot',
    emptyOutDir: true,
  },
})
