import { Check, Star } from 'lucide-react'

export interface XpPillProps {
  value: number
  /** Earned (post-completion) reads as success-green; pending is a quiet score. */
  earned?: boolean
}

/* The XP score on a task. XP demoted off gold when P-Bucks took the coin (ADR 051): a
   score is a fact about you, not a thing you hold, so it is a quiet star in
   --muted-foreground and keeps no metal.

   Pending and earned share ONE structure — a 12px icon + "{value} XP" — differing
   only in the icon (star → check) and colour (muted → success). Identical width is
   deliberate: the reward group is right-aligned next to the completion circle, so a
   width change between states would slide the whole group sideways when the flight
   lands. */
export function XpPill({ value, earned = false }: XpPillProps) {
  const Icon = earned ? Check : Star
  return (
    <span
      className={`text-sm-token inline-flex items-center gap-1 font-semibold ${earned ? 'text-success' : 'text-muted-foreground'}`}
    >
      <Icon size={12} strokeWidth={earned ? 3 : 2.5} />
      {value} XP
    </span>
  )
}
