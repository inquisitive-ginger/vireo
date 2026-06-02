import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'demo-plugin',
      filename: 'remoteEntry.js',
      exposes: {
        './Plugin': './src/Plugin.tsx',
      },
      shared: ['react', 'react-dom', '@family-os/ui', '@family-os/platform'],
    }),
  ],
  server: {
    port: 3010,
    strictPort: true,
  },
  preview: {
    port: 3010,
    strictPort: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  build: {
    target: 'esnext',
  },
})
