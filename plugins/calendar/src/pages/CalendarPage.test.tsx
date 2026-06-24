import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { CalendarPage } from './CalendarPage'

function jsonResponse(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response)
}

// Capture the `from` of every events fetch so we can prove a nav refetch.
let eventFroms: string[] = []

function mockFetch(events: unknown[]) {
  return vi.fn((url: string) => {
    if (url.startsWith('/api/profiles')) {
      return jsonResponse([{ id: 'p1', name: 'Zoe', tier: 1 }])
    }
    const from = new URL(url, 'http://x').searchParams.get('from') ?? ''
    eventFroms.push(from)
    return jsonResponse({ events })
  })
}

// jsdom has no matchMedia; the surface hook reads it. Stub it to drive the
// viewport branch (tablet → month grid, mobile → agenda).
function stubViewport(tabletUp: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: tabletUp, // the only query is `(min-width: 768px)`
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

// A CalendarEvent for "today" so the mobile agenda has something to render.
function todayEvent() {
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  return {
    id: 'today-1',
    seriesId: 'today-1',
    occurrenceDate: null,
    isOccurrence: false,
    title: 'Soccer game',
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'p1',
    startsAt: start.toISOString(),
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
}

function renderPage(tier = 4) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const profile = { id: 'me', name: 'Parent', tier } as Profile
  return render(
    <QueryClientProvider client={client}>
      <MockAuthProvider profile={profile}>
        <CalendarPage />
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  eventFroms = []
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CalendarPage', () => {
  it('renders the month grid with an Add-event CTA for tier 4', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    renderPage(4)
    await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
    // Exact name — the per-cell quick-add buttons are "Add event on <date>".
    expect(screen.getByRole('button', { name: 'Add event' })).toBeEnabled()
  })

  it('hides the Add-event CTA below tier 4', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    renderPage(3)
    await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Add event' })).not.toBeInTheDocument()
    // Below tier 4 the per-cell quick-add "+" is absent too.
    expect(screen.queryByRole('button', { name: /Add event on/ })).not.toBeInTheDocument()
  })

  it('shows the empty-month note when there are no events', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    renderPage()
    await waitFor(() =>
      expect(screen.getByText('Nothing on the calendar this month.')).toBeInTheDocument()
    )
  })

  it('refetches a new range when navigating to the next month', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    renderPage()
    await waitFor(() => expect(eventFroms.length).toBeGreaterThanOrEqual(1))
    const firstFrom = eventFroms[0]
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    // A new range → a new query key → a fetch with a different `from`.
    await waitFor(() => expect(eventFroms.some((f) => f !== firstFrom)).toBe(true))
  })

  describe('mobile (below md:)', () => {
    it('renders the agenda surface (no month grid) with a tier-4 Add CTA', async () => {
      stubViewport(false)
      vi.stubGlobal('fetch', mockFetch([todayEvent()]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Soccer game')).toBeInTheDocument())
      // Agenda, not the month grid (no weekday header row).
      expect(screen.queryByText('Sun')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add event' })).toBeEnabled()
    })

    it('hides the Add CTA below tier 4', async () => {
      stubViewport(false)
      vi.stubGlobal('fetch', mockFetch([todayEvent()]))
      renderPage(3)
      await waitFor(() => expect(screen.getByText('Soccer game')).toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Add event' })).not.toBeInTheDocument()
    })

    it('opens the create drawer from the mobile Add CTA', async () => {
      stubViewport(false)
      vi.stubGlobal('fetch', mockFetch([todayEvent()]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Soccer game')).toBeInTheDocument())
      fireEvent.click(screen.getByRole('button', { name: 'Add event' }))
      // The reused CreateEventDrawer opened (its title input is present).
      expect(await screen.findByPlaceholderText("What's happening?")).toBeInTheDocument()
    })

    it('queries a forward agenda range starting at today (not the month grid range)', async () => {
      stubViewport(false)
      vi.stubGlobal('fetch', mockFetch([todayEvent()]))
      renderPage(4)
      await waitFor(() => expect(eventFroms.length).toBeGreaterThanOrEqual(1))
      // agendaRange starts at local start-of-today; the month grid starts on the
      // grid's first Sunday (often the prior month). Assert the agenda `from` is
      // today's date at local midnight.
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      expect(eventFroms[0]).toBe(start.toISOString())
    })
  })
})
