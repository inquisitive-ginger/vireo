import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ItemCard } from './item-card'
import { RowActions } from './row-actions'
import { MemberGroupHeader } from './member-group-header'

describe('ItemCard — onActivate', () => {
  it('makes the row a tap target', () => {
    const onActivate = vi.fn()
    render(
      <ItemCard onActivate={onActivate} activateLabel="Edit “Vacuum”">
        <div>Vacuum</div>
      </ItemCard>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Edit “Vacuum”' }))
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it('keeps trailing controls clickable above the tap target', () => {
    const onActivate = vi.fn()
    const onTrailing = vi.fn()
    render(
      <ItemCard
        onActivate={onActivate}
        activateLabel="Edit “Vacuum”"
        trailing={<button onClick={onTrailing}>Remove</button>}
      >
        <div>Vacuum</div>
      </ItemCard>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onTrailing).toHaveBeenCalledOnce()
    // The row overlay must not also fire — the trailing control wins its own click.
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('renders no tap target when the row is not activatable', () => {
    render(
      <ItemCard trailing={<span>10 XP</span>}>
        <div>Vacuum</div>
      </ItemCard>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('RowActions', () => {
  it('names each control after the row it acts on', () => {
    render(<RowActions label="Vacuum" onEdit={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Edit “Vacuum”' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove “Vacuum”' })).toBeInTheDocument()
  })

  it('renders nothing when the viewer can do neither', () => {
    const { container } = render(<RowActions label="Vacuum" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('reports edit and remove intent separately', () => {
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    render(<RowActions label="Vacuum" onEdit={onEdit} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit “Vacuum”' }))
    expect(onEdit).toHaveBeenCalledOnce()
    expect(onRemove).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Remove “Vacuum”' }))
    expect(onRemove).toHaveBeenCalledOnce()
  })
})

describe('MemberGroupHeader', () => {
  it('shows the member’s face and name', () => {
    render(<MemberGroupHeader name="Maya" />)
    expect(screen.getByRole('img', { name: 'Maya' })).toBeInTheDocument()
    expect(screen.getByText('Maya')).toBeInTheDocument()
  })

  it('tints the COUNT in the member’s identity hue — a count of someone’s things is a statement about them (and the avatar may hold a photo, so it cannot be the colour signal — ADR 042)', () => {
    // The hue is passed, not hashed: it is assigned per member and travels with the
    // data (ADR 044). Asserting against `getIdentityHue('Maya')` would pin this test to
    // the palette's LENGTH — growing it from six hues to eight moves every hash bucket.
    render(<MemberGroupHeader name="Maya" hue="sage" count="2 left" />)
    const count = screen.getByText('2 left')
    expect(count.style.background).toBe('var(--identity-sage-tint)')
    expect(count.style.color).toBe('var(--identity-sage-ink)')
  })

  it('honours an explicit hue over the name hash', () => {
    render(<MemberGroupHeader name="Maya" hue="plum" count="2 left" />)
    expect(screen.getByText('2 left').style.background).toBe('var(--identity-plum-tint)')
  })

  it('renders a STATUS chip raw — status has its own language and must never be repainted in an identity hue (ADR 043)', () => {
    render(
      <MemberGroupHeader
        name="Maya"
        status={<span data-testid="status">1 overdue</span>}
        count="2 left"
      />
    )
    const status = screen.getByTestId('status')
    expect(status.style.background).toBe('')
    expect(status.style.color).toBe('')
  })

  it('renders the load and action slots the call site supplies', () => {
    render(
      <MemberGroupHeader
        name="Maya"
        load={<span>3 tasks · 25 XP load</span>}
        action={<button>Add</button>}
      />
    )
    expect(screen.getByText('3 tasks · 25 XP load')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})
