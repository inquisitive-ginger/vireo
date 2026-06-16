import { useState, useEffect } from 'react'
import { useAuth } from '@family-os/platform'
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
  const { tier } = useAuth()
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

  useEffect(() => {
    if (tier < 2) return
    function onNotify() {
      queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
    }
    window.addEventListener('platform:notification', onNotify)
    return () => window.removeEventListener('platform:notification', onNotify)
  }, [tier, queryClient])

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
