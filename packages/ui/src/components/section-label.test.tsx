import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionLabel } from './section-label'

describe('SectionLabel', () => {
  // `text-section-label` fixed type and said nothing about space, so the call
  // sites hand-rolled eight gaps below it and three above.
  it('owns one gap below and one above', () => {
    render(<SectionLabel>Produce</SectionLabel>)
    expect(screen.getByText('Produce')).toHaveClass('text-section-label', 'mb-2', 'pt-7')
  })

  // Two relationships, not two opinions: `pt-7` separates a group from the one
  // before it; `pt-4` opens the first group under whatever the surface put above.
  it('takes the shorter lead when nothing precedes it', () => {
    render(<SectionLabel leading>Produce</SectionLabel>)
    const el = screen.getByText('Produce')
    expect(el).toHaveClass('pt-4', 'mb-2')
    expect(el).not.toHaveClass('pt-7')
  })

  it('renders as a heading when the group belongs in the outline', () => {
    render(<SectionLabel as="h2">Finished</SectionLabel>)
    expect(screen.getByRole('heading', { name: 'Finished' })).toBeInTheDocument()
  })

  // Colour and a trailing rule are token choices, not rhythm — they stay the
  // caller's, and must not cost the caller its spacing.
  it('keeps its rhythm when a caller adds a tone', () => {
    render(<SectionLabel className="text-accent">Today</SectionLabel>)
    expect(screen.getByText('Today')).toHaveClass('text-accent', 'mb-2', 'pt-7')
  })
})
