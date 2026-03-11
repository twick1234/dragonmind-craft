import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@engine': resolve(__dirname, 'src/engine'),
      '@world': resolve(__dirname, 'src/world'),
      '@player': resolve(__dirname, 'src/player'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@inventory': resolve(__dirname, 'src/inventory'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@save': resolve(__dirname, 'src/save'),
      '@utils': resolve(__dirname, 'src/utils'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'howler', 'simplex-noise']
  }
})
