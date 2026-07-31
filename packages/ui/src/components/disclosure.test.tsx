import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Disclosure, RevealMore } from './disclosure'

describe('Disclosure', () => {
  it('leads collapsed, states the total, and toggles', () => {
    render(
      <Disclosure label="Settled" count={16}>
        <p>the body</p>
      </Disclosure>
    )
    const header = screen.getByRole('button', { name: /Settled · 16/ })
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('the body')).not.toBeInTheDocument()

    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('the body')).toBeInTheDocument()
  })

  it('opens from the start when the list is the point of the surface', () => {
    render(
      <Disclosure label="Recently used" count={3} defaultOpen>
        <p>the body</p>
      </Disclosure>
    )
    expect(screen.getByText('the body')).toBeInTheDocument()
  })

  it('drops the separator when there is no count to state', () => {
    render(
      <Disclosure label="Coming up">
        <p>the body</p>
      </Disclosure>
    )
    expect(screen.getByRole('button', { name: 'Coming up' })).toBeInTheDocument()
  })
})

describe('RevealMore', () => {
  it('marks a trip to the server, and only that', () => {
    const { rerender } = render(<RevealMore label="Show 13 more" onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Show 13 more' })).toBeInTheDocument()

    rerender(<RevealMore label="Further back" fetches onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Further back ›' })).toBeInTheDocument()
  })

  it('says it is working and refuses a second press', () => {
    const onClick = vi.fn()
    render(<RevealMore label="Further back" fetches busy onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Loading…' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
