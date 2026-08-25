import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you are deploying to GitHub Pages, change "/" to "/YOUR_REPO_NAME/"
export default defineConfig({
  plugins: [react()],
  base: '/',
})