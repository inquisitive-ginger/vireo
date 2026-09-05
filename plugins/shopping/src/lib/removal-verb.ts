import type { ShoppingItem } from '../types'

/* WHICH removal verb a reader gets on a row — the decision, in one place,
   because it was in two and only one of them was right.

   `manage` and `retract` are the same ACT to the person holding the phone: both
   hard-delete the row (ADR 073 §4). They differ in endpoint, in permission and in
   the `reason` the event carries — real distinctions to the server, invisible to
   someone looking at two buttons with one outcome. So a reader is offered exactly
   one, never both.

   **`manage` wins.** `retract` exists for the tiers that do NOT hold `manage`:
   ADR 073 created it so the wall and a kid could undo their own typo without
   being handed delete-the-list. A parent who already has the unconditional verb
   gains nothing from the conditional one, and would watch its label mutate
   fifteen minutes into a row's life.

   The quick edge had this right and the sheet ORed the two conditions, so a
   tier-4 parent looking at their own four-minute-old add saw both. Both surfaces
   read the rule from here now; neither restates it. */
export type RemovalVerb = 'remove' | 'retract'

export function removalVerb(
  item: ShoppingItem,
  canManage: boolean,
  /** The profile holds `shopping.item.retract`. Whether THIS row qualifies is the
      payload's `canRetract` — the server owns the clock and `added_by` never
      reaches the client (ADR 073 §2). */
  canRetract: boolean
): RemovalVerb | null {
  if (canManage) return 'remove'
  if (canRetract && item.canRetract) return 'retract'
  return null
}
