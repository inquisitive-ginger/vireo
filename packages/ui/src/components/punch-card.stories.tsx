import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { PunchCard } from './punch-card'
import { Coin } from './coin'

/* The punch card after the 2026-08-02 joy rework: a fixed 5-wide stamp wall that
   stamps the habit's own glyph, with the prize in a rail the caller composes. The
   rails here are examples of that composition — the real kid copy lives in the
   chores plugin. Review the wall at both widths (48px squares, fluid 5-up on
   narrow) and the gold full→won arc. */

const meta: Meta<typeof PunchCard> = {
  title: 'Primitives/PunchCard',
  component: PunchCard,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PunchCard>

function Rail({
  art,
  name,
  sub,
  cta,
  gold = false,
}: {
  art: ReactNode
  name: string
  sub: string
  cta?: ReactNode
  gold?: boolean
}) {
  return (
    <div className="flex min-h-full flex-col">
      <p className="text-section-label mb-2 text-muted-foreground">Your prize</p>
      <div className="flex items-start gap-3">
        <span
          className="grid size-13 shrink-0 place-items-center rounded-lg text-[26px] leading-none"
          style={
            gold
              ? {
                  background:
                    'linear-gradient(150deg, var(--coin-hi), var(--coin) 55%, var(--coin-deep))',
                  border: '1px solid var(--coin-deep)',
                }
              : { background: 'var(--surface-sunken)', border: '1.5px solid var(--border)' }
          }
          aria-hidden
        >
          {art}
        </span>
        <div className="min-w-0">
          <p className="text-card-title">{name}</p>
          <p className="text-xs-body mt-1 text-muted-foreground">{sub}</p>
        </div>
      </div>
      {cta && <div className="pt-3">{cta}</div>}
    </div>
  )
}

export const LivePicked: Story = {
  render: () => (
    <div className="w-[560px]">
      <PunchCard
        glyph="📖"
        name="Reading nights"
        goal={15}
        count={12}
        meta="Last punched yesterday"
        headerTrailing={
          <div className="text-right">
            <p className="text-card-title whitespace-nowrap">3 to go</p>
            <p className="text-xs-body mt-px text-muted-foreground">12 of 15</p>
          </div>
        }
        onPunch={() => {}}
        punchLabel="Punch Reading nights — 13 of 15"
        gridLabel="Reading nights: 12 of 15 stamped, 3 to go."
        prizeRail={
          <Rail
            art="🎬"
            name="You pick the Friday movie"
            sub="Your pick — 3 stamps away."
            cta={
              <button
                type="button"
                className="text-xs-body cursor-pointer text-muted-foreground underline underline-offset-3"
              >
                Change your pick
              </button>
            }
          />
        }
      />
    </div>
  ),
}

export const LiveCoins: Story = {
  render: () => (
    <div className="w-[560px]">
      <PunchCard
        glyph="🪥"
        name="Teeth, morning and night"
        goal={20}
        count={14}
        meta="Last punched this morning"
        headerTrailing={
          <div className="text-right">
            <p className="text-card-title whitespace-nowrap">6 to go</p>
            <p className="text-xs-body mt-px text-muted-foreground">14 of 20</p>
          </div>
        }
        onPunch={() => {}}
        punchLabel="Punch Teeth — 15 of 20"
        gridLabel="Teeth: 14 of 20 stamped, 6 to go."
        prizeRail={
          <Rail art={<Coin size={30} />} name="15 P-Bucks" sub="Straight into your wallet." />
        }
      />
    </div>
  ),
}

export const FullGold: Story = {
  render: () => (
    <div className="w-[560px]">
      <PunchCard
        glyph="🫶"
        name="Kind catch"
        goal={5}
        count={5}
        gold
        meta="Finished this morning"
        headerTrailing={
          <span
            className="inline-flex h-6.5 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.07em]"
            style={{
              background: 'linear-gradient(180deg, var(--coin-hi), var(--coin))',
              color: 'oklch(0.30 0.09 74)',
              boxShadow: 'inset 0 -1px 0 oklch(0.55 0.125 74 / 0.5)',
            }}
          >
            Card full!
          </span>
        }
        gridLabel="Kind catch: all 5 punches stamped. Card is full."
        prizeRail={
          <Rail
            art="🎁"
            gold
            name="Pick your prize!"
            sub="It goes straight in your pocket."
            cta={
              <button
                type="button"
                className="text-sm-token cursor-pointer rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                Pick your prize
              </button>
            }
          />
        }
      />
    </div>
  ),
}

/* The fluid 5-up wall — squares keep 44px minimum and the rail stacks below. */
export const Narrow: Story = {
  render: () => (
    <div className="w-[320px]">
      <PunchCard
        glyph="🥦"
        name="Try bites"
        goal={10}
        count={4}
        meta="Last punched Jun 30"
        headerTrailing={
          <div className="text-right">
            <p className="text-card-title whitespace-nowrap">6 to go</p>
            <p className="text-xs-body mt-px text-muted-foreground">4 of 10</p>
          </div>
        }
        onPunch={() => {}}
        punchLabel="Punch Try bites — 5 of 10"
        gridLabel="Try bites: 4 of 10 stamped, 6 to go."
        prizeRail={<Rail art="🍨" name="Ice cream run" sub="Your pick — 6 stamps away." />}
      />
    </div>
  ),
}
