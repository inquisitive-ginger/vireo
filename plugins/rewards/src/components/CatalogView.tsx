import { useState } from 'react'
import { Gift, Loader2, Plus } from 'lucide-react'
import { Button, ConfirmDialog, EmptyState } from '@family-os/ui'
import { FAMILY_PROFILE_ID } from '@family-os/platform'
import { useCatalog, useCatalogMutations, useProfiles } from '../lib/hooks'
import type { Reward, RewardInput } from '../types'
import { RewardRow } from './RewardRow'
import { RewardDrawer } from './RewardDrawer'

/* The tier-4 catalog: every reward a kid can spend on, newest-priced first. Create,
   edit, and retire (a reward that redemptions reference is hidden, not deleted, so
   an old redemption keeps its cost snapshot). */
export function CatalogView() {
  // Active only — retiring a redeemed reward should clear it from the manager, not
  // leave it lingering. The row survives in the DB for its redemptions' snapshots.
  const catalog = useCatalog(false)
  const profiles = useProfiles()
  const { create, update, remove } = useCatalogMutations()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Reward | null>(null)
  const [removeTarget, setRemoveTarget] = useState<Reward | null>(null)

  const members = (profiles.data ?? []).filter((m) => m.id !== FAMILY_PROFILE_ID && m.tier < 4)

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }
  function openEdit(reward: Reward) {
    setEditing(reward)
    setDrawerOpen(true)
  }

  async function submit(input: RewardInput) {
    if (editing) await update.mutateAsync({ id: editing.id, input })
    else await create.mutateAsync(input)
    setDrawerOpen(false)
  }

  const rewards = catalog.data ?? []
  const submitError = (editing ? update.error : create.error)?.message ?? null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-heading">Catalog</h2>
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
        <div className="flex flex-col gap-2">
          {rewards.map((reward) => (
            <RewardRow
              key={reward.id}
              reward={reward}
              members={members}
              onEdit={openEdit}
              onRemove={setRemoveTarget}
            />
          ))}
        </div>
      )}

      <RewardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editing={editing}
        members={members}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
        error={submitError}
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
    </div>
  )
}
