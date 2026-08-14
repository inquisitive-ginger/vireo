import path from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import type { RegistryEntry } from '@family-os/platform/types'

const registryPath = path.resolve(__dirname, '../../plugins.json')
const registry: RegistryEntry[] = JSON.parse(readFileSync(registryPath, 'utf-8'))

// Bust every client cache of remoteEntry.js on each deploy by versioning its
// URL. remoteEntry is mutable at a stable path, and a cached copy maps exposes
// to hashed chunks the next deploy deletes — auto-bug #107 was a phone whose
// HTTP cache pinned an Aug 11 copy through two deploys and every reload; the
// server-side no-cache header (PR #108) can't reach copies cached before it
// existed. A per-build query string can: the URL itself moves. CI stamps the
// commit sha; local builds fall back to a timestamp.
const buildStamp = (process.env.GITHUB_SHA ?? Date.now().toString(36)).slice(0, 8)

// Stamp the built service worker's cache name with the entry chunk's content
// hash so every deploy gets a fresh SW (byte-changed → browser reinstalls) and
// `activate` purges the prior cache. Without this the SW is byte-identical each
// build and installed PWAs pin a stale shell.
function stampServiceWorker(): Plugin {
  let version = 'dev'
  return {
    name: 'stamp-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const entry = Object.values(bundle).find((c) => c.type === 'chunk' && c.isEntry)
      const hash =
        entry?.type === 'chunk' ? entry.fileName.match(/-([A-Za-z0-9_-]+)\.js$/)?.[1] : ''
      if (hash) version = hash
    },
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js')
      if (!existsSync(swPath)) return
      writeFileSync(swPath, readFileSync(swPath, 'utf-8').replace(/__SW_VERSION__/g, version))
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    stampServiceWorker(),
    federation({
      name: 'shell',
      remotes: Object.fromEntries(
        registry.map((p) => [p.name, `/plugins/${p.name}/assets/remoteEntry.js?v=${buildStamp}`])
      ),
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
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
    hmr: { host: 'localhost', port: 5173 },
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/events': { target: 'ws://localhost:3000', ws: true },
      '/api': { target: 'http://localhost:3000' },
      ...Object.fromEntries(
        registry.map((p) => [
          `/plugins/${p.name}`,
          {
            target: p.baseUrl,
            // Rewrite the forwarded Host to the plugin's localhost target so the
            // plugin Vite servers' allowedHosts check passes when the shell is
            // reached via a tunnel (e.g. *.trycloudflare.com). Without this the
            // plugin remoteEntry/manifest 403s and federated plugins won't load.
            changeOrigin: true,
            rewrite: (path: string) => path.replace(`/plugins/${p.name}`, ''),
          },
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
          {
            target: p.baseUrl,
            // Rewrite the forwarded Host to the plugin's localhost target so the
            // plugin Vite servers' allowedHosts check passes when the shell is
            // reached via a tunnel (e.g. *.trycloudflare.com). Without this the
            // plugin remoteEntry/manifest 403s and federated plugins won't load.
            changeOrigin: true,
            rewrite: (path: string) => path.replace(`/plugins/${p.name}`, ''),
          },
        ])
      ),
    },
  },
  build: {
    target: 'esnext',
  },
})
