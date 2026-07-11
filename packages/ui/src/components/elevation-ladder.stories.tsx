import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { CalendarDays, CheckSquare, MessagesSquare } from 'lucide-react'
import { WidgetSlot, type WidgetProminence } from './widget-slot'
import { WidgetHeader } from './widget-header'
import { Spine } from './spine'

/* Home-surface elevation ladder (design-system.md §Widget prominence).
   A playground for the three prominence rungs and how they compose per profile.
   Content here is representative — the real widgets are federated plugins; this
   validates the rung CHROME + composition against real tokens. */

const meta: Meta = {
  title: 'Home Surface/Elevation Ladder',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 28, minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj

const GAP = 16
const ROW_H = 210
const COL_W = 244
function slot(w: number, h: number) {
  return { width: w * COL_W + (w - 1) * GAP, height: h * ROW_H + (h - 1) * GAP }
}

// ─── representative widget content (real tokens / primitives) ────────────────

function CalendarHero({ serif = true }: { serif?: boolean }) {
  return (
    <div className="rounded-hero p-4" style={{ background: 'var(--identity-sage-tint)' }}>
      <div className="flex items-center gap-1.5 text-section-label text-foreground/60">
        <span className="size-2 rounded-full" style={{ background: 'var(--identity-sage)' }} />
        <span>Up next</span>
        <span className="text-foreground/80">· in 2 hr</span>
      </div>
      <div
        className={`${serif ? 'text-page-title' : 'text-heading'} mt-2 truncate text-foreground`}
      >
        Vision Therapy
      </div>
      {/* No clock icon; time as plain text, owner in an identity pill (ring-defined
          so it reads against the same-hue wash). */}
      <div className="mt-1.5 flex items-center gap-2 text-sm-token text-foreground/75">
        <span className="tabular-nums">4:45 PM</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs-token font-semibold"
          style={{
            background: 'var(--identity-sage-tint)',
            color: 'var(--identity-sage-ink)',
            boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--identity-sage) 32%, transparent)',
          }}
        >
          Teddy
        </span>
      </div>
    </div>
  )
}

function AgendaRow({
  time,
  title,
  owner,
  hue,
}: {
  time: string
  title: string
  owner?: string
  hue: string
}) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <Spine color={hue} />
      <span className="text-sm-token w-16 shrink-0 tabular-nums text-muted-foreground">{time}</span>
      <span className="text-sm-token min-w-0 flex-1 truncate text-foreground">{title}</span>
      {owner && <span className="text-xs-token shrink-0 text-muted-foreground">{owner}</span>}
    </div>
  )
}

function CalendarWidget({ feature, serifHero }: { feature?: boolean; serifHero?: boolean }) {
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader icon={CalendarDays} label="Calendar" />
      <div className="mt-3">
        <CalendarHero serif={serifHero ?? false} />
      </div>
      {/* No divider between hero and agenda — spacing carries the separation
          ("depth, not lines"). Day groups are set apart by space, not rules. */}
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <div className="text-base-token font-semibold text-foreground">
            Tomorrow <span className="text-sm-token font-normal text-muted-foreground">Jul 11</span>
          </div>
          <AgendaRow
            time="All day"
            title="West Seattle Summer Fest"
            owner="Family"
            hue="var(--muted-foreground)"
          />
        </div>
        <div>
          <div className="text-base-token font-semibold text-foreground">
            Sunday <span className="text-sm-token font-normal text-muted-foreground">Jul 12</span>
          </div>
          <AgendaRow time="11:00 AM" title="T&T" owner="Zoë" hue="var(--identity-sky)" />
        </div>
        {feature && (
          <div>
            <div className="text-base-token font-semibold text-foreground">
              Monday <span className="text-sm-token font-normal text-muted-foreground">Jul 13</span>
            </div>
            <AgendaRow
              time="All day"
              title="FISW Camp"
              owner="Zoë & Teddy"
              hue="var(--identity-sage)"
            />
            <div className="mt-2 text-sm-token text-muted-foreground">+42 more</div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChoresWidget({ feature }: { feature?: boolean }) {
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader
        icon={CheckSquare}
        label="Chores"
        trailing={
          feature ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs-token font-bold"
              style={{
                background: 'var(--identity-marigold-tint)',
                color: 'var(--identity-marigold-ink)',
                borderColor: 'color-mix(in oklch, var(--identity-marigold) 45%, transparent)',
              }}
            >
              <span
                className="size-3 rounded-full"
                style={{ background: 'var(--identity-marigold)' }}
              />
              240 XP
            </span>
          ) : (
            <span className="text-xs-token text-muted-foreground">3 of 6 done</span>
          )
        }
      />
      <div className="mt-3">
        {/* Count anchors the widget → always text-metric (the real HeroCount),
            regardless of rung. Elevation, not the numeral, marks prominence. */}
        <div className="text-metric text-foreground">3</div>
        <div className="text-sm-token text-muted-foreground">
          {feature ? 'to do today · earn +30 XP' : 'pending today'}
        </div>
      </div>
      <div className="mt-3 h-meter overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-success" style={{ width: '50%' }} />
      </div>
      {feature ? (
        <div className="mt-3 flex flex-col gap-2">
          <TaskRow title="Feed the cat" xp="+10 XP" />
          <TaskRow title="Make your bed" xp="+5 XP" />
          <TaskRow title="Homework" xp="+15 XP" />
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <PersonRow name="Zoë" hue="sky" status="3 left" />
          <PersonRow name="Teddy" hue="sage" status="✓ all done" done />
        </div>
      )}
    </div>
  )
}

function TaskRow({ title, xp }: { title: string; xp: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-panel bg-muted/70 px-3 py-2.5">
      <Spine color="var(--border)" />
      <span className="text-sm-token flex-1 text-foreground">{title}</span>
      <span
        className="rounded-full px-2 py-0.5 text-xs-token font-bold"
        style={{
          background: 'var(--identity-marigold-tint)',
          color: 'var(--identity-marigold-ink)',
        }}
      >
        {xp}
      </span>
    </div>
  )
}

function PersonRow({
  name,
  hue,
  status,
  done,
}: {
  name: string
  hue: string
  status: string
  done?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-panel bg-muted/70 px-3 py-2">
      <span
        className="grid size-6 place-items-center rounded-full text-xs-token font-bold"
        style={{
          background: `var(--identity-${hue}-tint)`,
          color: `var(--identity-${hue}-ink)`,
        }}
      >
        {name[0]}
      </span>
      <span className="text-sm-token flex-1 text-foreground">{name}</span>
      <span
        className={`text-sm-token ${done ? 'font-semibold text-success' : 'text-muted-foreground'}`}
      >
        {status}
      </span>
    </div>
  )
}

function FeedPost({
  name,
  hue,
  ago,
  body,
  big,
}: {
  name: string
  hue: string
  ago: string
  body: string
  big?: boolean
}) {
  return (
    <div className="flex gap-3">
      <span
        className={`grid ${big ? 'size-9' : 'size-8'} shrink-0 place-items-center rounded-full text-sm-token font-bold`}
        style={{ background: `var(--identity-${hue}-tint)`, color: `var(--identity-${hue}-ink)` }}
      >
        {name[0]}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`${big ? 'text-heading' : 'text-card-title'} text-foreground`}>
            {name}
          </span>
          <span className="text-xs-token text-muted-foreground">{ago}</span>
        </div>
        {/* Family voice stays Lora either way. Roomy banner → text-prose (18px);
            dense widget rows → text-prose-sm (15px). */}
        <p className={`${big ? 'text-prose' : 'text-prose-sm'} mt-0.5 text-foreground`}>{body}</p>
      </div>
    </div>
  )
}

function FeedWidget({ banner }: { banner?: boolean }) {
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader icon={MessagesSquare} label="Family Feed" />
      <div className={`mt-3 flex flex-col ${banner ? 'gap-4' : 'gap-3'}`}>
        <FeedPost
          name="Zach"
          hue="terracotta"
          ago="19m ago"
          body="Just launched the new calendar plugin with month, week and day views!"
          big={banner}
        />
        <div className="h-px bg-border/70" />
        <FeedPost
          name="Zoë"
          hue="sky"
          ago="21d ago"
          body="French toast for breakfast today"
          big={banner}
        />
      </div>
    </div>
  )
}

// ─── framing shell ───────────────────────────────────────────────────────────

function Rail({ name, hue }: { name: string; hue: string }) {
  const Item = ({ label, sel }: { label: string; sel?: boolean }) => (
    <div
      className={`rounded-md px-3 py-2 text-sm ${sel ? 'text-primary font-medium' : 'text-muted-foreground'}`}
      style={
        sel ? { background: 'color-mix(in oklch, var(--primary) 20%, transparent)' } : undefined
      }
    >
      {label}
    </div>
  )
  return (
    <div className="flex w-36 shrink-0 flex-col gap-1">
      <div className="mb-3 flex items-center gap-2 px-2 py-1">
        <span
          className="grid size-7 place-items-center rounded-full text-xs-token font-bold"
          style={{ background: `var(--identity-${hue}-tint)`, color: `var(--identity-${hue}-ink)` }}
        >
          {name[0]}
        </span>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <Item label="Home" sel />
      <Item label="Family Feed" />
      <Item label="Chores" />
      <Item label="Calendar" />
    </div>
  )
}

function Cell({
  prominence,
  w,
  h,
  children,
}: {
  prominence: WidgetProminence
  w: number
  h: number
  children: ReactNode
}) {
  return (
    <div style={slot(w, h)}>
      <WidgetSlot prominence={prominence}>{children}</WidgetSlot>
    </div>
  )
}

function Framing({
  title,
  tier,
  logic,
  rail,
  children,
}: {
  title: string
  tier: string
  logic: string
  rail: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="mb-1 flex items-baseline gap-3">
        <h2 className="text-page-title text-foreground">{title}</h2>
        <span className="text-xs-token rounded-full border border-border px-2 py-0.5 text-muted-foreground">
          {tier}
        </span>
      </div>
      <p className="mb-4 text-sm-token text-muted-foreground" style={{ maxWidth: '68ch' }}>
        {logic}
      </p>
      <div className="flex gap-6">
        {rail}
        <div>{children}</div>
      </div>
    </section>
  )
}

// ─── stories ─────────────────────────────────────────────────────────────────

export const Rungs: Story = {
  name: 'The three rungs',
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['feature', 'card', 'quiet'] as const).map((rung) => (
        <div key={rung}>
          <div className="mb-2 text-xs-token font-semibold uppercase tracking-wide text-muted-foreground">
            {rung}
          </div>
          <Cell prominence={rung} w={2} h={2}>
            <CalendarWidget feature={rung === 'feature'} />
          </Cell>
        </div>
      ))}
    </div>
  ),
}

export const HeroTypeface: Story = {
  name: 'Feature hero — Lora vs DM Sans',
  render: () => (
    <div className="flex flex-wrap gap-8">
      <div>
        <div className="mb-2 text-xs-token font-semibold uppercase tracking-wide text-muted-foreground">
          Lora · text-page-title (current)
        </div>
        <Cell prominence="feature" w={2} h={2}>
          <CalendarWidget feature serifHero />
        </Cell>
      </div>
      <div>
        <div className="mb-2 text-xs-token font-semibold uppercase tracking-wide text-muted-foreground">
          DM Sans · text-heading
        </div>
        <Cell prominence="feature" w={2} h={2}>
          <CalendarWidget feature serifHero={false} />
        </Cell>
      </div>
    </div>
  ),
}

export const ParentView: Story = {
  name: 'Parent — Calendar features',
  render: () => (
    <Framing
      title="Parent view"
      tier="Tier 3–4 · Zach"
      logic="Calendar features (raised hero); chores rests; the feed recedes to a glance."
      rail={<Rail name="Zach" hue="terracotta" />}
    >
      <div className="flex gap-4">
        <Cell prominence="feature" w={2} h={2}>
          <CalendarWidget feature />
        </Cell>
        <div className="flex flex-col gap-4">
          <Cell prominence="card" w={2} h={1}>
            <ChoresWidget />
          </Cell>
          <Cell prominence="quiet" w={2} h={1}>
            <FeedWidget />
          </Cell>
        </div>
      </div>
    </Framing>
  ),
}

export const KidView: Story = {
  name: 'Kid — Chores features',
  render: () => (
    <Framing
      title="Kid view"
      tier="Tier 1–2 · Zoë"
      logic="Chores features (big count + XP); the calendar rests; the feed recedes. Same ladder, different rung assignment."
      rail={<Rail name="Zoë" hue="sky" />}
    >
      <div className="flex gap-4">
        <Cell prominence="feature" w={2} h={2}>
          <ChoresWidget feature />
        </Cell>
        <div className="flex flex-col gap-4">
          <Cell prominence="card" w={2} h={1}>
            <CalendarWidget />
          </Cell>
          <Cell prominence="quiet" w={2} h={1}>
            <FeedWidget />
          </Cell>
        </div>
      </div>
    </Framing>
  ),
}

export const FamilyView: Story = {
  name: 'Family — Feed banner features',
  render: () => (
    <Framing
      title="Family wall"
      tier="Pseudo-profile · unattended"
      logic="The feed features as a full-width banner — read across a room. Chores and calendar rest as equal peers beneath."
      rail={<Rail name="Family" hue="terracotta" />}
    >
      <div className="flex flex-col gap-4">
        <Cell prominence="feature" w={4} h={1}>
          <FeedWidget banner />
        </Cell>
        <div className="flex gap-4">
          <Cell prominence="card" w={2} h={1}>
            <ChoresWidget />
          </Cell>
          <Cell prominence="card" w={2} h={1}>
            <CalendarWidget />
          </Cell>
        </div>
      </div>
    </Framing>
  ),
}
