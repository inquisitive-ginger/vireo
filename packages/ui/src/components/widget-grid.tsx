import type { ReactNode } from 'react'
import { GridLayout, noCompactor, useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { WidgetSlot } from './widget-slot'
import { cn } from '../lib/utils'

export interface WidgetLayoutItem {
  widgetId: string
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetGridProps {
  layout: WidgetLayoutItem[]
  /** Children keyed by widgetId */
  children: Record<string, ReactNode>
  className?: string
}

const GRID_CONFIG = {
  cols:             4,
  rowHeight:        180,
  margin:           [16, 16] as [number, number],
  containerPadding: [0, 0]   as [number, number],
} as const

const STACK_BREAKPOINT = 768
const ROW_HEIGHT        = 180
const GAP               = 16

function stackHeight(h: number) {
  return h * ROW_HEIGHT + (h - 1) * GAP
}

export function WidgetGrid({ layout, children, className }: WidgetGridProps) {
  const { containerRef, width } = useContainerWidth()

  const rglLayout = layout.map(({ widgetId, x, y, w, h }) => ({
    i: widgetId,
    x,
    y,
    w,
    h,
    static: true,
  }))

  const isNarrow = width > 0 && width < STACK_BREAKPOINT

  return (
    <div ref={containerRef} data-testid="widget-grid" className={cn('w-full', className)}>
      {width > 0 && (isNarrow ? (
        <div className="flex flex-col" style={{ gap: GAP }}>
          {layout.map(({ widgetId, h }) => (
            <div key={widgetId} style={{ height: stackHeight(h) }}>
              <WidgetSlot>{children[widgetId]}</WidgetSlot>
            </div>
          ))}
        </div>
      ) : (
        <GridLayout
          layout={rglLayout}
          width={width}
          gridConfig={GRID_CONFIG}
          dragConfig={{ enabled: false }}
          resizeConfig={{ enabled: false }}
          compactor={noCompactor}
        >
          {rglLayout.map(({ i }) => (
            <div key={i}>
              <WidgetSlot>{children[i]}</WidgetSlot>
            </div>
          ))}
        </GridLayout>
      ))}
    </div>
  )
}
