# 2026-07-26 — Dev: Ticket Store + Pocket UI — M4/5b

**Branch:** `dev/rewards-store-wallet` (worktree `../family-os-store-wallet`), commit
`[rewards/store-wallet] ticket store + pocket UI, prod flip (M4/5b)`. Built to the
ADR 055 artifact, live-reviewed iteratively with the user (five feedback rounds), all
ACs met. **This commit carries the prod flip** — `rewards` is registered in
`plugins.json` + `load-plugin.ts`, added to the shell Dockerfile, and the flag defaults
on — so **merging this branch IS the launch**, and **M4/8 must land on the branch
before the PR** (the flag flip is what couples them; without it prod ships the
XP-vs-P$ picker mismatch).

## What was built

- **Two kid tabs — Store · My stuff** on the shared **`TabBar`**, not a segmented pill.
  The user caught this at review, and the system already agreed: TabBar's own doc
  comment reserves the pill for zoom/mode switches and the underline tabs for splits
  between peer surfaces. `TabBar` gained an optional per-option **`badge`** (pocket's
  ready count; the parent page's hand-rolled `TabButton` moved onto it too, its
  Approvals count riding the same badge). My `SegmentedControl` badge detour was
  reverted — one tab grammar for the module.
- **The ticket** (`Ticket.tsx`: `TicketFrame`/`CostStub`/`EmojiStub`/`StubChip`/
  `TicketSkeleton`): 80px stub with **coin + numeral side by side** (20px coin,
  `text-card-title` numeral — one step up the scale, user-requested), dashed brass
  perforation, description in the body. **The notches are die-cut, not drawn**: a mask
  punches real holes through the card and the shadow is a wrapper `drop-shadow` off the
  cut silhouette — the first build's overlay dots rode outside the ticket edge (user
  catch). Safari needs the `-webkit-mask` longhands; hole positions are constants keyed
  to the fixed stub/unit widths.
- **The roll** (wide-screen addendum, gated on the updated artifact): at `md:` a store
  ticket is one live 430px unit and the rest of its row is the same ticket echoing at
  the perforation, dimmed .38/.15, **bleeding off a cut edge** (no right border, no
  right radius). Echoes are `aria-hidden`, `pointer-events: none`; the phone renders
  zero echoes and is untouched. First cut shipped two bugs the fridge screenshot
  caught: the width rule only bound `.rwt-unit` so echoes shrank and wrapped, and the
  container's right border made the bleed read as a wide card.
- **My stuff**: pocket tickets (emoji stub, "Bought Tuesday" via new `lib/when.ts`,
  `Use it` / brass-outline `Ask to use` / waiting pill + "Asked 2 hours ago"), a
  not-now note quoted verbatim on the returned ticket, and the **"Torn & enjoyed"**
  stub shelf (clip-path stub chips, counts, "N rewards enjoyed since July").
- **The moments**: buy confirm "Buy this ticket?" (arithmetic kept, "It goes in your
  pocket"; ask-first adds one quiet line) · `UseTicketDialog` — the ask at use-time
  (timing copy, no money talk) and **the tear** (480ms split at the perforation,
  reduced-motion skipped, stub name condensed `MOVIENIGHT`-style). New
  `useUseRedemption` hook drives `POST :id/use`.
- **Queue words pulled forward from M4/5d** (user hit it live): a use request card now
  reads "wants to use · bought Friday · asked just now" with **no cost and no coin** —
  `CoinDecisionTray.amount` went optional (a payout keeps its coin; money genuinely
  pending). **Real bug found there:** the decline-note confirm still said
  "· refund N P$" — the refund-on-decline model ADR 055 deleted; it promised a refund
  that never happens. Removed + a test asserts no refund copy can render.

## Review-driven design calls (all user-gated, artifact addendum "Tickets meet the fridge")

- **Roll over two-up grid and counter column** (W1) — the tap target never stretches,
  the metaphor deepens, phone unchanged.
- **Purse says "Teddy's P-Bucks"**, not the full name (reads like first+last) — and the
  fix was the register system working: the literal `"Pritchett Bucks"` was exactly the
  ADR 054 leak; it now names `CURRENCY.short`. Note: `CURRENCY.name` currently has no
  kid-facing surface — ADR 054's "taught once" spot is open (candidate: M4/5c history
  sheet or settings).
- **No brass wash on the ticket** — the two-shelf split already states affordability,
  so the fill restated it; warmth lives in the border + coin + stub numeral. (The
  fixed-reach wash was built first and then removed — the shelf logic argument won.)
- **The striving shelf lost its meters and pills** — the user relayed the callout that
  a balance-fed progress bar **drops on every spend**, taxing every goal at once,
  exactly against the ticket model's grain. Distance is now quiet text ("5 more P$");
  the meter survives only where it answers a one-time "how close?" (nudge modal,
  widget next-up). The brass "5 more" pill also violated M4/3b's chip rule — a
  distance is not a collectible. "Almost there" goes **two-up at `md:`**.

## Gotchas worth keeping

- **A masked element clips its own box-shadow** (`mask-clip` is border-box), so the
  die-cut pairs mask-on-the-card with `filter: drop-shadow` on a wrapper — which is
  also what makes the shadow follow the notch curve.
- **jsdom ignores stylesheet media queries**, so roll echoes are "visible" to RTL —
  shelf tests use `getAllBy*` and assert one live button per reward instead.
- The artifact addendum (options rendered at fridge width, published back to the same
  URL) is Part "Tickets meet the fridge" — the approved record for W1/W2 + both
  defect fixes.

## Verification

Full flows re-driven headless after every round (playwright-core against the dev
stack, Teddy): buy → pocket → tear → stub shelf · ask → waiting → not-now returns
with note · nudge · phone 390px, fridge 1112px, dark theme. Dev catalog descriptions
were **backfilled by SQL** (rows predate the seed; no form could have written them —
M4/5d's drawer field is the real fix). **rewards 41 · ui 180 · chores 56 ·
calendar 105 · shell 17**; typecheck/lint clean workspace-wide.

## What the next sessions need to know

- **M4/5d shrank**: the queue tense/cost/fulfil work landed here. What remains is the
  RewardDrawer **description field** and the approval toggle's re-worded hint
  ("They'll ask before using it — buying is always allowed").
- **M4/5c unchanged** (history sheet + widget ticket-ready line + family-profile
  chooser + teen layout). The purse deliberately ships **without** "Where'd it go?" —
  no dead tap targets; 5c adds it with the sheet.
- **M4/8 gates the branch PR.** The flag defaults on and the plugin is registered on
  this branch: merge = launch. Run M4/8 on this branch before the PR.
- Dev DB carries real review data: Teddy owns an ice-cream ticket with a use request
  **waiting in the parents' queue**, and a Movie-night stub on the shelf — coherent
  fixtures for 5c/5d, deliberately left.
