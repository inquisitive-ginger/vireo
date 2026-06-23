import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Dedicated test config (no federation plugin — that only matters for the remote
// build). jsdom + RTL, mirroring packages/ui.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test.setup.ts'],
  },
})
