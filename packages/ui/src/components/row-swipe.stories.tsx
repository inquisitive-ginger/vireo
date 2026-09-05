import type { Meta, StoryObj } from '@storybook/react'
import { ListRow } from './list-row'
import { RowSwipe } from './row-swipe'

const meta: Meta<typeof RowSwipe> = {
  title: 'Primitives/RowSwipe',
  component: RowSwipe,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof RowSwipe>

const Ring = () => (
  <span className="size-6 shrink-0 rounded-full border-2 border-input" aria-hidden />
)

const Row = ({ name }: { name: string }) => (
  <ListRow leading={<Ring />} onActivate={() => {}} activateLabel={`Mark “${name}” as got`}>
    <div className="min-w-0 flex-1">
      <span className="text-card-title block truncate text-foreground">{name}</span>
    </div>
  </ListRow>
)

// 375px, the width the critique's E1 panels are drawn at.
const Phone = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[375px] bg-background">{children}</div>
)

export const BothEdges: Story = {
  name: 'Both verbs permitted',
  render: () => (
    <Phone>
      <RowSwipe label="milk" quick={{ label: 'Remove', onFire: () => {} }} onOpenActions={() => {}}>
        <Row name="milk" />
      </RowSwipe>
      <RowSwipe
        label="greek yogurt"
        quick={{ label: 'Remove', onFire: () => {} }}
        onOpenActions={() => {}}
      >
        <Row name="greek yogurt" />
      </RowSwipe>
    </Phone>
  ),
}

export const RetractOnly: Story = {
  name: 'Tier 1 — take it back, within the window',
  render: () => (
    <Phone>
      <RowSwipe label="mikk" quick={{ label: 'Take it back', onFire: () => {} }}>
        <Row name="mikk" />
      </RowSwipe>
    </Phone>
  ),
}

/* A row nobody may act on has no gesture at all — neither edge moves, and the
   left edge never reveals a button that will 403. */
export const NoVerbs: Story = {
  name: 'No permitted verb — no gesture',
  render: () => (
    <Phone>
      <RowSwipe label="paper towels">
        <Row name="paper towels" />
      </RowSwipe>
    </Phone>
  ),
}
