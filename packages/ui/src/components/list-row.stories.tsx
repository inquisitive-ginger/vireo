import type { Meta, StoryObj } from '@storybook/react'
import { ListRow } from './list-row'

const meta: Meta<typeof ListRow> = {
  title: 'Primitives/ListRow',
  component: ListRow,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ListRow>

// The shopping list's leading slot (design.md §Anatomy). ListRow does not render
// the ring itself (ADR 063: the primitive takes a generic `leading` slot).
const Ring = () => (
  <span className="size-6 shrink-0 rounded-full border-2 border-border" aria-hidden />
)

const Body = ({ name, note }: { name: string; note?: string }) => (
  <div className="min-w-0 flex-1">
    <span className="text-card-title block truncate text-foreground">{name}</span>
    {note && <span className="text-sm-token block truncate text-muted-foreground">{note}</span>}
  </div>
)

export const Basic: Story = {
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />}>
        <Body name="milk" />
      </ListRow>
    </div>
  ),
}

export const WithNote: Story = {
  name: 'Name + note line',
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />}>
        <Body name="snap peas" note="Emma added" />
      </ListRow>
    </div>
  ),
}

export const Activatable: Story = {
  name: 'Whole-row activation',
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />} onActivate={() => {}} activateLabel="Check off “greek yogurt”">
        <Body name="greek yogurt" />
      </ListRow>
    </div>
  ),
}

export const Dimmed: Story = {
  render: () => (
    <div className="max-w-sm">
      <ListRow leading={<Ring />} dimmed>
        <Body name="bananas" />
      </ListRow>
    </div>
  ),
}

export const AisleGroup: Story = {
  name: 'Aisle group (hairline-separated stack)',
  render: () => (
    <div className="max-w-sm">
      <div className="text-section-label pt-2.5 pb-1.5 text-muted-foreground">Produce</div>
      <ListRow leading={<Ring />}>
        <Body name="snap peas" note="Emma added" />
      </ListRow>
      <ListRow leading={<Ring />}>
        <Body name="bananas" />
      </ListRow>
      <div className="text-section-label pt-4.5 pb-1.5 text-muted-foreground">Dairy</div>
      <ListRow leading={<Ring />}>
        <Body name="milk" />
      </ListRow>
    </div>
  ),
}

/* A row that is itself a target, with a control that must survive it. The
   trailing slot sits above the activation overlay — a control the overlay
   swallows is a control that does nothing (shopping's aisle correction). */
export const WithTrailingControl: Story = {
  name: 'Trailing control on an activatable row',
  render: () => (
    <div className="max-w-sm">
      <ListRow
        leading={<Ring />}
        onActivate={() => {}}
        activateLabel="Check off “snap peas”"
        trailing={
          <button type="button" className="h-11 w-11 text-muted-foreground">
            ···
          </button>
        }
      >
        <Body name="snap peas" />
      </ListRow>
    </div>
  ),
}
