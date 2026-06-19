# Story: Today's Chores Widget

**Module:** chores
**Status:** ✅ Done

## User story

As a family member, I can see today's chores on the home screen so that I know what needs doing at a glance.

## Scope

**In:**

- `chores.today-summary` widget component in the `chore-engine` plugin (`./widgets/TodaySummary`)
- Registered in the plugin manifest `widgets[]` array with `id: "chores.today-summary"` (must match the reserved layout seed exactly — ADR 028)
- `supportedSizes: ['compact', 'standard', 'large']`, `defaultSize: 'standard'`, `minTier: 1`, `requiredPermission: 'chores.task.view'`
- **Standard size** (~180px tall — 1 row): pending task count + profile name; compact empty state if no pending tasks
- **Large size** (~376px tall — 2 rows): scrollable task list (up to 4–5 rows visible without scrolling), each row with title, assignee identity hue as 4px left spine, status indicator; XP total as `text-card-title` metric at bottom
- Task filtering:
  - Tier 1–2 profiles: own assigned tasks only
  - Tier 3–4 and family pseudo-profile: all tasks across the family
- Empty state copy: tier 1 → "All done! Nothing today!"; tier 2+ → "No tasks scheduled today"
- CSS container queries for size adaptation (no media queries — ADR 014)
- Widget identity header: `CheckSquare` icon at 13px + "CHORES" in `text-section-label` at `--accent` (standard design-system widget header pattern)
- Storybook stories: standard size with tasks, large size with tasks, empty state (both tier variants)
- The widget fills the placeholder slot that was already seeded for `chores.today-summary` in the home surface default layouts

**Out:** Create-task shortcut from widget; completed task history in widget; due-date filtering toggle; drag-and-drop resize (M1+)

## Acceptance criteria

1. `chores.today-summary` renders in the reserved home screen slot for all profiles (tier 1–4, including family pseudo-profile)
2. The widget `id` in the manifest is exactly `chores.today-summary` (matches the ADR 028 reserved seed — the placeholder card disappears and the live widget appears)
3. Standard size shows a pending task count and a brief message
4. Large size shows a task list; each row has a 4px left spine in the assignee's identity hue
5. Tier 1–2 profiles see only tasks assigned to them; tier 3–4 and family pseudo-profile see all tasks
6. Empty state renders with the correct tier-appropriate copy; no CTA button in the widget (task creation is on the full chores page)
7. CSS container queries — no `@media` breakpoints in the widget component
8. Storybook stories pass for standard (with tasks), large (with tasks), and empty state (tier 1 + tier 2+ copy variants)

## Dependencies

- task-model-creation (provides the API and data model the widget reads from)
- M2 Design: Chores (widget visual design and layout)

## Notes

- The widget reads from `GET /api/chores/tasks` — same endpoint as the full-page view, filtered by the same CASL rules
- XP display in large size uses `text-card-title` (not `text-metric`); the full `text-metric` treatment is on the chores full-page view (xp-award story)
- The chores.today-summary placeholder card was seeded in the home surface default layouts by the home-surface story — the widget simply replaces it by shipping with the matching `id`
- Assignee identity hue: use `getIdentityHue(assignee.name)` from `@family-os/ui` (consistent with family-feed pattern until explicit hue field is on the profile)
