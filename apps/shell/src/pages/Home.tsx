import { type ReactNode, useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Users, ClipboardList, CalendarDays, Wallet, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { WidgetGrid, PlaceholderCard, PageContainer } from '@family-os/ui'
import type { WidgetLayoutItem } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { hasLazyWidget } from '../lib/load-plugin'
import { WidgetErrorBoundary } from '../components/WidgetErrorBoundary'
import { WidgetView } from '../components/WidgetView'

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
  rewards: {
    moduleName: 'Wallet',
    description: 'Your P-Bucks balance and what you can afford right now.',
    icon: Wallet,
  },
  meals: {
    moduleName: 'Meals',
    description: "What's for dinner, who's got it, and tonight's try bite.",
    icon: Utensils,
  },
  // `shopping` is deliberately absent until the polish session announces it —
  // see the commit that removed it. `home-layout.ts` still places
  // `shopping.capture` in the default layouts; the loop below drops any id with
  // no meta from the LAYOUT as well as from the children, so no cell is
  // reserved for it.
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
  const [erroredWidgets, setErroredWidgets] = useState<ReadonlySet<string>>(new Set())

  const handleErrorChange = useCallback((widgetId: string, hasError: boolean) => {
    setErroredWidgets((prev) => {
      if (hasError === prev.has(widgetId)) return prev
      const next = new Set(prev)
      if (hasError) next.add(widgetId)
      else next.delete(widgetId)
      return next
    })
  }, [])

  const { data: layout, isLoading } = useQuery<WidgetLayoutItem[]>({
    queryKey: ['api/home/layout', profileId],
    queryFn: () => fetch('/api/home/layout').then((r) => r.json()) as Promise<WidgetLayoutItem[]>,
    staleTime: 5 * 60 * 1000,
    enabled: !!profileId,
  })

  const widgetChildren: Record<string, ReactNode> = {}
  const flatSlots: string[] = []
  // The grid places a cell for every layout entry it is handed and sizes itself
  // from the lowest one, so an entry the shell cannot render must not reach it —
  // otherwise it reserves an empty bordered region and grows the dashboard for a
  // widget that is not there. A layout can name a widget with no meta whenever
  // the two disagree: a plugin removed, a widget not yet registered, or a
  // persisted per-profile layout outliving the widget it was saved with.
  const placed: WidgetLayoutItem[] = []

  for (const item of layout ?? []) {
    const meta = WIDGET_META[moduleFromWidgetId(item.widgetId)]
    if (!meta) continue
    placed.push(item)

    const remoteName = widgetRemotes[item.widgetId]
    if (remoteName) {
      widgetChildren[item.widgetId] = hasLazyWidget(remoteName) ? (
        <WidgetErrorBoundary
          moduleName={meta.moduleName}
          remoteName={remoteName}
          onErrorChange={(hasError) => handleErrorChange(item.widgetId, hasError)}
        >
          <WidgetView remoteName={remoteName} fallback={<PlaceholderCard {...meta} />} />
        </WidgetErrorBoundary>
      ) : (
        <PlaceholderCard {...meta} />
      )
      // A caught widget renders ErrorCard in a flat slot (no card chrome).
      if (erroredWidgets.has(item.widgetId)) flatSlots.push(item.widgetId)
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
    // `full` — the dashboard grid is meant to fill the viewport, not sit in a column.
    <PageContainer width="full" className="flex flex-col md:h-full">
      <WidgetGrid layout={placed} flatSlots={flatSlots} className="md:min-h-0 md:flex-1">
        {widgetChildren}
      </WidgetGrid>
    </PageContainer>
  )
}
