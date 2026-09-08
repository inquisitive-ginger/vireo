# Session Queue

> Owned by planning sessions; every other session type reads but doesn't modify it. Each
> queued session has a kickoff in `docs/sessions/kickoffs/` that pre-loads its context —
> open it before starting work, don't fill out a template live.
>
> **Authoring rule (applies at every closeout):** an **Up Next** or **Recently Completed**
> entry is **at most two or three concise lines** — the headline + a pointer to its session
> log, where the detail lives. Never paste a summary. The log is the record; this file is
> the index.

---

## Up Next

> **M4.5 — Companion is the active milestone** (M4.5/3 next). **M5.5 — Shopping closed
> 2026-09-07.** Everything not listed below was recycled in the 2026-09-07 queue audit
> and is not coming back — do not restore it from a log.

### M4.5 — Companion: three sessions left, strictly sequenced

**Direction settled 2026-08-07** (ADR 061/062, `artifacts/2026-08-07-xp-sink-direction.html`,
`logs/2026-08-07-design-xp-sink-direction.md`). Sequencing: `docs/modules/companion/spec.md`.
Run in order:

1. ~~M4.5/1 — Style Bible + duotone proof~~ ✅ 2026-08-07 — bible settled, canvas-LUT
   duotone proven. _`logs/2026-08-07-design-companion-style-bible.md`._
2. ~~M4.5/2 — Gear taxonomy + asset library~~ ✅ 2026-08-08 — 20 bodies + 15 gear items
   (4 parked on renderer extensions). _`logs/2026-08-08-design-companion-gear-assets.md`._
3. **M4.5/3 — Design: Feature UX** · `kickoffs/design-companion-ux.md` · _depends on /2 —
   ready._ Assets + fits: `docs/modules/companion/assets/` (`bodies/`, `gear/`, `anchors.json`).
4. **M4.5/4 — Dev: Foundation** · `kickoffs/dev-companion-foundation.md` · _depends on /3
   (or /1 if wall-clock demands — see spec)_
5. **M4.5/5 — Dev: Surfaces (the launch PR)** · `kickoffs/dev-companion-surfaces.md` ·
   _depends on /4_

One pre-launch family task: **name the feature at the dinner table** (ADR 061 — "critter"
is the working register).

---

### Platform: family-feed test addendum

**Type:** development (test addendum) · **Kickoff:** _to be written_
`family-feed` has a `test` script and **zero test files** — silently "passing" its whole life.
Stand up an RTL suite mirroring chores/calendar.

---

## Recently Completed

> **A rolling window, not a changelog.** One line per session plus its log pointer, most
> recent first, nothing older than the current milestone's start. `docs/sessions/logs/` is
> date-ordered and holds the record. Do not restore entries pruned from here.

- **2026-09-07 — Fix: the month grid fills its frame instead of scrolling it** — not a
  padding bug; the calendar's tablet surface lacked Home's height contract. Home's bottom
  inset equalised (`md:pb-6`), the frame left alone. **Owed:** two lines in ADR 074
  recording that Home overrides the bottom inset — the ADR still reads "padding is not a
  prop". _[log](logs/2026-09-07-fix-calendar-month-scroll.md)_
- **2026-09-07 — Audit: the standing docs against the code** — `architecture.md`'s Platform
  API described a package that no longer exists (`createEventBusPlugin`/`getEventBus`, no
  `emitAndAwait`, no Query re-exports). Everything else was clean.
  _[log](logs/2026-09-07-audit-stale-docs.md)_
- **2026-09-07 — Dev: offline** (M5.5/6, PR #144) — **M5.5 closes.** Snapshot-seeded reads and
  a durable check queue replayed on reconnect; the service worker is untouched, which is how the
  deploy AC is held. Adds are refused offline, not queued.
  _[log](logs/2026-09-07-dev-shopping-offline.md)_
- **2026-09-07 — Docs: ten ADRs rewritten under the 6000-byte cap** — 042/044/043/031/035/046/
  041/022/040/057, all now 5939–5997 bytes; arguments intact, restatement and superseded
  clauses gone. _[log](logs/2026-09-07-docs-adr-cap.md)_
- **2026-09-07 — Audit: the queue, the kickoffs and the specs** — every queued item was put
  to a build/recycle call. Four kickoffs, three story specs and the shopping salvage
  inventory deleted; the whole Deferred Backlog recycled; M3 and M5 closed.
  _[log](logs/2026-09-07-audit-queue-recycle.md)_
- **2026-09-05 — Fix: four auto-bug reports** (#140–#142, PR #143) — the XP plate reaches Punch
  cards (`chores/xp` was never invalidated), the rename and its inline panel each get a visible
  way out, the last title-cased labels go. All four `deployed` flips landed.
  _[log](logs/2026-09-05-fix-auto-bugs-140-142.md)_
- **2026-09-04 — Dev: the page frame insets, the header leads** (PR #139) — the spacing audit's
  contract, ADR 074, a `SectionLabel` primitive, and `check-spacing.sh` in CI. Closes the
  `section-label` block-spacing entry. _[log](logs/2026-09-04-dev-spacing-contract.md)_
- **2026-09-04 — Dev: the Shopping polish, and the plugin is announced** (PR #138) — the
  critique's SH-01…SH-14 plus a long live pass; nav entry yes, Home tile pulled (one revert).
  Five docs amended, three pre-existing defects found. _[log](logs/2026-09-04-dev-shopping-polish.md)_
- **2026-09-04 — Fix: the up-next widget's day labels lead their events** (auto-bug #135, PR #137) —
  the stacked anatomy #117 built for the narrow slot is now the only one, and `DayHeading` is
  shared with the mobile agenda. _[log](logs/2026-09-04-dev-calendar-day-headings.md)_
- **2026-09-04 — Dev: shop context, shopper sync, the aisle correction** (M5.5/4, PR #136) —
  ADR 064 amended: per-row attribution is rendered in neither direction. Ships with the nav item
  and widget **disabled**, one revertable commit. _[log](logs/2026-09-04-dev-shopping-shop-context.md)_
- **2026-09-04 — Dev: the capture surface, the widget, and taking back an add** (M5.5/5, PR #134) —
  the no-mode rule is the phone's, not an exception; ADR 070 amended (nothing autofocuses) and
  ADR 073 written. _[log](logs/2026-09-04-dev-shopping-capture-surfaces.md)_
- **2026-09-04 — Dev: the plugin split + the capture surface** (M5.5/2, PR #132) — `shopping`
  is its own plugin and schema; ADR 071 (`check` at tier 2) and 072 (profile columns are text)
  came out of the build, and the live review cut rendered attribution.
  _[log](logs/2026-09-04-dev-shopping-split-capture.md)_
- **2026-09-04 — Dev: the needs-push contract** (M5.5/3, PR #133) — `meals.needs.pushed` over
  the bus with a new `emitAndAwait` so a failed push reports; `source_label` carries the
  producer's words. _[log](logs/2026-09-04-dev-shopping-needs-push.md)_
- **2026-09-03 — Design: the shopping surface** (M5.5/1, ADR 070) — capture field as the
  hero on a walk-order list, no mode; the wall only takes things in; Shopping takes a phone
  tab from `chores`. _[log](logs/2026-09-03-design-shopping-surface.md)_

Everything before 2026-09-02 (M0 through M4, deployment Parts A–F): see
`docs/sessions/logs/` and `docs/roadmap.md`.
