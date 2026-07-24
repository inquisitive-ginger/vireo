import path from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import type { RegistryEntry } from '@family-os/platform/types'

const registry: RegistryEntry[] = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../plugins.json'), 'utf-8')
)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      {
        find: new RegExp(`^(${registry.map((p) => p.name).join('|')})/.*$`),
        replacement: path.resolve(__dirname, './src/test/remote-stub.tsx'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test.setup.ts'],
    passWithNoTests: true,
  },
})
