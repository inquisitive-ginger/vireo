import { useState } from 'react'
import { Gift, Loader2, Plus } from 'lucide-react'
import { Button, ConfirmDialog, EmptyState } from '@family-os/ui'
import { ClampedList } from './ClampedList'
import { FAMILY_PROFILE_ID } from '@family-os/platform'
import {
  useCatalog,
  useCatalogMutations,
  useProfiles,
  usePunchTemplates,
  usePunchTemplateMutations,
} from '../lib/hooks'
import type { PunchTemplate, PunchTemplateInput, Reward, RewardInput } from '../types'
import { RewardRow } from './RewardRow'
import { RewardDrawer } from './RewardDrawer'
import { PunchTemplateRow } from './PunchTemplateRow'
import { PunchTemplateDrawer } from './PunchTemplateDrawer'

/* The tier-4 catalog: both halves of stocking the economy (M4/6 gate). Rewards are
   what P-Bucks buys; punch cards are how effort becomes those things. Create, edit,
   and retire each — a referenced row is hidden, not deleted, so history keeps its
   snapshot. */
export function CatalogView() {
  // Active only — retiring a redeemed reward should clear it from the manager, not
  // leave it lingering. The row survives in the DB for its redemptions' snapshots.
  const catalog = useCatalog(false)
  const profiles = useProfiles()
  const templates = usePunchTemplates()
  const { create, update, remove } = useCatalogMutations()
  const templateMutations = usePunchTemplateMutations()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Reward | null>(null)
  const [removeTarget, setRemoveTarget] = useState<Reward | null>(null)
  const [cardDrawerOpen, setCardDrawerOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<PunchTemplate | null>(null)
  const [removeCardTarget, setRemoveCardTarget] = useState<PunchTemplate | null>(null)

  const members = (profiles.data ?? []).filter((m) => m.id !== FAMILY_PROFILE_ID && m.tier < 4)

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }
  function openEdit(reward: Reward) {
    setEditing(reward)
    setDrawerOpen(true)
  }
  function openCardCreate() {
    setEditingCard(null)
    setCardDrawerOpen(true)
  }
  function openCardEdit(template: PunchTemplate) {
    setEditingCard(template)
    setCardDrawerOpen(true)
  }

  async function submit(input: RewardInput) {
    if (editing) await update.mutateAsync({ id: editing.id, input })
    else await create.mutateAsync(input)
    setDrawerOpen(false)
  }

  async function submitCard(input: PunchTemplateInput) {
    if (editingCard) await templateMutations.update.mutateAsync({ id: editingCard.id, input })
    else await templateMutations.create.mutateAsync(input)
    setCardDrawerOpen(false)
  }

  const rewards = catalog.data ?? []
  const cards = templates.data ?? []
  const submitError = (editing ? update.error : create.error)?.message ?? null
  const cardSubmitError =
    (editingCard ? templateMutations.update.error : templateMutations.create.error)?.message ?? null

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-heading">Rewards</h2>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1 size-4" /> New reward
          </Button>
        </div>

        {catalog.isLoading ? (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : rewards.length === 0 ? (
          <EmptyState
            icon={Gift}
            heading="No rewards yet"
            body="Add the first thing a kid can spend Pritchett Bucks on."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-1 size-4" /> New reward
              </Button>
            }
          />
        ) : (
          <ClampedList
            items={rewards}
            label="More rewards"
            render={(reward) => (
              <RewardRow
                key={reward.id}
                reward={reward}
                members={members}
                onEdit={openEdit}
                onRemove={setRemoveTarget}
              />
            )}
          />
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-heading">Punch cards</h2>
          <Button size="sm" onClick={openCardCreate}>
            <Plus className="mr-1 size-4" /> New card
          </Button>
        </div>

        {templates.isLoading ? (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : cards.length === 0 ? (
          <p className="text-sm-token text-muted-foreground">
            A fixed goal with a prize at the end — try bites, reading nights, shoes in the bin. The
            kid punches their own card and picks their prize.
          </p>
        ) : (
          <ClampedList
            items={cards}
            label="More cards"
            render={(template) => (
              <PunchTemplateRow
                key={template.id}
                template={template}
                members={members}
                onEdit={openCardEdit}
                onRemove={setRemoveCardTarget}
              />
            )}
          />
        )}
      </section>

      <RewardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editing={editing}
        members={members}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
        error={submitError}
      />

      <PunchTemplateDrawer
        open={cardDrawerOpen}
        onClose={() => setCardDrawerOpen(false)}
        editing={editingCard}
        members={members}
        rewards={rewards}
        onSubmit={submitCard}
        submitting={templateMutations.create.isPending || templateMutations.update.isPending}
        error={cardSubmitError}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        title={removeTarget ? `Remove ${removeTarget.emoji} ${removeTarget.name}?` : ''}
        description="If a kid has redeemed it before, it's hidden from the store rather than deleted, so their record keeps its price."
        confirmLabel="Remove"
        isPending={remove.isPending}
        onConfirm={async () => {
          if (removeTarget) await remove.mutateAsync(removeTarget.id)
          setRemoveTarget(null)
        }}
        onCancel={() => setRemoveTarget(null)}
      />

      <ConfirmDialog
        open={removeCardTarget !== null}
        title={removeCardTarget ? `Remove ${removeCardTarget.glyph} ${removeCardTarget.name}?` : ''}
        description="Cards already punched keep going and finished cards keep their history — the template is hidden rather than deleted once it's been used."
        confirmLabel="Remove"
        isPending={templateMutations.remove.isPending}
        onConfirm={async () => {
          if (removeCardTarget) await templateMutations.remove.mutateAsync(removeCardTarget.id)
          setRemoveCardTarget(null)
        }}
        onCancel={() => setRemoveCardTarget(null)}
      />
    </div>
  )
}
