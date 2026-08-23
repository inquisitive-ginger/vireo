# 066 — A Day Mark Carries Its Provider's Permission

**Status:** Decided (2026-08-22) · Extends ADR 050 (day-mark contract) with the
gate ADR 018 supplies the mechanism for

## Decision

A day mark is visible only to a profile who could see the underlying fact in the
providing plugin. Both gates apply, **conjunctively**:

- `calendar.event.view` gates the **surface** — no calendar, no marks, and the
  `day-marks` range endpoint 403s the same way `GET /calendar/events` does.
- The **provider's own** `(action, subject)` gates **its** marks —
  `view meals.PlannedMeal` for dinner, School's own subject for "no school Monday".

Consequences that are part of the decision:

- **Registration declares the permission.** A provider registers
  `{ name, action, subject, fetch }`; the field is **required** and there is no
  permissive default. A provider that cannot name its subject does not register.
- **Filtering is per provider, not all-or-nothing.** A kid with calendar view and
  no meal-plan view sees the month grid with School's marks and without dinner.
- **The aggregator filters server-side**, before `fetch` is called — a mark the
  caller may not see never crosses the wire, so no client gate is load-bearing.
- **The provider still applies its own row conditions.** Passing the caller's
  ability to `fetch` keeps `accessibleBy()` semantics intact; the subject check is
  the floor, not a substitute for the conditions on it.
- **The cap is applied after filtering** — two marks means two the caller can see,
  not two minus the ones they can't.

## Why

- **The failure is concrete and silent.** Dinner attribution is exactly the payload
  ADR 050 says a mark is; letting the calendar re-publish it under
  `calendar.event.view` launders a `meals` fact past a revoked `meals.plan.view`,
  and nothing in the UI would show that it happened.
- **A read-time contribution does not change who owns the fact.** ADR 050 keeps the
  contributing plugin the single source of truth; a source of truth that cannot
  gate its own reads is not one.
- **The second consumer needs a different answer.** "No school Monday" is a fact
  every tier should see, and a dinner assignment may not be. One shared gate forces
  those two to move together; a provider-declared gate lets School plug in with the
  visibility School wants and no edit to `plugins/calendar`.
- **The surface gate is not redundant.** Without it, a profile with meal-plan view
  and no calendar could pull dinner marks out of the calendar's endpoint.
- **It costs nothing.** The registry already holds `action` + `subject` per
  permission (ADR 018), and `request.ability.can()` is the same call every route
  already makes.

## Alternatives considered

- **`calendar.event.view` alone.** One check, one mental model — and the leak this
  ADR exists to close. Rejected on the concrete case, not on principle.
- **Provider permission alone.** Fixes the leak, but makes the calendar's own gate
  bypassable through the marks endpoint and gives a plugin a way to render into a
  surface the caller cannot open.
- **A dedicated `calendar.day-mark.view` permission.** A third string to grant, and
  it still has to be per provider to be useful — so it is this decision plus a
  synonym.
- **Client-side filtering in `plugins/calendar`.** The payload is already on the
  device; a gate that ships the data it is gating is not a gate.

## Do not revisit unless

A provider needs a mark **more** visible than its own data — a fact derived from
rows the caller cannot read (an anonymized "someone has dinner" state). That is a
new, coarser subject on the **provider's** side, not a change to which gate the
calendar honours.
