import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SegmentedControl } from './segmented-control'

const OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

function setup(value = 'month', onChange = vi.fn()) {
  render(
    <SegmentedControl
      aria-label="Calendar view"
      options={OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
  return { onChange }
}

describe('SegmentedControl', () => {
  it('renders a labelled radiogroup of its options', () => {
    setup()
    const group = screen.getByRole('radiogroup', { name: 'Calendar view' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('marks the selected option with aria-checked', () => {
    setup('week')
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'false')
  })

  it('gives only the selected option a tabbable roving tabindex', () => {
    setup('week')
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('tabindex', '-1')
  })

  it('fills the active segment with the primary token', () => {
    setup('month')
    expect(screen.getByRole('radio', { name: 'Month' }).className).toContain('bg-primary')
    expect(screen.getByRole('radio', { name: 'Week' }).className).toContain('text-muted-foreground')
  })

  it('calls onChange with the clicked value', () => {
    const { onChange } = setup('month')
    fireEvent.click(screen.getByRole('radio', { name: 'Day' }))
    expect(onChange).toHaveBeenCalledWith('day')
  })

  it('moves to the next option on ArrowRight', () => {
    const { onChange } = setup('month')
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('week')
  })

  it('wraps from the first to the last option on ArrowLeft', () => {
    const { onChange } = setup('month')
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith('day')
  })
})
