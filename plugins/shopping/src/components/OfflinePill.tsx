import { CloudOff } from 'lucide-react'

/* Offline is EXPECTED in a shop, not exceptional — the aisle with no signal is
   the aisle this whole story was written for. So it is a quiet pill in the muted
   register and not a banner, and nothing about it is amber: amber is for a state
   somebody has to act on, and there is no act here beyond carrying on.

   It sits under the title, above the field it has just closed — which is where
   the reader is already looking for the reason. It deliberately does NOT go in
   the sticky block below: that block is the shopper's own arithmetic, and a
   condition of the radio must not push the count or the meter off frame S3. */
export function OfflinePill({ offline }: { offline: boolean }) {
  if (!offline) return null
  return (
    <p
      // A live region, because this appears while someone is already reading the
      // page — it is not there when they arrive and land on it.
      role="status"
      className="text-sm-token mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-muted-foreground"
    >
      <CloudOff size={14} aria-hidden />
      Offline — checks will sync
    </p>
  )
}
