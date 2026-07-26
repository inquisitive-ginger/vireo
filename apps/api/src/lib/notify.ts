import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { sendPushToProfile } from '../plugins/push'

export const MAX_NOTIFICATIONS = 50

/** The four the tray can render. A variant outside this set has no icon and takes
    the whole shell down with it, so the union is the contract, not documentation. */
export const NOTIFY_VARIANTS = ['success', 'info', 'warning', 'error'] as const
export type NotifyVariant = (typeof NOTIFY_VARIANTS)[number]

export function isNotifyVariant(v: unknown): v is NotifyVariant {
  return NOTIFY_VARIANTS.includes(v as NotifyVariant)
}

export type NotifyInput = {
  title: string
  body?: string | null
  variant: NotifyVariant
  priority?: string
}

/** Server-side notification path. Persists a notification for a tier 2+ profile,
 * prunes that profile's history to MAX_NOTIFICATIONS, and dispatches a Web Push
 * for priority `alert` (tier 4 always, tier 3 when push is enabled).
 *
 * On success, emits `platform.notification.created` ({ profileId }) on the event
 * bus so connected clients (e.g. the notification bell) can refresh in realtime —
 * the bus broadcasts to all clients, which filter by profileId.
 *
 * Returns the created notification id, or `null` when skipped (profile missing or
 * tier < 2). Both `POST /notifications` and server-side event subscribers (e.g.
 * the chores parent-notification) go through this so persistence, pruning, and
 * push stay consistent in one place. */
export async function notify(
  eventBus: EventBus,
  profileId: string,
  input: NotifyInput
): Promise<{ id: string } | null> {
  const profile = await prisma.profile.findUnique({ where: { id: profileId } })
  if (!profile || profile.tier < 2) return null

  const priority = input.priority ?? 'info'

  const notification = await prisma.notification.create({
    data: {
      profileId,
      title: input.title,
      body: input.body ?? null,
      variant: input.variant,
      priority,
    },
  })

  // Prune oldest beyond the limit
  const count = await prisma.notification.count({ where: { profileId } })
  if (count > MAX_NOTIFICATIONS) {
    const oldest = await prisma.notification.findMany({
      where: { profileId },
      orderBy: { createdAt: 'asc' },
      take: count - MAX_NOTIFICATIONS,
      select: { id: true },
    })
    await prisma.notification.deleteMany({ where: { id: { in: oldest.map((n) => n.id) } } })
  }

  // Web Push: only for priority `alert`, tier 4 always, tier 3 only when push_enabled
  const qualifiesForPush =
    priority === 'alert' && (profile.tier === 4 || (profile.tier === 3 && profile.pushEnabled))

  if (qualifiesForPush) {
    void sendPushToProfile(profileId, {
      title: input.title,
      body: input.body ?? '',
      variant: input.variant,
    })
  }

  // Realtime signal for connected clients (bell badge / tray). Broadcast to all;
  // clients filter by profileId.
  eventBus.emit('platform.notification.created', { profileId })

  return { id: notification.id }
}
