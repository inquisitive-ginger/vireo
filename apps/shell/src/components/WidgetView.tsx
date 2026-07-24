import { Suspense, type ReactNode } from 'react'
import { getLazyWidget } from '@/lib/load-plugin'

type Props = {
  remoteName: string
  fallback: ReactNode
}

// Resolves the lazy component on every render so a retry that evicted the cache
// picks up the fresh one. Resolving it in the parent would pin the rejected lazy.
export function WidgetView({ remoteName, fallback }: Props) {
  const Widget = getLazyWidget(remoteName)
  if (!Widget) return fallback

  // No size prop — content widgets self-size to their slot via CSS container
  // queries (design-system.md).
  return (
    <Suspense fallback={fallback}>
      <Widget />
    </Suspense>
  )
}
