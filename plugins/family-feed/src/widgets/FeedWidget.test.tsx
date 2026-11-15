import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import FeedWidget from './FeedWidget'
import { post } from '../test-posts'
import type { FeedPost } from '../types'

function renderWidget(tier: number, serve: () => FeedPost[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ posts: serve(), nextCursor: null }),
      } as Response)
    )
  )
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MockAuthProvider profile={{ id: 'm-maya', name: 'Maya', tier } as Profile}>
          <FeedWidget />
        </MockAuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
  return client
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FeedWidget', () => {
  it("D-013 shares the page's query prefix, so a new post refreshes the widget [F-011]", async () => {
    let posts = [post()]
    const client = renderWidget(2, () => posts)
    expect((await screen.findAllByText('Pizza night is moved to Friday')).length).toBeGreaterThan(0)

    posts = [post({ id: 'new', body: 'Dentist at 3 on Tuesday' }), ...posts]
    await client.invalidateQueries({ queryKey: ['family-feed/posts'] })

    expect((await screen.findAllByText('Dentist at 3 on Tuesday')).length).toBeGreaterThan(0)
  })

  it('D-022 opens the feed page from the widget [F-011]', async () => {
    renderWidget(2, () => [post()])

    await screen.findAllByText('Pizza night is moved to Friday')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/family-feed')
  })

  it('D-003 an empty widget offers Add post to a poster and nothing to tier 1 [F-011]', async () => {
    renderWidget(2, () => [])
    expect((await screen.findAllByRole('link', { name: 'Add post' }))[0]).toHaveAttribute(
      'href',
      '/family-feed'
    )
  })

  it('D-003 an empty widget shows tier 1 no compose action [F-011]', async () => {
    renderWidget(1, () => [])
    expect((await screen.findAllByText('Nothing on the board yet')).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'Add post' })).not.toBeInTheDocument()
  })
})
