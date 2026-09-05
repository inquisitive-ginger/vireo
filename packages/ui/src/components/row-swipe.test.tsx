import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListRow } from './list-row'
import { RowSwipe } from './row-swipe'

function row(props: Partial<Parameters<typeof RowSwipe>[0]> = {}, onActivate = vi.fn()) {
  return render(
    <RowSwipe label="milk" {...props}>
      <ListRow onActivate={onActivate} activateLabel="Mark “milk” as got" leading={<span />}>
        <div className="min-w-0 flex-1">milk</div>
      </ListRow>
    </RowSwipe>
  )
}

describe('RowSwipe (SH-09)', () => {
  /* The whole point of both edges being the same permission check: the left edge
     must never reveal a button that will 403, and a row nobody may act on has no
     gesture at all — no wrapper, no strip, nothing to find. */
  it('binds no gesture and renders no control when no verb is permitted', () => {
    const { container } = row()
    expect(screen.queryByText('Edit')).toBeNull()
    expect(container.querySelector('[style*="translateX"]')).toBeNull()
    expect(container.querySelector('[data-row-swipe-quick]')).toBeNull()
  })

  it('binds only the edge whose verb is permitted', () => {
    const { rerender } = row({ quick: { label: 'Remove', onFire: vi.fn() } })
    expect(screen.getByTitle('Remove “milk”')).toBeInTheDocument()
    expect(screen.queryByText('Edit')).toBeNull()

    rerender(
      <RowSwipe label="milk" onOpenActions={vi.fn()}>
        <div>milk</div>
      </RowSwipe>
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.queryByTitle('Remove “milk”')).toBeNull()
  })

  /* Revealed, not fired (D1). The strip is a button, so reaching it costs a tap —
     which is what buys the absence of an undo that would re-create the row with a
     new id and a reset retract clock (ADR 073 §4). */
  it('fires the quick verb on a tap of the revealed control, not on the drag', () => {
    const onFire = vi.fn()
    row({ quick: { label: 'Remove', onFire } })
    expect(onFire).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTitle('Remove “milk”'))
    expect(onFire).toHaveBeenCalledOnce()
  })

  /* The guard that closes an open row on a stray tap must never close over the
     revealed control itself — it is the affordance the drag opened, and a
     capture-phase stop there would make one drag plus one tap do nothing. */
  it('lets a tap reach the revealed control even while the row is standing open', () => {
    const onFire = vi.fn()
    const { container } = row({ quick: { label: 'Remove', onFire } })
    const box = container.firstElementChild as HTMLElement
    fireEvent.click(screen.getByTitle('Remove “milk”'))
    expect(onFire).toHaveBeenCalledOnce()
    expect(box).toBeInTheDocument()
  })

  /* ADR 068 §3: the row primitive's activation overlay is the target the thumb
     aims for, and the gesture layer wraps the row rather than reaching into it —
     so the overlay keeps its full width and stays live at any offset. */
  it("leaves the row's activation overlay whole and live", () => {
    const onActivate = vi.fn()
    row({ quick: { label: 'Remove', onFire: vi.fn() } }, onActivate)
    fireEvent.click(screen.getByRole('button', { name: 'Mark “milk” as got' }))
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it('reaches the sheet by Shift+F10 and the context-menu key, and by right-click', () => {
    const onOpenActions = vi.fn()
    const { container } = row({ onOpenActions })
    const box = container.firstElementChild!

    fireEvent.keyDown(box, { key: 'F10', shiftKey: true })
    fireEvent.keyDown(box, { key: 'ContextMenu' })
    fireEvent.contextMenu(box)
    expect(onOpenActions).toHaveBeenCalledTimes(3)
  })

  /* There is no keyboard shortcut for the quick path — it is a shortcut, not a
     second API (E1). Everything it does, the sheet does by keyboard. */
  it('offers no keyboard route to the quick verb', () => {
    const onFire = vi.fn()
    const { container } = row({ quick: { label: 'Remove', onFire } })
    const box = container.firstElementChild!

    fireEvent.keyDown(box, { key: 'F10', shiftKey: true })
    fireEvent.keyDown(box, { key: 'Enter' })
    expect(onFire).not.toHaveBeenCalled()
    expect(screen.getByTitle('Remove “milk”')).toHaveAttribute('tabindex', '-1')
  })
})
