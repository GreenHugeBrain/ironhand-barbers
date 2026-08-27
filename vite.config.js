import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

// A multi-page build: every route is a real HTML file with its own React root,
// so there is no client-side router and no 404 rewrite needed on GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ironhand-barbers/' : '/',
  plugins: [react()],
  server: { port: 5183 },
  build: {
    rollupOptions: {
      input: {
        home: page('./index.html'),
        services: page('./services/index.html'),
        barbers: page('./barbers/index.html'),
        gallery: page('./gallery/index.html'),
        book: page('./book/index.html'),
      },
    },
  },
}))
