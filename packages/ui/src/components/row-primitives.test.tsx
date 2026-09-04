import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ItemCard } from './item-card'
import { ListRow } from './list-row'
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

describe('ListRow', () => {
  it('renders the leading slot and content', () => {
    render(
      <ListRow leading={<span data-testid="leading">●</span>}>
        <div>milk</div>
      </ListRow>
    )
    expect(screen.getByTestId('leading')).toBeInTheDocument()
    expect(screen.getByText('milk')).toBeInTheDocument()
  })

  it('renders no leading slot when omitted', () => {
    const { container } = render(
      <ListRow>
        <div>milk</div>
      </ListRow>
    )
    // Only the content div — no wrapper for an absent leading slot.
    expect(container.querySelectorAll('div')).toHaveLength(2)
  })

  it('makes the row a tap target via onActivate', () => {
    const onActivate = vi.fn()
    render(
      <ListRow onActivate={onActivate} activateLabel="Open “milk”">
        <div>milk</div>
      </ListRow>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open “milk”' }))
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it('renders no tap target when not activatable', () => {
    render(
      <ListRow>
        <div>milk</div>
      </ListRow>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('keeps its own height floor — a caller cannot shrink the row (ADR 068)', () => {
    const { container } = render(
      <ListRow className="min-h-11" leading={<span>x</span>}>
        <div>milk</div>
      </ListRow>
    )
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('min-h-[var(--spacing-list-touch)]')
    // Load-bearing: the arbitrary form is what tailwind-merge recognises as a
    // `min-h`, so the caller's class is DROPPED rather than left to fight it
    // out in CSS source order. A named utility would leave both.
    expect(row.className).not.toContain('min-h-11')
  })

  it('insets the tap target so neighbouring rows do not touch (ADR 068)', () => {
    render(
      <ListRow onActivate={vi.fn()} activateLabel="Check off milk">
        <div>milk</div>
      </ListRow>
    )
    const target = screen.getByRole('button', { name: 'Check off milk' })
    expect(target.className).toContain('inset-x-0')
    // Derived from live ≥ 48px and dead ≥ 8px, minus the hairline the padding
    // box excludes — not a round number anyone should tidy (ADR 068 §3).
    expect(target.className).toContain('inset-y-[3.5px]')
    expect(target.className).not.toContain('inset-0')
  })

  it('dims via opacity, not a status colour on the primitive', () => {
    render(
      <ListRow dimmed>
        <div>eggs</div>
      </ListRow>
    )
    expect(screen.getByText('eggs').parentElement?.className).toMatch(/opacity-/)
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
