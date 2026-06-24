import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ItemCard } from './item-card'

function spineOf(container: HTMLElement) {
  return container.querySelector('span[aria-hidden]')
}

describe('ItemCard', () => {
  it('renders its content column', () => {
    render(
      <ItemCard>
        <div>Row body</div>
      </ItemCard>
    )
    expect(screen.getByText('Row body')).toBeInTheDocument()
  })

  it('renders a leading spine only when a color is given', () => {
    const { container, rerender } = render(
      <ItemCard spine="var(--success)">
        <div>x</div>
      </ItemCard>
    )
    const spine = spineOf(container)
    expect(spine).not.toBeNull()
    expect(spine).toHaveStyle({ background: 'var(--success)' })

    rerender(
      <ItemCard>
        <div>x</div>
      </ItemCard>
    )
    expect(spineOf(container)).toBeNull()
  })

  it('carries card chrome by default and drops it for bare', () => {
    const { container, rerender } = render(
      <ItemCard>
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.className).toContain('rounded-card')
    expect(container.firstElementChild?.className).toContain('bg-card')

    rerender(
      <ItemCard chrome="bare">
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.className).not.toContain('rounded-card')
    expect(container.firstElementChild?.className).not.toContain('bg-card')
  })

  it('renders a trailing slot after the content', () => {
    render(
      <ItemCard trailing={<button>Done</button>}>
        <div>x</div>
      </ItemCard>
    )
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
  })

  it('dims when requested', () => {
    const { container } = render(
      <ItemCard dimmed>
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.className).toContain('opacity-[0.66]')
  })

  it('aligns center vs stretch', () => {
    const { container, rerender } = render(
      <ItemCard align="center">
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.className).toContain('items-center')

    rerender(
      <ItemCard align="stretch">
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.className).toContain('items-stretch')
  })

  it('renders as the requested element tag', () => {
    const { container } = render(
      <ItemCard as="article">
        <div>x</div>
      </ItemCard>
    )
    expect(container.firstElementChild?.tagName).toBe('ARTICLE')
  })
})
