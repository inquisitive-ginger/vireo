import { Suspense } from 'react'
import { getLazyPlugin } from '@/lib/load-plugin'
import { PluginNotFound } from '@/pages/PluginNotFound'

type Props = {
  remoteName: string
}

export function PluginView({ remoteName }: Props) {
  const PluginComponent = getLazyPlugin(remoteName)

  if (!PluginComponent) {
    return <PluginNotFound />
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <PluginComponent />
    </Suspense>
  )
}
