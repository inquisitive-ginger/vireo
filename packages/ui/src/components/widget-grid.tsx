import { type ReactNode, useState, useEffect } from 'react'
import { GridLayout, noCompactor, useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { WidgetSlot, type WidgetProminence } from './widget-slot'
import { cn } from '../lib/utils'
import { BREAKPOINT_MD } from '../lib/breakpoints'
import { readSpacingToken } from '../lib/read-spacing-token'

export interface WidgetLayoutItem {
  widgetId: string
  x: number
  y: number
  w: number
  h: number
  /** Elevation-ladder rung (feature/card/quiet). Defaults to `card` when absent. */
  prominence?: WidgetProminence
}

export interface WidgetGridProps {
  layout: WidgetLayoutItem[]
  /** Children keyed by widgetId */
  children: Record<string, ReactNode>
  className?: string
  /** Widget IDs that should render in a flat (no card chrome) slot — used for placeholder and error states. */
  flatSlots?: string[]
}

const GRID_COLS = 4
const MAX_ROW_HEIGHT = 400
const MIN_ROW_HEIGHT = readSpacingToken('--spacing-widget-row', 180)
const GAP = readSpacingToken('--spacing-grid-gap', 16)

function maxRow(layout: WidgetLayoutItem[]): number {
  return layout.reduce((m, item) => Math.max(m, item.y + item.h), 0)
}

function computeRowHeight(containerHeight: number, rows: number): number {
  if (containerHeight <= 0 || rows <= 0) return MIN_ROW_HEIGHT
  const rh = (containerHeight - (rows - 1) * GAP) / rows
  return Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, rh))
}

function stackHeight(h: number, rowHeight: number) {
  return h * rowHeight + (h - 1) * GAP
}

export function WidgetGrid({ layout, children, className, flatSlots }: WidgetGridProps) {
  const flatSet = new Set(flatSlots ?? [])
  const prominenceById = new Map(layout.map((item) => [item.widgetId, item.prominence]))
  const { containerRef, width } = useContainerWidth()
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  const rows = maxRow(layout)
  const rowHeight = computeRowHeight(height, rows)

  const gridConfig = {
    cols: GRID_COLS,
    rowHeight,
    margin: [GAP, GAP] as [number, number],
    containerPadding: [0, 0] as [number, number],
  }

  const rglLayout = layout.map(({ widgetId, x, y, w, h }) => ({
    i: widgetId,
    x,
    y,
    w,
    h,
    static: true,
  }))

  const isNarrow = width > 0 && width < BREAKPOINT_MD

  return (
    <div ref={containerRef} data-testid="widget-grid" className={cn('w-full', className)}>
      {width > 0 &&
        (isNarrow ? (
          <div className="flex flex-col" style={{ gap: GAP }}>
            {layout.map(({ widgetId, h, prominence }) => (
              <div key={widgetId} style={{ height: stackHeight(h, MIN_ROW_HEIGHT) }}>
                <WidgetSlot prominence={prominence} flat={flatSet.has(widgetId)}>
                  {children[widgetId]}
                </WidgetSlot>
              </div>
            ))}
          </div>
        ) : (
          <GridLayout
            layout={rglLayout}
            width={width}
            gridConfig={gridConfig}
            dragConfig={{ enabled: false }}
            resizeConfig={{ enabled: false }}
            compactor={noCompactor}
          >
            {rglLayout.map(({ i }) => (
              <div key={i}>
                <WidgetSlot prominence={prominenceById.get(i)} flat={flatSet.has(i)}>
                  {children[i]}
                </WidgetSlot>
              </div>
            ))}
          </GridLayout>
        ))}
    </div>
  )
}
