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

  it('tints the badge in the member’s identity hue — the avatar may hold a photo, so it cannot be the colour signal (ADR 042)', () => {
    render(<MemberGroupHeader name="Maya" badge="2 left" />)
    const badge = screen.getByText('2 left')
    // Maya hashes to `sage`.
    expect(badge.style.background).toBe('var(--identity-sage-tint)')
    expect(badge.style.color).toBe('var(--identity-sage-ink)')
  })

  it('honours an explicit hue over the name hash', () => {
    render(<MemberGroupHeader name="Maya" hue="plum" badge="2 left" />)
    expect(screen.getByText('2 left').style.background).toBe('var(--identity-plum-tint)')
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
