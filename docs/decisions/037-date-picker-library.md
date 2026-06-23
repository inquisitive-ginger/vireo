# 037 — Date picker: react-day-picker, themed by token

**Status:** Decided

**Decision:** The calendar's date **form inputs** (and, retrofitted, the chores
due-date field) use **`react-day-picker` v10** wrapped as shared
`@family-os/ui` components, themed to our design tokens:

- **`Calendar`** — `DayPicker` themed entirely through its documented `--rdp-*`
  CSS variables → our tokens (selection/today `--primary`, `var(--font-ui)`,
  Lucide `Chevron`); a single selected day **fills** via a small scoped rule
  (`react-day-picker/style.css` + `calendar.css`). Supports `single` and `range`.
- **`Popover`** — Radix `@radix-ui/react-popover` on `--shadow-raised`, with a
  `container` prop so a picker inside a modal Drawer portals **into the dialog**
  (a body-portaled popover falls outside the dialog's dismiss scope and becomes
  non-interactive).
- **`DatePicker`** — single-date field (Input-styled trigger → `Calendar` in a
  `Popover`; `fromDate` min constraint; auto-resolves the nearest `[role="dialog"]`
  as the portal container).
- **`DateRangePicker`** — range variant (the event drawer's "Multiple days").

Added deps to `packages/ui`: `react-day-picker`, `date-fns`, `@radix-ui/react-popover`.

**Why:**

- **Best UX-per-effort for this stack.** It is the shadcn-canonical picker, so it
  matches our copy-paste-ownership model (ADR 012): we own the markup and theme it
  with tokens — no fighting a UI kit's styling. **Range mode** solves multi-day
  spans elegantly. Accessible + keyboard out of the box.
- **On-brand.** Themed via the `--rdp-*` variables it reads as _our_ calendar, not
  a generic widget; dark-mode-aware through the same tokens.
- **The big month grid is unaffected** — that is a custom component (locked in M3
  Design); this library is only for the popover form inputs.

**Alternatives considered:**

- **react-aria / React Spectrum (headless).** Best-in-class a11y + i18n and true
  combined date+time/range, but off the shadcn idiom and more boilerplate to theme
  to tokens; i18n we don't need for one household.
- **Polish the native `<input type=date>`** (the chores stop-gap). Zero deps and
  great on mobile, but inconsistent/ugly on the hero tablet and **no range**.
- **MUI X / Mantine pickers.** Powerful but drag in their own styling systems
  (emotion/Material) that fight Tailwind tokens and the "no AI aesthetic" brand.

**Notes:**

- **Time** uses the native `<input type=time>` for now; a stepped time picker is
  optional future polish.
- The chores due-date retrofit ships with the calendar dev work (one shared
  component, two consumers).

**Do not revisit unless:** we need full date+time+range with serious i18n (then
react-aria becomes worth the theming cost), or react-day-picker drops React 19 /
token-theming support.
