import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker, isPaletteFull } from './color-picker'
import { IDENTITY_HUES } from '../lib/identity'

describe('ColorPicker (ADR 044)', () => {
  it('offers the whole palette and nothing else — no custom colour input', () => {
    render(<ColorPicker onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(IDENTITY_HUES.length)
    // The constraint IS the feature: a fixed palette is what keeps a family off neon green.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('marks the held hue as selected', () => {
    render(<ColorPicker value="teal" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'teal' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'plum' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('names the OWNER of a taken colour — taking one is a trade, and you cannot trade with someone you cannot see', () => {
    render(<ColorPicker value="teal" takenBy={{ plum: 'Zach' }} onChange={() => {}} />)
    const plum = screen.getByRole('button', { name: 'plum — taken by Zach' })
    expect(plum).toBeDisabled()
  })

  it('does not treat the member’s OWN hue as taken by someone else', () => {
    render(<ColorPicker value="teal" takenBy={{ teal: 'Hallie' }} onChange={() => {}} />)
    const teal = screen.getByRole('button', { name: 'teal' })
    expect(teal).not.toBeDisabled()
    expect(teal).toHaveAttribute('aria-pressed', 'true')
  })

  it('cannot hand out a colour someone already holds', () => {
    const onChange = vi.fn()
    render(<ColorPicker value="teal" takenBy={{ plum: 'Zach' }} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'plum — taken by Zach' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('hands back the chosen hue', () => {
    const onChange = vi.fn()
    render(<ColorPicker value="teal" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'moss' }))
    expect(onChange).toHaveBeenCalledWith('moss')
  })

  it('does not signal selection by colour alone', () => {
    // The swatch IS a colour, so the selected state has to be carried by something
    // else — a ring, a check, and aria-pressed.
    const { container } = render(<ColorPicker value="sky" onChange={() => {}} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

describe('isPaletteFull — the household cap', () => {
  it('is false while any colour is free', () => {
    expect(isPaletteFull({ teal: 'Hallie' })).toBe(false)
  })

  it('is true once every colour is spoken for', () => {
    const all = Object.fromEntries(IDENTITY_HUES.map((h, i) => [h, `Member ${i}`]))
    expect(isPaletteFull(all)).toBe(true)
  })
})
