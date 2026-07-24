import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WidgetErrorBoundary } from './WidgetErrorBoundary'
import { evictWidget } from '@/lib/load-plugin'

vi.mock('@/lib/load-plugin', () => ({ evictWidget: vi.fn() }))

// Flipped by the test to simulate a widget that fails, then loads on retry.
let shouldThrow = true
function Flaky() {
  if (shouldThrow) throw new Error('widget exploded')
  return <p>widget content</p>
}

describe('WidgetErrorBoundary', () => {
  beforeEach(() => {
    vi.mocked(evictWidget).mockClear()
    shouldThrow = true
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders the ErrorCard copy and notifies on catch, then remounts on retry', () => {
    const onErrorChange = vi.fn()

    render(
      <WidgetErrorBoundary moduleName="Chores" remoteName="chores" onErrorChange={onErrorChange}>
        <Flaky />
      </WidgetErrorBoundary>
    )

    expect(screen.getByText("Chores couldn't load")).toBeDefined()
    expect(onErrorChange).toHaveBeenCalledWith(true)

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(evictWidget).toHaveBeenCalledWith('chores')
    expect(screen.getByText('widget content')).toBeDefined()
    expect(onErrorChange).toHaveBeenLastCalledWith(false)
  })

  it('offers a reload once a retry has been spent', () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    })

    render(
      <WidgetErrorBoundary moduleName="Chores" remoteName="chores">
        <Flaky />
      </WidgetErrorBoundary>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }))

    expect(reload).toHaveBeenCalled()
  })
})
