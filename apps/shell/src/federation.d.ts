// Type declarations for Module Federation remotes.
// Each remote's exposed modules must be declared here so TypeScript resolves them.
// The actual implementations are loaded at runtime by @originjs/vite-plugin-federation.

declare module 'demo-plugin/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'family-feed/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'family-feed/widgets/FeedWidget' {
  import type { ComponentType } from 'react'
  const FeedWidget: ComponentType
  export default FeedWidget
}

declare module 'chore-engine/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'chore-engine/widgets/TodaySummary' {
  import type { ComponentType } from 'react'
  const TodaySummary: ComponentType
  export default TodaySummary
}
