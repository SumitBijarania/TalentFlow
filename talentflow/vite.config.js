import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['dexie']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main']
  }
})
