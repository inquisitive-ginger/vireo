import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Check, Coins, Lock, Star, Undo2, Wallet } from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'
import { ItemCard } from './item-card'
import { PageContainer } from './page-container'
import { WidgetHeader } from './widget-header'
import { WidgetSlot } from './widget-slot'
import { identityToken } from '../lib/identity'

/* M4/1 exploration — NOT shipped UI. Renders the rewards options inside the real
   primitives (ItemCard, WidgetSlot, PageContainer) rather than against each other,
   because the ADR 042 band passed a four-way playground and still failed on the first
   real screen. Delete this file once the decisions are recorded in design-system.md. */

const meta: Meta = {
  title: 'Explorations/Rewards & Wallet',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

/* Copied from plugins/chores/src/lib/gold.ts — ui cannot import a plugin. XP already
   owns gold AND the coin disc (ScorePlate), which is the whole problem in story 1. */
const GOLD = 'oklch(0.74 0.13 80)'
const GOLD_HI = 'oklch(0.88 0.09 86)'
const GOLD_DEEP = 'oklch(0.55 0.12 66)'
const GOLD_TINT = 'oklch(0.95 0.045 86)'
const GOLD_INK = 'oklch(0.45 0.1 70)'

const SILVER = 'oklch(0.8 0.015 250)'
const SILVER_HI = 'oklch(0.92 0.01 250)'
const SILVER_DEEP = 'oklch(0.6 0.02 250)'
const SILVER_INK = 'oklch(0.45 0.02 250)'

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-section-label mb-2 text-muted-foreground">{children}</p>
}

function OptionLabel({ children }: { children: ReactNode }) {
  return <p className="text-card-title mb-3">{children}</p>
}

function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs-body mt-4 max-w-[62ch] text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground">
      {children}
    </p>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-start gap-8">{children}</div>
}

/* ── Currency marks ────────────────────────────────────────────────────────── */

function Disc({
  hi,
  mid,
  deep,
  size = 24,
  glyph,
}: {
  hi: string
  mid: string
  deep: string
  size?: number
  glyph: ReactNode
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 30%, ${hi}, ${mid} 70%, ${deep})`,
        color: deep,
      }}
    >
      {glyph}
    </span>
  )
}

function XpPillGold({ value }: { value: number }) {
  return (
    <Badge style={{ background: GOLD_TINT, color: GOLD_INK, borderColor: 'transparent' }}>
      +{value} XP
    </Badge>
  )
}

function XpPillStar({ value }: { value: number }) {
  return (
    <span className="text-sm-token inline-flex items-center gap-1 font-semibold text-muted-foreground">
      <Star size={12} strokeWidth={2.5} />
      {value} XP
    </span>
  )
}

function CoinGold({ value, size = 24 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1"
      style={{ background: GOLD_TINT, border: `1px solid ${GOLD}` }}
    >
      <Disc
        hi={GOLD_HI}
        mid={GOLD}
        deep={GOLD_DEEP}
        size={size - 6}
        glyph={<Coins size={11} strokeWidth={2.5} />}
      />
      <span className="text-sm-token font-bold" style={{ color: GOLD_INK }}>
        {value} F$
      </span>
    </span>
  )
}

function CoinSilver({ value, size = 24 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1"
      style={{ background: 'oklch(0.96 0.005 250)', border: `1px solid ${SILVER}` }}
    >
      <Disc
        hi={SILVER_HI}
        mid={SILVER}
        deep={SILVER_DEEP}
        size={size - 6}
        glyph={<Coins size={11} strokeWidth={2.5} />}
      />
      <span className="text-sm-token font-bold" style={{ color: SILVER_INK }}>
        {value} F$
      </span>
    </span>
  )
}

/* The "note": a wallet metaphor rather than a second coin. No hue of its own — the
   identity palette already occupies 35/78/117/148/188/235/268/330 and red is --error,
   so there is no free hue left to spend on a currency. */
function Note({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  return (
    <span
      className={
        size === 'lg'
          ? 'inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1'
          : 'inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5'
      }
    >
      <Wallet size={size === 'lg' ? 14 : 11} className="text-muted-foreground" strokeWidth={2.5} />
      <span
        className={size === 'lg' ? 'text-card-title tabular-nums' : 'text-sm-token font-semibold'}
      >
        {value}
      </span>
      <span className="text-xs-token text-muted-foreground">F$</span>
    </span>
  )
}

function ChoreRow({ trailing, spineHue = 'teal' }: { trailing: ReactNode; spineHue?: string }) {
  return (
    <ItemCard spine={identityToken(spineHue as never)} align="center" className="w-[380px]">
      <div className="min-w-0 flex-1">
        <p className="text-card-title truncate">Mow the lawn</p>
        <p className="text-sm-token text-muted-foreground">Due Saturday</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{trailing}</div>
    </ItemCard>
  )
}

export const Currency: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <SectionLabel>The problem — XP already looks like money</SectionLabel>
        <Row>
          <div>
            <OptionLabel>Shipped today (M2)</OptionLabel>
            <ChoreRow trailing={<XpPillGold value={25} />} />
          </div>
          <div>
            <OptionLabel>Chores score plate (shipped)</OptionLabel>
            <span
              className="inline-flex items-center gap-2 rounded-full py-[7px] pr-[13px] pl-[10px]"
              style={{
                background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD_TINT})`,
                border: `1px solid ${GOLD}`,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Disc
                hi={GOLD_HI}
                mid={GOLD}
                deep={GOLD_DEEP}
                glyph={<Coins size={13} strokeWidth={2.5} />}
              />
              <span className="text-metric leading-none" style={{ color: GOLD_INK }}>
                1,240
              </span>
              <span
                className="text-xs-token font-bold tracking-[0.04em] opacity-70"
                style={{ color: GOLD_INK }}
              >
                XP
              </span>
            </span>
          </div>
        </Row>
        <Footnote>
          XP owns <b>gold</b>, the <b>coin disc</b>, and the <b>Coins glyph</b> — settled in M2 when
          nothing was spendable. F$ is the currency that actually buys things and arrives second.
          Note too that XP&apos;s gold is <b>oklch(0.74 0.13 80)</b> and{' '}
          <code>--identity-marigold</code> is <b>oklch(0.71 0.12 78)</b>: a member assigned marigold
          already wears the XP colour.
        </Footnote>
      </div>

      <div>
        <SectionLabel>Option A — F$ takes the coin; XP demotes to a score</SectionLabel>
        <Row>
          <ChoreRow
            trailing={
              <>
                <XpPillStar value={25} />
                <CoinGold value={5} />
              </>
            }
          />
          <div className="self-center">
            <p className="text-sm-token text-muted-foreground">
              Money looks like money. Costs a rework of every shipped XP surface.
            </p>
          </div>
        </Row>
      </div>

      <div>
        <SectionLabel>Option B — two metals: XP gold, F$ silver</SectionLabel>
        <Row>
          <ChoreRow
            trailing={
              <>
                <XpPillGold value={25} />
                <CoinSilver value={5} />
              </>
            }
          />
          <div className="self-center">
            <p className="text-sm-token text-muted-foreground">
              No M2 churn. Two coins on one row, and the one that matters looks cheaper.
            </p>
          </div>
        </Row>
      </div>

      <div>
        <SectionLabel>Option C — different metaphor: XP is a coin, F$ is a note</SectionLabel>
        <Row>
          <ChoreRow
            trailing={
              <>
                <XpPillGold value={25} />
                <Note value={5} />
              </>
            }
          />
          <div className="self-center">
            <p className="text-sm-token text-muted-foreground">
              Form, not hue — nothing to collide with the identity palette.
            </p>
          </div>
        </Row>
        <Footnote>
          Read all three <b>at arm&apos;s length</b>: the question is not which is prettier but
          which one a kid can tell apart from XP in half a second, on a row where both appear.
        </Footnote>
      </div>
    </div>
  ),
}

/* ── Store ─────────────────────────────────────────────────────────────────── */

type Reward = { emoji: string; name: string; cost: number; approval?: boolean }

const CATALOG: Reward[] = [
  { emoji: '🎧', name: 'Pick the car music', cost: 5 },
  { emoji: '🎮', name: 'Extra 30 min screen', cost: 10 },
  { emoji: '🌙', name: 'Stay up 30 min late', cost: 10 },
  { emoji: '🍿', name: 'Pick the movie', cost: 15 },
  { emoji: '🍕', name: "Pick Friday's dinner", cost: 15 },
  { emoji: '🍦', name: 'Ice cream run', cost: 25, approval: true },
  { emoji: '🎡', name: 'One-on-one outing', cost: 40, approval: true },
  { emoji: '🧸', name: 'Trip to the shop', cost: 40, approval: true },
]

const BALANCE = 12

function Meter({ value, max }: { value: number; max: number }) {
  return (
    <span
      className="block h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: 'var(--surface-sunken)', boxShadow: 'var(--shadow-inset)' }}
    >
      <span
        className="block h-full rounded-full"
        style={{
          width: `${Math.min(100, (value / max) * 100)}%`,
          background: 'var(--primary)',
        }}
      />
    </span>
  )
}

function RewardTile({ r, balance }: { r: Reward; balance: number }) {
  const affordable = balance >= r.cost
  return (
    <div className="rounded-card border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="mb-2 grid h-16 place-items-center text-[34px] leading-none">{r.emoji}</div>
      <p className="text-sm-token mb-0.5 font-semibold">{r.name}</p>
      <div className="mb-2.5 flex items-center gap-1.5">
        <Note value={r.cost} />
        {r.approval && (
          <Lock size={11} className="text-muted-foreground" aria-label="Needs a grown-up" />
        )}
      </div>
      {affordable ? (
        <Button size="sm" className="w-full">
          Get it
        </Button>
      ) : (
        <div className="space-y-1">
          <Meter value={balance} max={r.cost} />
          <p className="text-xs-body text-muted-foreground">{r.cost - balance} more</p>
        </div>
      )}
    </div>
  )
}

function StoreHeader({ balance }: { balance: number }) {
  return (
    <div className="mb-5 flex items-baseline gap-2">
      <span className="text-page-title">Rewards</span>
      <span className="flex-1" />
      <span className="text-section-label text-muted-foreground">You have</span>
      <Note value={balance} size="lg" />
    </div>
  )
}

const byAffordability = (balance: number) => (a: Reward, b: Reward) => {
  const aa = balance >= a.cost ? 0 : 1
  const bb = balance >= b.cost ? 0 : 1
  return aa - bb || a.cost - b.cost
}

export const Store: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionLabel>Option A — tile grid, affordable first</SectionLabel>
        <PageContainer width="wide">
          <StoreHeader balance={BALANCE} />
          <div className="grid grid-cols-4 gap-3">
            {[...CATALOG].sort(byAffordability(BALANCE)).map((r) => (
              <RewardTile key={r.name} r={r} balance={BALANCE} />
            ))}
          </div>
        </PageContainer>
        <Footnote>
          A shop, not a task list. Unaffordable tiles keep full colour and state the <b>distance</b>
          , not a denial. Big targets suit tier 1.
        </Footnote>
      </div>

      <div>
        <SectionLabel>Option B — two sections: afford now / saving up</SectionLabel>
        <PageContainer width="list">
          <StoreHeader balance={BALANCE} />
          <p className="text-section-label mb-2 text-muted-foreground">You can get now</p>
          <div className="mb-6 space-y-2">
            {CATALOG.filter((r) => r.cost <= BALANCE).map((r) => (
              <ItemCard key={r.name} align="center">
                <span className="text-[22px] leading-none">{r.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-card-title truncate">{r.name}</p>
                </div>
                <Note value={r.cost} />
                <Button size="sm">Get it</Button>
              </ItemCard>
            ))}
          </div>
          <p className="text-section-label mb-2 text-muted-foreground">Saving up for</p>
          <div className="space-y-2">
            {CATALOG.filter((r) => r.cost > BALANCE).map((r) => (
              <ItemCard key={r.name} align="center">
                <span className="text-[22px] leading-none">{r.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-card-title truncate">{r.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="w-32">
                      <Meter value={BALANCE} max={r.cost} />
                    </span>
                    <span className="text-xs-body text-muted-foreground">
                      {r.cost - BALANCE} more
                    </span>
                  </div>
                </div>
                <Note value={r.cost} />
              </ItemCard>
            ))}
          </div>
        </PageContainer>
        <Footnote>
          Explicit split, reads cleanly — but on <b>day one the top section is empty</b>, and a zero
          balance is the state a kid is in most of the time.
        </Footnote>
      </div>

      <div>
        <SectionLabel>Option C — one ordered list of ItemCard rows</SectionLabel>
        <PageContainer width="list">
          <StoreHeader balance={BALANCE} />
          <div className="space-y-2">
            {[...CATALOG].sort(byAffordability(BALANCE)).map((r) => {
              const affordable = BALANCE >= r.cost
              return (
                <ItemCard key={r.name} align="center">
                  <span className="text-[22px] leading-none">{r.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-card-title truncate">{r.name}</p>
                    {!affordable && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="w-32">
                          <Meter value={BALANCE} max={r.cost} />
                        </span>
                        <span className="text-xs-body text-muted-foreground">
                          {r.cost - BALANCE} more
                        </span>
                      </div>
                    )}
                  </div>
                  <Note value={r.cost} />
                  {affordable && <Button size="sm">Get it</Button>}
                </ItemCard>
              )
            })}
          </div>
        </PageContainer>
        <Footnote>
          Maximum consistency and the cheapest to build. Also the drabbest surface in the app for
          the one screen that is supposed to pay off a month of chores.
        </Footnote>
      </div>
    </div>
  ),
}

/* ── Wallet widget ─────────────────────────────────────────────────────────── */

function WidgetFrame({
  children,
  prominence = 'card',
  w = 300,
  h = 150,
}: {
  children: ReactNode
  prominence?: 'feature' | 'card' | 'quiet'
  w?: number
  h?: number
}) {
  return (
    <div style={{ width: w, height: h }}>
      <WidgetSlot prominence={prominence}>
        <div className="flex h-full flex-col gap-2 p-3">{children}</div>
      </WidgetSlot>
    </div>
  )
}

function WalletAdaptive({ balance }: { balance: number }) {
  const affordable = CATALOG.filter((r) => r.cost <= balance)
  const next = [...CATALOG].filter((r) => r.cost > balance).sort((a, b) => a.cost - b.cost)[0]
  return (
    <WidgetFrame>
      <WidgetHeader icon={Wallet} label="Wallet" />
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-metric">
          {balance}
          <span className="text-heading ml-1 text-muted-foreground">F$</span>
        </p>
        {affordable.length > 0 ? (
          <p className="text-sm-token mt-1.5 font-semibold">
            {affordable.length} rewards you can get
          </p>
        ) : (
          next && (
            <div className="mt-2 space-y-1">
              <p className="text-sm-token">
                {next.cost - balance} more for {next.emoji} {next.name}
              </p>
              <Meter value={balance} max={next.cost} />
            </div>
          )
        )}
      </div>
    </WidgetFrame>
  )
}

function WalletGoal({ balance }: { balance: number }) {
  const next = [...CATALOG].filter((r) => r.cost > balance).sort((a, b) => a.cost - b.cost)[0]
  return (
    <WidgetFrame>
      <WidgetHeader icon={Wallet} label="Wallet" />
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-metric">
          {balance}
          <span className="text-heading ml-1 text-muted-foreground">F$</span>
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm-token">
            {next.cost - balance} more for {next.emoji} {next.name}
          </p>
          <Meter value={balance} max={next.cost} />
        </div>
      </div>
    </WidgetFrame>
  )
}

function WalletBare({ balance }: { balance: number }) {
  return (
    <WidgetFrame>
      <WidgetHeader icon={Wallet} label="Wallet" />
      <div className="flex flex-1 items-center">
        <p className="text-metric">
          {balance}
          <span className="text-heading ml-1 text-muted-foreground">F$</span>
        </p>
      </div>
    </WidgetFrame>
  )
}

function WalletStandard({ balance }: { balance: number }) {
  const affordable = [...CATALOG].filter((r) => r.cost <= balance).sort((a, b) => b.cost - a.cost)
  const next = [...CATALOG].filter((r) => r.cost > balance).sort((a, b) => a.cost - b.cost)[0]
  return (
    <WidgetFrame w={380} h={200}>
      <WidgetHeader icon={Wallet} label="Wallet" trailing={<Note value={balance} />} />
      <div className="flex-1 space-y-1.5 pt-1">
        {affordable.slice(0, 2).map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <span className="text-[18px] leading-none">{r.emoji}</span>
            <span className="text-sm-token flex-1 truncate font-semibold">{r.name}</span>
            <span className="text-xs-token text-success">
              <Check size={12} className="inline" /> {r.cost}
            </span>
          </div>
        ))}
        {next && (
          <div className="flex items-center gap-2 opacity-70">
            <span className="text-[18px] leading-none">{next.emoji}</span>
            <span className="text-sm-token flex-1 truncate">{next.name}</span>
            <span className="text-xs-token text-muted-foreground">{next.cost - balance} more</span>
          </div>
        )}
      </div>
    </WidgetFrame>
  )
}

export const WalletWidget: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <SectionLabel>Compact — balance 12 F$ (three can be afforded)</SectionLabel>
        <Row>
          <div>
            <OptionLabel>A — adaptive second line</OptionLabel>
            <WalletAdaptive balance={12} />
          </div>
          <div>
            <OptionLabel>B — always the next goal</OptionLabel>
            <WalletGoal balance={12} />
          </div>
          <div>
            <OptionLabel>C — bare balance</OptionLabel>
            <WalletBare balance={12} />
          </div>
        </Row>
      </div>

      <div>
        <SectionLabel>
          Compact — balance 3 F$ (nothing affordable: day one, and most days)
        </SectionLabel>
        <Row>
          <div>
            <OptionLabel>A — adaptive second line</OptionLabel>
            <WalletAdaptive balance={3} />
          </div>
          <div>
            <OptionLabel>B — always the next goal</OptionLabel>
            <WalletGoal balance={3} />
          </div>
          <div>
            <OptionLabel>C — bare balance</OptionLabel>
            <WalletBare balance={3} />
          </div>
        </Row>
        <Footnote>
          The zero state decides this. <b>C</b> is a dead end — a number with nothing to do.{' '}
          <b>B</b> tells a kid who can already afford three things that they are short of a fourth.{' '}
          <b>A</b> changes what it says with the state it is in.
        </Footnote>
      </div>

      <div>
        <SectionLabel>Standard — affordability as the content</SectionLabel>
        <WalletStandard balance={12} />
        <Footnote>
          At <code>standard</code> the balance moves to the header trailing slot and the body
          becomes <b>what you can have</b> — the widget answers &quot;what is my money for&quot;
          rather than &quot;how much is it&quot;.
        </Footnote>
      </div>
    </div>
  ),
}

/* ── Redemption ────────────────────────────────────────────────────────────── */

function Sheet({ children, w = 340 }: { children: ReactNode; w?: number }) {
  return (
    <div className="rounded-hero bg-card p-5 shadow-[var(--shadow-raised)]" style={{ width: w }}>
      {children}
    </div>
  )
}

export const Redemption: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionLabel>The confirm — before → after</SectionLabel>
        <Row>
          <Sheet>
            <div className="mb-3 grid h-20 place-items-center text-[44px] leading-none">🍿</div>
            <p className="text-heading mb-1 text-center">Pick the movie</p>
            <p className="text-sm-token mb-4 text-center text-muted-foreground">
              Friday night is yours.
            </p>
            <div className="mb-4 flex items-center justify-center gap-3">
              <Note value={24} size="lg" />
              <span className="text-muted-foreground">→</span>
              <Note value={9} size="lg" />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                Not yet
              </Button>
              <Button className="flex-1">Yes, get it</Button>
            </div>
          </Sheet>

          <Sheet>
            <div className="mb-3 grid h-20 place-items-center text-[44px] leading-none">🍦</div>
            <p className="text-heading mb-1 text-center">Ice cream run</p>
            <div className="mb-4 flex items-center justify-center gap-3">
              <Note value={12} size="lg" />
              <span className="text-muted-foreground">→</span>
              <span className="text-sm-token font-semibold text-error">not enough</span>
            </div>
            <p className="text-sm-token mb-4 text-center text-muted-foreground">
              13 more to go. That is about two weeks of jobs.
            </p>
            <Button variant="secondary" className="w-full">
              OK
            </Button>
          </Sheet>
        </Row>
        <Footnote>
          The cost is stated as <b>before → after</b>, not as a price tag. ADR 047&apos;s claim is
          that a kid can explain their balance — the confirm is where that starts.
        </Footnote>
      </div>

      <div>
        <SectionLabel>The three end states — they must not blur</SectionLabel>
        <Row>
          <Sheet w={280}>
            <div className="mb-3 grid h-16 place-items-center text-[40px] leading-none">🍿</div>
            <p className="text-heading mb-1 text-center">It&apos;s yours!</p>
            <p className="text-sm-token text-center text-muted-foreground">
              Pick the movie — enjoy it.
            </p>
            <p className="text-sm-token mt-4 text-center">
              <span className="text-muted-foreground">Wallet </span>
              <b>9 F$</b>
            </p>
          </Sheet>

          <Sheet w={280}>
            <div className="mb-3 grid h-16 place-items-center text-[40px] leading-none">🍦</div>
            <p className="text-heading mb-1 text-center">Asked for!</p>
            <p className="text-sm-token text-center text-muted-foreground">
              Mum has to say yes to this one. We&apos;ll tell you when she does.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge variant="secondary">
                <Lock size={11} className="mr-1" /> Waiting
              </Badge>
            </div>
            <p className="text-xs-body mt-3 text-center text-muted-foreground">
              Your 25 F$ is being held.
            </p>
          </Sheet>

          <Sheet w={280}>
            <div className="mb-3 grid h-16 place-items-center text-[40px] leading-none">🍦</div>
            <p className="text-heading mb-1 text-center">Not this time</p>
            <p className="text-sm-token text-center text-muted-foreground">
              &quot;We&apos;re out on Saturday — ask me Sunday.&quot;
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <Undo2 size={13} className="text-success" />
              <span className="text-sm-token font-semibold text-success">
                25 F$ back in your wallet
              </span>
            </div>
          </Sheet>
        </Row>
        <Footnote>
          Pending must <b>never look granted</b> — it is debited already, so the sheet says so. A
          decline is not an error state: the refund is the headline, and the parent&apos;s reason is
          quoted in their own words.
        </Footnote>
      </div>

      <div>
        <SectionLabel>History — the ledger a kid can read (ADR 047)</SectionLabel>
        <PageContainer width="list">
          <div className="space-y-2">
            {[
              { when: 'Today', what: 'Ice cream run — Mum said not this time', delta: 25 },
              { when: 'Today', what: 'Ice cream run', delta: -25 },
              { when: 'Saturday', what: 'Mow the lawn', delta: 5 },
              { when: 'Saturday', what: 'Pick the movie', delta: -15 },
              { when: 'Friday', what: 'Bonus from Dad — helped with the shopping', delta: 3 },
              { when: 'Thursday', what: 'Try-bite card finished', delta: 10 },
            ].map((e, i) => (
              <ItemCard key={i} align="center" chrome="card">
                <div className="min-w-0 flex-1">
                  <p className="text-sm-token truncate font-semibold">{e.what}</p>
                  <p className="text-xs-body text-muted-foreground">{e.when}</p>
                </div>
                <span
                  className={
                    e.delta > 0
                      ? 'text-card-title tabular-nums text-success'
                      : 'text-card-title tabular-nums text-muted-foreground'
                  }
                >
                  {e.delta > 0 ? '+' : ''}
                  {e.delta}
                </span>
              </ItemCard>
            ))}
          </div>
        </PageContainer>
        <Footnote>
          The refund is a <b>row</b>, not a disappearance — the debit above it stays. This is the
          append-only ledger made visible, and it is the answer to &quot;where did my 12 F$
          go&quot;.
        </Footnote>
      </div>
    </div>
  ),
}

/* ── Option A follow-through ───────────────────────────────────────────────── */
/* Chosen 2026-07-22: F$ takes the coin. Two questions fall out of that and neither
   is answered by the choice itself — what XP wears instead, and whether a gold coin
   survives beside a member assigned marigold (oklch(0.71 0.12 78) vs gold 0.74/0.13/80). */

function XpStarQuiet({ value }: { value: number }) {
  return (
    <span className="text-sm-token inline-flex items-center gap-1 font-semibold text-muted-foreground">
      <Star size={12} strokeWidth={2.5} />
      {value} XP
    </span>
  )
}

function XpStarOutline({ value }: { value: number }) {
  return (
    <span className="text-xs-token inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-muted-foreground">
      <Star size={11} strokeWidth={2.5} />
      {value} XP
    </span>
  )
}

function XpStarFilled({ value }: { value: number }) {
  return (
    <span className="text-xs-token inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
      <Star size={11} strokeWidth={2.5} fill="currentColor" />
      {value} XP
    </span>
  )
}

function Plate({
  value,
  unit,
  glyph,
  gold,
}: {
  value: string
  unit: string
  glyph: ReactNode
  gold: boolean
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full py-[7px] pr-[13px] pl-[10px]"
      style={{
        background: gold ? `linear-gradient(135deg, ${GOLD_HI}, ${GOLD_TINT})` : 'var(--secondary)',
        border: `1px solid ${gold ? GOLD : 'var(--border)'}`,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span
        className="grid size-6 shrink-0 place-items-center rounded-full"
        style={
          gold
            ? {
                background: `radial-gradient(circle at 32% 30%, ${GOLD_HI}, ${GOLD} 70%, ${GOLD_DEEP})`,
                color: GOLD_DEEP,
              }
            : { background: 'var(--muted)', color: 'var(--muted-foreground)' }
        }
      >
        {glyph}
      </span>
      <span
        className="text-metric leading-none"
        style={{ color: gold ? GOLD_INK : 'var(--foreground)' }}
      >
        {value}
      </span>
      <span
        className="text-xs-token font-bold tracking-[0.04em] opacity-70"
        style={{ color: gold ? GOLD_INK : 'var(--muted-foreground)' }}
      >
        {unit}
      </span>
    </span>
  )
}

export const XpDemotion: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionLabel>What XP wears once F$ takes the coin</SectionLabel>
        <Row>
          <div>
            <OptionLabel>A1 — quiet star, no chrome</OptionLabel>
            <ChoreRow
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinGold value={5} />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>A2 — outline chip</OptionLabel>
            <ChoreRow
              trailing={
                <>
                  <XpStarOutline value={25} />
                  <CoinGold value={5} />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>A3 — filled stone chip</OptionLabel>
            <ChoreRow
              trailing={
                <>
                  <XpStarFilled value={25} />
                  <CoinGold value={5} />
                </>
              }
            />
          </div>
        </Row>
        <Footnote>
          XP keeps its <b>pill shape</b> and loses its <b>metal</b> — it stays a score, and a score
          is a fact about you, not a thing you hold. Watch the balance of the pair: XP is the bigger
          number (25 vs 5) and must not out-shout the smaller one that actually buys something.
        </Footnote>
      </div>

      <div>
        <SectionLabel>The two plates — the chores page header</SectionLabel>
        <Row>
          <div>
            <OptionLabel>Wallet (gold, the coin)</OptionLabel>
            <Plate value="24" unit="F$" glyph={<Coins size={13} strokeWidth={2.5} />} gold />
          </div>
          <div>
            <OptionLabel>Score (stone, the star)</OptionLabel>
            <Plate
              value="1,240"
              unit="XP"
              glyph={<Star size={13} strokeWidth={2.5} />}
              gold={false}
            />
          </div>
        </Row>
        <Footnote>
          Side by side the hierarchy inverts correctly: the <b>smaller</b> number is the one that
          glitters. Check this at arm&apos;s length — the lifetime XP total will always be the
          bigger figure and the ladder has to hold anyway.
        </Footnote>
      </div>

      <div>
        <SectionLabel>Collision check — a gold coin beside a member assigned marigold</SectionLabel>
        <Row>
          <div>
            <OptionLabel>Marigold member</OptionLabel>
            <ChoreRow
              spineHue="marigold"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinGold value={5} />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>Teal member (control)</OptionLabel>
            <ChoreRow
              spineHue="teal"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinGold value={5} />
                </>
              }
            />
          </div>
        </Row>
        <div className="mt-4 flex items-center gap-4">
          <span
            className="inline-block h-8 w-1 rounded-full"
            style={{ background: 'var(--identity-marigold)' }}
          />
          <span className="text-sm-token text-muted-foreground">
            marigold spine oklch(0.71 0.12 78)
          </span>
          <CoinGold value={5} />
          <span className="text-sm-token text-muted-foreground">coin gold oklch(0.74 0.13 80)</span>
        </div>
        <Footnote>
          Same hue, two meanings — <b>whose</b> row it is, and <b>how much</b> it pays. The
          separation has to come from the second channel, not the colour: the coin is a{' '}
          <b>disc with a radial gradient, a ring and a glyph</b>; a spine is a flat 4px bar. If that
          is not enough at arm&apos;s length, the answer is to deepen the coin&apos;s gold, not to
          retire marigold — ADR 044 paid for the eighth hue and it is the household cap.
        </Footnote>
      </div>
    </div>
  ),
}

/* ── The coin, made shiny ──────────────────────────────────────────────────── */
/* Gold moves off marigold's hue (78) toward brass (90) and gains chroma, so the two
   are no longer the same colour with different jobs. The rest of the separation is
   FORM — a coin is struck metal: a bevelled rim, a specular gloss, relief. None of it
   is available to a flat 4px spine, which is the point (ADR 044's second channel). */

const COIN_HI = 'oklch(0.95 0.09 96)'
const COIN = 'oklch(0.79 0.155 90)'
const COIN_DEEP = 'oklch(0.55 0.125 74)'
const COIN_TINT = 'oklch(0.96 0.05 95)'
const COIN_INK = 'oklch(0.44 0.105 78)'

/* Milling was tried and rejected on sight — hard radial notches read as a GEAR, and a
   gear is machinery, not money. What is left is polish: a bevelled rim, a swept
   highlight, and relief on the face. */
type Shine = 'flat' | 'gloss' | 'rim' | 'relief'

/* ONE disc, not a disc inside a ring. The rim is drawn as the outer sliver of the same
   circle via a masked overlay — nesting a smaller element inside a ring left a pale
   step between them, and a gap turns a coin into a washer. */
function Coin({
  size = 18,
  shine = 'relief',
  face = 'glyph',
}: {
  size?: number
  shine?: Shine
  face?: 'glyph' | 'mark'
}) {
  const rimWidth = Math.max(1.5, size * 0.09)
  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${rimWidth}px), #000 calc(100% - ${rimWidth}px))`
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 34% 28%, ${COIN_HI}, ${COIN} 58%, ${COIN_DEEP} 104%)`,
        color: COIN_DEEP,
        boxShadow:
          shine === 'flat'
            ? undefined
            : [
                `inset 0 ${Math.max(1, size / 20)}px 0 rgba(255,255,255,0.55)`,
                `inset 0 -${Math.max(1, size / 16)}px ${size / 8}px rgba(0,0,0,0.2)`,
                `0 1px 2px rgba(0,0,0,0.2)`,
              ].join(', '),
      }}
    >
      {(shine === 'rim' || shine === 'relief') && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 200deg, ${COIN_DEEP}, ${COIN_HI} 22%, ${COIN} 46%, ${COIN_DEEP} 66%, ${COIN_HI} 88%, ${COIN_DEEP})`,
            maskImage: ringMask,
            WebkitMaskImage: ringMask,
          }}
        />
      )}
      {shine === 'relief' && (
        <span
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: rimWidth,
            boxShadow: `inset 0 0 0 ${Math.max(1, size / 26)}px rgba(255,255,255,0.3), inset 0 ${Math.max(1, size / 30)}px ${size / 12}px rgba(255,255,255,0.25)`,
          }}
        />
      )}
      {face === 'glyph' ? (
        <Coins size={Math.round(size * 0.48)} strokeWidth={2.5} className="relative" />
      ) : (
        /* A coin depicting coins is a hall of mirrors at size — the face carries the
           denomination, struck in relief, the way real currency does. */
        <span
          className="relative font-bold"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: Math.round(size * 0.42),
            letterSpacing: '-0.03em',
            color: COIN_DEEP,
            textShadow: `0 ${Math.max(1, size / 60)}px 0 rgba(255,255,255,0.5)`,
          }}
        >
          F$
        </span>
      )}
      {shine !== 'flat' && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(122deg, rgba(255,255,255,0.75) 0 14%, rgba(255,255,255,0.1) 32%, rgba(255,255,255,0) 50%)`,
          }}
        />
      )}
    </span>
  )
}

function CoinValue({ value, shine = 'relief' }: { value: number; shine?: Shine }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1"
      style={{ background: COIN_TINT, border: `1px solid ${COIN}` }}
    >
      <Coin size={18} shine={shine} />
      <span className="text-sm-token font-bold" style={{ color: COIN_INK }}>
        {value} F$
      </span>
    </span>
  )
}

export const CoinShine: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionLabel>Polish, not machining — each beside the marigold spine</SectionLabel>
        <Row>
          <div>
            <OptionLabel>S1 — flat (what we had)</OptionLabel>
            <ChoreRow
              spineHue="marigold"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinValue value={5} shine="flat" />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>S2 — specular gloss only</OptionLabel>
            <ChoreRow
              spineHue="marigold"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinValue value={5} shine="gloss" />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>S3 — gloss + swept rim</OptionLabel>
            <ChoreRow
              spineHue="marigold"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinValue value={5} shine="rim" />
                </>
              }
            />
          </div>
          <div>
            <OptionLabel>S4 — swept rim + raised relief</OptionLabel>
            <ChoreRow
              spineHue="marigold"
              trailing={
                <>
                  <XpStarQuiet value={25} />
                  <CoinValue value={5} shine="relief" />
                </>
              }
            />
          </div>
        </Row>
        <Footnote>
          Milling is gone — hard radial notches read as a <b>gear</b>, and a gear is machinery, not
          money. The rim is now a <b>smooth metallic sweep</b> (light caught around a polished
          edge), and S4 adds a raised inner ring on the face — coin relief. Gold has also moved from
          hue <b>78</b> (marigold&apos;s) to <b>90</b>, brassier and higher in chroma, so the coin
          is no longer the member&apos;s colour doing a second job.
        </Footnote>
      </div>

      <div>
        <SectionLabel>At size — row, plate, and the redemption moment</SectionLabel>
        <div className="flex flex-wrap items-center gap-8">
          <Coin size={18} />
          <Coin size={26} />
          <Coin size={44} />
          <Coin size={72} />
          <span className="text-xs-body text-muted-foreground">rejected — denomination face →</span>
          <Coin size={18} face="mark" />
          <Coin size={44} face="mark" />
          <Coin size={72} face="mark" />
          <span
            className="inline-flex items-center gap-2 rounded-full py-[7px] pr-[13px] pl-[10px]"
            style={{
              background: `linear-gradient(135deg, ${COIN_HI}, ${COIN_TINT})`,
              border: `1px solid ${COIN}`,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Coin size={24} />
            <span className="text-metric leading-none" style={{ color: COIN_INK }}>
              24
            </span>
            <span
              className="text-xs-token font-bold tracking-[0.04em] opacity-70"
              style={{ color: COIN_INK }}
            >
              F$
            </span>
          </span>
        </div>
        <Footnote>
          The milling reads as texture at 18px and as a real edge at 44px+. Check the smallest one
          first — if the reeding turns to mud in a row, it should be dropped below ~22px and kept
          for the plate and the confirm sheet.
        </Footnote>
      </div>

      <div>
        <SectionLabel>In place — the store tile and the confirm</SectionLabel>
        <Row>
          <div className="rounded-card w-[190px] border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="mb-2 grid h-16 place-items-center text-[34px] leading-none">🍿</div>
            <p className="text-sm-token mb-0.5 font-semibold">Pick the movie</p>
            <div className="mb-2.5">
              <CoinValue value={15} />
            </div>
            <Button size="sm" className="w-full">
              Get it
            </Button>
          </div>
          <div
            className="rounded-hero bg-card p-5 text-center shadow-[var(--shadow-raised)]"
            style={{ width: 300 }}
          >
            <div className="mb-3 grid h-20 place-items-center">
              <Coin size={64} />
            </div>
            <p className="text-heading mb-1">It&apos;s yours!</p>
            <p className="text-sm-token text-muted-foreground">Pick the movie — enjoy it.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm-token text-muted-foreground">Wallet</span>
              <CoinValue value={9} />
            </div>
          </div>
        </Row>
      </div>
    </div>
  ),
}
