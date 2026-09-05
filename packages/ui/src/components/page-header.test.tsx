import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './page-header'

function header(props: Partial<Parameters<typeof PageHeader>[0]> = {}) {
  render(<PageHeader title="Chores" {...props} />)
  return screen.getByText('Chores').closest('header') as HTMLElement
}

describe('PageHeader', () => {
  // ADR 074: the title's breathing room is the header's, not the page frame's.
  // Above the title it restores the frame's old step (16 + 8 = 24 on a phone,
  // 24 + 16 = 40 at md:), so a titled route renders where it always did.
  it('owns the air above its title as well as below it', () => {
    expect(header()).toHaveClass('pt-2', 'md:pt-4', 'mb-6')
  })

  it('lets a caller extend the header without replacing its rhythm', () => {
    expect(header({ className: 'border-b' })).toHaveClass('border-b', 'pt-2', 'mb-6')
  })

  // The strip binds to the panel it switches, so the header's bottom margin IS
  // the strip's. Six surfaces had six answers for this gap before the slot.
  it('seats a nav strip under the title, inside its own bottom margin', () => {
    render(<PageHeader title="Rewards" nav={<div data-testid="strip" />} />)
    const strip = screen.getByTestId('strip').parentElement as HTMLElement
    expect(strip).toHaveClass('mt-4', 'basis-full')
    expect(strip.closest('header')).toHaveClass('mb-6')
  })

  // `basis-full` is what wraps the strip onto its own line; `min-w-0` is what
  // keeps the title and action off it. Shopping's `items-baseline` reaches the
  // title row only while the header IS that row.
  it('keeps the title and its action on one row', () => {
    const el = header({ action: <span>count</span> })
    expect(el).toHaveClass('flex', 'flex-wrap')
    expect(screen.getByText('Chores').parentElement).toHaveClass('min-w-0')
  })
})
