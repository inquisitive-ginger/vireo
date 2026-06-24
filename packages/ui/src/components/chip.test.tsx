import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Chip, MemberChip } from './chip'

describe('Chip', () => {
  it('reflects selection via aria-pressed and fires onClick', () => {
    const onClick = vi.fn()
    const { rerender } = render(
      <Chip selected={false} onClick={onClick}>
        30 min
      </Chip>
    )
    const btn = screen.getByRole('button', { name: '30 min' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Chip selected onClick={onClick} selectedClassName="border-primary">
        30 min
      </Chip>
    )
    expect(screen.getByRole('button', { name: '30 min' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('MemberChip', () => {
  it('renders the member name as a pressable toggle', () => {
    const onClick = vi.fn()
    render(<MemberChip name="Zoe" selected onClick={onClick} />)
    const btn = screen.getByRole('button', { name: 'Zoe' })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
