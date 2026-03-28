import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: '0.0.0.0',
    allowedHosts: [
      'app.myplatform.local',
      'dashboard.myplatform.local',
      'store.myplatform.local',
      'localhost'
    ],
    proxy: {
      '/api/auth': 'http://localhost:4000',
      '/api/store': 'http://localhost:4002'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
