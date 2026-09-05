import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { ShoppingItemNameSchema } from '@family-os/schemas'
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
    reports: [],
    canAdd: true,
    layout: 'list',
    totalOpenCount: 3,
    onShowLists: vi.fn(),
    canCheck: true,
    canFile: false,
    canManage: false,
    canRetract: false,
    // The narrow default: the suite drives the phone path unless a test says
    // otherwise, since that is the one with the bottom sheet.
    inlineActions: false,
    onToggle: vi.fn(),
    onRefile: vi.fn(),
    onRename: vi.fn(),
    onRemove: vi.fn(),
    onRowRetract: vi.fn(),
    onClear: vi.fn(),
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

/** Mirrors the view's own constant rather than importing it — a test that reads
    the value under test cannot catch the value changing. Must track
    `FOLD_AFTER_MS`. */
const FOLD_AFTER_MS = 220

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

  /* The platform's own pattern, not a bare `<p>` (design-system.md §Empty States):
     module icon, heading, body. No `action` — the capture field is directly above
     and IS the action, and a CTA that focused it would be the autofocus ADR 070
     withdrew. */
  it('uses the shared empty state, pointing at the field rather than repeating it', () => {
    const { container } = renderView({ groups: [] })
    expect(screen.getByRole('heading', { name: 'Nothing on Grocery yet.' })).toBeInTheDocument()
    expect(screen.getByText('Add something in the field above.')).toBeInTheDocument()
    // The module's own icon, never a generic empty box.
    expect(container.querySelector('svg.opacity-40')).not.toBeNull()
    // The field above is the action; a button here would duplicate it.
    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument()
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
    renderView({ reports: [report()] })
    expect(screen.getByRole('alert')).toHaveTextContent('tortillas')
  })

  it('names the newest failure and counts the rest', () => {
    renderView({ reports: [report({ message: 'Couldn’t add “bread” · 1 more' })] })
    expect(screen.getByRole('alert')).toHaveTextContent('Couldn’t add “bread” · 1 more')
  })

  it('clears on the ✕ and on nothing else', () => {
    const onDismiss = vi.fn()
    renderView({ reports: [report({ onDismiss })] })
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('states the collision in two clauses and offers the one verb, with no aisle', () => {
    const onSelect = vi.fn()
    renderView({
      reports: [
        report({
          tone: 'notice',
          message: 'Already on Grocery.',
          actions: [{ label: 'Take it back?', onSelect }],
        }),
      ],
    })
    expect(screen.getByText('Already on Grocery.')).toBeInTheDocument()
    expect(screen.queryByText(/added anyway|files under/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Take it back?' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('dismisses one notice without touching its neighbours', () => {
    const first = vi.fn()
    const second = vi.fn()
    renderView({
      reports: [
        report({ tone: 'notice', message: '“milk” already on Grocery.', onDismiss: first }),
        report({ tone: 'notice', message: '“bread” already on Grocery.', onDismiss: second }),
      ],
    })
    const dismissers = screen.getAllByRole('button', { name: 'Dismiss' })
    expect(dismissers).toHaveLength(2)
    fireEvent.click(dismissers[0])
    expect(first).toHaveBeenCalledOnce()
    expect(second).not.toHaveBeenCalled()
  })

  it('drops the action when the add it would undo is not retract-eligible', () => {
    renderView({
      reports: [report({ tone: 'notice', message: 'Already on Grocery.', actions: [] })],
    })
    expect(screen.getByText('Already on Grocery.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Take it back?' })).not.toBeInTheDocument()
  })

  /* A report outranks the echo, and an error outranks a notice — the container
     ranks them, the slot draws one line. */
  it('outranks the echo rather than sitting beside it', () => {
    renderView({ reports: [report()] })
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

  /* `design.md` §"One surface, two layouts": the block fills the screen, and a
     screen that scrolls is not filled. It fills the shell's `main` rather than
     computing against the viewport — the arithmetic it used to do was a copy of
     `PageContainer`'s padding, and it went 16px stale the day the container
     gained `sm:pt-10`.

     jsdom has no layout, so what is pinned here is the SHAPE: the capture layout
     is height-bound and the list layout is not. The 0px overflow itself was
     measured in a real frame. */
  it('binds the capture layout to its parent’s height, and leaves the list free to scroll', () => {
    const { container, unmount } = renderView({ layout: 'capture' })
    expect(container.querySelector('.max-w-list')).toHaveClass('h-full')
    unmount()

    // The list is long and always scrolled — at either width.
    renderView({ layout: 'list' })
    expect(document.body.querySelector('.max-w-list')?.className.includes('h-full')).toBe(false)
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

  /* SH-10. One arithmetic — what's LEFT — so the pill and the line count the same
     rows and cannot disagree. The line carries NO list name (Zach, list pass,
     reversing SH-11): the destination pills sit directly above it, and a line
     that repeats its neighbour is one people stop reading. */
  it('reads `{n} items left`, the same figure the pill reports, with no list name', () => {
    shopping()
    const line = screen.getByRole('progressbar').previousElementSibling!
    expect(line).toHaveTextContent('1 item left')
    expect(line).not.toHaveTextContent('Grocery')
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '3')
    expect(meter).toHaveAttribute('aria-valuemax', '4')
  })

  it('says `1 item left`, not `1 items left`', () => {
    shopping()
    expect(screen.queryByText(/1 items left/)).not.toBeInTheDocument()
  })

  /* SH-12. It used to MOUNT on the first check, shoving the row the thumb was
     still over down ~58px mid-interaction. The height was reserved to fix that;
     it is now also PAINTED from the first render (Zach, list pass), because the
     menu beside it needs an anchor — a `⋯` hovering against nothing reads as a
     mis-render. ADR 043's "no meter at zero" is amended for this surface in the
     same PR; the general rule stands elsewhere. */
  it('paints the meter from first paint, filling from zero', () => {
    renderView()
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '3')
    expect(meter.previousElementSibling).toHaveTextContent('3 items left')
  })

  it('keeps the clear menu reachable before anything is in the cart', () => {
    renderView({ canManage: true })
    expect(screen.getByRole('button', { name: 'What to do with this list' })).toBeInTheDocument()
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

  /* The aisle you just completed folds too — the fold IS the message. Clearing an
     aisle is the one moment in a shop that says "done here, move on", and holding
     it open makes the shopper learn that by reading a summary that has not
     changed. It waits for the check's own motion first, so the fold reads as a
     consequence of the tap rather than as the tap having done something else. */
  it('folds the aisle the last check completed, after the check’s own motion lands', async () => {
    vi.useFakeTimers()
    const done = [
      { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' as const })] },
    ]
    const { props, rerender } = renderView({
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'snap peas' })] }],
    })

    fireEvent.click(screen.getByRole('button', { name: /Mark .snap peas. as got/ }))
    expect(props.onToggle).toHaveBeenCalled()
    // The check lands upstream and the row comes back checked.
    rerender(<ShoppingPageView {...props} groups={done} />)

    // Still open while the ring finishes — folding on the same frame would read
    // as the tap having done something other than check.
    expect(screen.getByText('snap peas')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(FOLD_AFTER_MS))
    vi.useRealTimers()
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open Produce/ })).toBeInTheDocument()
  })

  /* ADR 071 §2 still binds: "the aisle collapsed and took the row with it" is a
     bug report someone will file about correct behaviour, and the reopen is the
     answer. One tap on the summary, and the uncheck is there. */
  it('keeps the uncheck one tap away behind the summary it folded into', () => {
    const { props } = renderView({
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' })] }],
    })
    fireEvent.click(screen.getByRole('button', { name: /Open Produce/ }))
    fireEvent.click(screen.getByRole('button', { name: /Put .snap peas. back on the list/ }))
    expect(props.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
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
    expect(meter.previousElementSibling).toHaveTextContent('1 item left')
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

  /* Two different branches with two different jobs: this one is a finish, the
     zero-items one is a beginning. */
  it('is not the empty state — that one is a claim about a list with nothing on it', () => {
    renderView({ groups: [] })
    expect(screen.getByRole('heading', { name: 'Nothing on Grocery yet.' })).toBeInTheDocument()
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

  /* THE ONE THIS MISSED. `Take it back` and `Remove from the list` are the same
     act — both hard-delete the row — differing only in endpoint, permission and
     the `reason` on the event: real to the server, invisible to someone looking
     at two buttons with one outcome. The sheet ORed the two conditions while the
     edge had the precedence, so a tier-4 parent looking at their own recent add
     saw both. An assertion about what should NOT be there. */
  it('offers exactly one removal verb, even when both would work', () => {
    renderView({
      canManage: true,
      canRetract: true,
      groups: [
        { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', canRetract: true })] },
      ],
    })
    openSheet('snap peas')
    expect(screen.getByRole('button', { name: 'Remove from the list' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Take it back' })).not.toBeInTheDocument()
  })

  /* `retract` is for the tiers that do NOT hold `manage` — ADR 073 created it so
     the wall and a kid could undo a typo without being handed delete-the-list. */
  it('gives the lower tier `Take it back` where a parent gets `Remove`', () => {
    renderView({
      canManage: false,
      canRetract: true,
      groups: [
        { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', canRetract: true })] },
      ],
    })
    openSheet('snap peas')
    expect(screen.getByRole('button', { name: 'Take it back' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove from the list' })).not.toBeInTheDocument()
  })

  /* The edge and the sheet read one rule from one place. If these two ever
     disagree again, one of them has restated it. */
  it('gives the quick edge the same verb the sheet offers', () => {
    const { unmount } = renderView({ canManage: true, canRetract: true })
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

  /* Tablet and up gets the verbs INLINE, anchored to the row and pushing the rows
     below it down (E1 panel 3, Zach's call on the list pass) — a bottom sheet on
     a screen with this much room travels its whole height to answer a question
     about a row near the top. */
  it('renders the verbs inline at tablet width, in the row’s own place in the list', () => {
    const { container } = renderView({ inlineActions: true, canManage: true })
    openSheet('snap peas')

    expect(container.querySelector('[role="dialog"]')).toBeNull()
    const panel = screen.getByRole('button', { name: 'Remove from the list' }).closest('div')!
    // In the list flow, after its own row and before the next one.
    const text = container.textContent!
    expect(text.indexOf('Remove from the list')).toBeGreaterThan(text.indexOf('snap peas'))
    expect(text.indexOf('Remove from the list')).toBeLessThan(text.indexOf('bananas'))
    expect(panel).toBeInTheDocument()
  })

  it('closes the inline panel on Escape', () => {
    renderView({ inlineActions: true, canManage: true })
    openSheet('snap peas')
    expect(screen.getByRole('button', { name: 'Remove from the list' })).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('button', { name: 'Remove from the list' }), {
      key: 'Escape',
    })
    expect(screen.queryByRole('button', { name: 'Remove from the list' })).not.toBeInTheDocument()
  })

  it('opens one row’s verbs at a time — another row replaces it', () => {
    renderView({ inlineActions: true, canManage: true })
    openSheet('snap peas')
    openSheet('bananas')
    const text = document.body.textContent!
    expect(text.indexOf('Remove from the list')).toBeGreaterThan(text.indexOf('bananas'))
    expect(screen.getAllByRole('button', { name: 'Remove from the list' })).toHaveLength(1)
  })

  /* A phone keeps the bottom sheet: a panel that pushes rows there moves the row
     being acted on off the screen. */
  it('keeps the bottom sheet below tablet width', () => {
    renderView({ inlineActions: false, canManage: true })
    openSheet('snap peas')
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  /* The recess belongs to the INLINE presentation — it says "let into the list".
     A phone's sheet is already a raised surface over the page and renders on
     `--card`; `--surface-sunken` and `--shadow-inset` travel together and are
     card-interior only (ADR 040). */
  it('recesses the inline panel and leaves the phone sheet raised', () => {
    const { container, unmount } = renderView({ inlineActions: true, canManage: true })
    openSheet('snap peas')
    expect(container.querySelector('.bg-surface-sunken')).not.toBeNull()
    unmount()

    renderView({ inlineActions: false, canManage: true })
    openSheet('snap peas')
    const sheet = document.querySelector('[role="dialog"]')!
    expect(sheet.querySelector('.bg-surface-sunken')).toBeNull()
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

  /* The cap is READ from the schema the create, the rename and the batch share,
     never restated — a second copy of 120 is a second rule wearing the first
     one's clothes. Held at the field so a long word stops where the person can
     see it rather than returning a 400 after the sheet has closed. */
  /* Renaming happens on the ROW at both widths (Zach, list pass) — a field in a
     bottom sheet on a phone sat under the keyboard, and a field on the row gets
     scrolled above it by the browser like every other input on the page. */
  it('renames on the row itself, not in the sheet, at either width', () => {
    const { props } = renderView({ canManage: true, inlineActions: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))

    // The panel is gone and the row is the field.
    expect(screen.queryByRole('button', { name: 'Remove from the list' })).not.toBeInTheDocument()
    const field = screen.getByLabelText('Rename “snap peas”')
    fireEvent.change(field, { target: { value: 'sugar snap peas' } })
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(props.onRename).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      'sugar snap peas'
    )
  })

  it('cancels on Escape without committing, and the blur after it does not either', () => {
    const { props } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))

    const field = screen.getByLabelText('Rename “snap peas”')
    fireEvent.change(field, { target: { value: 'something else' } })
    fireEvent.keyDown(field, { key: 'Escape' })
    fireEvent.blur(field)
    expect(props.onRename).not.toHaveBeenCalled()
    expect(screen.getByText('snap peas')).toBeInTheDocument()
  })

  /* A rename is one word — someone who taps away from it has finished, not
     abandoned it. */
  it('commits on blur', () => {
    const { props } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))

    const field = screen.getByLabelText('Rename “snap peas”')
    fireEvent.change(field, { target: { value: 'sugar snap peas' } })
    fireEvent.blur(field)
    expect(props.onRename).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      'sugar snap peas'
    )
  })

  /* The row being edited is a field and nothing else: a drag or a whole-row tap
     on it is a mis-tap every time. */
  it('takes the gesture and the check off the row while it is being renamed', () => {
    const { container, props } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))

    // Its neighbours keep theirs; the row being edited loses the wrapper entirely.
    expect(container.querySelectorAll('[data-row-swipe-quick]')).toHaveLength(2)
    expect(
      screen.queryByRole('button', { name: /Mark .snap peas. as got/ })
    ).not.toBeInTheDocument()
    expect(props.onToggle).not.toHaveBeenCalled()
  })

  it('caps the rename field at the shared schema’s own ceiling', () => {
    renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))
    expect(screen.getByLabelText('Rename “snap peas”')).toHaveAttribute(
      'maxlength',
      String(ShoppingItemNameSchema.maxLength)
    )
  })

  /* SH-06 / D5. Rename is `manage` and nothing more: no new key, no re-file, no
     teaching the dictionary. */
  it('renames under `manage`, and offers nothing to rename with below it', () => {
    const { props, unmount } = renderView({ canManage: true })
    openSheet('snap peas')
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))
    // The sheet closes and the ROW becomes the field, at both widths.
    const field = screen.getByLabelText('Rename “snap peas”')
    fireEvent.change(field, { target: { value: 'sugar snap peas' } })
    fireEvent.keyDown(field, { key: 'Enter' })
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

/* A paper list gets recycled until the next time (Zach). Both verbs are hard
   deletes with no undo, which is why the confirmation names the count. */
describe('ShoppingPageView — ending the list', () => {
  const midShop = (over: Partial<ShoppingPageViewProps> = {}) =>
    renderView({
      canManage: true,
      groups: [
        {
          aisle: 'Produce',
          items: [
            item({ id: '1', name: 'snap peas', status: 'got' }),
            item({ id: '2', name: 'bananas' }),
          ],
        },
      ],
      ...over,
    })

  it('rides the sticky line, not the destination pills', () => {
    midShop()
    const menu = screen.getByRole('button', { name: 'What to do with this list' })
    // Inside the sticky block, which is what keeps it reachable down a long list.
    expect(menu.closest('.sticky')).not.toBeNull()
  })

  /* Same rule as the row's edges: a profile without the verb sees no control at
     all, rather than one that 403s. */
  it('is absent entirely below `manage`', () => {
    midShop({ canManage: false })
    expect(
      screen.queryByRole('button', { name: 'What to do with this list' })
    ).not.toBeInTheDocument()
  })

  it('offers the recycle only once something is in the cart', () => {
    midShop({
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'snap peas' })] }],
    })
    fireEvent.click(screen.getByRole('button', { name: 'What to do with this list' }))
    expect(screen.queryByText('Remove checked items')).not.toBeInTheDocument()
    expect(screen.getByText('Throw the list away')).toBeInTheDocument()
  })

  /* Two-step and inline, never a dialog — the same shape as the row's
     reveal-then-tap. The count IS the warning, because there is no undo. */
  it('confirms in place, naming the count, and fires only on the second tap', () => {
    const { props } = midShop()
    fireEvent.click(screen.getByRole('button', { name: 'What to do with this list' }))

    fireEvent.click(screen.getByText('Throw the list away'))
    expect(props.onClear).not.toHaveBeenCalled()
    expect(screen.getByText('Sure? This removes 2')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Sure? This removes 2'))
    expect(props.onClear).toHaveBeenCalledWith('all')
  })

  /* "Clear" reads as UNCHECK on a surface whose items carry checkmarks, so the
     label says `Remove` — the same verb the row's own sheet uses. The count is
     not in the label; it does its work in the confirmation. */
  it('says `Remove checked items` and puts the count in the confirmation', () => {
    const { props } = midShop()
    fireEvent.click(screen.getByRole('button', { name: 'What to do with this list' }))
    const verb = screen.getByText('Remove checked items')
    expect(verb).toBeInTheDocument()
    expect(screen.queryByText(/Clear the/)).not.toBeInTheDocument()

    fireEvent.click(verb)
    fireEvent.click(screen.getByText('Sure? This removes 1'))
    expect(props.onClear).toHaveBeenCalledWith('checked')
  })

  /* Finishing a shop is exactly when you bin a paper list, so the recycle gets a
     real button in the cleared state rather than staying behind the menu — and
     it fires DIRECTLY. Everything here is already bought, so there is nothing to
     lose, and a confirm on the one unambiguously good outcome is friction for
     its own sake. The menu's verbs still confirm; mid-shop there are unchecked
     rows on screen and the count is the warning. */
  it('fires the fresh list straight off, with no confirmation step', () => {
    const { props } = renderView({
      canManage: true,
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' })] }],
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start a fresh list' }))
    expect(props.onClear).toHaveBeenCalledWith('checked')
    expect(screen.queryByText(/Sure\?/)).not.toBeInTheDocument()
  })

  /* The icon carries the one real difference between the two verbs: a recycled
     list comes back, a thrown-away one does not. */
  it('marks the two verbs with different icons, and neither on the confirm', () => {
    midShop()
    fireEvent.click(screen.getByRole('button', { name: 'What to do with this list' }))
    const recycle = screen.getByText('Remove checked items').closest('button')!
    const bin = screen.getByText('Throw the list away').closest('button')!
    expect(recycle.querySelector('svg')).not.toBeNull()
    expect(bin.querySelector('svg')).not.toBeNull()
    expect(recycle.querySelector('svg')).not.toEqual(bin.querySelector('svg'))

    // The confirm's whole job is the count; a glyph adds nothing to a number.
    fireEvent.click(screen.getByText('Throw the list away'))
    expect(
      screen.getByText('Sure? This removes 2').closest('button')!.querySelector('svg')
    ).toBeNull()
  })

  it('offers no fresh-list button below `manage`', () => {
    renderView({
      canManage: false,
      groups: [{ aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' })] }],
    })
    expect(screen.queryByRole('button', { name: 'Start a fresh list' })).not.toBeInTheDocument()
  })
})

/* Session-only, deliberately: nothing is stored and nothing syncs, so a fresh
   arrival always sees the shop in its truthful state. */
describe('ShoppingPageView — aisles open and close', () => {
  const oneClearedAisle = () =>
    renderView({
      groups: [
        { aisle: 'Produce', items: [item({ id: '1', name: 'snap peas', status: 'got' })] },
        { aisle: 'Dairy', items: [item({ id: '2', name: 'milk', category: 'Dairy' })] },
      ],
    })

  it('reopens a completed aisle, and closes it again on a second tap', () => {
    oneClearedAisle()
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Open Produce/ }))
    expect(screen.getByText('snap peas')).toBeInTheDocument()

    // The header of an open COMPLETE aisle is the way back to closed.
    fireEvent.click(screen.getByRole('button', { name: /^Produce/ }))
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()
  })

  /* ADR 071 §2 — the uncheck has to stay reachable by the person standing in the
     aisle, which is the whole reason the summary reopens at all. */
  it('keeps the uncheck reachable through the summary', () => {
    const { props } = oneClearedAisle()
    fireEvent.click(screen.getByRole('button', { name: /Open Produce/ }))
    fireEvent.click(screen.getByRole('button', { name: /Put .snap peas. back on the list/ }))
    expect(props.onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  it('leaves an incomplete aisle open, with no toggle to close it', () => {
    oneClearedAisle()
    expect(screen.getByText('milk')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Dairy/ })).not.toBeInTheDocument()
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
