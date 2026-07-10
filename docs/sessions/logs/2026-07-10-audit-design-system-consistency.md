# Session Log — 2026-07-10 — Audit: Design System & Code Consistency

**Type:** audit (read-only)
**Scope:** apps/shell, packages/ui, plugins/chores, plugins/calendar, plugins/family-feed
**Axes:** (1) ADR 012 shadcn/Radix compliance · (2) spacing/grid system (undefined — proposal authorized) · (3) code cleanliness · (4) cross-view UX consistency
**Docs audited against:** design-system.md; ADRs 012, 022, 025, 030, 031, 035, 037
**Method:** three parallel read-only research passes (one per code axis) + a direct grep catalog of every arbitrary dimension value for axis 2; all High-severity and conflicting claims re-verified by hand before inclusion. No files other than this report were created or modified.

---

## Executive summary

The design system is in better shape than the audit brief assumed. The shared primitives (`ItemCard`, `Spine`, `EmptyState`, `SegmentedControl`, `TabBar`) are adopted consistently across all three plugins' page views and widgets; color discipline is exemplary (zero hardcoded hex, zero non-token palette classes in plugins); and the comment-bloat premise **does not reproduce** — measured plugin comment ratios are 5–12%, not 21–24%, and ~85% of those comments carry genuine WHY.

The real issues, in priority order:

1. **Two user-facing a11y holes in `packages/ui`** — the chores completion toggle exposes no checked state to assistive tech, and notification deletion is unreachable by keyboard.
2. **The settled widget-slot error state was never built** — `ErrorCard` is exported but has no production consumer; Home renders widgets with no per-slot error boundary, so a throwing widget escalates to the route-level boundary instead of the calm flat-slot anatomy design-system.md specifies.
3. **No spacing scale exists** — 82 arbitrary dimension values across 27 files (full catalog + proposed scale in Part B). Notably, this gap isn't even registered in design-system.md's "To Be Defined" table.
4. **Radius is the widest visual drift** — five untokenized radii on card-like surfaces larger than a row (only `--radius-card` is tokenized); two "hero card" surfaces and two widget pills in the same file disagree with each other.
5. **Two high-value DRY consolidations** — the Today/Tomorrow day-label helper exists as four independent copies, and the widget identity header is reimplemented identically in all three widgets.

The AdminBoard seed case is an **intentional exception, not drift** (reasoning in Part A notes). Nothing found blocks M3; everything here is polish-tier and fits a follow-up cleanup session.

---

## Part A — Findings log

Severity: High = user-facing a11y hole, unimplemented settled anatomy, or systemic gap · Med = duplicated Radix behavior, explicit-rule violation on a shipped surface, or cross-view drift · Low = cosmetic, isolated, or informational.

| #   | Axis | Severity | File:Line                                                                                                                                                                                                                                                                                                     | ADR/Doc ref                                               | Issue                                                                                                                                                                                                                    | Why it matters                                                                                                                                                                                   |
| --- | ---- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 1    | High     | packages/ui/src/components/completion-toggle.tsx:39-60                                                                                                                                                                                                                                                        | ADR 012                                                   | Interactive completion toggle is a bare `<button>` with only a free-text `aria-label`; no `role="checkbox"`/`aria-checked`/`aria-pressed` — done/not-done state is conveyed visually only                                | Screen-reader users cannot tell whether a task is complete on the core chores control; Radix Checkbox/Toggle supplies this for free                                                              |
| 2   | 1    | High     | packages/ui/src/components/notification-item.tsx:159 (also :83, :108-109)                                                                                                                                                                                                                                     | ADR 012; design-system.md §Notification tray              | Delete (×) renders only while `hovered` (mouse events); swipe gesture is `pointer: { mouse: false }` — no keyboard path to delete a notification at all                                                                  | A destructive action is inaccessible to keyboard/AT users; hover-only reveal also fails on touch-with-keyboard setups                                                                            |
| 3   | 4    | High     | apps/shell/src/pages/Home.tsx:61-73; packages/ui/src/components/error-card.tsx:11                                                                                                                                                                                                                             | design-system.md §Error state (slot level); ADR 022       | No per-slot error boundary exists on the home surface; `ErrorCard` (the settled slot-error anatomy) has zero production consumers — all fallback paths render `PlaceholderCard`                                          | A throwing widget escalates past the slot to the route-level boundary (or blanks the home surface) instead of the settled calm flat-slot retry state; a settled design is silently unimplemented |
| 4   | 2    | High     | 27 files repo-wide (catalog in Part B)                                                                                                                                                                                                                                                                        | design-system.md (gap — absent even from "To Be Defined") | No spacing scale or dimension tokens exist; 82 arbitrary values (`px-[18px]`, `min-h-[54px]`, `calc(56px+…)`, …) chosen per-surface                                                                                      | Every new surface invents its own rhythm; drift is already visible (72px vs 68px time rails, 5px vs 6px meters, 11px vs 12px pill radii); Part B proposes the scale                              |
| 5   | 3    | High     | plugins/chores/src/lib/dates.ts:18-29; plugins/calendar/src/widgets/UpNextView.tsx:53-61; plugins/calendar/src/components/AgendaView.tsx:98-117; plugins/family-feed/src/pages/FeedPageView.tsx:9-20                                                                                                          | —                                                         | The Today/Tomorrow/Yesterday/weekday day-label helper is implemented four times (same day-diff branch structure, same `toLocaleDateString` formats; only direction differs)                                              | Four copies of user-facing date wording will drift independently; highest-value consolidation in the repo                                                                                        |
| 6   | 3    | High     | plugins/chores/src/widgets/TodaySummaryView.tsx:61-70; plugins/calendar/src/widgets/UpNextView.tsx:67-74; plugins/family-feed/src/widgets/FeedWidgetView.tsx:19-26                                                                                                                                            | design-system.md §Widget identity header                  | The settled widget identity header (13px muted icon + `text-section-label`) is reimplemented identically in all three widgets; the copies' own comments admit the coupling ("matches chores / family-feed")              | A settled, mandatory anatomy with three hand-kept copies is exactly what `@family-os/ui` exists to own                                                                                           |
| 7   | 1    | Med      | packages/ui/src/components/tab-bar.tsx:42-96                                                                                                                                                                                                                                                                  | ADR 012                                                   | Hand-rolls a full ARIA tablist (manual roving tabindex, arrow-key nav, by-hand `role`/`aria-selected`) that `@radix-ui/react-tabs` supplies; missing Home/End keys and automatic tabpanel wiring                         | Duplicates behavior ADR 012 commits to sourcing from Radix; keyboard users lose Home/End; two hand-rolled focus managers (with #8) to maintain                                                   |
| 8   | 1    | Med      | packages/ui/src/components/segmented-control.tsx:34-85                                                                                                                                                                                                                                                        | ADR 012                                                   | Hand-rolls a radiogroup (roving tabindex + arrow keys + by-hand ARIA) that Radix RadioGroup/ToggleGroup supplies; missing Home/End                                                                                       | Same rationale as #7; well-built but a parallel implementation to keep correct forever                                                                                                           |
| 9   | 1    | Med      | packages/ui/src/components/permission-toggle-item.tsx:35; pin-input.tsx:63; confirm-dialog.tsx:36                                                                                                                                                                                                             | design-system.md §Color & Tokens; ADR 035                 | Raw `oklch()` color literals: an off-token green "Granted" label, a hardcoded primary-wash fill, a hardcoded dialog scrim                                                                                                | Hues won't track token/theme changes; the green has no token ancestry at all ("colors go through tokens" is a hard rule)                                                                         |
| 10  | 4    | Med      | apps/shell/src/pages/Settings.tsx:875-902 (also :122-138, :340, :413)                                                                                                                                                                                                                                         | design-system.md §View switches                           | Multiple hand-rolled button groups (inset `bg-muted` track + active-fill `aria-pressed` buttons) re-implement `SegmentedControl`'s exact anatomy                                                                         | Violates an explicit "never hand-roll a button group"; N buttons instead of one radiogroup to AT                                                                                                 |
| 11  | 4    | Med      | plugins/chores/src/components/FocusView.tsx:158-167                                                                                                                                                                                                                                                           | ADR 012; design-system.md §Typography                     | Primary "Mark done" action is a hand-rolled `<button>` (raw `text-base`, untokenized `rounded-2xl`) instead of composing `Button`                                                                                        | The single most important CTA on a kid-facing surface bypasses the shared interactive primitive (focus ring, press states, future fixes)                                                         |
| 12  | 4    | Med      | apps/shell/src/pages/PluginNotFound.tsx:1-8; apps/shell/src/components/PluginErrorBoundary.tsx:14-23                                                                                                                                                                                                          | design-system.md §Error States Level 3                    | Route-level error surfaces are bare `text-sm`/`text-xs` blocks — no 40px icon, no Lora heading, no Back/Retry action                                                                                                     | The settled page-error anatomy is ignored on both route-level failure surfaces                                                                                                                   |
| 13  | 4    | Med      | plugins/chores/src/widgets/TodaySummaryView.tsx:190,224 vs :479; plugins/chores/src/components/FocusView.tsx:121,235 vs plugins/calendar/src/components/NextEventHero.tsx:110; calendar panels (MonthGrid.tsx:35, DetailView.tsx:93, AgendaView.tsx:34, ActivitiesView.tsx:126,388, CalendarPage.tsx:258,577) | design-system.md §ItemCard (radius token)                 | Radius fragmentation above the row level: widget pills use 11px AND 12px in the same file; the two hero cards use `rounded-[18px]` vs `rounded-2xl`; panels use untokenized `rounded-xl`                                 | Only `--radius-card` (rows) is tokenized; every larger surface picks its own corner — the most visible cross-plugin inconsistency (radius proposal bundled into Part B)                          |
| 14  | 4    | Med      | plugins/chores/src/components/FocusView.tsx:131,162; plugins/chores/src/widgets/TodaySummaryView.tsx:122,125,232,237                                                                                                                                                                                          | design-system.md §Type scale                              | Raw px font sizes in plugin content: hero heading `fontSize: 26` inline (DM Sans — 26px exists only as Lora `page-title`), coin text 15px/9px, avatar initials 12px, plus default-Tailwind `text-base`                   | Type-scale drift on shipped surfaces; 26px semibold DM Sans is a scale gap that needs a design ruling, not a silent invention                                                                    |
| 15  | 3    | Med      | plugins/chores/src/widgets/TodaySummaryView.tsx:745-772; plugins/calendar/src/widgets/UpNextView.tsx:375-385; plugins/family-feed/src/widgets/FeedWidgetView.tsx:44-51                                                                                                                                        | ADR 022                                                   | Container-query density-toggle mechanics (injected `<style>` + identical `min-height: 300px` / `min-width: 440px` breakpoints) duplicated across all three widgets                                                       | The shared breakpoint magic numbers will drift; the per-widget markup can stay, the mechanics/constants should not                                                                               |
| 16  | 3    | Med      | plugins/chores/src/lib/dates.ts:4-8; plugins/family-feed/src/pages/FeedPageView.tsx:11-14 (vs plugins/calendar/src/lib/grid.ts)                                                                                                                                                                               | —                                                         | Date-only primitives (`startOfDay`-style zeroing, day-diff math) re-hand-rolled per plugin while calendar's `grid.ts` already has canonical versions                                                                     | Same consolidation target as #5 — one shared date lib retires both                                                                                                                               |
| 17  | 1    | Med      | packages/ui/src/components/button.tsx:7,11,13,16,20                                                                                                                                                                                                                                                           | ADR 012; design-system.md §Surface elevation, §Type scale | shadcn defaults left unadapted: default `ring-1 ring-ring` focus, Tailwind `shadow`/`shadow-sm` instead of `--shadow-card`/`--shadow-raised`, raw `text-sm`/`text-xs` instead of token utilities                         | The most-used interactive primitive doesn't sit on the token system its consumers are required to use                                                                                            |
| 18  | 4    | Med      | plugins/chores/src/components/AdminBoard.tsx:210 (`min-h-[54px]`); plugins/chores/src/components/CreateTaskDrawer.tsx:218 (`min-w-[44px]`)                                                                                                                                                                    | design-system.md §Surfaces (touch targets)                | Interactive rows at 54px vs the 64px list-item minimum; a 44px control vs the 48px touch minimum                                                                                                                         | The tablet spec sets explicit floors; both values undercut them (needs a design ruling — see Part B decision list)                                                                               |
| 19  | 1    | Med      | packages/ui/src/components/compose-form.tsx:36-42,56; page-header.tsx:25-38; empty-state.tsx:33-60; pin-input.tsx:47                                                                                                                                                                                          | ADR 035; design-system.md §ItemCard (radius)              | Inline `style={{…}}` for static chrome (against utility-first), including a raw `borderRadius: 14` bypassing the radius tokens; pin-input's `focus:outline-none` leaves keyboard focus with no visible ring on the boxes | Diverges from "styled utility-first, same as the shell"; the pin-input focus case is a mild a11y issue                                                                                           |
| 20  | 1/4  | Low      | packages/ui/src/components/switch.tsx:32,41-42; notification-item.tsx:88-92; plugins/chores/src/components/TaskeeView.tsx:56; FocusView.tsx:65; apps/shell/src/components/ProfileGrid.tsx:100                                                                                                                 | design-system.md §Motion                                  | Hardcoded durations/easings (`duration-200`, `duration-180`, `320ms`, `180ms`, a literal cubic-bezier) instead of `--duration-*`/`--ease-*` tokens; plus `bg-white` on the switch thumb                                  | Motion tokens exist precisely so timing reads as one system; these are isolated misses (most code uses the tokens)                                                                               |
| 21  | 1    | Low      | packages/ui — error-card.tsx:28,35; placeholder-card.tsx:52,55; settings-layout.tsx:20; profile-list-item.tsx:26; profile-avatar.tsx:28-31; permission-toggle-item.tsx:35,40; confirm-dialog.tsx:46; bottom-tab-bar.tsx:40; input.tsx:15; textarea.tsx:14; notification-item.tsx:144,154,175                  | design-system.md §Type scale                              | Systemic raw px font sizes (`text-[10px]`/`[11px]`/`[13px]`) and default `text-sm`/`text-xs` instead of token utilities in ui primitives                                                                                 | Note: the settled placeholder/error-card anatomies themselves specify 13px/11px — an 11px regular-weight token does not exist, so this is partly a type-scale gap (decision f, Part B)           |
| 22  | 1    | Low      | packages/ui/src/components/profile-avatar.tsx:43-63                                                                                                                                                                                                                                                           | ADR 012                                                   | Photo renders via `backgroundImage` with initials only when `!avatarUrl` — a broken/slow image shows an empty tinted circle (no load-error fallback à la Radix Avatar)                                                   | Latent gap; avatars are mostly initials-only today but photos are supported                                                                                                                      |
| 23  | 4    | Low      | AdminBoard.tsx:210 (`pl-[18px]`), TodaySummaryView.tsx:190,224 (`px-3`) vs :479 (`px-3.5`), FocusView.tsx:121,206, DetailView.tsx:93, ActivitiesView.tsx:126,388                                                                                                                                              | design-system.md §ItemCard                                | Row/card padding is bespoke per surface off the `px-4 py-3` ItemCard baseline, with no shared step scale                                                                                                                 | Resolved wholesale by the Part B scale; listed for traceability                                                                                                                                  |
| 24  | 4    | Low      | plugins/chores/src/components/ScorePlate.tsx:75 (also FlightChip.tsx:77, TodaySummaryView.tsx:115)                                                                                                                                                                                                            | design-system.md §Surface elevation                       | Hardcoded `box-shadow` values; ScorePlate's is a plain resting shadow (`--shadow-card` candidate); the other two are gold-coin material treatment (arguably inside the sanctioned inline-gold exception)                 | "Never hardcode box-shadow" is explicit; only ScorePlate needs a change, the coin pair needs a ruling when gold is promoted to tokens                                                            |
| 25  | 3    | Low      | Worst files: TodaySummaryView.tsx (20,56,182,323-325,457-459,619-621,708-710); UpNextView.tsx (32,63,136,276); calendar/lib/grid.ts (12,39,66,97,193,240); ActivitiesView.tsx (182,353); CreateEventDrawer.tsx (323,507,558); CalendarPage.tsx (344,376); FocusView.tsx:12; ScorePlate.tsx:53                 | —                                                         | CUT-class comments: decorative section-banner rule lines (`/* ===== */`, `── helpers ──`) and JSX labels restating structure (`{/* Title */}`) — ~15% of plugin comment lines                                            | Small, mechanical cleanup; the other ~85% of plugin comments carry genuine WHY (ADR citations, workaround rationale) and must be kept                                                            |
| 26  | 3    | Low      | plugins/calendar/src/lib/grid.ts (`DayCell`, `LaidOutCell`, `AgendaDay`); lib/hues.ts (`Fill`); plugins/chores/src/lib/use-xp-flight.ts (`Flight`, `UseXpFlightOptions`); packages/ui/src/components/popover.tsx:15 (`PopoverAnchor`)                                                                         | —                                                         | Superfluous `export` keywords on file-internal types; one unused Radix re-export                                                                                                                                         | Dead surface area only — the types themselves are live; `PopoverAnchor` is shadcn-conventional and may be kept deliberately                                                                      |
| 27  | 4    | Low      | plugins/calendar/src/components/AgendaRow.tsx:42 (`w-[72px]`) vs plugins/calendar/src/widgets/UpNextView.tsx:105 (`w-[68px]`)                                                                                                                                                                                 | —                                                         | Two leading time-column widths for the same role within one module                                                                                                                                                       | Unify to one value (decision g); mapped in Part B                                                                                                                                                |
| 28  | 4    | Low      | plugins/chores — FocusView.tsx:63, TaskeeView.tsx:54, AdminBoard.tsx:148 (`h-[5px]`) vs widgets/TodaySummaryView.tsx:85 (`h-[6px]`)                                                                                                                                                                           | —                                                         | Progress-meter bar height drifts 5px vs 6px within one module                                                                                                                                                            | Unify via the proposed `--spacing-meter` token (decision b); mapped in Part B                                                                                                                    |
| 29  | 4    | Low      | plugins/chores/src/components/AdminBoard.tsx:133-295; docs/design-system.md §ItemCard                                                                                                                                                                                                                         | design-system.md §ItemCard, §Status vs identity colour    | AdminBoard's hand-rolled rows are an **intentional exception** (verdict below) but design-system.md's blanket "do not hand-roll" prohibition doesn't record it                                                           | An undocumented exception invites a future session to "fix" correct code — one paragraph in the ItemCard section closes it                                                                       |

### Seed verdict — AdminBoard vs ItemCard: intentional exception

`AdminBoard.tsx` is **not** drift. Evidence:

- It is a dense, divider-separated lane list (`border-b border-border`, no rounded/bg-card/shadow at AdminBoard.tsx:210) — the card chrome `ItemCard` exists to standardize is deliberately absent. `TaskCard.tsx:45`, which _does_ render floating cards, correctly composes `ItemCard`.
- It composes `<Spine>` correctly (AdminBoard.tsx:215) and implements the design-system "seam" rule exactly: identity on the lane header (tint gradient + 2px identity top-border, :137-140), status on the row spine with identity fallback (:190-194).
- Its rows exceed `ItemCard`'s model: a stretched `absolute inset-0` tap-to-edit overlay (:230-237) and a multi-control trailing cluster (XpPill + edit + delete + toggle, :238-295) vs `ItemCard`'s single `trailing` prop. `chrome='bare'` models none of this.

Lone caveat: the bespoke `pl-[18px]`/`min-h-[54px]` padding (finding #18, #23) — the 18px aligns rows to the lane header and is preserved as a sanctioned step (`4.5`) in Part B; the 54px height needs a ruling against the 64px list-item minimum. Action: document the exception (finding #29), don't refactor the board.

### Corrected baselines (axis 3)

The brief's comment-ratio baseline does not reproduce. Measured (comment lines / non-blank lines, excluding generated/tests/stories):

| Scope               | Measured         | Brief claimed |
| ------------------- | ---------------- | ------------- |
| plugins/chores      | 12.1% (306/2536) | ~22%          |
| plugins/calendar    | 10.7% (363/3396) | ~21%          |
| plugins/family-feed | 5.3% (27/511)    | ~24%          |
| packages/ui         | 8.3% (190/2277)  | ~2%           |

The framing is inverted in places: `packages/ui` is comment-dense on its documented primitives (item-card.tsx ~40%, spine.tsx ~45%) and family-feed is the leanest code in the repo. Only ~15% of plugin comment lines are CUT-class (finding #25); the rest are ADR citations and genuine constraint/workaround rationale. **There is no comment-bloat problem** — there is a small banner-comment cleanup.

### Positive findings (checked, clean)

- **Color (plugins):** zero hardcoded hex; zero non-token Tailwind palette classes; every `oklch()` literal is either `color-mix` over tokens or the sanctioned inline gold constants (`plugins/chores/src/lib/gold.ts`). Red correctly reserved for overdue/error.
- **Primitive adoption (plugins):** every empty state composes `EmptyState`; every row surface composes `ItemCard`/`Spine`; calendar's view switches compose `SegmentedControl` and `TabBar`. No hand-rolled spine spans anywhere.
- **Radix delegation:** `Drawer`, `NotificationTray`, `ConfirmDialog` correctly delegate focus trap/escape/outside-click to Radix Dialog/AlertDialog. `Chip` correctly hand-implements `aria-pressed`. `PinInput` is a reasonable bespoke pattern (no Radix OTP primitive exists).
- **Dead code:** essentially none beyond finding #26 — no orphaned files, no unreachable branches found.

---

## Part B — Spacing scale proposal

> **Status: APPROVED 2026-07-10** — all eight B.5 decisions were resolved by human review in this session (see the B.5 register). Still **not implemented**; implementation is a separate pass (Part C, axis-2 group, now unblocked).

### Current state

- `packages/ui/src/styles.css` defines **no** `--spacing-*` tokens and one radius token (`--radius-card: 0.5rem`, line 31).
- 82 arbitrary dimension values across 27 files: 77 bracket utilities (`px-[18px]`, `min-h-[54px]`, …) + 5 `calc()` expressions. Full disposition in the mapping table below.
- The codebase otherwise uses standard Tailwind numeric utilities (base-4 grid), so most arbitrary values are near-grid stragglers or unnamed semantic dimensions.

### B.1 Rhythm scale

> **✅ Approved 2026-07-10 (decision a: snap to base-4 grid).** The three custom off-grid values (7px, 18px, 22px) are **not** blessed as steps — they snap to the grid (7→8, 18→16, 22→24). Standard Tailwind half-steps (0.5/1.5/2.5/3.5) remain available; no custom rhythm steps exist.

Tailwind v4 derives every numeric spacing utility from the single `--spacing: 0.25rem` base, so the scale needs **zero CSS additions** — it is a _sanctioned-step convention_ (documented in design-system.md, enforceable by grep/lint), in the same style as the type scale:

| Step | Example utility                         | px  | Role                                                                |
| ---- | --------------------------------------- | --- | ------------------------------------------------------------------- |
| 0.5  | `gap-0.5`                               | 2   | hairline gaps                                                       |
| 1    | `w-1`                                   | 4   | Spine width, tight inline gaps                                      |
| 1.5  | `gap-1.5`                               | 6   | icon–label gaps, chip padding                                       |
| 2    | `p-2`                                   | 8   | dense row padding, field-label gap                                  |
| 2.5  | `px-2.5`                                | 10  | compact controls                                                    |
| 3    | `py-3`                                  | 12  | row padding (ItemCard `py`)                                         |
| 3.5  | `px-3.5`                                | 14  | —                                                                   |
| 4    | `px-4`                                  | 16  | card padding (ItemCard `px`), grid gap, board/lane inset            |
| 5    | `p-5`                                   | 20  | —                                                                   |
| 6    | `p-6`                                   | 24  | panel padding, widget section rhythm (divider stacks, hero padding) |
| 8    | `p-8`                                   | 32  | page-level breathing room                                           |
| 12+  | `w-18`, `min-h-20`, `min-h-32`, `w-35`… | 4×N | larger fixed dimensions stay on the 4px grid via numeric utilities  |

Rule (to add to design-system.md): spacing is a step from this table or a semantic token from B.2 — bracket-arbitrary `[Npx]` spacing is banned once migration lands, except the documented exemptions in B.4.

### B.2 Semantic dimension tokens (new CSS — `@theme` in `packages/ui/src/styles.css`)

> **✅ Approved 2026-07-10** — with `--spacing-meter: 6px` (decision b).

| Token                 | Value | Utility                                                                      | Covers                                                                                  |
| --------------------- | ----- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `--spacing-touch`     | 48px  | `min-h-touch` / `min-w-touch`                                                | minimum touch target (already settled in §Surfaces)                                     |
| `--spacing-row-touch` | 64px  | `min-h-row-touch`                                                            | minimum card/list-item height (settled in §Surfaces)                                    |
| `--spacing-tab-bar`   | 56px  | `h-tab-bar`, `pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]` | bottom tab bar + everything anchored to it (App.tsx scroll padding, ProfileGrid anchor) |
| `--spacing-top-bar`   | 52px  | `min-h-top-bar`                                                              | mobile brand top bar + its safe-area calc                                               |
| `--spacing-sidebar`   | 220px | `w-sidebar`                                                                  | settled sidebar width (§Tablet Nav Layout)                                              |
| `--spacing-meter`     | 6px   | `h-meter`                                                                    | progress-meter bar height (unifies the 5px/6px drift, finding #28; decision b: 6px)     |
| `--container-content` | 680px | `max-w-content`                                                              | single-column content pages (4 identical uses today)                                    |
| `--container-drawer`  | 440px | `md:w-drawer`                                                                | side-drawer width                                                                       |

(Tailwind v4: `--spacing-*` theme keys generate all spacing-namespace utilities; `--container-*` keys generate the `max-w-*`/`w-*` size utilities.)

### B.3 Radius companion (resolves finding #13)

> **✅ Approved 2026-07-10** — `--radius-hero: 1rem` (decision e: 16px; FocusView's two 18px cards tighten by 2px).

| Token            | Value          | Utility         | Covers                                                                                                             |
| ---------------- | -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `--radius-card`  | 0.5rem (8px)   | `rounded-card`  | **exists** — card rows (unchanged)                                                                                 |
| `--radius-panel` | 0.75rem (12px) | `rounded-panel` | panels and widget pills — absorbs `rounded-xl` sites (same px) and the 10/11/12px arbitraries (≤2px visual change) |
| `--radius-hero`  | 1rem (16px)    | `rounded-hero`  | hero cards — absorbs `rounded-2xl` sites (same px) and `rounded-[18px]` (−2px; approved)                           |

### B.4 Mapping table — current value → disposition

Every cataloged occurrence. "Step" = B.1 numeric utility (no CSS change); "token" = B.2/B.3.

| Current                                                                                                            | File:Line                                                                                                                             | Proposed                                                                 | Notes                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `px-[18px]`                                                                                                        | plugins/chores/src/components/AdminBoard.tsx:135                                                                                      | `px-4`                                                                   | snap −2px (decision a)                                                                                |
| `pl-[18px]`                                                                                                        | AdminBoard.tsx:210                                                                                                                    | `pl-4`                                                                   | snap −2px (decision a)                                                                                |
| `py-[9px]`                                                                                                         | AdminBoard.tsx:216                                                                                                                    | `py-2`                                                                   | snap −1px (row has min-h; no visual effect)                                                           |
| `mt-[5px]`                                                                                                         | AdminBoard.tsx:147                                                                                                                    | `mt-1`                                                                   | snap −1px                                                                                             |
| `h-[5px]`                                                                                                          | AdminBoard.tsx:148; FocusView.tsx:63; TaskeeView.tsx:54                                                                               | `h-meter`                                                                | token; +1px unify (decision b: 6px)                                                                   |
| `h-[6px]`                                                                                                          | plugins/chores/src/widgets/TodaySummaryView.tsx:85                                                                                    | `h-meter`                                                                | token (exact)                                                                                         |
| `max-w-[120px]`                                                                                                    | AdminBoard.tsx:148                                                                                                                    | `max-w-30`                                                               | step (exact)                                                                                          |
| `min-h-[54px]`                                                                                                     | AdminBoard.tsx:210                                                                                                                    | `min-h-row-touch`                                                        | decision c: raise to 64px; visual check on a full board                                               |
| `min-w-[44px]`                                                                                                     | plugins/chores/src/components/CreateTaskDrawer.tsx:218                                                                                | `min-w-touch`                                                            | decision d: raise to 48px                                                                             |
| `p-[22px]`                                                                                                         | FocusView.tsx:121                                                                                                                     | `p-6`                                                                    | snap +2px (decision a)                                                                                |
| `rounded-[18px]`                                                                                                   | FocusView.tsx:121,235                                                                                                                 | `rounded-hero`                                                           | −2px (decision e: 16px)                                                                               |
| `max-w-[680px]`                                                                                                    | FocusView.tsx:55; TaskeeView.tsx:46; ChoresPageView.tsx:69; plugins/family-feed/src/pages/FeedPageView.tsx:56                         | `max-w-content`                                                          | token                                                                                                 |
| `size-[22px]`                                                                                                      | plugins/chores/src/components/ScorePlate.tsx:79                                                                                       | `size-6`                                                                 | snap +2px (coin glyph; visual check)                                                                  |
| `rounded-[11px]`                                                                                                   | TodaySummaryView.tsx:190,224                                                                                                          | `rounded-panel`                                                          | +1px unify                                                                                            |
| `rounded-[12px]`                                                                                                   | TodaySummaryView.tsx:479                                                                                                              | `rounded-panel`                                                          | exact                                                                                                 |
| `w-[140px]`                                                                                                        | TodaySummaryView.tsx:388,665                                                                                                          | `w-35`                                                                   | step (exact)                                                                                          |
| `w-[72px]`                                                                                                         | plugins/calendar/src/components/AgendaRow.tsx:42                                                                                      | `w-18`                                                                   | step (exact)                                                                                          |
| `w-[68px]`                                                                                                         | plugins/calendar/src/widgets/UpNextView.tsx:105                                                                                       | `w-18`                                                                   | +4px unify with AgendaRow (decision g: 72px; verify longest time strings fit)                         |
| `my-[22px]`, `mt-[22px] pt-[22px]`                                                                                 | UpNextView.tsx:166,170; plugins/family-feed/src/widgets/FeedWidgetView.tsx:73                                                         | `my-6` / `mt-6 pt-6`                                                     | snap +2px (decision a); cross-widget rhythm stays aligned — migrate all sites together                |
| `mb-[7px]`                                                                                                         | packages/ui/src/components/field-label.tsx:18; plugins/calendar/src/components/CreateEventDrawer.tsx:571                              | `mb-2`                                                                   | snap +1px (decision a); the drawer's copy should compose `FieldLabel` instead (drive-by in migration) |
| `min-h-[128px]`                                                                                                    | plugins/calendar/src/components/MonthGrid.tsx:65; CalendarPage.tsx:589                                                                | `min-h-32`                                                               | step (exact); keep grid + skeleton in sync via one plugin-local constant                              |
| `max-w-[1100px]`                                                                                                   | CalendarPage.tsx:426                                                                                                                  | keep as-is                                                               | single consumer; tokenize only if a second wide-canvas page appears                                   |
| `pb-[calc(env(safe-area-inset-bottom)+1.5rem)]`                                                                    | CreateEventDrawer.tsx:531                                                                                                             | keep                                                                     | sanctioned safe-area pattern (§Mobile Surface)                                                        |
| `min-h-[48px]`                                                                                                     | apps/shell/src/components/Sidebar.tsx:93; packages/ui/src/components/bell-badge.tsx:55                                                | `min-h-touch`                                                            | token                                                                                                 |
| `min-h-[56px]`                                                                                                     | Sidebar.tsx:44                                                                                                                        | `min-h-14`                                                               | step (exact; profile chip, not the tab bar)                                                           |
| `min-h-[56px]`                                                                                                     | packages/ui/src/components/bottom-tab-bar.tsx:35                                                                                      | `min-h-tab-bar`                                                          | token                                                                                                 |
| `top-[56px]`                                                                                                       | apps/shell/src/components/ProfileGrid.tsx:97                                                                                          | `top-tab-bar` or `top-14`                                                | verify which 56 it anchors to during migration                                                        |
| `w-[220px]`                                                                                                        | Sidebar.tsx:20                                                                                                                        | `w-sidebar`                                                              | token (settled value, named)                                                                          |
| `w-[3px]`                                                                                                          | Sidebar.tsx:103                                                                                                                       | keep (exempt)                                                            | hairline indicator geometry, analogous to border widths (no 0.75 step in the approved scale)          |
| `min-h-[52px]`                                                                                                     | apps/shell/src/components/MobileBrandTopBar.tsx:15                                                                                    | `min-h-top-bar`                                                          | token                                                                                                 |
| `calc(52px+env(safe-area-inset-top))`                                                                              | apps/shell/src/App.tsx:52                                                                                                             | `calc(var(--spacing-top-bar)+env(safe-area-inset-top))`                  | token-derived                                                                                         |
| `calc(56px+env(safe-area-inset-bottom))`                                                                           | App.tsx:34; MobileCanvas.tsx:70                                                                                                       | `calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))`               | token-derived                                                                                         |
| `min-h-[400px]`                                                                                                    | apps/shell/src/pages/DemoPage.tsx:3                                                                                                   | keep                                                                     | dev-only page                                                                                         |
| `h-[7px] w-[7px]`                                                                                                  | bell-badge.tsx:39                                                                                                                     | `size-2`                                                                 | snap +1px (decision a)                                                                                |
| `h-[18px] min-w-[18px]`                                                                                            | bell-badge.tsx:65                                                                                                                     | `h-4 min-w-4`                                                            | snap −2px (decision a); visual check — count pill holds 10px text                                     |
| `min-h-[80px]`                                                                                                     | packages/ui/src/components/textarea.tsx:14                                                                                            | `min-h-20`                                                               | step (exact)                                                                                          |
| `w-[340px]`                                                                                                        | packages/ui/src/components/confirm-dialog.tsx:39                                                                                      | keep                                                                     | one-off dialog width                                                                                  |
| `max-w-[400px]`                                                                                                    | packages/ui/src/components/notification-tray.tsx:44                                                                                   | keep                                                                     | one-off tray width                                                                                    |
| `md:w-[440px]`                                                                                                     | packages/ui/src/components/drawer.tsx:24                                                                                              | `md:w-drawer`                                                            | token                                                                                                 |
| `calc(env(safe-area-inset-top)+1.25rem)`                                                                           | drawer.tsx:31                                                                                                                         | keep                                                                     | sanctioned safe-area pattern                                                                          |
| `rounded-[10px]`                                                                                                   | packages/ui/src/components/placeholder-card.tsx:48                                                                                    | `rounded-panel`                                                          | +2px                                                                                                  |
| `borderRadius: 14` (inline)                                                                                        | packages/ui/src/components/compose-form.tsx:37                                                                                        | `rounded-panel`                                                          | −2px; part of finding #19 cleanup                                                                     |
| `backdrop-blur-[1px]`; `border-[2.5px]`; `translate-x-[3px]`/`[21px]`; `h-[22px]` (switch); `outline-offset-[3px]` | drawer.tsx:19; completion-toggle.tsx:56,76; switch.tsx:31,42-43; profile-avatar.tsx:50                                                | **exempt**                                                               | component-internal geometry (switch thumb travel, stroke widths, focus offsets) — not layout spacing  |
| `text-[10px]`                                                                                                      | permission-toggle-item.tsx:35,40; bottom-tab-bar.tsx:40                                                                               | `text-xs-token`                                                          | typography, cross-ref #21                                                                             |
| `text-[11px]`                                                                                                      | Settings.tsx:455; error-card.tsx:35; placeholder-card.tsx:55; profile-avatar.tsx:28; profile-list-item.tsx:26; settings-layout.tsx:20 | `text-section-label` where uppercase label; otherwise new `text-xs-body` | decision f: add an 11px/400 `xs-body` token — settled anatomies stay pixel-identical                  |
| `text-[13px]`                                                                                                      | confirm-dialog.tsx:46; error-card.tsx:28; placeholder-card.tsx:52; profile-avatar.tsx:29                                              | `text-sm-token`                                                          | exact                                                                                                 |
| `text-[15px]`                                                                                                      | MobileBrandTopBar.tsx:27                                                                                                              | `text-base-token`                                                        | snap −1px (consistent with decision a's snap-to-scale spirit)                                         |
| `text-[22px]`                                                                                                      | profile-avatar.tsx:31                                                                                                                 | keep                                                                     | scales with avatar size variant                                                                       |

### B.5 Decisions — **all resolved 2026-07-10** (human review in this session)

| #   | Question                                            | Ruling                                                                                                     |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| a   | Bless off-grid steps 1.75/4.5/5.5 (7/18/22px)?      | **Snap to base-4 grid** — 7→8, 18→16, 22→24; no custom rhythm steps                                        |
| b   | Meter height 5px vs 6px                             | **6px** (`--spacing-meter: 6px`)                                                                           |
| c   | AdminBoard row height vs 64px list-item minimum     | **Raise to 64px** (`min-h-row-touch`); visual check on a full board                                        |
| d   | CreateTaskDrawer 44px control vs 48px touch minimum | **Raise to 48px** (`min-w-touch`)                                                                          |
| e   | Hero radius 16 vs 18px                              | **16px** (`--radius-hero: 1rem`); FocusView cards tighten 2px                                              |
| f   | 11px/400 type-scale gap                             | **Add `xs-body` token** (11px/400); settled anatomies stay pixel-identical                                 |
| g   | Calendar time-rail 72 vs 68px                       | **Unify at 72px** (`w-18`); verify longest time strings fit the widget                                     |
| h   | FocusView 26px semibold DM Sans heading             | **Use `text-page-title`** — the hero task name becomes Lora; design-review the tier-1 surface on migration |

Consequence of (a): the widget divider rhythm moves 22→24px **uniformly** across feed/calendar widgets (alignment preserved), the AdminBoard lane inset moves 18→16px, and the FieldLabel gap moves 7→8px globally — all small but visible; the migration tasks include a visual pass.

Consequence of (f): the type-scale table in design-system.md gains one row (`xs-body` · `text-xs-body` · 11px · 400 · 1.4 · DM Sans) — land it with `spacing-tokens-land`.

---

## Part C — Remediation plan (structured for a multi-agent fix workflow)

Atomic tasks, grouped by axis. "Parallel" means no shared files / no ordering constraint. **Part B was approved 2026-07-10 (all B.5 decisions resolved), so no task is gated on human input anymore** — the only remaining ordering constraint is that `spacing-tokens-land` runs before the migration tasks that consume its tokens.

### Axis 1 — Radix / a11y / token compliance in packages/ui

- **id:** `a11y-completion-state`
  **title:** Expose checked state on CompletionToggle
  **findings:** #1
  **files:** packages/ui/src/components/completion-toggle.tsx, completion-toggle.stories.tsx (+ new test)
  **parallel with:** everything
  **AC:** interactive variant renders `role="checkbox"` + `aria-checked` (or is rebuilt on Radix Checkbox); state change is announced by AT; rendered visuals unchanged (Storybook diff); test asserts the ARIA state flips on toggle.

- **id:** `a11y-notification-delete`
  **title:** Keyboard-accessible notification delete
  **findings:** #2
  **files:** packages/ui/src/components/notification-item.tsx, notification-tray.test.tsx
  **parallel with:** everything
  **AC:** the × button is reachable by keyboard (rendered on focus-within, not only mouse hover) and activates with Enter/Space; hover and swipe behavior unchanged; test covers the keyboard path.

- **id:** `tabbar-radix-decision`
  **title:** TabBar: back with Radix Tabs or complete + document the hand-rolled version
  **findings:** #7
  **files:** packages/ui/src/components/tab-bar.tsx, tab-bar.test.tsx (+ package.json if Radix chosen)
  **parallel with:** everything
  **AC:** either rebuilt on `@radix-ui/react-tabs` with identical visuals, or Home/End key support added and a header comment documents the deliberate exception; tests cover Home/End.

- **id:** `segmented-radix-decision`
  **title:** SegmentedControl: same decision as TabBar
  **findings:** #8
  **files:** packages/ui/src/components/segmented-control.tsx, segmented-control.test.tsx
  **parallel with:** everything
  **AC:** same shape as `tabbar-radix-decision` (RadioGroup/ToggleGroup as the Radix backing).

- **id:** `ui-color-literals`
  **title:** Replace raw oklch literals in ui components with tokens
  **findings:** #9
  **files:** packages/ui/src/components/permission-toggle-item.tsx, pin-input.tsx, confirm-dialog.tsx
  **parallel with:** everything
  **AC:** `grep -rn 'oklch(' packages/ui/src/components` returns nothing outside calendar.css/styles.css; replacements use tokens or `color-mix` over tokens; visuals equivalent.

- **id:** `button-token-pass`
  **title:** Move Button onto elevation/type tokens
  **findings:** #17
  **files:** packages/ui/src/components/button.tsx
  **parallel with:** everything (coordinate with `focusview-button`)
  **AC:** `shadow`/`shadow-sm` → shadow tokens or documented flat; `text-sm`/`text-xs` → token utilities; focus-ring treatment decided and documented; full Storybook visual pass (this touches every button in the app — human design review required before merge).

- **id:** `ui-inline-style-cleanup`
  **title:** Utility-first conversion of inline-styled ui chrome + pin-input focus ring
  **findings:** #19
  **files:** packages/ui/src/components/compose-form.tsx, page-header.tsx, empty-state.tsx, pin-input.tsx
  **must run after:** `spacing-tokens-land` (the `borderRadius: 14` → `rounded-panel` bit); the rest can proceed independently
  **AC:** no `style={{…}}` for static chrome in these files; pin-input shows a visible focus indication; visuals unchanged except the 14→12px radius.

- **id:** `avatar-fallback`
  **title:** Initials fallback behind avatar photos
  **findings:** #22
  **files:** packages/ui/src/components/profile-avatar.tsx
  **parallel with:** everything
  **AC:** a broken/slow `avatarUrl` shows initials, not an empty circle (layered render or load-error state).

- **id:** `motion-token-pass`
  **title:** Replace hardcoded durations/easings with motion tokens
  **findings:** #20
  **files:** packages/ui/src/components/switch.tsx, notification-item.tsx; plugins/chores/src/components/TaskeeView.tsx, FocusView.tsx; apps/shell/src/components/ProfileGrid.tsx
  **parallel with:** everything
  **AC:** all timing via `--duration-*`/`--ease-*` (320ms → `--duration-slow` unless design objects); switch thumb `bg-white` → token; `prefers-reduced-motion` behavior unchanged.

- **id:** `ui-type-token-pass`
  **title:** Replace raw px font sizes in ui with type tokens
  **findings:** #21
  **files:** packages/ui/src/components/{error-card,placeholder-card,settings-layout,profile-list-item,profile-avatar,permission-toggle-item,confirm-dialog,bottom-tab-bar,input,textarea,notification-item}.tsx
  **must run after:** `spacing-tokens-land` (which lands the approved `xs-body` token, decision f)
  **AC:** no `text-[Npx]` in packages/ui except documented exemptions (avatar 22px); 11px regular text uses `text-xs-body`; default `text-sm`/`text-xs` on content text replaced with token utilities.

### Axis 2 — Spacing scale (Part B approved — ready to run)

- **id:** `spacing-tokens-land`
  **title:** Land spacing/dimension/radius tokens + design-system.md section
  **findings:** #4, #13 (token half)
  **files:** packages/ui/src/styles.css, docs/design-system.md
  **must run after:** nothing (Part B approved 2026-07-10); runs first in this group
  **AC:** B.2 + B.3 tokens exist in `@theme` (`--spacing-meter: 6px`, `--radius-hero: 1rem` per decisions b/e) plus the `xs-body` type token (decision f); design-system.md gains a Spacing section mirroring B.1/B.2 tables and the type-scale row; utilities compile (canary usage in a story); no call sites migrated yet.

- **id:** `spacing-migrate-ui` · `spacing-migrate-shell` · `spacing-migrate-chores` · `spacing-migrate-calendar` · `spacing-migrate-feed`
  **title:** Apply the B.4 mapping table per package (5 independent tasks)
  **findings:** #4, #13 (call sites), #23, #27 (calendar task), #28 (chores task)
  **files:** per the B.4 table, split by package
  **must run after:** `spacing-tokens-land`; **parallel with:** each other (worktree isolation recommended)
  **AC:** every B.4 row in scope applied per the approved rulings; `grep -rE -- '-\[[0-9.]+(px|rem)\]'` over the package returns only the exempt list; typecheck + package tests + Storybook build green; visual pass on the snap sites (18→16 lane inset, 22→24 widget rhythm, 7→8 label gap, bell-badge pill); calendar task includes 68→72 unify, chores task includes meter unify at 6px.

- **id:** `touch-target-fixes`
  **title:** Bring sub-minimum touch targets up to spec
  **findings:** #18
  **files:** plugins/chores/src/components/AdminBoard.tsx, CreateTaskDrawer.tsx
  **must run after:** `spacing-tokens-land` (decisions c/d resolved: 64px rows, 48px control)
  **AC:** AdminBoard rows use `min-h-row-touch` (64px), the drawer control `min-w-touch` (48px); admin board density visually reviewed at the new row height.

### Axis 3 — Cleanliness / DRY

- **id:** `comment-banner-cleanup`
  **title:** Strip CUT-class comments (banners + structural JSX labels)
  **findings:** #25
  **files:** plugins/chores/src/widgets/TodaySummaryView.tsx, components/{FocusView,ScorePlate}.tsx; plugins/calendar/src/widgets/UpNextView.tsx, lib/grid.ts, components/{ActivitiesView,CreateEventDrawer}.tsx, pages/CalendarPage.tsx
  **parallel with:** everything (pure deletions — rebase-trivial)
  **AC:** rule-line banners (`====`, `───`) and WHAT-restating JSX labels removed; all ADR/design citations and WHY comments untouched; zero behavior change (no code lines modified).

- **id:** `shared-date-lib`
  **title:** One shared date lib: parametric relativeDayLabel + date-only primitives
  **findings:** #5, #16
  **files:** new packages/ui/src/lib/dates.ts (+ index export); plugins/chores/src/lib/dates.ts; plugins/calendar/src/widgets/UpNextView.tsx, components/AgendaView.tsx (and lib/grid.ts re-exports); plugins/family-feed/src/pages/FeedPageView.tsx
  **parallel with:** `widget-header-primitive` (different files)
  **AC:** one `relativeDayLabel(date, now, { direction })` (+ shared `startOfDay`/`dayDiff`/`isSameDay`) with unit tests; all four call sites migrated; rendered labels unchanged (existing plugin tests green).

- **id:** `widget-header-primitive`
  **title:** WidgetHeader primitive in @family-os/ui
  **findings:** #6
  **files:** new packages/ui/src/components/widget-header.tsx (+ story, test, index export); the three widget views
  **parallel with:** `shared-date-lib`
  **AC:** `WidgetHeader({ icon, label, trailing? })` implements the settled identity-header anatomy; all three widgets compose it; visuals pixel-identical.

- **id:** `widget-cq-breakpoints`
  **title:** Share the widget container-query breakpoint constants
  **findings:** #15
  **files:** packages/ui (new constant/helper export); the three widget views
  **parallel with:** everything (touches same widget files as `widget-header-primitive` — sequence those two if run concurrently)
  **AC:** the 300px/440px breakpoint values defined once; per-widget variant markup unchanged.

- **id:** `dead-export-trim`
  **title:** Remove superfluous export keywords / decide PopoverAnchor
  **findings:** #26
  **files:** plugins/calendar/src/lib/{grid,hues}.ts, plugins/chores/src/lib/use-xp-flight.ts, packages/ui/src/components/popover.tsx
  **parallel with:** everything
  **AC:** file-internal types unexported; `PopoverAnchor` either removed or kept with a one-line shadcn-convention note; typecheck green.

### Axis 4 — Cross-view consistency / unimplemented anatomies

- **id:** `widget-error-boundary`
  **title:** Per-slot widget error boundary wiring ErrorCard
  **findings:** #3
  **files:** apps/shell/src/pages/Home.tsx, new apps/shell/src/components/WidgetErrorBoundary.tsx (+ test)
  **parallel with:** everything
  **AC:** a throwing widget renders `ErrorCard` in a flat `WidgetSlot` (per §Error state (slot level)) with a working retry remount; sibling slots unaffected; `ErrorCard` gains its production consumer (retires finding #3's dead-code half).

- **id:** `route-error-anatomy`
  **title:** Level-3 error anatomy on route-level failure surfaces
  **findings:** #12
  **files:** apps/shell/src/pages/PluginNotFound.tsx, apps/shell/src/components/PluginErrorBoundary.tsx (+ tests)
  **parallel with:** everything
  **AC:** both render the settled anatomy (Lucide icon 40px muted, Lora heading, one-line muted body, Back/Retry action).

- **id:** `settings-segmented-controls`
  **title:** Replace Settings' hand-rolled button groups with SegmentedControl
  **findings:** #10
  **files:** apps/shell/src/pages/Settings.tsx
  **parallel with:** everything
  **AC:** the appearance/tier/other groups compose `SegmentedControl`; behavior and persisted values identical; AT reads one radiogroup per switch.

- **id:** `focusview-button`
  **title:** FocusView "Mark done" composes Button
  **findings:** #11
  **files:** plugins/chores/src/components/FocusView.tsx (+ possibly a Button size variant in packages/ui)
  **must run after:** `button-token-pass` (soft — avoids double visual churn on the same control)
  **AC:** the CTA is a `Button` (new size/variant if needed); tap target and visuals design-reviewed on the tier-1 surface.

- **id:** `radius-token-migrate`
  **title:** Migrate C1 radius sites onto rounded-panel / rounded-hero
  **findings:** #13
  **files:** the finding-#13 site list (folds naturally into the per-package `spacing-migrate-*` tasks — implement there, keep this id for tracking)
  **must run after:** `spacing-tokens-land` (decision e resolved: 16px)
  **AC:** no `rounded-[Npx]` on card-like surfaces; panels/pills on `rounded-panel`, heroes on `rounded-hero` (FocusView's 2px tightening design-reviewed).

- **id:** `plugin-type-tokens`
  **title:** Replace raw px/inline font sizes in plugin content
  **findings:** #14
  **files:** plugins/chores/src/components/FocusView.tsx, widgets/TodaySummaryView.tsx
  **must run after:** nothing (decision h resolved: hero heading → `text-page-title`)
  **AC:** no inline `fontSize` on text content (decorative emoji sizing exempt); FocusView hero heading uses `text-page-title` (now Lora — design-review the tier-1 surface); `text-base` → token utility.

- **id:** `scoreplate-shadow`
  **title:** ScorePlate resting shadow onto --shadow-card
  **findings:** #24
  **files:** plugins/chores/src/components/ScorePlate.tsx
  **parallel with:** everything
  **AC:** the plain resting shadow uses the token; coin-material shadows (FlightChip, coin highlight) left for the future gold-token promotion, with a one-line note.

- **id:** `doc-adminboard-exception`
  **title:** Document the AdminBoard dense-lane exception in design-system.md
  **findings:** #29
  **files:** docs/design-system.md (§ItemCard)
  **parallel with:** everything
  **AC:** the ItemCard section records the sanctioned exception and its criteria (dense divider list + overlay/multi-control rows), so future sessions don't "fix" it.

### Gating summary (updated after Part B approval, 2026-07-10)

| Gate                                                                          | Tasks                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~Part B approval~~ **resolved** — sequenced after `spacing-tokens-land` only | `spacing-migrate-{ui,shell,chores,calendar,feed}`, `touch-target-fixes`, `radius-token-migrate`, `ui-type-token-pass`, tail of `ui-inline-style-cleanup`                                                                                                                               |
| No gate — start anytime                                                       | `spacing-tokens-land`, all axis-1 a11y/color/motion tasks, all axis-3 tasks, `widget-error-boundary`, `route-error-anatomy`, `settings-segmented-controls`, `focusview-button` (soft-after `button-token-pass`), `plugin-type-tokens`, `scoreplate-shadow`, `doc-adminboard-exception` |

---

## Open questions raised

- ~~Decisions (a)–(h) in B.5~~ — **resolved 2026-07-10** by human review in this session (see the B.5 register).
- Should the Radix-backing question for TabBar/SegmentedControl (#7, #8) become a small ADR? Both components are complete and well-built; the real decision is policy ("hand-rolled focus management is acceptable when X") rather than per-component.
- The widget-slot error boundary (#3) is arguably an unshipped M1 story remnant rather than an audit-scoped cleanup — it may deserve its own queue entry rather than a slot in the fix workflow.

## Execution addendum — fixes applied same day (2026-07-10)

The Part C plan was executed in this same session on branch `audit/design-system-fixes`
(6 parallel/sequential fix agents in disjoint file territories), live-reviewed,
signed off, and **fast-forward merged to main** — 74 files, 4 commits:

1. `[platform/design-audit]` — tokens + design-system.md §Spacing + this report
2. `[ui/design-audit]` — a11y + token compliance + shared primitives in packages/ui
3. `[shell/design-audit]` — WidgetErrorBoundary/ErrorCard wiring, Level-3 route errors, Settings SegmentedControls, shell migration
4. `[plugins/design-audit]` — spacing/radius/type migration + DRY consolidation across chores/calendar/family-feed

**Verification:** typecheck + lint clean on all 5 packages; tests green (ui 81 —
14 new; calendar 66; shell 3 — WidgetErrorBoundary new; chores/feed have no test
files); Storybook builds; shell builds with all 12 new token utilities confirmed
emitting; the arbitrary-`[Npx]` sweep returns only the documented exemption list.

**Task-level outcomes vs the Part C plan:**

- Executed in full: every task except the two below.
- `settings-segmented-controls` — 3 of 4 groups converted. The Appearance
  (light/system/dark) control needs an optional per-option icon slot on
  `SegmentedControl` before it can convert without dropping its icons.
  **Follow-up.**
- Radix-decision tasks (`tabbar-radix-decision`, `segmented-radix-decision`) —
  resolved as "complete + document" (Home/End added, header comments record the
  deliberate hand-roll); no Radix rebuild, no new deps.
- Deliberate exemptions recorded in code: the TodaySummary coin numeral inline
  15px (geometry-coupled to the coin composite), FlightChip gold glow shadow
  (awaits `--reward-*` promotion), profile-avatar 22px initials (size-coupled).
- Extra fixes found during execution: bell-badge severity bubble used hardcoded
  `text-white` — a latent contrast bug on `--warning` (dark foreground token);
  now uses the paired `-foreground` tokens.

**Open follow-ups:** SegmentedControl icon slot → convert Settings Appearance;
`--reward-*` gold token promotion (second consumer rule); optional ADR for the
"hand-rolled focus management is acceptable when…" policy (#7/#8).

## What the next session needs to know

- This was read-only: no code, docs (other than this log), or config changed; nothing committed by the audit itself.
- **Part B is approved with all eight decisions resolved** (B.5 register). Every Part C task is runnable; the only ordering constraint is `spacing-tokens-land` before the migration tasks that consume its tokens.
- Decision (a) means the migrations are not purely mechanical renames at the snap sites — the 18→16 lane inset, 22→24 widget rhythm, 7→8 label gap, and hero-heading→Lora changes are small but visible; each migration task carries a visual pass in its AC.
- The comment-ratio baseline used in the audit brief is wrong (see corrected table) — don't scope a "comment de-bloat" session; scope the small banner cleanup plus the two DRY consolidations instead.
