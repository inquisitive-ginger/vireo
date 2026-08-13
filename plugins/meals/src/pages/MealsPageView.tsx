import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Button,
  FAMILY_HUE,
  ItemCard,
  PageContainer,
  ProfileAvatar,
  RowActions,
  cn,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import type { MealMember, PlannedMeal } from '../types'
import { isCovered, kindVerb, needsCookLabel } from '../lib/meals'

export interface WeekDay {
  key: string
  date: Date
  meal: PlannedMeal | null
}

export interface MealsPageViewProps {
  days: WeekDay[]
  membersById: Map<string, MealMember>
  todayKey: string
  weekTitle: string
  weekLabel: string
  needCount: number
  canManage: boolean
  canClaim: boolean
  onPrevWeek: () => void
  onNextWeek: () => void
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/* The /meals week page (design.md §M5/2): seven ItemCard rows — a day is an
   independent object with several actions, so it's a card, not a ListRow
   (ADR 063). The page is CALM — no amber ever; the widget and the nudge do the
   shouting. Spine = owner identity hue in every state (ADR 043); an unclaimed or
   empty day renders a dashed spine — identity's absence — and an empty day
   additionally drops to dashed card chrome. */
export function MealsPageView({
  days,
  membersById,
  todayKey,
  weekTitle,
  weekLabel,
  needCount,
  canManage,
  canClaim,
  onPrevWeek,
  onNextWeek,
  onPlan,
  onEdit,
  onClaim,
  onRemove,
}: MealsPageViewProps) {
  return (
    <PageContainer width="list">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-page-title text-foreground">{weekTitle}</h1>
          <p className="text-sm-token mt-1 text-muted-foreground">
            {weekLabel} ·{' '}
            <span className="font-semibold text-foreground">{needsCookLabel(needCount)}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Previous week" onClick={onPrevWeek}>
            <ChevronLeft size={18} aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Next week" onClick={onNextWeek}>
            <ChevronRight size={18} aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {days.map((day) => (
          <DayRow
            key={day.key}
            day={day}
            isToday={day.key === todayKey}
            membersById={membersById}
            canManage={canManage}
            canClaim={canClaim}
            onPlan={onPlan}
            onEdit={onEdit}
            onClaim={onClaim}
            onRemove={onRemove}
          />
        ))}
      </div>
    </PageContainer>
  )
}

function DayRow({
  day,
  isToday,
  membersById,
  canManage,
  canClaim,
  onPlan,
  onEdit,
  onClaim,
  onRemove,
}: {
  day: WeekDay
  isToday: boolean
  membersById: Map<string, MealMember>
  canManage: boolean
  canClaim: boolean
  onPlan: (day: WeekDay) => void
  onEdit: (day: WeekDay) => void
  onClaim: (meal: PlannedMeal) => void
  onRemove: (meal: PlannedMeal) => void
}) {
  const meal = day.meal
  const owner = meal?.ownerId ? membersById.get(meal.ownerId) : undefined
  // Going out belongs to everyone: Hearth spine (ADR 041), never dashed — an
  // ownerless out-meal is covered, not unclaimed.
  const spine = owner
    ? identityToken(resolveHue(owner.name, owner.identityHue))
    : meal?.kind === 'out'
      ? identityToken(FAMILY_HUE)
      : 'var(--border)'

  const trailing = meal ? (
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

  return (
    <ItemCard
      spine={spine}
      spineDashed={!owner && meal?.kind !== 'out'}
      align="center"
      className={cn(!meal && 'border-dashed shadow-none')}
      onActivate={canManage ? () => (meal ? onEdit(day) : onPlan(day)) : undefined}
      activateLabel={
        canManage ? (meal ? `Edit “${meal.title}”` : `Plan ${DOW[day.date.getDay()]}`) : undefined
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

      <div className="min-w-0 flex-1">
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
                    {kindVerb(meal.kind, owner.name)}
                    {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                  </span>
                </>
              ) : meal.kind === 'out' ? (
                <span className="text-sm-token truncate text-muted-foreground">
                  we're going out
                  {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                </span>
              ) : (
                <span className="text-sm-token truncate text-muted-foreground">
                  planned — nobody's on it yet
                  {meal.tryBite && ` · try bite: ${meal.tryBite}`}
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="text-base-token text-muted-foreground/70 italic">Nothing planned</span>
        )}
      </div>
    </ItemCard>
  )
}
