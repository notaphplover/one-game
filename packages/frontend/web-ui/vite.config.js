import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ['@cornie-js/api-http-client', /node_modules/],
    },
  },
  optimizeDeps: {
    include: ['@cornie-js/api-http-client']
  },
  plugins: [react()],
})
