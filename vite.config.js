import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const repoName = 'Campusnav'
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,        // true = 0.0.0.0, allow external access
    port: 5173,        // optional, makes sure port is fixed
  },
  base:"/",
})
