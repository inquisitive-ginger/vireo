import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'calendar',
      filename: 'remoteEntry.js',
      exposes: {
        './Plugin': './src/Plugin.tsx',
        './widgets/UpNext': './src/widgets/UpNext.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
        '@family-os/ui': { singleton: true },
        '@family-os/platform': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3013,
    strictPort: true,
  },
  preview: {
    port: 3013,
    strictPort: true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' },
  },
  build: {
    target: 'esnext',
  },
})
