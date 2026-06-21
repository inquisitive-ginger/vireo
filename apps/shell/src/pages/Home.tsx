import { type ReactNode, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Users, ClipboardList, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { WidgetGrid, PlaceholderCard } from '@family-os/ui'
import type { WidgetLayoutItem } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { getLazyWidget } from '../lib/load-plugin'

type WidgetMeta = { moduleName: string; description: string; icon: LucideIcon }

const WIDGET_META: Record<string, WidgetMeta> = {
  'family-feed': {
    moduleName: 'Family Feed',
    description: 'Shared updates, photos, and activity from the whole family.',
    icon: Users,
  },
  chores: {
    moduleName: 'Chores',
    description: "Today's tasks and who's completed what.",
    icon: ClipboardList,
  },
  calendar: {
    moduleName: 'Calendar',
    description: "Today's events and upcoming schedule.",
    icon: CalendarDays,
  },
}

function moduleFromWidgetId(widgetId: string): string {
  return widgetId.split('.')[0] ?? widgetId
}

type HomeProps = {
  /** Map of widget id → the federation remote that exposes it, built from plugin
      manifests in main.tsx. Resolves the widget loader by remote name, since a
      widget's id namespace isn't guaranteed to match its remote name (ADR 022). */
  widgetRemotes: Record<string, string>
}

export function Home({ widgetRemotes }: HomeProps) {
  const { id: profileId } = useAuth()

  const { data: layout, isLoading } = useQuery<WidgetLayoutItem[]>({
    queryKey: ['api/home/layout', profileId],
    queryFn: () => fetch('/api/home/layout').then((r) => r.json()) as Promise<WidgetLayoutItem[]>,
    staleTime: 5 * 60 * 1000,
    enabled: !!profileId,
  })

  const widgetChildren: Record<string, ReactNode> = {}
  const flatSlots: string[] = []

  for (const item of layout ?? []) {
    const meta = WIDGET_META[moduleFromWidgetId(item.widgetId)]
    if (!meta) continue

    const remoteName = widgetRemotes[item.widgetId]
    if (remoteName) {
      const Widget = getLazyWidget(remoteName)
      widgetChildren[item.widgetId] = Widget ? (
        <Suspense fallback={<PlaceholderCard {...meta} />}>
          {/* No size prop — content widgets self-size to their slot via CSS
              container queries (design-system.md). */}
          <Widget />
        </Suspense>
      ) : (
        <PlaceholderCard {...meta} />
      )
    } else {
      widgetChildren[item.widgetId] = <PlaceholderCard {...meta} />
      flatSlots.push(item.widgetId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6 md:h-full">
      <WidgetGrid layout={layout ?? []} flatSlots={flatSlots} className="md:flex-1 md:min-h-0">
        {widgetChildren}
      </WidgetGrid>
    </div>
  )
}
