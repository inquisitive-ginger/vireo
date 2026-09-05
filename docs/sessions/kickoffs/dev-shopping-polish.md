# Kickoff — Shopping polish · Dev

**Type:** Development · **Branch:** `dev/shopping-polish` (off `main`) → PR to `main`
**Modules:** `shopping`, `@family-os/ui`, `apps/shell`
**Depends on:** the design critique (`kickoffs/design-shopping-polish.md`) — **its decision set
and artifact are the input to this session.** Runs before M5.5/6 (offline).

## Scope

Build the design session's decisions plus Zach's added items, and **announce Shopping to the
family** — the plugin is fully working and reachable only by typed URL today.

## Pre-session reads

- [ ] **The design session's log and its artifact in `docs/sessions/artifacts/`** — both. The
      decision set is the contract; the artifact is where the proportion lives. It is an input,
      not an appendix. Named, because the directory now holds several shopping files:
      `artifacts/2026-09-04-shopping-polish-critique.md` (the contract — Decided, Rejected, the
      SH-01…SH-14 items, and four open questions, one of which blocks SH-09) and
      `artifacts/2026-09-04-shopping-polish-critique.html` (the visual reference — its
      `Exploration` view holds six panels at real dimensions, each closing with a spec block of
      thresholds, timings and tokens). **Where a spec block and an acceptance criterion in the
      `.md` disagree, the spec block is the later thinking.**
- [ ] `CLAUDE.md` — the **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/design.md`, especially §Anatomy and §"One surface, two layouts"
- [ ] `logs/2026-09-04-dev-shopping-shop-context.md` + `-capture-surfaces.md` — the two build
      logs; every deferred item here has its diagnosis in one of them
- [ ] ADRs **063** · **064** · **068** · **069**–**073**, plus any the design session wrote
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Acceptance criteria

1. **Every decision in the design set is built**, or the log says which was not and why. Where a
   decision changed a shared token, the change is applied and **verified on the surfaces that
   share it** — the check ring is `--border` on `--background`, so `CompletionToggle` and every
   chores surface move with it. Review chores live too; it is the blast radius, not a side effect.
2. **One counting scheme ships** (SH-10/SH-11). The design session did not tell the two numbers
   apart — it **deleted** the cumulative cross-list count from the title strip, because nobody
   acts on a total across lists. What remains counts one thing, "what's left": the pill is
   remaining on that list, and the sticky bar reads `{n} items left` — the same figure, so
   they cannot disagree. (Zach's live pass dropped the list name from that line, 2026-09-04;
   `design.md` and ADR 043 amended in this PR.) **`design.md` §Anatomy item 1 is amended in this PR**; it specifies the
   cumulative count deliberately, and a doc left describing it is how the next session restores
   it. Check the widget and the Home tile, which print the same counts, and the singular case.
3. **A failed add survives a later success.** `setAddError(null)` on success
   (`lib/use-ambient-capture.ts:73`, and the copies at `pages/ShoppingPage.tsx:193/357`) means
   "milk" failing then "eggs" succeeding erases the record that milk was lost. Build the
   queue-or-replace behaviour the design session picked; do not re-decide it here.
4. **The Home tile no longer grows the dashboard.** Implement whichever lever the design session
   chose — displacing a settled widget, or a 2×1 that holds something other than rows. **Do not
   override `ListRow`'s 56px floor** (ADR 068); if the chosen lever turns out to require that,
   stop and flag it rather than improvising.
5. **Zach's items from the design pass are in**, each named in the log. Anything that turned out
   to be a new capability rather than a correction goes to `product` as a story, not into this PR.
6. **Shopping is announced.** The manifest `navItem` and `Home.tsx` `WIDGET_META.shopping` are
   back — both were removed in `e4052b0`, so `git revert e4052b0` is the mechanic. The nav entry
   renders at every breakpoint, the widget occupies a cell AC4 paid for, and **both are seen live
   before close-out**. This lands last: the family's first sight of Shopping is the polished one.

## Constraints

- **Live-app review with Zach in the real shell before any close-out task** — docs, commit or PR.
  A port answering 200 proves _some_ worktree is serving, not this one.
- **Do not re-litigate the design set.** If an AC conflicts with it, flag it and stop — that is a
  message back to the design session, not an improvisation.
- **ADR 064** — no per-row attribution in either direction. **ADR 070** — nothing autofocuses;
  the prop is gone from `CaptureField`, do not reintroduce it.
- The **no-mode principle is scoped to narrow** (design.md §"One surface, two layouts"). The wide
  capture-only layout is not a violation.
- The destination pill is **one control with two jobs** and M5.5/4 keys aisle-open state on it —
  read design.md §Anatomy 4 before touching it.
- `PageContainer` padding is **not a prop**; never hand-roll a row or a page frame; no blind
  `catch {}` on a path a family member reaches.
- `familyos_test` is shared across worktrees — never run a full suite concurrently with another.
  `db:reset` defaults to the **dev** DB and destroys the seed fixtures; set `DATABASE_URL`.
- Plugin suites still don't run in CI (queue, tech debt) — run shopping's locally and say so.
- A widget drops silently without **all five** registration points (CLAUDE.md); `WIDGET_META` is
  the fifth.

## Outputs

- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean (shopping, ui, shell)
- [ ] Contrast ratios re-measured after the token change and recorded in the log
- [ ] Session log · `progress.md` · queue update (M5.5/6 is next) · PR to `main` ·
      **delete this kickoff**
