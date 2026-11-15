import { describe, it, expect, vi, afterEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { FeedPage } from './FeedPage'
import { post } from '../test-posts'
import type { FeedPost } from '../types'

function feedServer(initial: FeedPost[], { postFails = false } = {}) {
  let posts = initial
  return vi.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'POST') {
      if (postFails) return Promise.resolve({ ok: false, status: 500 } as Response)
      const created = post({ id: 'new', body: JSON.parse(String(init.body)).body })
      posts = [created, ...posts]
      return Promise.resolve({ ok: true, json: () => Promise.resolve(created) } as Response)
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ posts, nextCursor: null }),
    } as Response)
  })
}

function renderPage(tier: number, fetchImpl: ReturnType<typeof feedServer>) {
  vi.stubGlobal('fetch', fetchImpl)
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MockAuthProvider profile={{ id: 'm-maya', name: 'Maya', tier } as Profile}>
        <FeedPage />
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('FeedPage', () => {
  it('D-003 a tier-1 profile reads the feed but gets no compose action [F-011]', async () => {
    renderPage(1, feedServer([post()]))

    expect(await screen.findByText('Pizza night is moved to Friday')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add post' })).not.toBeInTheDocument()
  })

  it('D-013 a new post refreshes the feed from the top and closes the form [F-011]', async () => {
    renderPage(2, feedServer([post()]))

    fireEvent.click(await screen.findByRole('button', { name: 'Add post' }))
    fireEvent.change(screen.getByPlaceholderText('Leave a note for the family…'), {
      target: { value: 'Dentist at 3 on Tuesday' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Post' }))

    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Leave a note for the family…')).not.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.getAllByRole('article')[0]).toHaveTextContent('Dentist at 3 on Tuesday')
    )
  })

  it('F-011 a post that fails to save keeps the text and says so', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderPage(2, feedServer([post()], { postFails: true }))

    fireEvent.click(await screen.findByRole('button', { name: 'Add post' }))
    const box = screen.getByPlaceholderText('Leave a note for the family…')
    fireEvent.change(box, { target: { value: 'Dentist at 3 on Tuesday' } })
    fireEvent.click(screen.getByRole('button', { name: 'Post' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Post' })).toBeEnabled())
    expect(screen.getByPlaceholderText('Leave a note for the family…')).toHaveValue(
      'Dentist at 3 on Tuesday'
    )
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't post. Try again.")
    expect(console.error).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add post' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
