import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import CaptureWidget from './CaptureWidget'

const RECENT = {
  lists: [
    { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 14 },
    { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: false, itemCount: 3 },
  ],
  items: [
    {
      id: '1',
      name: 'snap peas',
      listName: 'Grocery',
      category: 'Produce',
      quantity: null,
      status: 'needed',
      listId: 'grocery',
      addedAt: '2026-09-04T12:00:00.000Z',
      note: null,
    },
  ],
  overrides: { 'snap peas': 'Produce' },
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderWidget(fetchImpl?: ReturnType<typeof vi.fn>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const profile = { id: 'parent-1', name: 'Zach', tier: 4 } as Profile
  const fetchMock =
    fetchImpl ??
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(RECENT) } as Response))
  vi.stubGlobal('fetch', fetchMock)
  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MockAuthProvider profile={profile}>
          <CaptureWidget />
        </MockAuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
  return { client, fetchMock }
}

describe('CaptureWidget', () => {
  it('reads under the page’s own key prefix, so one invalidation refreshes both', async () => {
    const { client } = renderWidget()
    await screen.findByText('snap peas')

    // The prefix, not the exact key — the page reads ['shopping/list', id, 'index']
    // and ['shopping/list', id, listId]; this reads ['shopping/list', id, 'recent'].
    // A disjoint key here is the defect: the widget would sit stale until
    // staleTime while the page it sits beside was already right (ADR 013/022).
    const cached = client.getQueryCache().findAll({ queryKey: ['shopping/list'] })
    expect(cached).toHaveLength(1)
    expect(cached[0]!.queryKey).toEqual(['shopping/list', 'parent-1', 'recent'])
  })

  it('invalidates the whole prefix on an add, not just its own key', async () => {
    const { client } = renderWidget()
    await screen.findByText('snap peas')
    const invalidate = vi.spyOn(client, 'invalidateQueries')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk' } })
    fireEvent.submit(field.closest('form')!)

    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['shopping/list'] }))
  })

  it('lands the add on the first destination — neither ambient surface has a picker', async () => {
    const { fetchMock } = renderWidget()
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk' } })
    fireEvent.submit(field.closest('form')!)

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/shopping/lists/grocery/items',
        expect.objectContaining({ method: 'POST' })
      )
    )
  })

  it('says which word was lost when the add fails, and logs why', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi.fn((url: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? Promise.resolve({ ok: false, status: 503 } as Response)
        : Promise.resolve({ ok: true, json: () => Promise.resolve(RECENT) } as Response)
    )
    renderWidget(fetchMock as unknown as ReturnType<typeof vi.fn>)
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk' } })
    fireEvent.submit(field.closest('form')!)

    // Both halves: a wall or a dashboard has nobody holding devtools, so the
    // reason goes to the console AND the word goes back on the screen.
    expect(await screen.findByRole('alert')).toHaveTextContent('milk')
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  /* SH-13. The echo says the field is live and Enter commits, and nothing about
     an aisle: correcting one is `file`, tier 4, and the dashboard is where the
     tiers that cannot correct do most of their capturing. */
  it('says Enter commits, and names no aisle', async () => {
    renderWidget()
    await screen.findByText('snap peas')

    fireEvent.change(screen.getByLabelText('Add to Grocery'), {
      target: { value: 'snap peas' },
    })
    expect(await screen.findByText('Enter to add')).toBeInTheDocument()
    expect(screen.queryByText(/files under/)).not.toBeInTheDocument()
  })
})
