import { useState, useEffect, useCallback } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@family-os/ui'
import { PermissionGate, useAuth } from '@family-os/platform'
import type { ChoreTask, FamilyMember, TasksResponse } from '../types'
import { ChoresPageView } from './ChoresPageView'
import { CreateTaskDrawer, type CreateTaskInput } from '../components/CreateTaskDrawer'

const FAMILY_PROFILE_ID = 'family'

export function ChoresPage() {
  const { id, tier } = useAuth()
  // Tier 4 manages (create/assign). Tier 4 + the family dashboard see all tasks.
  const canManage = tier >= 4
  const seesAllTasks = canManage || id === FAMILY_PROFILE_ID

  const [tasks, setTasks] = useState<ChoreTask[]>([])
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [prefillAssigneeId, setPrefillAssigneeId] = useState<string | null>(null)

  const loadTasks = useCallback(() => {
    setLoading(true)
    setError(false)
    fetch('/api/chores/tasks')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<TasksResponse>
      })
      .then((data) => setTasks(data.tasks))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // Re-fetch when the active profile changes (profile switch invalidates
  // ['api/auth/me'], so `id` updates) — otherwise the previous profile's list
  // would persist until a full reload.
  useEffect(() => {
    loadTasks()
  }, [loadTasks, id])

  // Managers need the family roster for the assignee chips. The "family"
  // pseudo-profile (the unattended dashboard) is not an assignable person.
  useEffect(() => {
    if (!canManage) return
    fetch('/api/profiles')
      .then((r) => (r.ok ? (r.json() as Promise<FamilyMember[]>) : []))
      .then((roster) => setMembers(roster.filter((m) => m.id !== FAMILY_PROFILE_ID)))
      .catch(() => setMembers([]))
  }, [canManage])

  function openCreate(assigneeId: string | null) {
    setPrefillAssigneeId(assigneeId)
    setDrawerOpen(true)
  }

  async function handleCreate(input: CreateTaskInput) {
    const res = await fetch('/api/chores/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) return
    const created: ChoreTask = await res.json()
    setTasks((prev) => [created, ...prev])
    setDrawerOpen(false)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-base-token" style={{ color: 'var(--muted-foreground)' }}>
          Could not load chores.
        </p>
        <Button variant="outline" size="sm" onClick={loadTasks}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <>
      <ChoresPageView
        tasks={tasks}
        tier={tier}
        seesAllTasks={seesAllTasks}
        canManage={canManage}
        onAddForAssignee={(assigneeId) => openCreate(assigneeId)}
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
          onSubmit={handleCreate}
        />
      )}
    </>
  )
}
