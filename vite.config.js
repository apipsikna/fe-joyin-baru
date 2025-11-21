// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // HAPUS baris allowedHosts, atau minimal sertakan localhost:
    // allowedHosts: ['localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- ganti ke ngrok backend yang AKTIF
        changeOrigin: true,
        secure: true,  // ngrok pakai sertifikat valid
        ws: true,
      }
    },
    // (opsional) eksplisit HMR kalau masih gagal
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  }
})
