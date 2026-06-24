import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@family-os/platform'
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

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <CalendarPage />
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
  it('renders the month grid and an inert Add-event CTA', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    renderPage()
    await waitFor(() => expect(screen.getByText('Sun')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /Add event/ })).toBeDisabled()
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
})
