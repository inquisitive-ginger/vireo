import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CompletionToggle } from './completion-toggle'

describe('CompletionToggle', () => {
  it('exposes checkbox semantics with aria-checked reflecting the checked prop', () => {
    const { rerender } = render(
      <CompletionToggle checked={false} onToggle={vi.fn()} label="Mark done" />
    )
    const box = screen.getByRole('checkbox', { name: 'Mark done' })
    expect(box).toHaveAttribute('aria-checked', 'false')

    rerender(<CompletionToggle checked onToggle={vi.fn()} label="Mark done" />)
    expect(screen.getByRole('checkbox', { name: 'Mark done' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  it('fires onToggle when tapped', () => {
    const onToggle = vi.fn()
    render(<CompletionToggle checked={false} onToggle={onToggle} label="Mark done" />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark done' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('renders a non-interactive indicator (no checkbox) without onToggle', () => {
    render(<CompletionToggle checked />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
