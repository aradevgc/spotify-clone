import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow LAN access for testing on real iPhone via local network
    host: true,
    port: 5173,
  },
  build: {
    // Ensure icons and manifest are copied
    assetsInlineLimit: 0,
  },
})
