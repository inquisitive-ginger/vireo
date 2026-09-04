import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform'
import type { WidgetLayoutItem } from '@family-os/ui'
import { Home } from './Home'

// The grid is the thing under test's OUTPUT, so it records what it is handed
// rather than rendering react-grid-layout in jsdom.
let received: WidgetLayoutItem[] = []
vi.mock('@family-os/ui', async () => {
  const actual = await vi.importActual<typeof import('@family-os/ui')>('@family-os/ui')
  return {
    ...actual,
    WidgetGrid: ({ layout }: { layout: WidgetLayoutItem[] }) => {
      received = layout
      return <div data-testid="grid">{layout.map((l) => l.widgetId).join(',')}</div>
    },
  }
})

vi.mock('../lib/load-plugin', () => ({ hasLazyWidget: () => false }))

const PARENT: Profile = {
  id: '00000000-5ec0-0001-0000-000000000001',
  name: 'Dad',
  tier: 4,
  identityHue: 'sage',
} as Profile

function cell(widgetId: string): WidgetLayoutItem {
  return { widgetId, x: 0, y: 0, w: 2, h: 1 }
}

function renderHome(layout: WidgetLayoutItem[]) {
  received = []
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ json: () => Promise.resolve(layout) } as Response))
  )
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MockAuthProvider profile={PARENT}>
        <Home widgetRemotes={{}} />
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

describe('Home — the layout the grid is handed', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  /* The grid places a cell for every entry it receives and sizes itself from
     the lowest one, so an entry the shell cannot render must never reach it: it
     would reserve an empty bordered region and grow the dashboard for a widget
     that is not there. Regressed once — `shopping.capture` stayed in
     `DEFAULT_LAYOUTS` while its `WIDGET_META` entry was removed to hide the
     plugin, and the hole shipped to a live review. */
  it('drops an entry with no WIDGET_META rather than reserving a cell for it', async () => {
    renderHome([cell('calendar.up-next'), cell('shopping.capture'), cell('chores.today-summary')])
    await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument())
    expect(received.map((l) => l.widgetId)).toEqual(['calendar.up-next', 'chores.today-summary'])
  })

  it('keeps every entry it can render, in the order the layout gave them', async () => {
    renderHome([cell('meals.tonight'), cell('family-feed.feed')])
    await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument())
    expect(received.map((l) => l.widgetId)).toEqual(['meals.tonight', 'family-feed.feed'])
  })

  /* Layout-agnostic on purpose: this filters whatever `/api/home/layout`
     returns, so it holds for all three `DEFAULT_LAYOUTS` and for a persisted
     per-profile layout that outlived the widget it was saved with. */
  it('holds for a layout naming only widgets the shell has never heard of', async () => {
    renderHome([cell('ghost.one'), cell('ghost.two')])
    await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument())
    expect(received).toEqual([])
  })
})
