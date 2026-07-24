import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button, ConfirmDialog } from '@family-os/ui'
import {
  FAMILY_PROFILE_ID,
  PermissionGate,
  useAuth,
  useQuery,
  useMutation,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type { ChoreTask, PendingPayout, TasksResponse } from '../types'
import { ChoresPageView } from './ChoresPageView'
import { CreateTaskDrawer, type CreateTaskInput } from '../components/CreateTaskDrawer'
import { REWARDS_UI_ENABLED } from '../lib/flags'

export interface DecidePayoutInput {
  id: string
  decision: 'approve' | 'decline'
  note?: string
}

export function ChoresPage() {
  const { id, tier, focusMode } = useAuth()
  // Tier 4 manages (create/assign). Tier 4 + the family dashboard see all tasks.
  const canManage = tier >= 4
  const seesAllTasks = canManage || id === FAMILY_PROFILE_ID
  const queryClient = useQueryClient()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [prefillAssigneeId, setPrefillAssigneeId] = useState<string | null>(null)
  // Set → the drawer opens in edit mode; null → create mode.
  const [editingTask, setEditingTask] = useState<ChoreTask | null>(null)
  // Set → the remove-confirm dialog is open for this task.
  const [removeTarget, setRemoveTarget] = useState<ChoreTask | null>(null)

  // Keyed by the active profile — a profile switch changes the key and refetches
  // automatically (ADR 013), so no manual re-fetch on switch is needed.
  const tasksQuery = useQuery({
    queryKey: ['chores/tasks', id],
    queryFn: () =>
      fetch('/api/chores/tasks').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<TasksResponse>
      }),
    retry: 1,
  })

  // Persisted lifetime XP total — profile-scoped so a profile switch refetches.
  // Only fetched for taskees (tiers 1–3); admin/family view has no score plate.
  const xpQuery = useQuery({
    queryKey: ['chores/xp', id],
    queryFn: () =>
      fetch('/api/chores/xp').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ totalXp: number }>
      }),
    enabled: !seesAllTasks,
  })

  // Held F$ payouts (M4/3b), flagged with the rest of the earn UI. The tier-4 board
  // reads all pending (to overlay the approve/decline tray); a taskee reads their own
  // pending + declined (the held badge and the declined note). The family dashboard
  // (sees-all but tier 1, not a manager) fetches none — it cannot decide anyway.
  const wantsPayouts = REWARDS_UI_ENABLED && (canManage || !seesAllTasks)
  // The board needs approved payouts too, so it can tell a paid chore from a held one
  // and warn before a reopen claws the money back. The kid needs approved so a
  // released payout reads "earned" rather than staying "held".
  const payoutStatus = seesAllTasks ? 'pending,approved' : 'pending,approved,declined'
  const payoutsQuery = useQuery({
    queryKey: ['rewards/payouts', id, payoutStatus],
    queryFn: () =>
      fetch(`/api/rewards/payouts?status=${payoutStatus}&limit=100`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ payouts: PendingPayout[] }>
      }),
    enabled: wantsPayouts,
  })

  // A paid chore being reopened claws the F$ back — confirm first, showing the kid's
  // resulting balance (fetched on demand) so an overdraw isn't a surprise (M4/3b).
  const [reopenTarget, setReopenTarget] = useState<{ task: ChoreTask; clawback: number } | null>(
    null
  )
  const reopenBalanceQuery = useQuery({
    queryKey: ['rewards/wallet', reopenTarget?.task.assigneeId, 'reopen'],
    queryFn: () =>
      fetch(`/api/rewards/wallet?profileId=${reopenTarget!.task.assigneeId}&limit=1`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ balance: number }>
      }),
    enabled: !!reopenTarget,
  })

  const decidePayout = useMutation({
    mutationFn: ({ id: payoutId, decision, note }: DecidePayoutInput) =>
      fetch(`/api/rewards/payouts/${payoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards/payouts'] })
      queryClient.invalidateQueries({ queryKey: ['rewards/wallet'] })
    },
  })

  // Managers need the family roster for the assignee chips. The "family"
  // pseudo-profile (the unattended dashboard) is not an assignable person.
  const profilesQuery = useQuery({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json() as Promise<Profile[]>),
    enabled: canManage,
  })
  const members = (profilesQuery.data ?? []).filter((m) => m.id !== FAMILY_PROFILE_ID)

  const createTask = useMutation({
    mutationFn: (input: CreateTaskInput) =>
      fetch('/api/chores/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => {
      // Refetch every profile's chores list (any assignee may have changed).
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setDrawerOpen(false)
    },
  })

  // Edit a task (tier 4) — same field set as create; assignee may change.
  const updateTask = useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: CreateTaskInput }) =>
      fetch(`/api/chores/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setDrawerOpen(false)
      setEditingTask(null)
    },
  })

  // Remove a task (tier 4) — confirmed via the dialog below.
  const deleteTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setRemoveTarget(null)
    },
  })

  // Completion + reopen. The views own the optimistic UI (XP flight / row toggle)
  // and revert on rejection; we invalidate on success so the board and the
  // assignee's own list reconcile (a reopened task resurfaces on their list).
  const completeTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}/complete`, { method: 'PATCH' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      // A paying completion may have created a held payout — refetch so the card's
      // F$ state reconciles (the held badge already shows from the task itself).
      queryClient.invalidateQueries({ queryKey: ['rewards/payouts'] })
    },
  })

  const reopenTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}/reopen`, { method: 'PATCH' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      queryClient.invalidateQueries({ queryKey: ['rewards/payouts'] })
    },
  })

  function openCreate(assigneeId: string | null) {
    setEditingTask(null)
    setPrefillAssigneeId(assigneeId)
    setDrawerOpen(true)
  }

  function openEdit(task: ChoreTask) {
    setEditingTask(task)
    setPrefillAssigneeId(null)
    setDrawerOpen(true)
  }

  if (tasksQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (tasksQuery.isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-base-token text-muted-foreground">Could not load chores.</p>
        <Button variant="outline" size="sm" onClick={() => tasksQuery.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const tasks = tasksQuery.data?.tasks ?? []

  return (
    <>
      <ChoresPageView
        tasks={tasks}
        tier={tier}
        seesAllTasks={seesAllTasks}
        canManage={canManage}
        focusMode={focusMode}
        initialXp={xpQuery.data?.totalXp}
        payouts={payoutsQuery.data?.payouts ?? []}
        onDecidePayout={(input) => decidePayout.mutateAsync(input)}
        onAddForAssignee={(assigneeId) => openCreate(assigneeId)}
        onCompleteTask={(taskId) => completeTask.mutateAsync(taskId)}
        onReopenTask={(taskId) => reopenTask.mutateAsync(taskId)}
        onReopenPaidTask={(task, clawback) => setReopenTarget({ task, clawback })}
        onEditTask={openEdit}
        onRemoveTask={(task) => setRemoveTarget(task)}
        newTaskButton={
          <PermissionGate action="create" subject="chores.Task">
            <Button onClick={() => openCreate(null)}>
              <Plus size={16} />
              New Task
            </Button>
          </PermissionGate>
        }
        emptyAction={
          // sm matches the empty-state CTA convention (EmptyState stories + family-feed);
          // the header "New Task" keeps the default size when the board has tasks.
          <PermissionGate action="create" subject="chores.Task">
            <Button size="sm" onClick={() => openCreate(null)}>
              <Plus size={16} />
              New Task
            </Button>
          </PermissionGate>
        }
      />
      {canManage && (
        <CreateTaskDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setEditingTask(null)
          }}
          members={members}
          prefillAssigneeId={prefillAssigneeId}
          editingTask={editingTask}
          onSubmit={async (input) => {
            // Swallow the rejection: the drawer stays open on failure;
            // onSuccess closes it.
            if (editingTask) {
              await updateTask.mutateAsync({ taskId: editingTask.id, input }).catch(() => {})
            } else {
              await createTask.mutateAsync(input).catch(() => {})
            }
          }}
        />
      )}
      {canManage && (
        <ConfirmDialog
          open={!!removeTarget}
          title={`Remove “${removeTarget?.title ?? ''}”?`}
          description="This task will be permanently deleted. This can't be undone."
          confirmLabel="Remove"
          onConfirm={() => removeTarget && deleteTask.mutate(removeTarget.id)}
          onCancel={() => setRemoveTarget(null)}
          isPending={deleteTask.isPending}
        />
      )}
      {canManage && reopenTarget && (
        <ConfirmDialog
          open
          title={`Reopen “${reopenTarget.task.title}”?`}
          description={reopenWarning(
            reopenTarget.task.assigneeName,
            reopenTarget.clawback,
            reopenBalanceQuery.data?.balance
          )}
          confirmLabel="Reopen & take back"
          onConfirm={() => {
            reopenTask.mutate(reopenTarget.task.id)
            setReopenTarget(null)
          }}
          onCancel={() => setReopenTarget(null)}
          isPending={reopenTask.isPending}
        />
      )}
    </>
  )
}

/* The clawback warning shown before reopening a paid chore. The amounts are
   emphasized against the muted body, and the resulting balance turns red when it goes
   negative — the overdraw is the point of the dialog, so it should read at a glance.
   The balance is appended once the wallet fetch lands. */
function reopenWarning(name: string, clawback: number, balance: number | undefined) {
  const resulting = balance === undefined ? undefined : balance - clawback
  return (
    <>
      You already paid {name} <Amount value={clawback} /> for this. Reopening takes it back.
      {resulting !== undefined && (
        <>
          {' '}
          Their balance goes to{' '}
          <Amount value={resulting} tone={resulting < 0 ? 'error' : 'normal'} />.
        </>
      )}
    </>
  )
}

function Amount({ value, tone = 'normal' }: { value: number; tone?: 'normal' | 'error' }) {
  return (
    <strong
      className="font-semibold"
      style={{ color: tone === 'error' ? 'var(--error)' : 'var(--foreground)' }}
    >
      {value} F$
    </strong>
  )
}
