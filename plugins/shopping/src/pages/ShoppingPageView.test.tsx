import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ShoppingPageView, type ShoppingPageViewProps } from './ShoppingPageView'
import type { ShoppingItem } from '../types'

const item = (over: Partial<ShoppingItem> & { id: string; name: string }): ShoppingItem => ({
  category: 'Produce',
  quantity: null,
  status: 'needed',
  listId: 'grocery',
  addedAt: '2026-09-03T12:00:00.000Z',
  note: null,
  canRetract: true,
  ...over,
})

function renderView(over: Partial<ShoppingPageViewProps> = {}) {
  const props: ShoppingPageViewProps = {
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 3 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 1 },
    ],
    selectedListId: 'grocery',
    onSelectList: vi.fn(),
    groups: [
      {
        aisle: 'Produce',
        items: [
          item({ id: '1', name: 'snap peas', note: 'for Thursday' }),
          item({ id: '2', name: 'bananas', canRetract: true }),
        ],
      },
      { aisle: 'Dairy', items: [item({ id: '3', name: 'milk', category: 'Dairy' })] },
    ],
    loading: false,
    onAdd: vi.fn(),
    onDraftChange: vi.fn(),
    draftAisle: null,
    addError: null,
    canAdd: true,
    layout: 'list',
    justAdded: [],
    totalOpenCount: 3,
    onShowLists: vi.fn(),
    retractError: null,
    canCheck: true,
    canFile: false,
    onToggle: vi.fn(),
    onRefile: vi.fn(),
    rowErrors: {},
    ...over,
  }
  return { props, ...render(<ShoppingPageView {...props} />) }
}

describe('ShoppingPageView', () => {
  it('leads with the title and a muted count strip, never a shout', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument()
    expect(screen.getByText('3 things to get')).toBeInTheDocument()
  })

  it('puts the capture field first under the title and does NOT steal the keyboard', () => {
    renderView()
    const field = screen.getByLabelText('Add to Grocery')
    expect(field).toBeInTheDocument()
    expect(field).not.toHaveFocus()
  })

  it('names the destination on the field, with no second control in the slot', () => {
    renderView({ selectedListId: 'costco' })
    expect(screen.getByLabelText('Add to Costco')).toBeInTheDocument()
  })

  it('groups rows under aisle headers in walk order', () => {
    renderView()
    const labels = screen.getAllByText(/^(Produce|Dairy)$/).map((el) => el.textContent)
    expect(labels).toEqual(['Produce', 'Dairy'])
    expect(screen.getByText('snap peas')).toBeInTheDocument()
    expect(screen.getByText('milk')).toBeInTheDocument()
  })

  it('renders a producer fact on the note line — no spine, no avatar, no hue (ADR 064)', () => {
    const { container } = renderView()
    expect(screen.getByText('for Thursday')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toMatch(/identity-/)
  })

  it('says nothing about who added a row — that is noise on a shared list', () => {
    renderView()
    expect(screen.queryByText(/added/i)).not.toBeInTheDocument()
  })

  it('shows one pill per destination with its count, and swaps the list in place', () => {
    const { props } = renderView()
    const costco = screen.getByRole('button', { name: /Costco 1/ })
    expect(screen.getByRole('button', { name: /Grocery 3/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(costco)
    expect(props.onSelectList).toHaveBeenCalledWith('costco')
  })

  it('states the aisle BEFORE the commit, beside the strip that says where it lands', () => {
    renderView({ draftAisle: 'Pantry' })
    const echo = screen.getByText(/Enter to add/)
    expect(within(echo).getByText('Pantry')).toBeInTheDocument()
    // The strip used to give way to this line. It stays now, because it carries
    // the destination — hiding where a word lands while it is being typed is the
    // one moment that fact matters most.
    expect(screen.getByRole('button', { name: /Costco/ })).toBeInTheDocument()
  })

  it('hands the typed word back when the add fails, so it is not silently lost', () => {
    renderView({ addError: 'tortillas' })
    expect(screen.getByRole('alert')).toHaveTextContent('tortillas')
  })

  it('reports a submit up with the caught word', () => {
    const { props } = renderView()
    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'tortillas' } })
    fireEvent.submit(field.closest('form')!)
    expect(props.onAdd).toHaveBeenCalledWith('tortillas')
  })

  it('says why a profile whose add is revoked cannot type, rather than failing silently', () => {
    renderView({ canAdd: false })
    expect(screen.getByLabelText('Add to Grocery')).toBeDisabled()
    expect(screen.getByText(/turned off for this profile/)).toBeInTheDocument()
  })

  it('has no index of lists and no drill-in — a pill is a filter, not a link', () => {
    const { container } = renderView()
    expect(container.querySelector('a')).toBeNull()
  })
})

/* The same component at tablet width and up (design.md §"One surface, two
   layouts"): W2 relocated. Capture only, and `Show lists` swaps to the list at
   its own URL rather than revealing it — a control that replaces a screen of
   content behind an unchanged URL breaks the back button. */
describe('ShoppingPageView — the capture layout', () => {
  it('asks the question and offers the big field', () => {
    renderView({ layout: 'capture' })
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Add to Grocery')).toBeInTheDocument()
  })

  it('does not take the keyboard — a kitchen screen is not one you walked up to', () => {
    renderView({ layout: 'capture' })
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it('is capture ONLY — no rows and no second title, but it can still pick a list', () => {
    renderView({ layout: 'capture' })
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Shopping' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    // The destinations DO belong here: without them a person at the fridge can
    // only ever add to the default list (Zach, 2026-09-04).
    expect(screen.getByRole('button', { name: /Costco/ })).toBeInTheDocument()
  })

  it('hands off to the list rather than drawing one', () => {
    const { props } = renderView({ layout: 'capture' })
    fireEvent.click(screen.getByRole('button', { name: 'Show lists' }))
    expect(props.onShowLists).toHaveBeenCalled()
  })

  it('names what was just added, never who', () => {
    renderView({ layout: 'capture', justAdded: [{ id: '1', name: 'oat milk', canRetract: true }] })
    expect(screen.getByText('oat milk')).toBeInTheDocument()
    expect(screen.queryByText(/Emma|the house|added by/i)).not.toBeInTheDocument()
  })
})

describe('ShoppingPageView — getting back from the list', () => {
  it('offers the way back on a tablet, where a dedicated capture view exists', () => {
    const onBackToCapture = vi.fn()
    renderView({ layout: 'list', onBackToCapture })
    fireEvent.click(screen.getByRole('button', { name: /Back to adding/ }))
    expect(onBackToCapture).toHaveBeenCalled()
  })

  it('offers none on a phone, which has no capture view to go back to', () => {
    // Narrow already opens on the list with a field at its top, so there is
    // nothing to return to (Zach, 2026-09-04).
    renderView({ layout: 'list', onBackToCapture: undefined })
    expect(screen.queryByRole('button', { name: /Back to adding/ })).not.toBeInTheDocument()
  })
})

describe('ShoppingPageView — one control for "which list?"', () => {
  it('does not put a second destination control in the field', () => {
    // The chip in the trailing slot and the pill row below were two controls in
    // similar clothes answering the same question (Zach, 2026-09-04).
    renderView()
    const field = screen.getByLabelText('Add to Grocery')
    expect(within(field.closest('form')!).queryByText(/Grocery/)).not.toBeInTheDocument()
  })

  it('keeps the pills visible while composing — they say where the word lands', () => {
    // They used to give way to the filing echo. Now they carry the destination,
    // which must not vanish mid-word.
    renderView({ draftAisle: 'Pantry' })
    expect(screen.getByRole('button', { name: /Grocery/ })).toBeInTheDocument()
    expect(screen.getByText(/files under/)).toBeInTheDocument()
  })

  it('reports the cumulative count, not the selected list', () => {
    renderView({ totalOpenCount: 19 })
    expect(screen.getByText('19 things to get')).toBeInTheDocument()
    expect(screen.queryByText('3 things to get')).not.toBeInTheDocument()
  })

  it('says "1 thing to get" rather than "1 things"', () => {
    renderView({ totalOpenCount: 1 })
    expect(screen.getByText('1 thing to get')).toBeInTheDocument()
  })
})

/* Frame S3 — the same screen in a shop. Nothing switched modes. */
describe('ShoppingPageView — in a shop', () => {
  const shopping = (over: Partial<ShoppingPageViewProps> = {}) =>
    renderView({
      groups: [
        {
          aisle: 'Produce',
          items: [
            item({ id: '1', name: 'snap peas', status: 'got' }),
            item({ id: '2', name: 'bananas', status: 'got' }),
          ],
        },
        {
          aisle: 'Dairy',
          items: [
            item({ id: '3', name: 'milk', category: 'Dairy', status: 'got' }),
            item({ id: '4', name: 'butter', category: 'Dairy' }),
          ],
        },
      ],
      ...over,
    })

  it('makes the whole row the target, in both directions, on one key', () => {
    const { props } = shopping()
    fireEvent.click(screen.getByRole('button', { name: /Mark .butter. as got/ }))
    expect(props.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: '4' }))

    fireEvent.click(screen.getByRole('button', { name: /Put .milk. back on the list/ }))
    expect(props.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: '3' }))
  })

  it('dims a checked row and strikes its name, in place — it never moves or vanishes', () => {
    shopping()
    const milk = screen.getByText('milk')
    expect(milk).toHaveClass('line-through')
    expect(milk.closest('.opacity-\\[0\\.66\\]')).not.toBeNull()
    // Still the second aisle's first row, exactly where it was.
    expect(screen.getByText('butter')).toBeInTheDocument()
  })

  it('leaves the rows inert but readable when `check` is revoked', () => {
    shopping({ canCheck: false })
    expect(screen.queryByRole('button', { name: /as got/ })).not.toBeInTheDocument()
    expect(screen.getByText('butter')).toBeInTheDocument()
  })

  it('shows the compacted status line and the meter once anything is in the cart', () => {
    shopping()
    // The count leads at its own rank, and the line does NOT name the
    // destination — the pill row above it carries that now, and a region that
    // repeats its neighbour is one people stop reading.
    const line = screen.getByText('3 of 4')
    expect(line).toBeInTheDocument()
    expect(line).not.toHaveTextContent('Grocery')
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '3')
    expect(meter).toHaveAttribute('aria-valuemax', '4')
  })

  it('keeps the meter off a list nobody has started — there is no progress to report', () => {
    renderView()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('never switches the hero off — the capture field is present in a shop too', () => {
    shopping()
    expect(screen.getByLabelText('Add to Grocery')).toBeInTheDocument()
  })

  it('collapses a fully cleared aisle to one summary row, tappable to reopen', () => {
    shopping()
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()
    const summary = screen.getByRole('button', { name: /Produce.*2 in the cart/s })
    fireEvent.click(summary)
    expect(screen.getByText('snap peas')).toBeInTheDocument()
  })

  it('does not close the aisle you are standing in — the row you tapped stays put', () => {
    shopping()
    // Dairy has one open row; clearing it would clear the aisle.
    fireEvent.click(screen.getByRole('button', { name: /Mark .butter. as got/ }))
    expect(screen.getByText('butter')).toBeInTheDocument()
    expect(screen.getByText('milk')).toBeInTheDocument()
  })

  it('has no cleared-aisle collapse on a flat list — that grouping is not one its shopper can see', () => {
    renderView({
      lists: [
        { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 0 },
      ],
      selectedListId: 'hardware',
      groups: [
        {
          aisle: '',
          items: [
            item({ id: '1', name: 'wood screws', category: 'Other', status: 'got' }),
            item({ id: '2', name: 'wood glue', category: 'Other', status: 'got' }),
          ],
        },
      ],
    })
    expect(screen.getByText('wood screws')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Open .* in the cart/ })).not.toBeInTheDocument()
  })

  it('still meters a flat list — progress is not coupled to having aisles', () => {
    renderView({
      lists: [
        { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 1 },
      ],
      selectedListId: 'hardware',
      groups: [
        {
          aisle: '',
          items: [
            item({ id: '1', name: 'wood screws', category: 'Other', status: 'got' }),
            item({ id: '2', name: 'wood glue', category: 'Other' }),
          ],
        },
      ],
    })
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '1')
    expect(meter).toHaveAttribute('aria-valuemax', '2')
    expect(screen.getByText('1 of 2')).toBeInTheDocument()
  })

  it('reports a failed check on the row that was tapped, not in the page chrome', () => {
    shopping({ rowErrors: { '4': "Didn't reach the list — check your connection and tap again." } })
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/Didn.t reach the list/)
    expect(alert.closest('div')?.textContent).toContain('butter')
  })

  // A row names nobody, in either direction (ADR 064 amended 2026-09-04) — and
  // carries no identity chrome to name them with either.
  it('names nobody on a row, and carries no chrome that could', () => {
    const { container } = shopping()
    // Neither direction: the checked `milk` row says it is got, not who got it.
    expect(screen.queryByText(/added|got it|checked by/i)).not.toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toMatch(/identity-/)
    // What `Spine` actually emits is an inline `background` (packages/ui
    // spine.tsx) — a class-name probe for "spine" can never fail.
    expect(container.querySelector('[style*="background"]')).toBeNull()
  })
})

/* AC9 — the aisle correction. `file` is tier 4 and its own action (ADR 071). */
describe('ShoppingPageView — the aisle correction', () => {
  it('is simply absent below tier 4', () => {
    renderView({ canFile: false })
    expect(
      screen.queryByRole('button', { name: /Move .* to another aisle/ })
    ).not.toBeInTheDocument()
  })

  it('opens the walk order from the row and says the correction teaches the next add', () => {
    const { props } = renderView({ canFile: true })
    fireEvent.click(screen.getByRole('button', { name: /Move .snap peas. to another aisle/ }))
    expect(screen.getByText(/Files every future/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Pantry' }))
    expect(props.onRefile).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), 'Pantry')
  })

  it('does not fire a correction that changes nothing', () => {
    const { props } = renderView({ canFile: true })
    fireEvent.click(screen.getByRole('button', { name: /Move .snap peas. to another aisle/ }))
    fireEvent.click(screen.getByRole('button', { name: /^Produce/ }))
    expect(props.onRefile).not.toHaveBeenCalled()
  })
})
