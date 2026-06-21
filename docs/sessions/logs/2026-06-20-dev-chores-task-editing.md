# 2026-06-20 — Dev: Chores Task Editing (ad-hoc)

Ad-hoc session (no kickoff). The **edit/remove task flow** was missed in M2
scoping; added it, reusing the create drawer.

## Built

- **API** — `PATCH /api/chores/tasks/:id` (edit) + `DELETE /api/chores/tasks/:id`
  (remove), both tier-4 only via new CASL `update` / `delete` actions (covered by
  tier-4 `manage all`). PATCH mirrors the create validation (title required,
  assignee exists, dueDate parse); DELETE returns 204. **+9 API tests → 172 total.**
- **Edit drawer** — `CreateTaskDrawer` gained an `editingTask` prop: prefills all
  fields, header "Edit task", CTA "Save changes". Create path unchanged. Container
  (`ChoresPage`) routes submit to `updateTask` vs `createTask` and adds a
  `deleteTask` mutation + `ConfirmDialog`.
- **Row actions** — `AdminBoard` rows get **tap-row-to-edit** (stretched
  transparent button over the row's passive area; real controls layered above) +
  inline **Remove** (trash → confirm). Pencil affordance on `sm+`, hidden on
  mobile (tap-row is the path there). 44px touch targets; completion toggle wrapped
  to a 44px box and kept above the edit hit-area.
- **Empty-state fix** — suppressed the duplicate header primary action on empty
  (chores **and** family-feed); empty CTA normalized to `size="sm"` to match the
  `EmptyState` stories + family-feed.
- Storybook: added Drawer "Edit — prefilled" story; updated Admin + AdminEmpty
  references.

## Decided

- **XP retained on delete.** Deleting a completed task does **not** claw back banked
  XP — consistent with `reopen` (which also doesn't decrement) and the ledger-less
  `xp_balances` running total. Deliberate; option to claw back rejected.
- **Inline row actions over a kebab** (per the inline prompt). Kebabs lean on hover
  (absent on touch) and the app already established inline edit/remove in
  settings → profiles. Reconciled in the design doc.
- **Empty state owns the primary CTA** (suppress header action when empty) — new
  cross-cutting rule in `design-system.md`.

## Design reconciliation (deviations surfaced + recorded)

- `design.md` §1 specced a hover **kebab (edit/remove)** → shipped inline tap-row +
  Remove (44px). §3 specced **Remove beneath the drawer CTA** → shipped as a row
  action; drawer footer is the primary CTA only. Both sections updated with dated
  reconciliation notes. Drag handle (hover) still owed to 1.5.

## Next session needs to know

- **M2 Dev: Focus Mode** is still the next queued story (taskee Focus view +
  per-profile `focusMode` setting; also owns the widget's Focus "Next up" variant).
- Editing a **completed** task is allowed but its XP edit won't retro-adjust the
  banked balance (no per-task ledger) — fine for now; revisit if an XP economy lands.
