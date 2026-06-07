import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NotifyPayload } from '../types'

const DURATIONS: Record<string, number> = {
  success: 3000,
  info: 5000,
  warning: 8000,
  error: Infinity,
}

async function persistNotification(payload: NotifyPayload): Promise<void> {
  await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      variant: payload.variant,
      priority: payload.priority ?? 'info',
    }),
  })
}

export function useNotify(): (payload: NotifyPayload) => void {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: persistNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
    },
  })

  return useCallback(
    (payload: NotifyPayload) => {
      const duration = DURATIONS[payload.variant] ?? 5000
      const options = {
        duration,
        description: payload.body,
        action: payload.actions?.[0]
          ? {
              label: payload.actions[0].label,
              onClick: () => window.location.assign(payload.actions![0].href),
            }
          : undefined,
      }

      switch (payload.variant) {
        case 'success':
          toast.success(payload.title, options)
          break
        case 'info':
          toast.info(payload.title, options)
          break
        case 'warning':
          toast.warning(payload.title, options)
          break
        case 'error':
          toast.error(payload.title, options)
          break
      }

      mutation.mutate(payload)
    },
    [mutation]
  )
}
