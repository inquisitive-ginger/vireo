import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockAuthProvider, QueryClient, QueryClientProvider } from '@family-os/platform'
import { FAMILY_PROFILE_ID } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { RewardsPage } from './RewardsPage'

const family: Profile = { id: FAMILY_PROFILE_ID, name: 'Family', tier: 1 }

const profiles: Profile[] = [
  family,
  { id: 'kid-zoe', name: 'Zoë Pritchett', tier: 3 },
  { id: 'kid-teddy', name: 'Teddy Pritchett', tier: 2 },
  { id: 'parent-emma', name: 'Emma Pritchett', tier: 4 },
]

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn(async (url: RequestInfo | URL) => {
    const u = String(url)
    if (u.startsWith('/api/profiles')) {
      return new Response(JSON.stringify(profiles), { status: 200 })
    }
    if (u.startsWith('/api/auth/switch')) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }
    throw new Error(`Unexpected fetch in the family chooser: ${u}`)
  })
  vi.stubGlobal('fetch', fetchMock)
})

function renderPage() {
  return render(
    <MockAuthProvider profile={family}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <RewardsPage />
      </QueryClientProvider>
    </MockAuthProvider>
  )
}

/* ADR 053: a household holds no balance, and the fridge tablet sits on exactly this
   profile — the audit found an infinite spinner over nine 403s here. */
describe('RewardsPage on the family profile', () => {
  it('renders the chooser with the kids, never the store', async () => {
    renderPage()

    expect(screen.getByText('Wallets are personal.')).toBeInTheDocument()
    expect(screen.getByText('Whose pocket?')).toBeInTheDocument()
    expect(await screen.findByText('Zoë')).toBeInTheDocument()
    expect(screen.getByText('Teddy')).toBeInTheDocument()
    // A parent's wallet is not what anyone walks up to the fridge for — and
    // switching to one would need the PIN this surface doesn't carry.
    expect(screen.queryByText('Emma')).not.toBeInTheDocument()
  })

  it('never fetches a wallet (AC2) — the only reads are the faces', async () => {
    renderPage()
    await screen.findByText('Teddy')

    const urls = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urls.some((u) => u.includes('/api/rewards/'))).toBe(false)
  })

  it('hands the store to whoever tapped their face, via the shell switch', async () => {
    renderPage()
    fireEvent.click(await screen.findByRole('button', { name: /Teddy/ }))

    await waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => String(c[0]) === '/api/auth/switch')
      expect(call).toBeDefined()
      expect(JSON.parse((call![1] as RequestInit).body as string)).toEqual({
        targetProfileId: 'kid-teddy',
      })
    })
  })
})
