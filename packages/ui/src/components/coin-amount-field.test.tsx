import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CoinAmountField } from './coin-amount-field'

describe('CoinAmountField', () => {
  it('selects a preset chip and reports it as the typed value', () => {
    const onChange = vi.fn()
    render(<CoinAmountField value="" onChange={onChange} presets={[1, 2, 5, 10]} />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    expect(onChange).toHaveBeenCalledWith('5')
  })

  it('marks the matching preset selected', () => {
    render(<CoinAmountField value="10" onChange={vi.fn()} presets={[1, 2, 5, 10]} />)
    expect(screen.getByRole('button', { name: '10' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('strips non-digits from typed input', () => {
    const onChange = vi.fn()
    render(<CoinAmountField value="" onChange={onChange} presets={[5, 10]} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1a2' } })
    expect(onChange).toHaveBeenCalledWith('12')
  })
})
