import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useFitRows } from './use-fit-rows'

/* jsdom has no layout, so the clamp has to be fed one: `available` is the box's
   height and every row is `ROW` tall. `hidden` zeroes everything, the way
   `display: none` does under a container-query variant toggle. */
const ROW = 50
const RESERVE = 20
let available = 0
let hidden = false
const roCallbacks: ResizeObserverCallback[] = []

function fireResize() {
  act(() => {
    for (const cb of roCallbacks) cb([], undefined as unknown as ResizeObserver)
  })
}

beforeAll(() => {
  class ResizeObserverStub {
    constructor(cb: ResizeObserverCallback) {
      roCallbacks.push(cb)
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.box && !hidden ? available : 0
    },
  })
  // The hook measures rows with list-anchored rects (never offsetTop — see the
  // hook), so the stub feeds rects: each row a ROW-tall band, the list at 0.
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement): DOMRect {
      const row = this.dataset.row
      const top = row && !hidden ? Number(row) * ROW : 0
      const height = row && !hidden ? ROW : 0
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
  hidden = false
  roCallbacks.length = 0
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

  /* The container-query widgets ship every variant and CSS reveals one, so a
     consumer can mount `display: none` and measure nothing but zeros. Trusting
     that measurement after the slot crosses a breakpoint meant no clamp at all —
     the tile cropped instead of fitting (auto-bug #116). */
  it('re-measures when a variant hidden at mount is revealed', () => {
    hidden = true
    available = 170
    render(<List items={NAMES} />)
    for (const name of NAMES) expect(screen.getByText(name)).toBeInTheDocument()

    hidden = false
    fireResize()
    expect(screen.getByText('Teddy')).toBeInTheDocument()
    expect(screen.queryByText('Nora')).not.toBeInTheDocument()
    expect(screen.getByTestId('more')).toHaveTextContent('+1')
  })
})
