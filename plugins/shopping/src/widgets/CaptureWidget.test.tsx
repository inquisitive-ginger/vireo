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
      canRetract: true,
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Some of these mocks declare no arguments, so their call tuple types as empty.
    The URL is always the first one. */
function hitBatch(fetchMock: { mock: { calls: unknown[] } }): boolean {
  return (fetchMock.mock.calls as unknown as [string][]).some(([url]) =>
    String(url).endsWith('/batch')
  )
}

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

  /* The add is an ENVELOPE, not a row — `{ item, duplicateOf }` — so this is the
     one place the widget's whole add path is read against the shape the server
     actually sends. The assertion that matters is the ID: `Take it back?` undoes
     the row the add JUST CREATED, never the pre-existing one it collided with.
     On a shared list those are two different people's rows. */
  it('reads the add envelope, and takes back the row it created — not the one it doubled', async () => {
    const fetchMock = vi.fn((url: string, init?: RequestInit) =>
      init?.method === 'POST' && String(url).endsWith('/items')
        ? Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                item: { ...RECENT.items[0], id: 'created-1', name: 'milk', canRetract: true },
                duplicateOf: { id: 'pre-existing-1', name: 'milk' },
              }),
          } as Response)
        : Promise.resolve({ ok: true, json: () => Promise.resolve(RECENT) } as Response)
    )
    renderWidget(fetchMock as unknown as ReturnType<typeof vi.fn>)
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk' } })
    fireEvent.submit(field.closest('form')!)

    // Two clauses, verbatim, list name interpolated — and no aisle clause.
    expect(await screen.findByText('Already on Grocery.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Take it back?' }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/shopping/items/created-1/retract', {
        method: 'POST',
      })
    )
  })

  /* `milk, cereal, chicken thighs` on one Enter. The batch route is NOT atomic,
     so the client reads per-name results: what landed reports its collisions,
     what did not joins the sticky error line, and neither costs the other. */
  it('sends a comma list to the batch route, and reports each name’s own outcome', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi.fn((url: string, init?: RequestInit) =>
      init?.method === 'POST' && String(url).endsWith('/items/batch')
        ? Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                results: [
                  {
                    name: 'milk',
                    item: { ...RECENT.items[0], id: 'c1', name: 'milk' },
                    duplicateOf: { id: 'p1', name: 'milk' },
                  },
                  {
                    name: 'cereal',
                    item: { ...RECENT.items[0], id: 'c2', name: 'cereal' },
                    duplicateOf: null,
                  },
                  // Zod's own message, which is exactly what the route sends.
                  {
                    name: 'chicken thighs',
                    error: 'String must contain at most 120 character(s)',
                  },
                ],
              }),
          } as Response)
        : Promise.resolve({ ok: true, json: () => Promise.resolve(RECENT) } as Response)
    )
    renderWidget(fetchMock as unknown as ReturnType<typeof vi.fn>)
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk, cereal, chicken thighs' } })
    fireEvent.submit(field.closest('form')!)

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/shopping/lists/grocery/items/batch',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ names: ['milk', 'cereal', 'chicken thighs'] }),
        })
      )
    )
    // The one that failed takes the error line; the one that collided takes a
    // notice under it. One collision, so it stays unnamed.
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t add “chicken thighs”')
    expect(screen.getByText('Already on Grocery.')).toBeInTheDocument()

    /* THE TRAP: `error` is Zod's raw message — developer copy. It must never
       reach a family member at the wall, and it must not be swallowed either.
       The slot says it in the surface's own voice; the reason goes to the
       console, where ADR 046's ring buffer can have it. */
    expect(document.body.textContent).not.toContain('String must contain')
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('could not add'),
      'chicken thighs',
      'String must contain at most 120 character(s)'
    )
    consoleError.mockRestore()
  })

  it('keeps a single word on the single-add route — the common case pays nothing', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ item: RECENT.items[0], duplicateOf: null, ...RECENT }),
      } as Response)
    )
    renderWidget(fetchMock as unknown as ReturnType<typeof vi.fn>)
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'tortillas' } })
    fireEvent.submit(field.closest('form')!)

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/shopping/lists/grocery/items',
        expect.objectContaining({ method: 'POST' })
      )
    )
    expect(hitBatch(fetchMock)).toBe(false)
  })

  it('refuses more than twenty before sending, and says so in the slot', async () => {
    const { fetchMock } = renderWidget()
    await screen.findByText('snap peas')

    const field = screen.getByLabelText('Add to Grocery')
    const many = Array.from({ length: 21 }, (_, i) => `thing ${i}`).join(', ')
    fireEvent.change(field, { target: { value: many } })
    fireEvent.submit(field.closest('form')!)

    expect(await screen.findByRole('alert')).toHaveTextContent('21 things at once')
    expect(hitBatch(fetchMock)).toBe(false)
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
