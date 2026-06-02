// Type declarations for Module Federation remotes.
// Each remote's exposed modules must be declared here so TypeScript resolves them.
// The actual implementations are loaded at runtime by @originjs/vite-plugin-federation.

declare module 'demo-plugin/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}
