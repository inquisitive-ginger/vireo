import path from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import type { RegistryEntry } from '@family-os/platform/types'

const registryPath = path.resolve(__dirname, '../../plugins.json')
const registry: RegistryEntry[] = JSON.parse(readFileSync(registryPath, 'utf-8'))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      remotes: Object.fromEntries(
        registry.map((p) => [p.name, `/plugins/${p.name}/assets/remoteEntry.js`])
      ),
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        '@family-os/platform': { singleton: true },
        '@family-os/ui': { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/events': { target: 'ws://localhost:3000', ws: true },
      '/api': { target: 'http://localhost:3000' },
      ...Object.fromEntries(
        registry.map((p) => [
          `/plugins/${p.name}`,
          { target: p.baseUrl, rewrite: (path: string) => path.replace(`/plugins/${p.name}`, '') },
        ])
      ),
    },
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/events': { target: 'ws://localhost:3000', ws: true },
      '/api': { target: 'http://localhost:3000' },
      ...Object.fromEntries(
        registry.map((p) => [
          `/plugins/${p.name}`,
          { target: p.baseUrl, rewrite: (path: string) => path.replace(`/plugins/${p.name}`, '') },
        ])
      ),
    },
  },
  build: {
    target: 'esnext',
  },
})
