/**
 * Design gate playground — DO NOT ship.
 * Three frames + integrated home-surface context views.
 * Delete once a frame is approved and production Storybook stories replace this.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Rss, CheckSquare, CalendarDays } from 'lucide-react'
import { ProfileAvatar, WidgetGrid } from '@family-os/ui'
import type { WidgetLayoutItem } from '@family-os/ui'

// ─── Mock data ────────────────────────────────────────────────────────────────

const POSTS = [
  {
    id: '1',
    body: 'Emma finished her science fair project — a light-up bioluminescent fungi diorama she built completely from scratch.',
    createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    author: { id: 'a', name: 'Sarah' },
  },
  {
    id: '2',
    body: 'Pizza night tonight! Grabbing dough on the way home — vote on toppings in the group chat.',
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    author: { id: 'b', name: 'Dad' },
  },
  {
    id: '3',
    body: 'Won my soccer game 3–1. I scored the first goal.',
    createdAt: new Date(Date.now() - 28 * 3600_000).toISOString(),
    author: { id: 'c', name: 'Jake' },
  },
]

function relativeTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Slot helper (253px col, 16px gap, 180px row — from design-system.md) ────

const COL = 253
const GAP = 16
const ROW = 180
const slotW = (w: number) => w * COL + (w - 1) * GAP
const slotH = (h: number) => h * ROW + (h - 1) * GAP

// Simulates WidgetSlot: bg-secondary border rounded-xl overflow-hidden
function Slot({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: slotW(w),
        height: slotH(h),
        background: 'var(--secondary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}

// ─── Empty state — design-system.md: 36px icon, opacity 0.4, text-display-lg heading, text-body body ──

function FeedEmptyState() {
  return (
    <div
      style={{
        height: '100%',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '20px 24px',
        textAlign: 'center',
      }}
    >
      <Rss size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} strokeWidth={1.5} />
      <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
        No posts yet
      </h2>
      <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
        Be the first to share something.
      </p>
    </div>
  )
}

// ─── Story chrome ─────────────────────────────────────────────────────────────

function SizeLabel({ label }: { label: string }) {
  return (
    <p className="text-section-label" style={{ color: 'var(--muted-foreground)', marginBottom: 8 }}>
      {label}
    </p>
  )
}

function FrameLabel({ letter, tagline }: { letter: string; tagline: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
      <span className="text-display-lg" style={{ color: 'var(--primary)' }}>
        {letter}
      </span>
      <span className="text-base-token" style={{ color: 'var(--muted-foreground)' }}>
        {tagline}
      </span>
    </div>
  )
}

// ─── Post row — shared across all frames ──────────────────────────────────────

function PostRow({ post, lineClamp = 3 }: { post: (typeof POSTS)[0]; lineClamp?: number }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ProfileAvatar name={post.author.name} size="sm" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            className="text-card-title"
            style={{
              color: 'var(--foreground)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {post.author.name}
          </span>
          <span
            className="text-sm-token"
            style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}
          >
            {relativeTime(post.createdAt)}
          </span>
        </div>
        <p
          className="text-body"
          style={{
            color: 'var(--foreground)',
            margin: '4px 0 0',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: lineClamp,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.body}
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL FRAMES fill with --background.
//
// WidgetSlot sits on --secondary. PlaceholderCard sits on --muted.
// --secondary ≈ --muted visually. A widget that keeps --secondary reads as
// another placeholder. --background creates a "live content" surface that
// lifts off the grid.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Frame A — Dividers ───────────────────────────────────────────────────────
// Post separation through 1px --border lines. Structural, lightweight.

function FrameA_Single({ post }: { post: (typeof POSTS)[0] }) {
  return (
    <div
      style={{
        background: 'var(--background)',
        height: '100%',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <PostRow post={post} lineClamp={3} />
    </div>
  )
}

function FrameA_Multi() {
  return (
    <div
      style={{
        background: 'var(--background)',
        height: '100%',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {POSTS.map((post, i) => (
        <div key={post.id}>
          <PostRow post={post} lineClamp={2} />
          {i < POSTS.length - 1 && (
            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Frame B — Breathing room ─────────────────────────────────────────────────
// Post separation through whitespace only. Posts feel independent.

function FrameB_Single({ post }: { post: (typeof POSTS)[0] }) {
  return (
    <div
      style={{
        background: 'var(--background)',
        height: '100%',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <PostRow post={post} lineClamp={3} />
    </div>
  )
}

function FrameB_Multi() {
  return (
    <div
      style={{
        background: 'var(--background)',
        height: '100%',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {POSTS.map((post) => (
        <PostRow key={post.id} post={post} lineClamp={2} />
      ))}
    </div>
  )
}

// ─── Frame C — Anchored strip ─────────────────────────────────────────────────
// Single 3px --primary left border on the whole widget.
// Brand anchor. Posts separated by whitespace; the strip does structural work.

function FrameC_Single({ post }: { post: (typeof POSTS)[0] }) {
  return (
    <div
      style={{
        background: 'var(--background)',
        borderLeft: '3px solid var(--primary)',
        height: '100%',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <PostRow post={post} lineClamp={3} />
    </div>
  )
}

function FrameC_Multi() {
  return (
    <div
      style={{
        background: 'var(--background)',
        borderLeft: '3px solid var(--primary)',
        height: '100%',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {POSTS.map((post) => (
        <PostRow key={post.id} post={post} lineClamp={2} />
      ))}
    </div>
  )
}

// ─── Feed page ────────────────────────────────────────────────────────────────

function FeedPage() {
  return (
    <div
      style={{
        width: slotW(4),
        minHeight: 420,
        background: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '28px 36px',
      }}
    >
      <h1 className="text-page-title" style={{ color: 'var(--foreground)', marginBottom: 28 }}>
        Family Feed
      </h1>
      {POSTS.map((post, i) => (
        <div key={post.id}>
          <PostRow post={post} lineClamp={10} />
          {i < POSTS.length - 1 && (
            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Mock context widgets ─────────────────────────────────────────────────────

const CHORES = [
  { id: '1', label: 'Set the table', done: true, who: 'Jake' },
  { id: '2', label: 'Take out trash', done: false, who: 'Emma' },
  { id: '3', label: 'Feed the dog', done: false, who: 'Jake' },
  { id: '4', label: 'Vacuum living room', done: false, who: 'Emma' },
]

const EVENTS = [
  { id: '1', time: '3:30 PM', label: 'Soccer practice', who: 'Jake' },
  { id: '2', time: '6:00 PM', label: 'Family dinner', who: '' },
  { id: '3', time: '7:30 PM', label: 'Reading time', who: 'Emma' },
]

function ChoresWidget({ large = false }: { large?: boolean }) {
  const items = large ? CHORES : CHORES.slice(0, 2)
  const done = CHORES.filter((c) => c.done).length
  return (
    <div
      style={{
        padding: '16px 18px',
        height: '100%',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckSquare size={15} color="var(--primary)" />
          <span className="text-card-title" style={{ color: 'var(--foreground)' }}>
            Today's Chores
          </span>
        </div>
        <span className="text-sm-token" style={{ color: 'var(--muted-foreground)' }}>
          {done}/{CHORES.length}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
          justifyContent: 'space-evenly',
        }}
      >
        {items.map((chore) => (
          <div key={chore.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                flexShrink: 0,
                border: chore.done ? 'none' : '1.5px solid var(--border)',
                background: chore.done ? 'var(--primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {chore.done && (
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                  <path
                    d="M1 4L4 7L10 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-body"
              style={{
                flex: 1,
                color: chore.done ? 'var(--muted-foreground)' : 'var(--foreground)',
                textDecoration: chore.done ? 'line-through' : 'none',
              }}
            >
              {chore.label}
            </span>
            <span className="text-sm-token" style={{ color: 'var(--muted-foreground)' }}>
              {chore.who}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarWidget({ large = false }: { large?: boolean }) {
  const events = large ? EVENTS : EVENTS.slice(0, 2)
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
  return (
    <div
      style={{
        padding: '16px 18px',
        height: '100%',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CalendarDays size={15} color="var(--accent)" />
        <span className="text-card-title" style={{ color: 'var(--foreground)' }}>
          {today}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
          justifyContent: 'space-evenly',
        }}
      >
        {events.map((event) => (
          <div key={event.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span
              className="text-sm-token"
              style={{
                color: 'var(--muted-foreground)',
                flexShrink: 0,
                minWidth: 52,
                paddingTop: 2,
              }}
            >
              {event.time}
            </span>
            <div
              style={{
                width: 2,
                borderRadius: 1,
                background: 'var(--accent)',
                alignSelf: 'stretch',
                flexShrink: 0,
                minHeight: 18,
              }}
            />
            <div>
              <span className="text-body" style={{ color: 'var(--foreground)' }}>
                {event.label}
              </span>
              {event.who && (
                <span
                  className="text-sm-token"
                  style={{ color: 'var(--muted-foreground)', display: 'block' }}
                >
                  {event.who}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Home surface (ADR 028 default layouts) ───────────────────────────────────

type FeedVariant = 'A' | 'B' | 'C'

const LAYOUTS = {
  familyProfile: [
    { widgetId: 'family-feed.feed', x: 0, y: 0, w: 4, h: 1 },
    { widgetId: 'chores.today-summary', x: 0, y: 1, w: 2, h: 1 },
    { widgetId: 'calendar.today', x: 2, y: 1, w: 2, h: 1 },
  ],
  tiers12: [
    { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'calendar.today', x: 2, y: 1, w: 2, h: 1 },
  ],
  tiers34: [
    { widgetId: 'calendar.today', x: 0, y: 0, w: 2, h: 2 },
    { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
    { widgetId: 'chores.today-summary', x: 2, y: 1, w: 2, h: 1 },
  ],
} satisfies Record<string, WidgetLayoutItem[]>

function feedWidget(variant: FeedVariant, slot: WidgetLayoutItem) {
  const post = POSTS[0]
  if (slot.h >= 2) {
    if (variant === 'A') return <FrameA_Multi />
    if (variant === 'B') return <FrameB_Multi />
    return <FrameC_Multi />
  }
  if (variant === 'A') return <FrameA_Single post={post} />
  if (variant === 'B') return <FrameB_Single post={post} />
  return <FrameC_Single post={post} />
}

function HomeSurface({ variant, layout }: { variant: FeedVariant; layout: WidgetLayoutItem[] }) {
  const feedSlot = layout.find((i) => i.widgetId === 'family-feed.feed')!
  const choresSlot = layout.find((i) => i.widgetId === 'chores.today-summary')!
  const calSlot = layout.find((i) => i.widgetId === 'calendar.today')!
  return (
    <WidgetGrid
      layout={layout}
      children={{
        'family-feed.feed': feedWidget(variant, feedSlot),
        'chores.today-summary': <ChoresWidget large={choresSlot.h >= 2} />,
        'calendar.today': <CalendarWidget large={calSlot.h >= 2} />,
      }}
    />
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Family Feed/Widget — Playground',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          background: 'var(--background)',
          padding: 32,
          minHeight: '100vh',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

// ─── Per-frame detail stories ─────────────────────────────────────────────────

export const FrameA: Story = {
  name: '1A · Frame A — Dividers',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FrameLabel letter="A" tagline="--background fill · 1px --border dividers between posts" />
      <SizeLabel label="Standard (2×1)" />
      <Slot w={2} h={1}>
        <FrameA_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Banner (4×1)" />
      <Slot w={4} h={1}>
        <FrameA_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Large (2×2)" />
      <Slot w={2} h={2}>
        <FrameA_Multi />
      </Slot>
      <SizeLabel label="Empty state" />
      <Slot w={2} h={1}>
        <FeedEmptyState />
      </Slot>
      <SizeLabel label="Feed page" />
      <FeedPage />
    </div>
  ),
}

export const FrameB: Story = {
  name: '1B · Frame B — Breathing room',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FrameLabel letter="B" tagline="--background fill · whitespace only between posts" />
      <SizeLabel label="Standard (2×1)" />
      <Slot w={2} h={1}>
        <FrameB_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Banner (4×1)" />
      <Slot w={4} h={1}>
        <FrameB_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Large (2×2)" />
      <Slot w={2} h={2}>
        <FrameB_Multi />
      </Slot>
      <SizeLabel label="Empty state" />
      <Slot w={2} h={1}>
        <FeedEmptyState />
      </Slot>
      <SizeLabel label="Feed page" />
      <FeedPage />
    </div>
  ),
}

export const FrameC: Story = {
  name: '1C · Frame C — Anchored strip',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FrameLabel
        letter="C"
        tagline="--background fill · 3px --primary left edge · whitespace between posts"
      />
      <SizeLabel label="Standard (2×1)" />
      <Slot w={2} h={1}>
        <FrameC_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Banner (4×1)" />
      <Slot w={4} h={1}>
        <FrameC_Single post={POSTS[0]} />
      </Slot>
      <SizeLabel label="Large (2×2)" />
      <Slot w={2} h={2}>
        <FrameC_Multi />
      </Slot>
      <SizeLabel label="Empty state" />
      <Slot w={2} h={1}>
        <FeedEmptyState />
      </Slot>
      <SizeLabel label="Feed page" />
      <FeedPage />
    </div>
  ),
}

// ─── In-context home surface layouts ─────────────────────────────────────────

export const InContext_FamilyProfile: Story = {
  name: '2 · In context — Family pseudo-profile (banner)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      {(['A', 'B', 'C'] as FeedVariant[]).map((v, i) => (
        <div key={v}>
          <SizeLabel label={`Frame ${v}`} />
          <HomeSurface variant={v} layout={LAYOUTS.familyProfile} />
          {i < 2 && <div style={{ height: 1, background: 'var(--border)', marginTop: 40 }} />}
        </div>
      ))}
    </div>
  ),
}

export const InContext_Tiers12: Story = {
  name: '3 · In context — Tiers 1–2 (chores-first)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      {(['A', 'B', 'C'] as FeedVariant[]).map((v, i) => (
        <div key={v}>
          <SizeLabel label={`Frame ${v}`} />
          <HomeSurface variant={v} layout={LAYOUTS.tiers12} />
          {i < 2 && <div style={{ height: 1, background: 'var(--border)', marginTop: 40 }} />}
        </div>
      ))}
    </div>
  ),
}

export const InContext_Tiers34: Story = {
  name: '4 · In context — Tiers 3–4 (calendar-first)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      {(['A', 'B', 'C'] as FeedVariant[]).map((v, i) => (
        <div key={v}>
          <SizeLabel label={`Frame ${v}`} />
          <HomeSurface variant={v} layout={LAYOUTS.tiers34} />
          {i < 2 && <div style={{ height: 1, background: 'var(--border)', marginTop: 40 }} />}
        </div>
      ))}
    </div>
  ),
}
