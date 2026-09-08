import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { ShoppingPage } from './ShoppingPage'
import { readQueue, saveLists, saveListItems } from '../lib/offline-store'
import type { ListResponse, ListsResponse } from '../types'

const LISTS: ListsResponse = {
  lists: [{ id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 2 }],
}

const LIST: ListResponse = {
  list: LISTS.lists[0],
  items: [
    {
      id: '1',
      name: 'milk',
      category: 'Dairy',
      quantity: null,
      status: 'needed',
      listId: 'grocery',
      addedAt: '2026-09-07T12:00:00.000Z',
      note: null,
      canRetract: true,
    },
    {
      id: '2',
      name: 'snap peas',
      category: 'Produce',
      quantity: null,
      status: 'needed',
      listId: 'grocery',
      addedAt: '2026-09-07T12:00:00.000Z',
      note: null,
      canRetract: true,
    },
  ],
}

/** The failure this whole story is about: a request that never leaves the
    device. `fetch` rejects with a `TypeError`, exactly as a browser does. */
const noSignal = () => vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))

function setOnline(online: boolean) {
  Object.defineProperty(navigator, 'onLine', { value: online, configurable: true })
}

beforeEach(() => {
  localStorage.clear()
  setOnline(false)
  // `useEventBus` opens a socket on mount; jsdom would spend the suite failing
  // to connect and backing off. Nothing here is driven by the bus.
  vi.stubGlobal(
    'WebSocket',
    class {
      static OPEN = 1
      readyState = 1
      close() {}
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  setOnline(true)
})

function renderPage(fetchMock: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetchMock)
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const profile = { id: 'parent-1', name: 'Zach', tier: 4 } as Profile
  render(
    <MemoryRouter initialEntries={['/shopping']}>
      <QueryClientProvider client={client}>
        <MockAuthProvider profile={profile}>
          <ShoppingPage />
        </MockAuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
  return { client }
}

/** What a device that has been to `/shopping` with signal already holds. */
function seed() {
  saveLists('parent-1', LISTS, 1_000)
  saveListItems('parent-1', 'grocery', LIST, 1_000)
}

describe('/shopping with no signal', () => {
  it('opens on the last known list, in walk order, rather than an error page', async () => {
    seed()
    renderPage(noSignal())

    expect(await screen.findByText('milk')).toBeInTheDocument()
    expect(screen.getByText('snap peas')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })

  it('says it is offline, quietly, without displacing the count or the meter', async () => {
    seed()
    renderPage(noSignal())

    expect(await screen.findByText('Offline — checks will sync')).toBeInTheDocument()
    // The shopper's own arithmetic is still the sticky block's, untouched.
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('refuses an add rather than taking a word it would drop, and says checking still works', async () => {
    seed()
    renderPage(noSignal())

    await screen.findByText('milk')
    expect(screen.getByLabelText('Add to Grocery')).toBeDisabled()
    expect(
      screen.getByText('Adding needs a connection. Checking things off still works.')
    ).toBeInTheDocument()
  })

  it('checks a row on the spot and writes the tap down, spending no request on it', async () => {
    seed()
    const fetchMock = noSignal()
    renderPage(fetchMock)

    await screen.findByText('milk')
    const before = fetchMock.mock.calls.length

    fireEvent.click(screen.getByRole('button', { name: /Mark “milk” as got/ }))

    await waitFor(() => expect(screen.getByText('milk')).toHaveClass('line-through'))
    expect(fetchMock.mock.calls.length).toBe(before)
    expect(readQueue('parent-1')).toEqual([
      expect.objectContaining({ itemId: '1', status: 'got', was: 'needed' }),
    ])
  })

  it('replays the queue when the signal comes back, and empties it', async () => {
    seed()
    const fetchMock = vi.fn((url: string) => {
      if (String(url).includes('/check')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...LIST.items[0], status: 'got' }),
        } as Response)
      }
      return Promise.reject(new TypeError('Failed to fetch'))
    })
    renderPage(fetchMock as unknown as ReturnType<typeof vi.fn>)

    await screen.findByText('milk')
    fireEvent.click(screen.getByRole('button', { name: /Mark “milk” as got/ }))
    expect(readQueue('parent-1')).toHaveLength(1)

    setOnline(true)
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    await waitFor(() => expect(readQueue('parent-1')).toEqual([]))
    expect(
      (fetchMock.mock.calls as unknown as [string][]).some(([url]) => url.includes('/check'))
    ).toBe(true)
    // The pill goes with the queue — the drain got all the way through.
    expect(screen.queryByText('Offline — checks will sync')).not.toBeInTheDocument()
  })

  it('survives a reload with the row and the queue agreeing', async () => {
    seed()
    const { client } = renderPage(noSignal())

    await screen.findByText('milk')
    fireEvent.click(screen.getByRole('button', { name: /Mark “milk” as got/ }))

    // What a reopened app reads back: the snapshot draws the checked row, the
    // queue still knows it has not been sent. If only one of the two survived,
    // the row would flip back under the shopper on reopening.
    await waitFor(() => {
      const saved = JSON.parse(
        localStorage.getItem('vireo.shopping.snapshot.v1.parent-1')!
      ) as import('../lib/offline-store').ListSnapshot
      expect(saved.items.grocery.data.items[0].status).toBe('got')
    })
    expect(readQueue('parent-1')).toHaveLength(1)
    client.clear()
  })
})
