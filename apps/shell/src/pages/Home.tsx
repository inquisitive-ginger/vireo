import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Users, ClipboardList, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { WidgetGrid, PlaceholderCard } from '@family-os/ui'
import type { WidgetLayoutItem } from '@family-os/ui'
import type { RegistryEntry } from '@family-os/platform/types'
import { useAuth } from '@family-os/platform'

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

export function Home() {
  const { id: profileId } = useAuth()

  const { data: layout, isLoading } = useQuery<WidgetLayoutItem[]>({
    queryKey: ['api/home/layout', profileId],
    queryFn: () => fetch('/api/home/layout').then((r) => r.json()) as Promise<WidgetLayoutItem[]>,
    staleTime: 5 * 60 * 1000,
    enabled: !!profileId,
  })

  const { data: plugins } = useQuery<RegistryEntry[]>({
    queryKey: ['api/plugins'],
    queryFn: () => fetch('/api/plugins').then((r) => r.json()) as Promise<RegistryEntry[]>,
    staleTime: 5 * 60 * 1000,
  })

  const installedModules = new Set((plugins ?? []).map((p) => p.name))

  const widgetChildren: Record<string, ReactNode> = {}
  for (const item of layout ?? []) {
    const module = moduleFromWidgetId(item.widgetId)
    const meta = WIDGET_META[module]
    if (!meta) continue

    if (installedModules.has(module)) {
      // TODO M2+: swap in real <ModuleWidget /> once each plugin ships its widget component
      widgetChildren[item.widgetId] = <PlaceholderCard {...meta} />
    } else {
      widgetChildren[item.widgetId] = <PlaceholderCard {...meta} />
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
    <div className="p-6">
      <WidgetGrid layout={layout ?? []} children={widgetChildren} />
    </div>
  )
}
