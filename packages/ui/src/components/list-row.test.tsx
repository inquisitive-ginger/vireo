import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListRow } from './list-row'

describe('ListRow', () => {
  it('makes the passive area one target with one accessible name', () => {
    const onActivate = vi.fn()
    render(
      <ListRow onActivate={onActivate} activateLabel="Mark “milk” as got">
        <div className="min-w-0 flex-1">milk</div>
      </ListRow>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mark “milk” as got' }))
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it('lifts a trailing control above the activation overlay, so the row cannot swallow it', () => {
    const onActivate = vi.fn()
    const onCorrect = vi.fn()
    render(
      <ListRow
        onActivate={onActivate}
        activateLabel="Mark “milk” as got"
        trailing={
          <button type="button" onClick={onCorrect}>
            Move
          </button>
        }
      >
        <div className="min-w-0 flex-1">milk</div>
      </ListRow>
    )

    const trailing = screen.getByRole('button', { name: 'Move' }).parentElement!
    expect(trailing.className).toContain('z-20')

    fireEvent.click(screen.getByRole('button', { name: 'Move' }))
    expect(onCorrect).toHaveBeenCalledOnce()
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('leaves a trailing slot unwrapped when the row is not itself a target', () => {
    render(
      <ListRow trailing={<span>3</span>}>
        <div className="min-w-0 flex-1">milk</div>
      </ListRow>
    )
    expect(screen.getByText('3').parentElement!.className).not.toContain('z-20')
  })

  it('keeps the derived overlay inset — 48px live, 8px dead (ADR 068 §3)', () => {
    render(
      <ListRow onActivate={() => {}} activateLabel="Mark “milk” as got">
        <div className="min-w-0 flex-1">milk</div>
      </ListRow>
    )
    expect(screen.getByRole('button').className).toContain('inset-y-[3.5px]')
  })
})
