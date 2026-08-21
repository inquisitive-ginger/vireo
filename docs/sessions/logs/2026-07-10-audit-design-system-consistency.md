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
- 82 arbitrary dimension values across 27 files: 77 bracket utilities (`px-[18px]`, `min-h-[54px]`, …) + 5 `calc()` expressions. Disposition summarized in B.4.
- The codebase otherwise uses standard Tailwind numeric utilities (base-4 grid), so most arbitrary values are near-grid stragglers or unnamed semantic dimensions.

### B.1 Rhythm scale

**✅ Approved 2026-07-10 (decision a: snap to base-4 grid** — 7→8, 18→16, 22→24; no custom rhythm steps). A sanctioned-step convention on Tailwind v4's single `--spacing: 0.25rem` base — zero CSS additions; bracket-arbitrary `[Npx]` spacing banned once migration lands, except documented exemptions. Table lives in design-system.md §Spacing.

### B.2 Semantic dimension tokens

**✅ Approved 2026-07-10** — with `--spacing-meter: 6px` (decision b). Eight tokens (`--spacing-touch/row-touch/tab-bar/top-bar/sidebar/meter`, `--container-content/drawer`) landed in `@theme` in `packages/ui/src/styles.css`. Table lives in design-system.md §Spacing.

### B.3 Radius companion (resolves finding #13)

**✅ Approved 2026-07-10** — `--radius-hero: 1rem` (decision e: 16px; FocusView's two 18px cards tighten by 2px). Adds `--radius-panel` (12px) and `--radius-hero` (16px) beside the existing `--radius-card`. Table lives in design-system.md §Spacing.

### B.4 Mapping table

All 82 call sites across 27 files were mapped to a per-site disposition (B.1 step / B.2–B.3 token / keep-exempt) and fully migrated in this session's execution pass; the surviving exemption rules (component-internal geometry, safe-area `calc()`, single-consumer widths) live in design-system.md §Spacing §Rules.

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

## Part C — Remediation plan

Atomic tasks grouped by axis, executed same day — outcomes in the Execution
addendum below. The per-task files/AC detail was cut after execution; task ids
retained. Only ordering constraint: `spacing-tokens-land` before the migration
tasks that consume its tokens.

**Axis 1 — Radix / a11y / token compliance in packages/ui:**
`a11y-completion-state` — expose checked state on CompletionToggle (#1) ·
`a11y-notification-delete` — keyboard-accessible notification delete (#2) ·
`tabbar-radix-decision` — TabBar: Radix Tabs or complete + document (#7) ·
`segmented-radix-decision` — same decision for SegmentedControl (#8) ·
`ui-color-literals` — replace raw oklch literals with tokens (#9) ·
`button-token-pass` — Button onto elevation/type tokens (#17) ·
`ui-inline-style-cleanup` — utility-first ui chrome + pin-input focus ring (#19) ·
`avatar-fallback` — initials fallback behind avatar photos (#22) ·
`motion-token-pass` — hardcoded durations/easings → motion tokens (#20) ·
`ui-type-token-pass` — raw px font sizes in ui → type tokens (#21)

**Axis 2 — Spacing scale:**
`spacing-tokens-land` — land B.2/B.3 tokens + design-system.md §Spacing (#4, #13) ·
`spacing-migrate-{ui,shell,chores,calendar,feed}` — apply the B.4 mapping per
package, parallel (#4, #13, #23, #27, #28) ·
`touch-target-fixes` — 64px rows / 48px control per decisions c/d (#18)

**Axis 3 — Cleanliness / DRY:**
`comment-banner-cleanup` — strip CUT-class comments (#25) ·
`shared-date-lib` — one shared relativeDayLabel + date-only primitives (#5, #16) ·
`widget-header-primitive` — WidgetHeader in @family-os/ui (#6) ·
`widget-cq-breakpoints` — shared container-query breakpoint constants (#15) ·
`dead-export-trim` — unexport file-internal types / decide PopoverAnchor (#26)

**Axis 4 — Cross-view consistency / unimplemented anatomies:**
`widget-error-boundary` — per-slot boundary wiring ErrorCard (#3) ·
`route-error-anatomy` — Level-3 anatomy on route failure surfaces (#12) ·
`settings-segmented-controls` — Settings button groups → SegmentedControl (#10) ·
`focusview-button` — "Mark done" composes Button (#11) ·
`radius-token-migrate` — radius sites onto rounded-panel/hero (#13; folded into
`spacing-migrate-*`, id kept for tracking) ·
`plugin-type-tokens` — raw px/inline font sizes in plugin content (#14) ·
`scoreplate-shadow` — ScorePlate resting shadow onto `--shadow-card` (#24) ·
`doc-adminboard-exception` — document the AdminBoard exception in
design-system.md (#29)

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
