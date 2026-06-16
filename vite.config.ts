/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      'react-router-dom-v5-compat': resolve(__dirname, 'src/stubs/react-router-dom-v5-compat.ts'),
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
