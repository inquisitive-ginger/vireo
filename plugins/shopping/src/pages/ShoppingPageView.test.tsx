import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { ShoppingPageView, type ShoppingPageViewProps } from './ShoppingPageView'
import type { CaptureReport, ShoppingItem } from '../types'

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
    report: null,
    canAdd: true,
    layout: 'list',
    totalOpenCount: 3,
    onShowLists: vi.fn(),
    canCheck: true,
    canFile: false,
    canManage: false,
    canRetract: false,
    onToggle: vi.fn(),
    onRefile: vi.fn(),
    onRename: vi.fn(),
    onRemove: vi.fn(),
    onRowRetract: vi.fn(),
    rowErrors: {},
    ...over,
  }
  return { props, ...render(<ShoppingPageView {...props} />) }
}

/** Shift+F10 is the sheet's keyboard route (E1). There is deliberately no
    keyboard route to the quick path, so the sheet is how a test reaches a row's
    verbs. */
const openSheet = (name: string) =>
  fireEvent.keyDown(screen.getAllByText(name)[0], { key: 'F10', shiftKey: true })

const report = (over: Partial<CaptureReport> = {}): CaptureReport => ({
  tone: 'error',
  message: 'Couldn’t add “tortillas”',
  actions: [],
  onDismiss: vi.fn(),
  ...over,
})

describe('ShoppingPageView', () => {
  /* SH-10. The strip counted every destination, which names no trip — you shop
     one list. Deleted, not relabelled. */
  it('leads with the title and NOTHING on its trailing edge', () => {
    renderView({ totalOpenCount: 19 })
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument()
    expect(screen.queryByText(/things to get/)).not.toBeInTheDocument()
    expect(screen.queryByText('19')).not.toBeInTheDocument()
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

  it('shows one pill per destination with what is LEFT on it, and swaps the list in place', () => {
    const { props } = renderView()
    const costco = screen.getByRole('button', { name: /Costco 1/ })
    expect(screen.getByRole('button', { name: /Grocery 3/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(costco)
    expect(props.onSelectList).toHaveBeenCalledWith('costco')
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

/* SH-13. The echo used to read `Enter to add · files under Pantry`, reporting a
   problem to an audience that cannot act on it: correcting an aisle is `file`,
   tier 4, and most capture is tier 1 and the wall. The slot and its reserve
   stay — they are what stops the first keystroke shoving the layout. */
describe('ShoppingPageView — the echo names no aisle', () => {
  it('says the field is live and Enter commits, and nothing about filing', () => {
    renderView()
    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'tortillas' } })
    expect(screen.getByText('Enter to add')).toBeInTheDocument()
    expect(screen.queryByText(/files under/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Pantry|Produce ·/)).not.toBeInTheDocument()
  })

  it('keeps the pills visible while composing — they say where the word lands', () => {
    renderView()
    fireEvent.change(screen.getByLabelText('Add to Grocery'), { target: { value: 'x' } })
    expect(screen.getByRole('button', { name: /Grocery/ })).toBeInTheDocument()
  })
})

/* D4. One line, and a success never clears it — "milk" failing then "eggs"
   landing must not erase the record that milk was lost. */
describe('ShoppingPageView — the report slot', () => {
  it('hands the typed word back when the add fails, so it is not silently lost', () => {
    renderView({ report: report() })
    expect(screen.getByRole('alert')).toHaveTextContent('tortillas')
  })

  it('names the newest failure and counts the rest', () => {
    renderView({ report: report({ message: 'Couldn’t add “bread” · 1 more' }) })
    expect(screen.getByRole('alert')).toHaveTextContent('Couldn’t add “bread” · 1 more')
  })

  it('clears on the ✕ and on nothing else', () => {
    const onDismiss = vi.fn()
    renderView({ report: report({ onDismiss }) })
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('states the collision in two clauses and offers the one verb, with no aisle', () => {
    const onSelect = vi.fn()
    renderView({
      report: report({
        tone: 'notice',
        message: 'Already on Grocery.',
        actions: [{ label: 'Take it back?', onSelect }],
      }),
    })
    expect(screen.getByText('Already on Grocery.')).toBeInTheDocument()
    expect(screen.queryByText(/added anyway|files under/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Take it back?' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('drops the action when the add it would undo is not retract-eligible', () => {
    renderView({ report: report({ tone: 'notice', message: 'Already on Grocery.', actions: [] }) })
    expect(screen.getByText('Already on Grocery.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Take it back?' })).not.toBeInTheDocument()
  })

  /* A report outranks the echo, and an error outranks a notice — the container
     ranks them, the slot draws one line. */
  it('outranks the echo rather than sitting beside it', () => {
    renderView({ report: report() })
    fireEvent.change(screen.getByLabelText('Add to Grocery'), { target: { value: 'x' } })
    expect(screen.queryByText('Enter to add')).not.toBeInTheDocument()
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

  it('draws no short memory and no voice slot — the rows carry take-back now', () => {
    renderView({ layout: 'capture' })
    expect(screen.queryByText('Just added')).not.toBeInTheDocument()
    expect(screen.queryByText(/speak/i)).not.toBeInTheDocument()
  })

  it('keeps the house-wide seam count — one number, at the scope it states (D6)', () => {
    renderView({ layout: 'capture', totalOpenCount: 19 })
    expect(screen.getByText('19 things to get')).toBeInTheDocument()
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

  /* SH-10 / SH-11. One arithmetic — what's LEFT — so the pill and the line count
     the same rows and cannot disagree, and the line carries the list name design.md
     specified and the build dropped. */
  it('reads `{list} · {n} left`, the same figure the pill reports', () => {
    shopping()
    expect(screen.getByRole('progressbar').previousElementSibling).toHaveTextContent(
      'Grocery · 1 left'
    )
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '3')
    expect(meter).toHaveAttribute('aria-valuemax', '4')
  })

  it('says `1 left`, not `1 lefts`', () => {
    shopping()
    expect(screen.queryByText(/lefts/)).not.toBeInTheDocument()
  })

  /* SH-12. It used to MOUNT on the first check, shoving the row the thumb was
     still over down ~58px mid-interaction. ADR 043's "no comparison until there
     is progress" is about what the block says, so it goes quiet, not absent. */
  it('reserves the meter’s height from first paint and only goes quiet', () => {
    const { container } = renderView()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(container.querySelector('.invisible')).not.toBeNull()
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
    expect(meter.previousElementSibling).toHaveTextContent('Hardware · 1 left')
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

/* SH-07 — the walk gets an ending. It replaces the meter and NOTHING else. */
describe('ShoppingPageView — the cleared list', () => {
  const cleared = (over: Partial<ShoppingPageViewProps> = {}) =>
    renderView({
      groups: [
        { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' })] },
        {
          aisle: 'Dairy',
          items: [item({ id: '2', name: 'milk', category: 'Dairy', status: 'got' })],
        },
      ],
      ...over,
    })

  it('names the count, the aisles and the list, in place of the meter', () => {
    cleared()
    expect(screen.getByText('That’s everything.')).toBeInTheDocument()
    expect(screen.getByText('2 things, 2 aisles, Grocery is clear.')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('is not the empty state — that one is a claim about a list with nothing on it', () => {
    renderView({ groups: [] })
    expect(screen.getByText('Nothing on Grocery yet.')).toBeInTheDocument()
    expect(screen.queryByText('That’s everything.')).not.toBeInTheDocument()
  })

  /* ADR 071 §2 — the uncheck has to stay reachable by the person standing in the
     aisle, and remembering one more thing at the register is exactly when this
     screen is on. */
  it('leaves the field, the pills and every aisle summary live', () => {
    const { props } = cleared()
    expect(screen.getByLabelText('Add to Grocery')).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /Costco 1/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Open Produce/ }))
    fireEvent.click(screen.getByRole('button', { name: /Put .snap peas. back on the list/ }))
    expect(props.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  it('is per-list — clearing Grocery says nothing about Costco', () => {
    cleared()
    expect(screen.getByRole('button', { name: /Costco 1/ })).toBeInTheDocument()
  })

  it('returns to the normal shape in the same render once a row is unchecked', () => {
    const { rerender, props } = cleared()
    rerender(
      <ShoppingPageView
        {...props}
        groups={[
          { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'needed' })] },
          {
            aisle: 'Dairy',
            items: [item({ id: '2', name: 'milk', category: 'Dairy', status: 'got' })],
          },
        ]}
      />
    )
    expect(screen.queryByText('That’s everything.')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})

/* SH-08 / SH-09 / SH-01 / SH-02 / SH-06. Row chrome is leading ring, name,
   optional note — nothing else, at any tier. Every verb is behind the gesture,
   filtered by permission BEFORE it is drawn. */
describe('ShoppingPageView — the row’s verbs', () => {
  it('carries no permanent trailing control, at any tier', () => {
    renderView({ canFile: true, canManage: true, canRetract: true })
    expect(
      screen.queryByRole('button', { name: /Move .* to another aisle/ })
    ).not.toBeInTheDocument()
  })

  it('binds no gesture at all for a reader with none of the three verbs', () => {
    const { container } = renderView({ canFile: false, canManage: false, canRetract: false })
    expect(container.querySelector('[data-row-swipe-quick]')).toBeNull()
    expect(screen.queryByText('Edit')).toBeNull()
  })

  it('offers `Remove` on the quick edge under `manage`, and `Take it back` without it', () => {
    const { unmount } = renderView({ canManage: true })
    expect(screen.getAllByTitle(/Remove “/).length).toBeGreaterThan(0)
    expect(screen.queryByTitle(/Take it back “/)).toBeNull()
    unmount()

    renderView({ canManage: false, canRetract: true })
    expect(screen.getAllByTitle(/Take it back “/).length).toBeGreaterThan(0)
    expect(screen.queryByTitle(/Remove “/)).toBeNull()
  })

  it('binds no quick edge when a row is past its retract window', () => {
    const { container } = renderView({
      canRetract: true,
      groups: [
        { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', canRetract: false })] },
      ],
    })
    expect(container.querySelector('[data-row-swipe-quick]')).toBeNull()
  })

  it('removes a row through the sheet, under `manage`', () => {
    const { props } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Remove from the list' }))
    expect(props.onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  /* SH-02. Retract reaches the phone, and eligibility is the payload's — never a
     client clock and never a position in the Just-added strip (ADR 073 §2). */
  it('offers `Take it back` in the sheet only for a row the server says is eligible', () => {
    const { props } = renderView({
      canRetract: true,
      groups: [
        {
          aisle: 'Produce',
          items: [
            item({ id: '1', name: 'snap peas', canRetract: true }),
            item({ id: '2', name: 'bananas', canRetract: false }),
          ],
        },
      ],
    })
    openSheet('bananas')
    expect(screen.queryByRole('button', { name: 'Take it back' })).not.toBeInTheDocument()

    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Take it back' }))
    expect(props.onRowRetract).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  /* THE WALL'S ONLY RETRACT SURFACE, once the hero's `Just added` strip is gone.
     At W2 everyone is the `family` profile, tier 1 (ADR 072): no `check`, no
     `manage`, no `file` — `retract` is the one verb it holds, and there is no
     keyboard and no right-click on a wall tablet. So the touch long-press has to
     reach the sheet on a row whose `ListRow` is not even activatable, and the
     sheet has to offer Take it back. If this breaks, the wall loses its undo. */
  it('reaches Take it back by touch long-press alone, on an uncheckable row', async () => {
    vi.useFakeTimers()
    const onRowRetract = vi.fn()
    renderView({
      canCheck: false,
      canFile: false,
      canManage: false,
      canRetract: true,
      onRowRetract,
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'mikk', canRetract: true })] }],
    })

    // No overlay to press: `check` is tier 2 and the wall is tier 1.
    expect(screen.queryByRole('button', { name: /as got/ })).not.toBeInTheDocument()

    fireEvent.pointerDown(screen.getByText('mikk'), { pointerType: 'touch' })
    await act(() => vi.advanceTimersByTimeAsync(500))
    vi.useRealTimers()

    fireEvent.click(screen.getByRole('button', { name: 'Take it back' }))
    expect(onRowRetract).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  it('reports a retract the server refused on the row, rather than swallowing it', () => {
    renderView({
      canRetract: true,
      rowErrors: { '1': 'Too late to take back “snap peas” — it has been on the list a while.' },
    })
    expect(screen.getByRole('alert')).toHaveTextContent(/Too late to take back/)
  })

  /* SH-06 / D5. Rename is `manage` and nothing more: no new key, no re-file, no
     teaching the dictionary. */
  it('renames under `manage`, and offers nothing to rename with below it', () => {
    const { props, unmount } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))
    const field = screen.getByLabelText('Rename “snap peas”')
    fireEvent.change(field, { target: { value: 'sugar snap peas' } })
    fireEvent.submit(field.closest('form')!)
    expect(props.onRename).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      'sugar snap peas'
    )
    unmount()

    renderView({ canManage: false, canFile: true })
    openSheet('snap peas')
    expect(screen.queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument()
  })
})

/* AC9 — the aisle correction. `file` is tier 4 and its own action (ADR 071). It
   moved behind the sheet in SH-08; its family-wide warning copy did not change. */
describe('ShoppingPageView — the aisle correction', () => {
  it('is simply absent below tier 4', () => {
    renderView({ canFile: false, canManage: true })
    openSheet('snap peas')
    expect(screen.queryByRole('button', { name: 'Move to another aisle' })).not.toBeInTheDocument()
  })

  it('opens the walk order from the sheet and says the correction teaches the next add', () => {
    const { props } = renderView({ canFile: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Move to another aisle' }))
    expect(screen.getByText(/Files every future/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Pantry' }))
    expect(props.onRefile).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), 'Pantry')
  })

  it('does not fire a correction that changes nothing', () => {
    const { props } = renderView({ canFile: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Move to another aisle' }))
    fireEvent.click(screen.getByRole('button', { name: /^Produce/ }))
    expect(props.onRefile).not.toHaveBeenCalled()
  })
})
