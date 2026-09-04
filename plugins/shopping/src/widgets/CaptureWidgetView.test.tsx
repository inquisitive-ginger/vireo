import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CaptureWidgetView, type CaptureWidgetViewProps } from './CaptureWidgetView'
import type { RecentItem } from '../types'

const ROW_HEIGHT = 56
const BOX_HEIGHT = 2 * ROW_HEIGHT + 10

const item = (id: string, name: string, listName = 'Grocery'): RecentItem => ({
  id,
  name,
  listName,
  category: 'Produce',
  quantity: null,
  status: 'needed',
  listId: 'grocery',
  addedAt: '2026-09-04T12:00:00.000Z',
  note: null,
  canRetract: true,
})

function renderView(over: Partial<CaptureWidgetViewProps> = {}) {
  const props: CaptureWidgetViewProps = {
    items: [item('1', 'snap peas'), item('2', 'wood screws', 'Hardware'), item('3', 'tortillas')],
    openCount: 19,
    loading: false,
    error: false,
    destination: 'Grocery',
    onAdd: vi.fn(),
    onDraftChange: vi.fn(),
    draftAisle: null,
    addError: null,
    canAdd: true,
    ...over,
  }
  return { props, ...render(<CaptureWidgetView {...props} />) }
}

describe('CaptureWidgetView', () => {
  it('captures with zero navigation — the field is open, not focused', () => {
    // Open on arrival is the whole value; TAKING the keyboard is not. On a phone
    // the dashboard stacks and this tile is fifth, so focus scrolled the reader
    // 1272px to a surface they had not asked for (ADR 070, amended 2026-09-04).
    renderView()
    const field = screen.getByLabelText('Add to Grocery')
    expect(field).toBeInTheDocument()
    expect(field).not.toHaveFocus()
  })

  it('adds on Enter and clears, so four things out of the fridge is four keystrokes', () => {
    const { props } = renderView()
    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'milk' } })
    fireEvent.submit(field.closest('form')!)
    expect(props.onAdd).toHaveBeenCalledWith('milk')
    expect(field).toHaveValue('')
  })

  it('states the filing before the commit here too', () => {
    renderView({ draftAisle: 'Pantry' })
    expect(screen.getByText('files under Pantry')).toBeInTheDocument()
  })

  it('names the destination only for a row that is not on the default list', () => {
    renderView()
    expect(screen.getByText('Hardware')).toBeInTheDocument()
    expect(screen.queryByText('Grocery')).not.toBeInTheDocument()
  })

  it('shows what is waiting everywhere, not just the rows that fit', () => {
    renderView()
    expect(screen.getByText('19')).toBeInTheDocument()
  })

  it('never renders who added a row', () => {
    renderView()
    expect(screen.queryByText(/Emma|Sam|the house|added/i)).not.toBeInTheDocument()
  })

  it('says it does not know rather than claiming the house needs nothing', () => {
    renderView({ error: true, items: [] })
    expect(screen.getByText(/Couldn’t load/)).toBeInTheDocument()
    expect(screen.queryByText('Nothing waiting.')).not.toBeInTheDocument()
  })

  it('surfaces the word that failed — nobody at a dashboard has devtools open', () => {
    renderView({ addError: 'milk' })
    expect(screen.getByRole('alert')).toHaveTextContent('milk')
  })
})

/* jsdom has no layout, so every rect is zero and the clamp would see a list that
   always fits. The two markers the view carries (`data-fit-box`, `data-fit-list`)
   are what this stub reads: the box has a height, each row is a ROW_HEIGHT band
   measured from the list. The clamp's own arithmetic is covered in packages/ui —
   what is under test here is the WIRING, which is what auto-bug #116 broke:
   consumers that gave `useFitRows` no height-constrained child measured zero and
   cropped forever. */
describe('CaptureWidgetView — fitting its slot', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get(this: HTMLElement) {
        return this.hasAttribute('data-fit-box') ? BOX_HEIGHT : 0
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value(this: HTMLElement): DOMRect {
        const parent = this.parentElement
        if (!parent?.hasAttribute('data-fit-list')) {
          return { top: 0, bottom: 0, height: 0 } as DOMRect
        }
        const bottom = (Array.from(parent.children).indexOf(this) + 1) * ROW_HEIGHT
        return { top: bottom - ROW_HEIGHT, bottom, height: ROW_HEIGHT } as DOMRect
      },
    })
  })

  it('shows whole rows and states the remainder rather than cropping one', () => {
    renderView({ items: Array.from({ length: 6 }, (_, i) => item(String(i), `thing ${i}`)) })

    expect(screen.getByText('thing 0')).toBeInTheDocument()
    expect(screen.queryByText('thing 5')).not.toBeInTheDocument()
    expect(screen.getByText(/^\+\d+ more$/)).toBeInTheDocument()
  })

  it('does not claim there is more when everything already fits', () => {
    renderView({ items: [item('1', 'milk')], openCount: 1 })
    expect(screen.queryByText(/more$/)).not.toBeInTheDocument()
  })

  /* The remainder counts off the house, not off the read: `/shopping/recent`
     caps at 12, so a tile clamped to 4 rows out of a 19-item house must not say
     "+2 more" beside a header that says 19. */
  it('counts the remainder against the open count, not the capped read', () => {
    renderView({
      items: Array.from({ length: 6 }, (_, i) => item(String(i), `thing ${i}`)),
      openCount: 19,
    })
    // The stub fits one row, so 18 of the 19 the house is waiting on are unseen
    // — never 5, which is all the capped read happened to carry.
    expect(screen.getByText('+18 more')).toBeInTheDocument()
  })
})
