import { Badge } from '@family-os/ui'
import { GOLD_INK, GOLD_TINT } from '../lib/gold'

export interface XpPillProps {
  value: number
  /** Earned (post-completion) reads as success-green; pending reads as gold reward. */
  earned?: boolean
}

/* The gold reward on a task. Gold = XP only (a treasure semantic not yet in the
   token set — see lib/gold.ts; the XP Award story promotes it to `--gold-*`).
   Built on the shared Badge so the pill shape/typography match the system;
   only the gold fill is an inline override. */
export function XpPill({ value, earned = false }: XpPillProps) {
  if (earned) {
    return (
      <span className="text-sm-token" style={{ color: 'var(--success)', fontWeight: 600 }}>
        ✓ +{value} XP
      </span>
    )
  }
  return (
    <Badge style={{ background: GOLD_TINT, color: GOLD_INK, borderColor: 'transparent' }}>
      +{value} XP
    </Badge>
  )
}
