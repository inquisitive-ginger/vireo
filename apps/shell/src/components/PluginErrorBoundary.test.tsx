import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PluginErrorBoundary } from './PluginErrorBoundary'
import { evictPlugin } from '@/lib/load-plugin'

vi.mock('@/lib/load-plugin', () => ({ evictPlugin: vi.fn() }))

function Bomb(): never {
  throw new Error('plugin exploded')
}

// Flipped by the test to simulate a plugin that fails, then loads on retry.
let shouldThrow = true
function Flaky() {
  if (shouldThrow) throw new Error('plugin exploded')
  return <p>plugin content</p>
}

describe('PluginErrorBoundary', () => {
  beforeEach(() => {
    vi.mocked(evictPlugin).mockClear()
    shouldThrow = true
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <PluginErrorBoundary remoteName="chores">
        <p>plugin content</p>
      </PluginErrorBoundary>
    )
    expect(screen.getByText('plugin content')).toBeDefined()
  })

  it('shows error state when child throws', () => {
    render(
      <PluginErrorBoundary remoteName="chores">
        <Bomb />
      </PluginErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeDefined()
  })

  it('evicts the cached lazy component and remounts on retry', () => {
    render(
      <PluginErrorBoundary remoteName="chores">
        <Flaky />
      </PluginErrorBoundary>
    )

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(evictPlugin).toHaveBeenCalledWith('chores')
    expect(screen.getByText('plugin content')).toBeDefined()
  })

  it('offers a reload once a retry has been spent', () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    })

    render(
      <PluginErrorBoundary remoteName="chores">
        <Flaky />
      </PluginErrorBoundary>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reload page' }))

    expect(reload).toHaveBeenCalled()
  })
})
