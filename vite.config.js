import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true, // Show error overlay in browser
    },
    watch: {
      usePolling: false, // Use native file system events
    },
  },
})

