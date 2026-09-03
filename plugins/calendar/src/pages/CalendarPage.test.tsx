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
// Set when the Activities lens fetches its series.
let activitiesFetched = false

function mockFetch(events: unknown[], activities: unknown[] = []) {
  return vi.fn((url: string) => {
    if (url.startsWith('/api/profiles')) {
      return jsonResponse([{ id: 'p1', name: 'Zoe', tier: 1 }])
    }
    if (url.startsWith('/api/calendar/activities')) {
      activitiesFetched = true
      return jsonResponse({ activities })
    }
    const from = new URL(url, 'http://x').searchParams.get('from') ?? ''
    eventFroms.push(from)
    return jsonResponse({ events })
  })
}

// A standing activity owned by p1 (Zoe, from the profiles mock).
function anActivity() {
  return {
    id: 'act-1',
    seriesId: 'act-1',
    occurrenceDate: null,
    isOccurrence: false,
    title: 'Gymnastics',
    description: null,
    attendeeIds: ['p1'],
    ownerId: 'p1',
    createdBy: 'p1',
    startsAt: new Date(2026, 6, 6, 16, 0).toISOString(),
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: 'weekly',
    recurrenceUntil: null,
    isActivity: true,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
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

/* A CalendarEvent for "today" so the mobile agenda has something to render.
   Relative to now, not pinned to noon: the agenda only carries events that
   haven't ended yet, so a fixed hour makes the test pass or fail depending on
   the wall clock it runs at. */
function todayEvent() {
  const start = new Date(Date.now() + 2 * 60 * 60 * 1000)
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

// A plain single-day event at noon on `day`.
function eventOn(day: Date) {
  return {
    ...todayEvent(),
    id: 'on-day',
    seriesId: 'on-day',
    title: 'Dentist',
    startsAt: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0).toISOString(),
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
  activitiesFetched = false
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

  describe('the chrome Add-event CTA seeds the day on screen', () => {
    // The DatePicker trigger's label — `format(value, 'EEE, MMM d, yyyy')`.
    const triggerLabel = (d: Date) =>
      d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

    it('uses the drilled-in day, not today', async () => {
      const now = new Date()
      // A day in the visible month that is never today, so a stale "today"
      // default can't pass by accident.
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() === 15 ? 16 : 15)
      vi.stubGlobal('fetch', mockFetch([eventOn(target)]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())

      fireEvent.click(screen.getByRole('button', { name: `View ${target.toDateString()}` }))
      fireEvent.click(await screen.findByRole('button', { name: 'Add event' }))

      expect(await screen.findByRole('heading', { name: 'Add event' })).toBeInTheDocument()
      expect(screen.getByText(triggerLabel(target))).toBeInTheDocument()
    })

    it('uses the first of a month you have stepped away to', async () => {
      vi.stubGlobal('fetch', mockFetch([]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())

      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      fireEvent.click(screen.getByRole('button', { name: 'Add event' }))

      const now = new Date()
      const firstOfNext = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      expect(await screen.findByRole('heading', { name: 'Add event' })).toBeInTheDocument()
      expect(screen.getByText(triggerLabel(firstOfNext))).toBeInTheDocument()
    })

    it('still defaults to today on the current month', async () => {
      vi.stubGlobal('fetch', mockFetch([]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())

      fireEvent.click(screen.getByRole('button', { name: 'Add event' }))
      expect(await screen.findByRole('heading', { name: 'Add event' })).toBeInTheDocument()
      expect(screen.getByText(triggerLabel(new Date()))).toBeInTheDocument()
    })
  })

  describe('activities lens (tablet)', () => {
    it('switches to the Activities surface and lazily fetches the series', async () => {
      vi.stubGlobal('fetch', mockFetch([], [anActivity()]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
      // Lens is lazy — nothing fetched until the tab is opened.
      expect(activitiesFetched).toBe(false)

      fireEvent.click(screen.getByRole('tab', { name: 'Activities' }))
      // Wait for the series to land → the roster renders.
      expect(await screen.findByText('Gymnastics')).toBeInTheDocument()
      expect(activitiesFetched).toBe(true)
      expect(screen.getByRole('button', { name: 'Add activity' })).toBeInTheDocument()
      // The month grid is gone (no weekday header).
      expect(screen.queryByText('Sun')).not.toBeInTheDocument()
    })

    it('hides the Add-activity CTA below tier 4', async () => {
      vi.stubGlobal('fetch', mockFetch([], []))
      renderPage(3)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
      fireEvent.click(screen.getByRole('tab', { name: 'Activities' }))
      await waitFor(() => expect(screen.getByText('No activities yet')).toBeInTheDocument())
      expect(screen.queryByRole('button', { name: 'Add activity' })).not.toBeInTheDocument()
    })

    it('opens the create drawer in activity framing from Add activity', async () => {
      vi.stubGlobal('fetch', mockFetch([], [anActivity()]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
      fireEvent.click(screen.getByRole('tab', { name: 'Activities' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Add activity' }))
      // The reused drawer opened with the "Add activity" header + repeat-weekly on.
      expect(await screen.findByRole('heading', { name: 'Add activity' })).toBeInTheDocument()
      expect(screen.getByRole('switch', { name: 'Repeat weekly' })).toBeChecked()
    })
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

    it('reaches the Activities lens from the mobile tab bar', async () => {
      stubViewport(false)
      vi.stubGlobal('fetch', mockFetch([todayEvent()], [anActivity()]))
      renderPage(4)
      await waitFor(() => expect(screen.getByText('Soccer game')).toBeInTheDocument())
      // The Calendar ⇄ Activities tier is present on mobile too.
      fireEvent.click(screen.getByRole('tab', { name: 'Activities' }))
      expect(await screen.findByText('Gymnastics')).toBeInTheDocument()
      expect(activitiesFetched).toBe(true)
      expect(screen.getByRole('button', { name: 'Add activity' })).toBeInTheDocument()
    })
  })
})
