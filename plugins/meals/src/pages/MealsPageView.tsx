import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import {
  Button,
  ItemCard,
  PageContainer,
  ProfileAvatar,
  RowActions,
  cn,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import type { MealMember, PlannedMeal } from '../types'
import { isCovered, kindVerb, needsCookLabel, needsCount, needsPushLabel } from '../lib/meals'

export interface WeekDay {
  key: string
  date: Date
  meal: PlannedMeal | null
}

export interface MealsPageViewProps {
  days: WeekDay[]
  membersById: Map<string, MealMember>
  todayKey: string
  /** Past DINNER_DONE_HOUR — today's verbs go past tense too. */
  dinnerDone: boolean
  /** The date-range title ("August 9 – 15") — the calendar week view's grammar. */
  weekTitle: string
  /** null hides the count — a past week is history, not coverage to state. */
  needCount: number | null
  canManage: boolean
  canClaim: boolean
  /** The needs-push link's gate — `shopping.item.add`, the same key the shopping
      surface asks (ADR 018/071). */
  canPushNeeds: boolean
  /** What the last row-scoped action said back, carried by `mealId` to the row
      that was tapped — the outcome states itself on the row it changed, not
      under the page title where it names no meal and can sit a screen away from
      the finger. `failed` turns it destructive and leaves the affordance in
      place: the affordance is the retry. */
  rowNote: { mealId: string; text: string; failed: boolean } | null
  /** The meal whose push is in flight, if any — its link goes inert so a second
      tap cannot file the same needs twice. */
  pushPendingMealId: string | null
  onPrevWeek: () => void
  onNextWeek: () => void
  onThisWeek: () => void
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onPushNeeds: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/* The /meals week page (design.md §M5/2): seven ItemCard rows — a day is an
   independent object with several actions, so it's a card, not a ListRow
   (ADR 063). The page is CALM — no amber ever; the widget and the nudge do the
   shouting. Spine = owner identity hue in every state (ADR 043); an unclaimed or
   empty day renders a dashed spine — identity's absence — and an empty day
   additionally drops to dashed card chrome. Past days recede (critique,
   2026-08-13): dimmed, past-tense verbs, no actions at all — behind today the
   page only records. */
export function MealsPageView({
  days,
  membersById,
  todayKey,
  dinnerDone,
  weekTitle,
  needCount,
  canManage,
  canClaim,
  canPushNeeds,
  rowNote,
  pushPendingMealId,
  onPrevWeek,
  onNextWeek,
  onThisWeek,
  onPlan,
  onEdit,
  onClaim,
  onPushNeeds,
  onRemove,
}: MealsPageViewProps) {
  return (
    <PageContainer width="list">
      {/* The calendar week view's title grammar (the range, no "This week").
          Nav is pinned to the RIGHT edge, chevrons outermost, so the cluster
          never moves when the title's width changes with the month name. The
          reset label diverges from calendar's "Today" deliberately: the
          surface's unit is the week. */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-page-title text-foreground">{weekTitle}</h1>
          {needCount !== null && (
            <p
              className={cn(
                'text-sm-token mt-1',
                // The all-clear is a murmur; a gap speaks in the action colour —
                // bold ink reads as a heading, not an ask. Primary, never amber:
                // the page stays calm, the widget does the shouting.
                needCount === 0 ? 'text-muted-foreground' : 'font-semibold text-primary'
              )}
            >
              {needsCookLabel(needCount)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onThisWeek}>
            This week
          </Button>
          <Button variant="ghost" size="icon" aria-label="Previous week" onClick={onPrevWeek}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Next week" onClick={onNextWeek}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {days.map((day) => (
          <DayRow
            key={day.key}
            day={day}
            isToday={day.key === todayKey}
            isPast={day.key < todayKey}
            dinnerDone={dinnerDone}
            membersById={membersById}
            canManage={canManage}
            canClaim={canClaim}
            canPushNeeds={canPushNeeds}
            note={day.meal && rowNote?.mealId === day.meal.id ? rowNote : null}
            pushPending={day.meal != null && pushPendingMealId === day.meal.id}
            onPlan={onPlan}
            onEdit={onEdit}
            onClaim={onClaim}
            onPushNeeds={onPushNeeds}
            onRemove={onRemove}
          />
        ))}
      </div>
    </PageContainer>
  )
}

/* `· Recipe ↗` on the meta line (gate, 2026-09-03) — a text link, never a
   bordered button, the grammar design.md already fixed for M5/6's needs-push.
   `shrink-0` so the verb and try bite truncate around it rather than clipping
   the affordance itself, and `z-20` to clear ItemCard's activate overlay the
   same way `trailing` does — without it the row's tap-to-edit swallows it. */
function RecipeLink({ url, title }: { url: string; title: string }) {
  return (
    <>
      <span aria-hidden className="text-sm-token shrink-0 text-muted-foreground">
        ·
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Recipe for “${title}” (opens in a new tab)`}
        className="text-sm-token relative z-20 flex shrink-0 items-center gap-1 font-medium text-accent hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Recipe
        <ExternalLink size={11} aria-hidden />
      </a>
    </>
  )
}

/* "3 things needed" — the meta line, not the trailing slot. design.md §M5/2
   fixed this as a text link rather than a bordered button, and the meta line is
   where this page already puts row-level text links (`RecipeLink`, directly
   after it). The trailing slot is `shrink-0`: a third control there and the
   content column collapses to nothing at 390px, which took the meal's TITLE off
   a phone entirely. `shrink-0` here too, so the verb and try bite truncate
   around the affordance instead of clipping it, and `z-20` to clear ItemCard's
   activate overlay — without it the row's tap-to-edit swallows the push. */
function NeedsPushLink({
  count,
  pending,
  onPush,
}: {
  count: number
  pending: boolean
  onPush: () => void
}) {
  return (
    // One flex item, so the pair wraps together. The separator only earns its
    // place while the link sits INLINE after the verb — on the wrapped line it
    // would lead with a stray bullet, so it is gone at the widths that wrap.
    <span className="flex shrink-0 items-center gap-1.5">
      <span aria-hidden className="text-sm-token hidden text-muted-foreground sm:inline">
        ·
      </span>
      {/* Inert while its own push is in flight. Nothing on the row changes
          between the tap and the answer, so a second tap is what a phone user
          does — and `mutate()` does not coalesce, so both would file. */}
      <button
        type="button"
        onClick={onPush}
        disabled={pending}
        aria-busy={pending}
        className="text-sm-token relative z-20 shrink-0 cursor-pointer font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-default disabled:opacity-[0.66] disabled:hover:no-underline"
      >
        {pending ? 'Sending…' : needsPushLabel(count)}
      </button>
    </span>
  )
}

function DayRow({
  day,
  isToday,
  isPast,
  dinnerDone,
  membersById,
  canManage,
  canClaim,
  canPushNeeds,
  note,
  pushPending,
  onPlan,
  onEdit,
  onClaim,
  onPushNeeds,
  onRemove,
}: {
  day: WeekDay
  isToday: boolean
  isPast: boolean
  dinnerDone: boolean
  membersById: Map<string, MealMember>
  canManage: boolean
  canClaim: boolean
  canPushNeeds: boolean
  note: { text: string; failed: boolean } | null
  pushPending: boolean
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onPushNeeds: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
}) {
  const meal = day.meal
  const owner = meal?.ownerId ? membersById.get(meal.ownerId) : undefined
  // Verbs go past when the day is behind us OR tonight's dinner hour has passed.
  const spoken = isPast || (isToday && dinnerDone)
  // A covered-but-ownerless meal (going out, ordering in) names nobody, so no
  // spine (transparent, not omitted, keeps the day column aligned) and never
  // dashed — dashed is for a cook still owed.
  const spine = owner
    ? identityToken(resolveHue(owner.name, owner.identityHue))
    : meal && isCovered(meal)
      ? 'transparent'
      : 'var(--border)'

  const needed = needsCount(meal)

  const trailing = isPast ? undefined : meal ? (
    <>
      {!isCovered(meal) && canClaim && (
        <Button variant="outline" size="sm" onClick={() => onClaim(meal)}>
          I've got it
        </Button>
      )}
      {canManage && (
        <RowActions
          label={meal.title}
          noun="meal"
          onEdit={() => onEdit(day)}
          onRemove={() => onRemove(meal)}
        />
      )}
    </>
  ) : canManage ? (
    <Button variant="outline" size="sm" onClick={() => onPlan(day)}>
      Plan it
    </Button>
  ) : undefined

  const canActivate = canManage && !isPast

  return (
    <ItemCard
      spine={spine}
      spineDashed={!(meal && isCovered(meal))}
      align="center"
      dimmed={isPast}
      className={cn(!meal && 'border-dashed shadow-none', note && 'flex-wrap')}
      onActivate={canActivate ? () => (meal ? onEdit(day) : onPlan(day)) : undefined}
      activateLabel={
        canActivate ? (meal ? `Edit “${meal.title}”` : `Plan ${DOW[day.date.getDay()]}`) : undefined
      }
      trailing={trailing}
    >
      <div className="w-11 shrink-0 text-center">
        <div
          className={cn('text-section-label', isToday ? 'text-primary' : 'text-muted-foreground')}
        >
          {DOW[day.date.getDay()]}
        </div>
        <div
          className={cn(
            'text-card-title tabular-nums',
            isToday ? 'text-primary' : 'text-foreground'
          )}
        >
          {day.date.getDate()}
        </div>
      </div>

      {/* min-h-14 = the two-line planned block (title + 32px avatar rail), so
          out/unclaimed/empty rows hold the same height — seven equal day slots,
          not rows that shrink with their state. */}
      <div className="flex min-h-14 min-w-0 flex-1 flex-col justify-center">
        {meal ? (
          <>
            <div className="truncate">
              <span className="text-card-title text-foreground">{meal.title}</span>
              {meal.sides && (
                <span className="text-base-token text-muted-foreground"> · {meal.sides}</span>
              )}
            </div>
            {/* Wraps rather than shrinks: at 390px the day column, the verb and
                a text affordance do not fit on one line, and squeezing them
                truncated "planned — nobody's on it yet" down to "p.". The
                affordances drop to their own line there — the same rule the
                header cluster follows, and the same one that says nothing gets
                hidden on the phone, which is the primary device. */}
            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5">
              {owner ? (
                <>
                  <ProfileAvatar
                    name={owner.name}
                    size="sm"
                    avatarUrl={owner.avatarUrl}
                    identity={resolveHue(owner.name, owner.identityHue)}
                  />
                  <span className="text-sm-token truncate text-muted-foreground">
                    {kindVerb(meal.kind, owner.name, false, spoken)}
                    {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                  </span>
                </>
              ) : isCovered(meal) ? (
                <span className="text-sm-token truncate text-muted-foreground">
                  {kindVerb(meal.kind, '', false, spoken)}
                  {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                </span>
              ) : (
                <span className="text-sm-token truncate text-muted-foreground">
                  {spoken ? 'planned — nobody claimed it' : "planned — nobody's on it yet"}
                  {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                </span>
              )}
              {/* Both hidden on past days with the rest of the row's affordances
                  — behind today the page only records (design.md §M5/2). */}
              {needed > 0 && canPushNeeds && !isPast && (
                <NeedsPushLink
                  count={needed}
                  pending={pushPending}
                  onPush={() => onPushNeeds(meal)}
                />
              )}
              {meal.recipeUrl && !isPast && <RecipeLink url={meal.recipeUrl} title={meal.title} />}
            </div>
          </>
        ) : (
          <span className="text-base-token text-muted-foreground/70 italic">
            {isPast ? 'No dinner was planned' : 'Nothing planned'}
          </span>
        )}
      </div>

      {/* The push outcome, on the row it changed — a row-scoped action states
          its result on the row, not under the page title where it names no meal
          and can sit a screen away from the finger.

          A full-width line of its own (`order-last w-full` against the card's
          `flex-wrap`, which only turns on when there's a note), NOT the meta
          line and NOT the trailing slot: the meta line describes the meal and
          truncates — a failure that can be truncated away is a failure nobody
          sees — and at 390px the trailing slot and the content column together
          leave ~90px, which wraps this sentence into five lines. The sentence
          needs the row's whole width, so it takes the row's whole width.

          The row growing past `min-h-14` IS the evidence the tap did something,
          and only the tapped row grows. Medium weight on a failure so it can't
          read as one more muted meta fragment; `pl-14` sets it under the title
          rather than under the day column. */}
      {note && (
        <p
          role="status"
          className={cn(
            'text-sm-token order-last w-full pl-14 leading-snug',
            note.failed ? 'font-medium text-destructive' : 'text-muted-foreground'
          )}
        >
          {note.text}
        </p>
      )}
    </ItemCard>
  )
}
