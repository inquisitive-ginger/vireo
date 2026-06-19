import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@family-os/ui'
import { PermissionGate, useAuth, useQuery, useMutation, useQueryClient } from '@family-os/platform'
import type { ChoreTask, FamilyMember, TasksResponse } from '../types'
import { ChoresPageView } from './ChoresPageView'
import { CreateTaskDrawer, type CreateTaskInput } from '../components/CreateTaskDrawer'

const FAMILY_PROFILE_ID = 'family'

export function ChoresPage() {
  const { id, tier } = useAuth()
  // Tier 4 manages (create/assign). Tier 4 + the family dashboard see all tasks.
  const canManage = tier >= 4
  const seesAllTasks = canManage || id === FAMILY_PROFILE_ID
  const queryClient = useQueryClient()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [prefillAssigneeId, setPrefillAssigneeId] = useState<string | null>(null)

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

  // Managers need the family roster for the assignee chips. The "family"
  // pseudo-profile (the unattended dashboard) is not an assignable person.
  const profilesQuery = useQuery({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json() as Promise<FamilyMember[]>),
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

  // Completion + reopen. The views own the optimistic UI (XP flight / row toggle)
  // and revert on rejection; we invalidate on success so the board and the
  // assignee's own list reconcile (a reopened task resurfaces on their list).
  const completeTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}/complete`, { method: 'PATCH' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chores/tasks'] }),
  })

  const reopenTask = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`/api/chores/tasks/${taskId}/reopen`, { method: 'PATCH' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<ChoreTask>
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chores/tasks'] }),
  })

  function openCreate(assigneeId: string | null) {
    setPrefillAssigneeId(assigneeId)
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
        initialXp={xpQuery.data?.totalXp}
        onAddForAssignee={(assigneeId) => openCreate(assigneeId)}
        onCompleteTask={(taskId) => completeTask.mutateAsync(taskId)}
        onReopenTask={(taskId) => reopenTask.mutateAsync(taskId)}
        newTaskButton={
          <PermissionGate action="create" subject="chores.Task">
            <Button onClick={() => openCreate(null)}>
              <Plus size={16} />
              New Task
            </Button>
          </PermissionGate>
        }
        emptyAction={
          <PermissionGate action="create" subject="chores.Task">
            <Button onClick={() => openCreate(null)}>
              <Plus size={16} />
              New Task
            </Button>
          </PermissionGate>
        }
      />
      {canManage && (
        <CreateTaskDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          members={members}
          prefillAssigneeId={prefillAssigneeId}
          onSubmit={async (input) => {
            // Swallow the rejection: the drawer stays open on failure;
            // onSuccess closes it.
            await createTask.mutateAsync(input).catch(() => {})
          }}
        />
      )}
    </>
  )
}
