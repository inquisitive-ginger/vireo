import { useMemo, type ReactNode } from 'react'
import { HandPlatter, ShoppingCart, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  FAMILY_HUE,
  ProfileAvatar,
  WIDGET_CQ,
  WIDGET_INSET,
  WidgetHeader,
  cn,
  identityToken,
  resolveHue,
  useFitRows,
} from '@family-os/ui'
import type { MealMember, PlannedMeal, WidgetSize } from '../types'
import { fromDateKey, toDateKey } from '../lib/dates'
import { DINNER_DONE_HOUR, ESCALATION_HOUR, isCovered, kindVerb, needsCount } from '../lib/meals'

/* `meals.tonight` — the pure view (data comes from `Tonight.tsx`). The fridge
   anti-ambush surface (spec.md): the meal name is the headline, readable from
   the door, no tap. Four states (design.md §M5/2):

     claimed              — title · sides · try-bite chip ┃ owner + verb
     unclaimed (pre-4pm)  — title · "planned — nobody's on it yet" · ghost claim
     unclaimed (post-4pm) — title · AMBER BADGE "Still needs a cook" · solid claim
     nothing planned      — muted headline · "the week's still open" · Plan it

   THE CARD HAS TWO AUDIENCES READING AT TWO TIMES (v3 live review, 2026-08-12,
   amending the M5/1 render): everything above the hairline is what a kid reads
   at 3:30 — the meal, the plate, the one named ask; below it is the adult
   morning glance — who's cooking ("You're cooking" when it's the viewer). The
   large size adds NEXT UP, a two-day lookahead with a store flag per row
   (comma count of `needs` — the Tuesday answer to "shop for Thursday?"),
   replacing the seven-chip week strip; the week-level count stays on the page.

   Escalation is localised, never a wash — the badge + solid button shout; the
   card surface stays `--card`. The window is [ESCALATION_HOUR, DINNER_DONE_HOUR)
   — after dinner the verbs flip past and the badge stands down (iPad review,
   2026-08-13). Ownerless takeout is covered like going out — "we're ordering
   in", family dot, no claim pressure. Three sizes self-size via container
   queries (the shell renders `<Widget />` with no size prop; `size` is a
   Storybook/test override). */

export interface TonightViewProps {
  meals: PlannedMeal[]
  membersById: Map<string, MealMember>
  now: Date
  /** The signed-in profile — second-person verb when they own tonight. */
  viewerId: string | null
  canClaim: boolean
  canPlan: boolean
  onClaim: (meal: PlannedMeal) => void
  size?: WidgetSize
}

interface ZoneProps {
  today: PlannedMeal | null
  owner: MealMember | undefined
  escalated: boolean
  /** Past DINNER_DONE_HOUR — tonight is history, verbs go past tense. */
  dinnerDone: boolean
  meals: PlannedMeal[]
  now: Date
  viewerId: string | null
  canClaim: boolean
  canPlan: boolean
  onClaim: (meal: PlannedMeal) => void
}

const INSET = WIDGET_INSET

function timeLabel(now: Date): string {
  return now
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(/\s?[AP]M$/i, '')
}

/* The WHOLE TILE deep-links to /meals (live review, 2026-08-13 — the headline
   alone was too small a target). A button inside an anchor is a
   nested-interactive fault, so it's ItemCard's overlay recipe instead: a
   sibling link stretched across the tile, real controls lifted above it. */
function CardLink() {
  return (
    <Link
      to="/meals"
      aria-label="Open the meals week"
      className="absolute inset-0 z-10 rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
    />
  )
}

/* Wraps to two lines before it ellipsizes — the fridge reads the meal name from
   the door, and a one-line truncate ate the headline it exists for. Compact is
   the one slot with no room to wrap. Display-lg at every non-compact size (iPad
   review, 2026-08-13): the 36px hero rung made the meal the loudest thing on
   the wall and starved the NEXT UP groove.

   The pb/-mb pair is clip room: truncate/line-clamp set overflow-hidden, and
   Lora's descenders reach below the display tokens' 1.2 line box — without it
   the g in "Rigatoni" loses its tail. Padding is inside the clip box, the
   negative margin gives the room back to the layout. */
function Headline({
  children,
  muted = false,
  compact = false,
}: {
  children: ReactNode
  muted?: boolean
  compact?: boolean
}) {
  return (
    <span
      className={cn(
        compact ? 'text-page-title block truncate' : 'text-display-lg line-clamp-2',
        '-mb-1.5 pb-1.5',
        muted ? 'text-muted-foreground italic' : 'text-foreground'
      )}
    >
      {children}
    </span>
  )
}

function TryBiteChip({ tryBite }: { tryBite: string }) {
  return (
    <span className="text-xs-body shrink-0 rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
      Try bite · {tryBite}
    </span>
  )
}

/* Both stand-ins hold the exact footprint of a rendered `sm` avatar (32px) so
   rows never shift between owned, unclaimed, and going-out states. */
function HollowRing() {
  return (
    <span
      aria-hidden
      className="size-8 shrink-0 rounded-full border-2 border-dashed border-border"
    />
  )
}

/* A going-out dinner belongs to everyone — the Hearth hue (ADR 041) wearing
   the serving platter, never a member's hue, never the dashed absence ring. */
function FamilyDot() {
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full border-2"
      style={{
        background: identityToken(FAMILY_HUE, 'tint'),
        borderColor: identityToken(FAMILY_HUE),
        color: identityToken(FAMILY_HUE, 'ink'),
      }}
    >
      <HandPlatter size={16} />
    </span>
  )
}

/* The four-state core, shared by standard and large. Kid zone above the
   hairline; the adult logistics rail below it. `stretch` pins the rail to the
   box bottom (standard, a short slot); large stacks content instead and lets
   the slack fall between the rail and the lookahead groove. */
function Body({ stretch = true, ...zone }: ZoneProps & { stretch?: boolean }) {
  const { today, owner, escalated, dinnerDone, now, viewerId, canClaim, canPlan, onClaim } = zone
  const frame = cn('flex min-h-0 flex-col gap-2', stretch && 'flex-1 justify-between')
  if (!today) {
    return (
      <div className={frame}>
        <div className="min-w-0">
          <Headline muted>Nothing planned</Headline>
          <p className="text-prose mt-1 truncate text-muted-foreground italic">
            the week's still open
          </p>
        </div>
        {canPlan && (
          <div className="flex items-center gap-2 border-t border-border/50 pt-3">
            <Button size="sm" asChild className="relative z-20">
              <Link to="/meals">Plan it</Link>
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!isCovered(today)) {
    return (
      <div className={frame}>
        <div className="min-w-0">
          <Headline>{today.title}</Headline>
          {/* The chip rides the status line's right edge — a level shallower,
              and the card's right half stops being dead air (iPad review). */}
          <div className="mt-1 flex min-w-0 items-center justify-between gap-3">
            {escalated ? (
              <Badge variant="warning">Still needs a cook · {timeLabel(now)}</Badge>
            ) : (
              <p className="text-prose min-w-0 truncate text-muted-foreground italic">
                {dinnerDone ? 'planned — nobody claimed it' : "planned — nobody's on it yet"}
              </p>
            )}
            {today.tryBite && <TryBiteChip tryBite={today.tryBite} />}
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-t border-border/50 pt-3">
          <HollowRing />
          {canClaim && (
            <Button
              size="sm"
              variant={escalated ? 'default' : 'outline'}
              className="relative z-20"
              onClick={() => onClaim(today)}
            >
              I've got it
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={frame}>
      <div className="min-w-0">
        <Headline>{today.title}</Headline>
        {(today.sides || today.tryBite) && (
          <div className="mt-1 flex min-w-0 items-center justify-between gap-3">
            <p className="text-prose min-w-0 truncate text-muted-foreground italic">
              {today.sides}
            </p>
            {today.tryBite && <TryBiteChip tryBite={today.tryBite} />}
          </div>
        )}
      </div>
      <div className="mt-2 flex min-w-0 items-center gap-2 border-t border-border/50 pt-3">
        {owner ? (
          <>
            <ProfileAvatar
              name={owner.name}
              size="sm"
              avatarUrl={owner.avatarUrl}
              identity={resolveHue(owner.name, owner.identityHue)}
            />
            <span className="text-base-token min-w-0 truncate text-foreground">
              {kindVerb(today.kind, owner.name, today.ownerId === viewerId, dinnerDone)}
            </span>
          </>
        ) : (
          <>
            <FamilyDot />
            <span className="text-base-token min-w-0 truncate text-foreground">
              {kindVerb(today.kind, '', false, dinnerDone)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

/* Room to state "+N more day(s)" when the clamp drops a row. */
const MORE_RESERVE = 20

/* Large only: NEXT UP — the 3-day lookahead in a sunken plane (ADR 040 groove).
   Day · cook · meal · store flag: the Tuesday answer to "do I shop for
   Thursday?". The flag is a comma count of the meal's `needs`; it never claims
   the inverse (see `needsCount`). Unclaimed and empty days keep the dashed
   grammar — identity's absence, rendered.

   A widget list fits its slot, it does not crop (iPad review, 2026-08-13 — the
   third day sheared off at the fridge): bands compress to min-h-12, and
   `useFitRows` drops to whole rows + "+N more" when even that doesn't fit. The
   shown rows stay equal flex bands, so slack still pads every row. */
function NextUp({
  meals,
  membersById,
  now,
  viewerId,
}: {
  meals: PlannedMeal[]
  membersById: Map<string, MealMember>
  now: Date
  viewerId: string | null
}) {
  // Keyed on the date STRING, not `now` — the container makes a fresh Date every
  // render, and an unstable rows identity makes useFitRows re-measure each pass.
  const todayKey = toDateKey(now)
  const days = useMemo(() => {
    const byDate = new Map(meals.map((m) => [m.date, m]))
    const start = fromDateKey(todayKey)
    return [1, 2, 3].map((offset) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset)
      return { date: d, meal: byDate.get(toDateKey(d)) ?? null }
    })
  }, [meals, todayKey])
  const { boxRef, listRef, shown, hiddenCount, measuring } = useFitRows(days, MORE_RESERVE)

  /* Zero whole rows fit (a MacBook-height slot engages large with ~80px of
     groove — auto-bug #116 review): an empty sunken plane stating "+3 more
     days" reads as a broken tile, so the groove goes blank instead. Visuals
     only — the label and more-line keep their space (`invisible`) and the
     chrome toggles are non-layout, because collapsing anything here resizes
     the measured box and the clamp would oscillate rows in and out. */
  const empty = !measuring && shown.length === 0

  return (
    <div
      className={cn(
        '-mx-6 -mb-6 mt-4 flex min-h-0 flex-1 flex-col px-6 pb-4 pt-3',
        !empty && 'bg-surface-sunken shadow-[var(--shadow-inset)]'
      )}
    >
      <div className={cn('text-section-label mb-1.5 text-muted-foreground', empty && 'invisible')}>
        Next up
      </div>
      {/* Measuring pass renders the rows at natural (min-band) height — h-full
          would stretch them to fill the box, caching bottoms that scale with
          whatever height the box happened to have at measure time. Fit is
          judged on the minimum bands; the shown rows then stretch. */}
      <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden">
        <div ref={listRef} className={cn('flex min-h-0 flex-col', !measuring && 'h-full')}>
          {shown.map(({ date, meal }, i) => {
            const owner = meal?.ownerId ? membersById.get(meal.ownerId) : undefined
            const toBuy = needsCount(meal)
            return (
              <div
                key={date.getDay()}
                className={cn(
                  'flex min-h-12 min-w-0 flex-1 items-center gap-3 py-2',
                  i > 0 && 'border-t border-border/50'
                )}
              >
                <span className="text-xs-token w-8 shrink-0 font-semibold text-muted-foreground">
                  {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </span>
                {owner ? (
                  <ProfileAvatar
                    name={owner.name}
                    size="sm"
                    avatarUrl={owner.avatarUrl}
                    identity={resolveHue(owner.name, owner.identityHue)}
                  />
                ) : isCovered(meal) ? (
                  <FamilyDot />
                ) : (
                  <HollowRing />
                )}
                {meal ? (
                  <span className="text-base-token min-w-0 flex-1 truncate text-foreground">
                    {meal.title}
                    {isCovered(meal) && (
                      <span className="text-muted-foreground">
                        {' '}
                        · {kindVerb(meal.kind, owner?.name ?? '', meal.ownerId === viewerId)}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-base-token min-w-0 flex-1 truncate text-muted-foreground/70 italic">
                    nothing planned
                  </span>
                )}
                {toBuy > 0 && (
                  <span className="text-sm-token flex shrink-0 items-center gap-1 font-medium text-muted-foreground">
                    <ShoppingCart size={13} aria-hidden />
                    {toBuy} to buy
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {!measuring && hiddenCount > 0 && (
        <div
          className={cn('text-sm-token shrink-0 pt-1 text-muted-foreground', empty && 'invisible')}
        >
          +{hiddenCount} more day{hiddenCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

function Compact({ today, owner, escalated }: ZoneProps) {
  return (
    <div className={cn('relative flex size-full flex-col', INSET.compact)}>
      <CardLink />
      <WidgetHeader icon={Utensils} label="Tonight" />
      <div className="mt-2 flex min-h-0 flex-1 flex-col justify-between gap-1.5">
        <div className="min-w-0">
          {today ? (
            <Headline compact>{today.title}</Headline>
          ) : (
            <Headline compact muted>
              Nothing planned
            </Headline>
          )}
        </div>
        <div className="flex items-center gap-2">
          {today &&
            (owner ? (
              <ProfileAvatar
                name={owner.name}
                size="sm"
                avatarUrl={owner.avatarUrl}
                identity={resolveHue(owner.name, owner.identityHue)}
              />
            ) : isCovered(today) ? (
              <FamilyDot />
            ) : escalated ? (
              <Badge variant="warning">Still needs a cook</Badge>
            ) : (
              <HollowRing />
            ))}
        </div>
      </div>
    </div>
  )
}

function Standard(props: ZoneProps) {
  return (
    <div className={cn('relative flex size-full flex-col', INSET.standard)}>
      <CardLink />
      <WidgetHeader icon={Utensils} label="Meals · Tonight" />
      <div className="mt-2.5 flex min-h-0 flex-1 flex-col">
        <Body {...props} />
      </div>
    </div>
  )
}

function Large(props: ZoneProps & { membersById: Map<string, MealMember> }) {
  const { membersById, ...zone } = props
  return (
    <div className={cn('relative flex size-full flex-col', INSET.large)}>
      <CardLink />
      <WidgetHeader icon={Utensils} label="Meals · Tonight" />
      <div className="mt-2.5 flex min-h-0 flex-col">
        <Body {...zone} stretch={false} />
      </div>
      <NextUp
        meals={zone.meals}
        membersById={membersById}
        now={zone.now}
        viewerId={zone.viewerId}
      />
    </div>
  )
}

const WIDGET_STYLES = `
  .mtn-compact, .mtn-standard, .mtn-large { height: 100%; }
  .mtn-compact  { display: block; }
  .mtn-standard { display: none; }
  .mtn-large    { display: none; }
  @container (min-height: ${WIDGET_CQ.tallMinHeight}) {
    .mtn-compact  { display: none; }
    .mtn-large    { display: block; }
  }
  @container (min-width: ${WIDGET_CQ.wideMinWidth}) and (max-height: ${WIDGET_CQ.shortMaxHeight}) {
    .mtn-compact  { display: none; }
    .mtn-large    { display: none; }
    .mtn-standard { display: block; }
  }
`

export function TonightView({
  meals,
  membersById,
  now,
  viewerId,
  canClaim,
  canPlan,
  onClaim,
  size,
}: TonightViewProps) {
  const todayKey = toDateKey(now)
  const today = useMemo(() => meals.find((m) => m.date === todayKey) ?? null, [meals, todayKey])
  const owner = today?.ownerId ? membersById.get(today.ownerId) : undefined
  const dinnerDone = now.getHours() >= DINNER_DONE_HOUR
  const escalated = now.getHours() >= ESCALATION_HOUR && !dinnerDone

  const zone: ZoneProps = {
    today,
    owner,
    escalated,
    dinnerDone,
    meals,
    now,
    viewerId,
    canClaim,
    canPlan,
    onClaim,
  }

  if (size) {
    return size === 'compact' ? (
      <Compact {...zone} />
    ) : size === 'standard' ? (
      <Standard {...zone} />
    ) : (
      <Large {...zone} membersById={membersById} />
    )
  }

  return (
    <div className="size-full" style={{ containerType: 'size' }}>
      <style href="meals-tonight-widget" precedence="default">
        {WIDGET_STYLES}
      </style>
      <div className="mtn-compact">
        <Compact {...zone} />
      </div>
      <div className="mtn-standard">
        <Standard {...zone} />
      </div>
      <div className="mtn-large">
        <Large {...zone} membersById={membersById} />
      </div>
    </div>
  )
}
