import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spine } from './spine'

function bar(container: HTMLElement) {
  return container.querySelector('span[aria-hidden]') as HTMLElement
}

describe('Spine', () => {
  it('paints a solid bar for a single color', () => {
    const { container } = render(<Spine color="var(--success)" />)
    expect(bar(container).style.background).toBe('var(--success)')
  })

  it('paints a solid bar for a one-element array', () => {
    const { container } = render(<Spine color={['var(--secondary)']} />)
    expect(bar(container).style.background).toBe('var(--secondary)')
  })

  it('splits multiple colors into a vertical hard-stop gradient', () => {
    const { container } = render(<Spine color={['#a00', '#0a0']} />)
    const bg = bar(container).style.background
    expect(bg).toContain('linear-gradient(180deg')
    expect(bg).toContain('#a00 0% 50%')
    expect(bg).toContain('#0a0 50% 100%')
  })

  it('insets the bar when asked', () => {
    const { container } = render(<Spine color="#000" inset />)
    expect(bar(container).className).toContain('my-2')
  })
})
