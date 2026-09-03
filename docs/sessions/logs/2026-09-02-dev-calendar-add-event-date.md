# 2026-09-02 — Dev: calendar "Add event" date prefill (auto-bug #128)

**Type:** development (bug fix, ad-hoc) · **PR:** #130 (merged) · **Issue:** #128
**Report id:** `2b882a8c-dd86-455f-8a1d-4da12681270f` — Dad (tier 4), route
`/calendar`, 1112×814, macOS Safari, build `DevSCXR5`

## What was reported

> Clicking add event from specific day does not set the date field appropriately

## What was wrong

`CalendarPage.tsx` had four ways to open the create drawer and only one of them
dropped the date. The month cell's hover `+`, each day section's `+ Add`, and the
empty-day CTA all passed their own `Date` into `openCreate`. The chrome's primary
**Add event** button passed `null`, so `blankDefaults` fell back to
`startOfDay(new Date())` — today — no matter which day, week, or month was on
screen.

The drawer itself was innocent: `prefillDate` → `blankDefaults` → the RHF reset
on open all behaved, and `DatePicker` is fully controlled. Reading it top-down
costs a while before the one-line caller shows itself, which is worth remembering
the next time a prefill looks broken.

## What was built

A derived `headerAddDate` feeding the chrome CTA:

- **day view** → the drilled-in day.
- **week view** → `null` when today falls inside the visible week, else that
  week's Sunday.
- **month view** → `null` when the cursor month is the current month, else the
  1st of the month on screen.

`null` still means "today", so the common case — adding from this month — is
unchanged. Nothing else moved: the mobile agenda's CTA keeps `null` on purpose
(that surface is today-forward by construction), and the three per-day
affordances were already correct.

## Verification

- Three new tests in `CalendarPage.test.tsx` — drilled-in day, stepped-away
  month, and the today default. Two of them fail against the old caller
  (confirmed by stashing the fix and re-running), so they pin the behaviour
  rather than restate it.
- `plugin-calendar` 145/145, typecheck and eslint clean.
- Live review in the real shell at `localhost:5173`, signed off by the user
  before the PR opened.

## Notes for the next session

- **The worktree needed more than `.env`.** Docker Desktop was down, and — new
  since the repo directory was renamed `family-os` → `vireo` — plain
  `docker compose up` derives its project name from the directory, so it created
  an **empty** `vireo_postgres_data` volume instead of attaching the real
  `family-os_postgres_data`. The API came up against a blank database. Recovered
  with `COMPOSE_PROJECT_NAME=family-os docker compose up -d` and removed the
  empty volume. **Pinning `name: family-os` in `docker-compose.yml` would close
  this for good** — not done here, it is outside a bug fix's scope, but it will
  bite the next person who runs the stack from a worktree.
- **No ADR, no progress row.** Bug fixes aren't tracked on the module board (the
  #123 fix set that precedent), and nothing here settles a question.
- The `deployed` flip is the last step of the loop, not a doc bullet — see
  `platform.bug_reports`.
