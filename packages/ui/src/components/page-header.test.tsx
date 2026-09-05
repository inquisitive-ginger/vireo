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
})
