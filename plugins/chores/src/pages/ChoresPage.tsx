import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button, ConfirmDialog, bucks } from '@family-os/ui'
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
import { todayKey } from '../lib/dates'
import { daySetLabel } from '../lib/routines'

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
  // A member id prefills that member; null prefills Anyone (the up-for-grabs lane's
  // "+ add"); undefined prefills nothing (the header button).
  const [prefillAssigneeId, setPrefillAssigneeId] = useState<string | null | undefined>(undefined)
  // Set → the drawer opens in edit mode; null → create mode.
  const [editingTask, setEditingTask] = useState<ChoreTask | null>(null)
  // Set → the remove-confirm dialog is open for this task.
  const [removeTarget, setRemoveTarget] = useState<ChoreTask | null>(null)

  // Keyed by the active profile — a profile switch changes the key and refetches
  // automatically (ADR 013), so no manual re-fetch on switch is needed.
  // `today` is the client's local date — routine occurrences materialize on this
  // read, against the household's day rather than the server's UTC one.
  const tasksQuery = useQuery({
    queryKey: ['chores/tasks', id],
    queryFn: () =>
      fetch(`/api/chores/tasks?today=${todayKey()}`).then((r) => {
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

  // Held payouts (M4/3b), flagged with the rest of the earn UI. The tier-4 board
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

  // A paid chore being reopened claws the payout back — confirm first, showing the kid's
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
      queryClient.invalidateQueries({ queryKey: ['rewards/store'] })
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
        body: JSON.stringify(taskPayload(input)),
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

  // Routines (recurring chores). Creation spawns nothing itself — the first
  // occurrence materializes on the refetch these invalidations trigger.
  const createRoutine = useMutation({
    mutationFn: (input: CreateTaskInput) =>
      fetch('/api/chores/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routinePayload(input)),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setDrawerOpen(false)
    },
  })

  const updateRoutine = useMutation({
    mutationFn: ({ routineId, input }: { routineId: string; input: CreateTaskInput }) =>
      fetch(`/api/chores/routines/${routineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routinePayload(input)),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setDrawerOpen(false)
      setEditingTask(null)
    },
  })

  // End a routine (the routine rows' remove action) — stops spawning, removes the
  // open row, keeps history.
  const endRoutine = useMutation({
    mutationFn: (routineId: string) =>
      fetch(`/api/chores/routines/${routineId}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok && r.status !== 204) throw new Error(String(r.status))
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      setRemoveTarget(null)
    },
  })

  // Claim an up-for-grabs task — from then on it is an ordinary assigned task.
  const claimTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}/claim`, { method: 'PATCH' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
    },
  })

  // Edit a task (tier 4) — same field set as create; assignee may change.
  const updateTask = useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: CreateTaskInput }) =>
      fetch(`/api/chores/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload(input)),
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
      // A paying completion may have created a held payout, or auto-credited the ledger.
      // Refetch payouts AND the wallet/store balance so the widget and store reflect the
      // new P-Bucks (the credit lands async on the event bus; the refetch round-trip
      // outlasts it in practice — a stale read reconciles on the next refocus).
      queryClient.invalidateQueries({ queryKey: ['rewards/payouts'] })
      queryClient.invalidateQueries({ queryKey: ['rewards/wallet'] })
      queryClient.invalidateQueries({ queryKey: ['rewards/store'] })
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
      queryClient.invalidateQueries({ queryKey: ['rewards/wallet'] })
      queryClient.invalidateQueries({ queryKey: ['rewards/store'] })
    },
  })

  function openCreate(assigneeId?: string | null) {
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
        profileId={id}
        tier={tier}
        seesAllTasks={seesAllTasks}
        canManage={canManage}
        focusMode={focusMode}
        initialXp={xpQuery.data?.totalXp}
        payouts={payoutsQuery.data?.payouts ?? []}
        onDecidePayout={(input) => decidePayout.mutateAsync(input)}
        onAddForAssignee={(assigneeId) => openCreate(assigneeId)}
        onClaimTask={(taskId) => claimTask.mutateAsync(taskId)}
        onCompleteTask={(taskId) => completeTask.mutateAsync(taskId)}
        onReopenTask={(taskId) => reopenTask.mutateAsync(taskId)}
        onReopenPaidTask={(task, clawback) => setReopenTarget({ task, clawback })}
        onEditTask={openEdit}
        onRemoveTask={(task) => setRemoveTarget(task)}
        newTaskButton={
          <PermissionGate action="create" subject="chores.Task">
            <Button onClick={() => openCreate()}>
              <Plus size={16} />
              New Task
            </Button>
          </PermissionGate>
        }
        emptyAction={
          // sm matches the empty-state CTA convention (EmptyState stories + family-feed);
          // the header "New Task" keeps the default size when the board has tasks.
          <PermissionGate action="create" subject="chores.Task">
            <Button size="sm" onClick={() => openCreate()}>
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
            // onSuccess closes it. Changing the Repeats mode in edit converts the
            // thing itself — a one-shot becomes a routine (and vice versa), so the
            // original is retired once its replacement exists.
            if (editingTask?.routineId) {
              if (input.repeats === 'once') {
                await createTask
                  .mutateAsync(input)
                  .then(() => endRoutine.mutateAsync(editingTask.routineId as string))
                  .then(() => setEditingTask(null))
                  .catch(() => {})
              } else {
                await updateRoutine
                  .mutateAsync({ routineId: editingTask.routineId, input })
                  .catch(() => {})
              }
            } else if (editingTask) {
              if (input.repeats === 'once') {
                await updateTask.mutateAsync({ taskId: editingTask.id, input }).catch(() => {})
              } else {
                await createRoutine
                  .mutateAsync(input)
                  .then(() => deleteTask.mutateAsync(editingTask.id))
                  .then(() => setEditingTask(null))
                  .catch(() => {})
              }
            } else if (input.repeats === 'once') {
              await createTask.mutateAsync(input).catch(() => {})
            } else {
              await createRoutine.mutateAsync(input).catch(() => {})
            }
          }}
        />
      )}
      {canManage && (
        <ConfirmDialog
          open={!!removeTarget}
          title={
            removeTarget?.routineId ? 'End this routine?' : `Remove “${removeTarget?.title ?? ''}”?`
          }
          description={
            removeTarget?.routineId
              ? routineEndWarning(removeTarget)
              : "This task will be permanently deleted. This can't be undone."
          }
          confirmLabel={removeTarget?.routineId ? 'End routine' : 'Remove'}
          onConfirm={() =>
            removeTarget &&
            (removeTarget.routineId
              ? endRoutine.mutate(removeTarget.routineId)
              : deleteTask.mutate(removeTarget.id))
          }
          onCancel={() => setRemoveTarget(null)}
          isPending={deleteTask.isPending || endRoutine.isPending}
        />
      )}
      {canManage && reopenTarget && (
        <ConfirmDialog
          open
          title={`Reopen “${reopenTarget.task.title}”?`}
          description={reopenWarning(
            reopenTarget.task.assigneeName ?? 'them',
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

// The drawer's input, mapped to the two wire shapes. A one-shot never sends the
// repeat fields; a routine never sends a due date.
function taskPayload(input: CreateTaskInput) {
  const { repeats: _repeats, repeatDays: _repeatDays, ...task } = input
  return task
}

function routinePayload(input: CreateTaskInput) {
  return {
    title: input.title,
    assigneeId: input.assigneeId,
    coinReward: input.coinReward,
    requiresApproval: input.requiresApproval,
    kind: input.repeats,
    repeatDays: input.repeatDays,
  }
}

function routineEndWarning(task: ChoreTask): string {
  const rule =
    task.routine?.kind === 'ongoing'
      ? "comes back whenever it's done"
      : `repeats ${task.routine ? daySetLabel(task.routine.repeatDays) : ''}`
  return `“${task.title}” ${rule}. Ending it removes the current task; everything already done stays done and stays paid.`
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
      {bucks(value)}
    </strong>
  )
}
