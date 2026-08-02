import { CoinValue, ItemCard, ProfileAvatar, RowActions, resolveHue } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { PunchTemplate } from '../types'

/* A punch-card template row — the RewardRow's grammar (glyph tile · name · faces),
   with the card's promise as the meta line: "5 punches → pick of 🍦 🍪 🎮". Coins
   payouts keep the one coin in the trailing slot, the collectible where the catalog
   put it; a choice payout's prizes are already named in the line. */
export function PunchTemplateRow({
  template,
  members,
  onEdit,
  onRemove,
}: {
  template: PunchTemplate
  members: Profile[]
  onEdit: (template: PunchTemplate) => void
  onRemove: (template: PunchTemplate) => void
}) {
  const byId = new Map(members.map((m) => [m.id, m]))
  const audience =
    template.audience?.map((id) => byId.get(id)).filter((m): m is Profile => !!m) ?? []

  const options = (template.payoutOptions ?? []).filter((o) => o.active)
  const promise =
    template.payoutKind === 'reward' && options.length > 0
      ? options.length === 1
        ? `${template.goal} punches → ${options[0]!.emoji} ${options[0]!.name}`
        : `${template.goal} punches → pick of ${options.map((o) => o.emoji).join(' ')}`
      : `${template.goal} punches`

  return (
    <ItemCard
      align="center"
      dimmed={!template.active}
      onActivate={() => onEdit(template)}
      activateLabel={`Edit ${template.name}`}
      trailing={
        <>
          <RowActions
            label={template.name}
            noun="punch card"
            onEdit={() => onEdit(template)}
            onRemove={() => onRemove(template)}
          />
          {template.payoutKind === 'coins' && (
            <CoinValue value={template.payoutCoins ?? 0} size={22} />
          )}
        </>
      }
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">
        {template.glyph}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-card-title truncate">{template.name}</span>
          {!template.active && <span className="text-xs-body text-muted-foreground">· hidden</span>}
        </div>
        <div className="text-xs-body truncate text-muted-foreground">{promise}</div>
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
            <span className="text-xs-body text-muted-foreground">Everyone gets a card</span>
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
