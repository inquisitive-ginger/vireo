import { useState, useEffect } from 'react'
import { useAuth, useEventBus } from '@family-os/platform'
import { BellBadge, NotificationTray } from '@family-os/ui'
import type { NotificationEntry } from '@family-os/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type UnreadData = {
  unreadCount: number
  maxSeverity: 'success' | 'info' | 'warning' | 'error' | null
}

export function NotificationBell({
  className,
  compact,
}: {
  className?: string
  compact?: boolean
}) {
  const { id, tier } = useAuth()
  const { subscribe } = useEventBus()
  const queryClient = useQueryClient()
  const [trayOpen, setTrayOpen] = useState(false)

  const { data: unread } = useQuery<UnreadData>({
    queryKey: ['notifications/unread'],
    queryFn: () => fetch('/api/notifications/unread').then((r) => r.json()) as Promise<UnreadData>,
    enabled: tier >= 2,
    staleTime: 30_000,
  })

  const { data: notifications = [], isFetching } = useQuery<NotificationEntry[]>({
    queryKey: ['notifications'],
    queryFn: () =>
      fetch('/api/notifications').then((r) => r.json()) as Promise<NotificationEntry[]>,
    enabled: trayOpen && tier >= 2,
    staleTime: 0,
  })

  // Keep the bell live: the server emits platform.notification.created on the
  // event bus when a notification is persisted. The bus broadcasts to every
  // client, so refresh only when the new notification targets this profile.
  useEffect(() => {
    if (tier < 2) return
    return subscribe('platform.notification.created', (payload) => {
      if ((payload as { profileId?: string }).profileId !== id) return
      queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })
  }, [id, tier, subscribe, queryClient])

  function closeTray() {
    setTrayOpen(false)
    fetch('/api/notifications/read', { method: 'POST', credentials: 'include' })
      .then(() => queryClient.invalidateQueries({ queryKey: ['notifications/unread'] }))
      .catch(() => {})
  }

  async function handleDeleteNotification(id: string) {
    queryClient.setQueryData<NotificationEntry[]>(
      ['notifications'],
      (prev) => prev?.filter((n) => n.id !== id) ?? []
    )
    await fetch(`/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' })
    queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
  }

  async function handleClearAll() {
    queryClient.setQueryData<NotificationEntry[]>(['notifications'], [])
    await fetch('/api/notifications', { method: 'DELETE', credentials: 'include' })
    queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
  }

  if (tier < 2) return null

  return (
    <div className={className}>
      <BellBadge
        count={unread?.unreadCount ?? 0}
        maxSeverity={unread?.maxSeverity ?? null}
        onClick={() => setTrayOpen(true)}
        compact={compact}
      />
      <NotificationTray
        open={trayOpen}
        onClose={closeTray}
        notifications={notifications}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAll}
        loading={isFetching}
      />
    </div>
  )
}
