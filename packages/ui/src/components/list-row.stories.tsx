import type { Meta, StoryObj } from '@storybook/react'
import { ListRow } from './list-row'

const meta: Meta<typeof ListRow> = {
  title: 'Primitives/ListRow',
  component: ListRow,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ListRow>

// A 26px unfilled ring — the grocery list's leading slot (design.md §M5/6).
// ListRow doesn't render the ring itself (ADR 063 decision: the primitive
// takes a generic `leading` slot); this is what the first consumer passes.
const Ring = () => (
  <span className="size-6.5 shrink-0 rounded-full border-2 border-border" aria-hidden />
)

const Body = ({ name, note }: { name: string; note?: string }) => (
  <div className="min-w-0 flex-1">
    <span className="text-list-title block truncate text-foreground">{name}</span>
    {note && <span className="text-sm-token block truncate text-muted-foreground">{note}</span>}
  </div>
)

// ─── Basic row ──────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />}>
        <Body name="Milk" note="2%" />
      </ListRow>
    </div>
  ),
}

// ─── Name + note (provenance line) ─────────────────────────────────────────

export const WithNote: Story = {
  name: 'Name + note line (provenance)',
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />}>
        <Body name="Chicken thighs" note="for Sunday's rigatoni" />
      </ListRow>
    </div>
  ),
}

// ─── Whole-row activation ───────────────────────────────────────────────────

export const Activatable: Story = {
  name: 'Whole-row activation',
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />} onActivate={() => alert('activated')} activateLabel="Open “Milk”">
        <Body name="Milk" note="2%" />
      </ListRow>
    </div>
  ),
}

// ─── Dimmed ──────────────────────────────────────────────────────────────────

export const Dimmed: Story = {
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />} dimmed>
        <Body name="Eggs" />
      </ListRow>
    </div>
  ),
}

// ─── Hairline-separated group (aisle head, design.md §M5/6) ────────────────

export const AisleGroup: Story = {
  name: 'Aisle group (hairline-separated stack)',
  render: () => (
    <div className="max-w-sm">
      <div className="flex items-baseline justify-between border-b border-border pb-1.5">
        <span className="text-aisle-head text-foreground">Dairy</span>
        <span className="text-sm-token text-muted-foreground">2 left</span>
      </div>
      <ListRow leading={<Ring />}>
        <Body name="Milk" note="2%" />
      </ListRow>
      <ListRow leading={<Ring />}>
        <Body name="Eggs" note="Emma added these" />
      </ListRow>
    </div>
  ),
}
