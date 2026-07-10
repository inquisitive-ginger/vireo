import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WidgetErrorBoundary } from './WidgetErrorBoundary'

// Flipped by the test to simulate a widget that fails, then loads on retry.
let shouldThrow = true
function Flaky() {
  if (shouldThrow) throw new Error('widget exploded')
  return <p>widget content</p>
}

describe('WidgetErrorBoundary', () => {
  afterEach(() => {
    shouldThrow = true
  })

  it('renders the ErrorCard copy and notifies on catch, then remounts on retry', () => {
    shouldThrow = true
    const onErrorChange = vi.fn()
    const consoleError = console.error
    console.error = () => {}

    render(
      <WidgetErrorBoundary moduleName="Chores" onErrorChange={onErrorChange}>
        <Flaky />
      </WidgetErrorBoundary>
    )

    expect(screen.getByText("Chores couldn't load")).toBeDefined()
    expect(onErrorChange).toHaveBeenCalledWith(true)

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByText('widget content')).toBeDefined()
    expect(onErrorChange).toHaveBeenLastCalledWith(false)
    console.error = consoleError
  })
})
