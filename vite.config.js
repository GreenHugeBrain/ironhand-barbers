import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from /ironhand-barbers/ on GitHub Pages; dev stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ironhand-barbers/' : '/',
  plugins: [react()],
  server: { port: 5183 },
}))
