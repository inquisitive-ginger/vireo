// Type declarations for Module Federation remotes.
// Each remote's exposed modules must be declared here so TypeScript resolves them.
// The actual implementations are loaded at runtime by @originjs/vite-plugin-federation.

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

declare module 'chores/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'chores/widgets/TodaySummary' {
  import type { ComponentType } from 'react'
  const TodaySummary: ComponentType
  export default TodaySummary
}

declare module 'calendar/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'calendar/widgets/UpNext' {
  import type { ComponentType } from 'react'
  const UpNext: ComponentType
  export default UpNext
}

declare module 'rewards/Plugin' {
  import type { ComponentType } from 'react'
  const Plugin: ComponentType
  export default Plugin
}

declare module 'rewards/widgets/Wallet' {
  import type { ComponentType } from 'react'
  const Wallet: ComponentType
  export default Wallet
}
