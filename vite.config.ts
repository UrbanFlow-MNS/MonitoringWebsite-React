/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'

function reactRouterV5CompatStub(): Plugin {
  const RESOLVED_ID = '\0react-router-dom-v5-compat';
  return {
    name: 'react-router-dom-v5-compat-stub',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'react-router-dom-v5-compat' || id.startsWith('react-router-dom-v5-compat/')) {
        return RESOLVED_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_ID) {
        return `export { Link, NavLink, useNavigate as useHistory, useLocation, useParams, useMatch, Navigate, Outlet, Route, Routes } from 'react-router-dom';`;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    reactRouterV5CompatStub(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', '@grafana/ui', '@grafana/data', 'uplot'],
          'vendor-state': ['mobx', 'mobx-react'],
        },
      },
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
