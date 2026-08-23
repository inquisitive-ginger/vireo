import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  /** Grocery add capability (everyone but the unattended family dashboard) —
      the needs-push link's gate, same baseline as `meals.grocery.add`. */
  canPushNeeds: boolean
  onPrevWeek: () => void
  onNextWeek: () => void
  onThisWeek: () => void
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
  onPushNeeds: (meal: PlannedMeal) => void
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
  onPrevWeek,
  onNextWeek,
  onThisWeek,
  onPlan,
  onEdit,
  onClaim,
  onRemove,
  onPushNeeds,
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
            onPlan={onPlan}
            onEdit={onEdit}
            onClaim={onClaim}
            onRemove={onRemove}
            onPushNeeds={onPushNeeds}
          />
        ))}
      </div>
    </PageContainer>
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
  onPlan,
  onEdit,
  onClaim,
  onRemove,
  onPushNeeds,
}: {
  day: WeekDay
  isToday: boolean
  isPast: boolean
  dinnerDone: boolean
  membersById: Map<string, MealMember>
  canManage: boolean
  canClaim: boolean
  canPushNeeds: boolean
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
  onPushNeeds: (meal: PlannedMeal) => void
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
      {/* "3 things needed" — a text link, never a bordered button (design.md
          §M5/2, lands with M5/6). Same gate as adding to the list: everyone
          but the unattended family dashboard. */}
      {needed > 0 && canPushNeeds && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary"
          onClick={() => onPushNeeds(meal)}
        >
          {needsPushLabel(needed)}
        </Button>
      )}
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
      className={cn(!meal && 'border-dashed shadow-none')}
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
            <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
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
            </div>
          </>
        ) : (
          <span className="text-base-token text-muted-foreground/70 italic">
            {isPast ? 'No dinner was planned' : 'Nothing planned'}
          </span>
        )}
      </div>
    </ItemCard>
  )
}
