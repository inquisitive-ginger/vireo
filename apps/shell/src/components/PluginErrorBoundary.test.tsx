import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PluginErrorBoundary } from './PluginErrorBoundary'

function Bomb(): never {
  throw new Error('plugin exploded')
}

describe('PluginErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <PluginErrorBoundary>
        <p>plugin content</p>
      </PluginErrorBoundary>
    )
    expect(screen.getByText('plugin content')).toBeDefined()
  })

  it('shows error state when child throws', () => {
    const consoleError = console.error
    console.error = () => {}

    render(
      <PluginErrorBoundary>
        <Bomb />
      </PluginErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeDefined()
    console.error = consoleError
  })
})
