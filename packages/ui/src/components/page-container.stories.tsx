import type { Meta, StoryObj } from '@storybook/react'
import { PageContainer, type PageWidth } from './page-container'

const meta: Meta<typeof PageContainer> = {
  title: 'Foundation/Page Containers',
  component: PageContainer,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PageContainer>

const ROLES: { width: PageWidth; px: string; who: string; why: string }[] = [
  {
    width: 'prose',
    px: '680px',
    who: 'Family feed',
    why: 'A reading column. The feed body is Lora at 18px — past ~680px the eye loses the line.',
  },
  {
    width: 'list',
    px: '840px',
    who: 'Chores board · taskee · focus · Settings',
    why: 'A scannable list of rows. A row carries a spine, title, badges and controls — not a sentence — so it needs more measure than prose.',
  },
  {
    width: 'wide',
    px: '1400px',
    who: 'Calendar month / week',
    why: 'A canvas. A 7-column grid crushed into a reading column stops being glanceable across the room.',
  },
  {
    width: 'full',
    px: 'no max',
    who: 'Home dashboard · calendar mobile agenda',
    why: 'Fills the viewport. The widget grid sizes its own rows to the screen.',
  },
]

/* A page states its ROLE, not a number. Before this primitive, the six page
   surfaces had six different recipes: chores and feed agreed at 680px only by
   coincidence, the calendar hardcoded `max-w-[1100px]` beside a token that
   existed to prevent exactly that, and Settings had drifted onto Tailwind's stock
   `max-w-2xl` (672px — 8px off ours) *without* `mx-auto`, so it silently hugged
   the left edge. None of it was decided; it accumulated. */
export const Roles: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background py-8">
      {ROLES.map((r) => (
        <div key={r.width}>
          <PageContainer width={r.width}>
            <div className="rounded-card border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-card-title text-foreground">{r.width}</span>
                <span className="text-xs-token text-muted-foreground">{r.px}</span>
              </div>
              <p className="text-sm-token mt-1 text-muted-foreground">{r.who}</p>
              <p className="text-sm-token mt-2 text-foreground">{r.why}</p>
            </div>
          </PageContainer>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The four page roles at their real measures. Resize the viewport: every role shares one padding rhythm (px-4 → sm:px-6), so the gutter never jumps between routes. Padding is deliberately NOT a prop — a surface that must break the gutter does it on a child, not by renegotiating the page frame.',
      },
    },
  },
}
