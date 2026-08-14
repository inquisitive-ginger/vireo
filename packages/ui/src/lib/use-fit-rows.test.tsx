import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useFitRows } from './use-fit-rows'

/* jsdom has no layout, so the clamp has to be fed one: `available` is the box's
   height and every row is `ROW` tall. */
const ROW = 50
const RESERVE = 20
let available = 0

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.box ? available : 0
    },
  })
  // The hook measures rows with list-anchored rects (never offsetTop — see the
  // hook), so the stub feeds rects: each row a ROW-tall band, the list at 0.
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement): DOMRect {
      const row = this.dataset.row
      const top = row ? Number(row) * ROW : 0
      const height = row ? ROW : 0
      return {
        top,
        bottom: top + height,
        height,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: top,
        toJSON: () => ({}),
      } as DOMRect
    },
  })
})

afterEach(() => {
  available = 0
})

function List({ items }: { items: string[] }) {
  const { boxRef, listRef, shown, hiddenCount, measuring } = useFitRows(items, RESERVE)
  return (
    <div ref={boxRef} data-box="1">
      <div ref={listRef}>
        {shown.map((name, i) => (
          <div key={name} data-row={String(i)}>
            {name}
          </div>
        ))}
      </div>
      <span data-testid="more">{measuring ? 'measuring' : `+${hiddenCount}`}</span>
    </div>
  )
}

const NAMES = ['Zach', 'Emma', 'Teddy', 'Nora']

describe('useFitRows', () => {
  it('shows every row when they all fit', () => {
    available = 4 * ROW
    render(<List items={NAMES} />)
    for (const name of NAMES) expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByTestId('more')).toHaveTextContent('+0')
  })

  it('drops whole rows — never a partial one — and reports the remainder', () => {
    // 170px fits three rows outright; reserving the "+N more" line leaves 150.
    available = 170
    render(<List items={NAMES} />)
    expect(screen.getByText('Teddy')).toBeInTheDocument()
    expect(screen.queryByText('Nora')).not.toBeInTheDocument()
    expect(screen.getByTestId('more')).toHaveTextContent('+1')
  })

  it('holds off on the count until it has measured', () => {
    // An unmeasurable box (height 0) must not claim rows are hidden.
    available = 0
    render(<List items={NAMES} />)
    expect(screen.getByTestId('more')).toHaveTextContent('+0')
    for (const name of NAMES) expect(screen.getByText(name)).toBeInTheDocument()
  })
})
