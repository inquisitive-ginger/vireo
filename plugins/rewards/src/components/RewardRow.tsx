import { AskSeal, CoinValue, ItemCard, ProfileAvatar, RowActions, resolveHue } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { Reward } from '../types'

/* A catalog reward row — the approved "Faces & seal" treatment (M4/4 design gate).
   Each fact wears its own language, never a row of look-alike pills:
     · cost      → the one coin (the currency, the collectible)
     · who       → real faces in each kid's colour (null audience = everyone)
     · how many  → a warm count
     · needs a yes → a gold "?" seal on the treat (AskSeal) — a seal is authorization,
                     and "?" reads as *ask*, not "blocked" (a lock) or "done" (a check).
   A reward has no single owner, so the row carries no identity spine. */
export function RewardRow({
  reward,
  members,
  onEdit,
  onRemove,
}: {
  reward: Reward
  members: Profile[]
  onEdit: (reward: Reward) => void
  onRemove: (reward: Reward) => void
}) {
  const byId = new Map(members.map((m) => [m.id, m]))
  const audience = reward.audience?.map((id) => byId.get(id)).filter((m): m is Profile => !!m) ?? []

  return (
    <ItemCard
      align="center"
      dimmed={!reward.active}
      onActivate={() => onEdit(reward)}
      activateLabel={`Edit ${reward.name}`}
      trailing={
        <>
          <RowActions
            label={reward.name}
            noun="reward"
            onEdit={() => onEdit(reward)}
            onRemove={() => onRemove(reward)}
          />
          <CoinValue value={reward.cost} size={22} />
        </>
      }
    >
      <div className="relative shrink-0">
        <div className="grid size-11 place-items-center rounded-xl bg-secondary text-2xl">
          {reward.emoji}
        </div>
        {reward.requiresApproval && (
          <AskSeal size={20} className="absolute -right-1.5 -bottom-1.5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-card-title truncate">{reward.name}</span>
          {!reward.active && <span className="text-xs-body text-muted-foreground">· hidden</span>}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {audience.length > 0 ? (
            <>
              <span className="flex items-center">
                {audience.slice(0, 3).map((m) => (
                  <span key={m.id} className="-mr-2 last:mr-0">
                    <ProfileAvatar
                      name={m.name}
                      size="sm"
                      avatarUrl={m.avatarUrl}
                      identity={resolveHue(m.name, m.identityHue)}
                    />
                  </span>
                ))}
              </span>
              <span className="text-xs-body text-muted-foreground">{audienceLabel(audience)}</span>
            </>
          ) : (
            <span className="text-xs-body text-muted-foreground">Anyone can get this</span>
          )}
          {reward.stock !== null && (
            <span className="text-xs-token" style={{ color: 'var(--coin-ink)' }}>
              · {reward.stock} left
            </span>
          )}
        </div>
      </div>
    </ItemCard>
  )
}

function audienceLabel(audience: Profile[]): string {
  if (audience.length === 1) return `just ${audience[0]!.name}`
  if (audience.length === 2) return `${audience[0]!.name} & ${audience[1]!.name}`
  return `${audience[0]!.name} +${audience.length - 1}`
}
