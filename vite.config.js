import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
const repoName = 'Campusnav'
export default defineConfig({
  plugins: [react()],
  base:"/",
})
