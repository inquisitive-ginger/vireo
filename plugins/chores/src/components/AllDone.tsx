/* Empty payoff, shared by both taskee framings (design §1): Focus swaps it in for
   the hero, Agency for the whole list. It replaces the progress line rather than
   sitting under it — a full green bar reading "all done" and a card saying the same
   thing is one fact stated twice, and the card says it better. */
export function AllDone({ note }: { note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-hero border border-border bg-card py-14 text-center shadow-[var(--shadow-card)]">
      <span style={{ fontSize: 40 }} aria-hidden>
        🎉
      </span>
      <span className="text-card-title text-foreground">All done today</span>
      {note && <span className="text-sm-token text-muted-foreground">{note}</span>}
    </div>
  )
}
