# Roadmap

Status: `todo` · `in progress` · `in review` (approver has a link) · `locked`. Stage: `ideate` · `plan` · `build`. Type: `decide` · `build` · `verify` · `critique` · `feature`.
Every session fits in under an hour: one deliverable, inputs locked before it starts. `/replan` keeps this table true; `/status` reads it.
Adopted 2026-11-14: Vireo was built and live before Throughline, so Scaffold and Launch count as locked. Milestones M0–M5.5 and everything before this table: `docs/history/roadmap-milestones.md` and `docs/sessions/logs/`.

| #   | Stage  | Session                  | Type   | Features     | Approver | Depends | Status |
| --- | ------ | ------------------------ | ------ | ------------ | -------- | ------- | ------ |
| 0   | ideate | Idea one-pager (adopted) | decide | —            | Zach     | —       | todo   |
| 1   | plan   | Roadmap                  | decide | —            | Zach     | 0       | todo   |
| 2   | build  | Companion: feature UX    | decide | F-040        | Zach     | 1       | todo   |
| 3   | build  | Companion: foundation    | build  | F-040        | Zach     | 2       | todo   |
| 4   | build  | Companion: surfaces      | build  | F-040        | Zach     | 3       | todo   |
| 5   | build  | Family feed: test suite  | build  | F-011        | Zach     | 1       | todo   |
| 6   | build  | Enhancements             | build  | F-008, F-004 | Zach     | 1       | todo   |

## Review links

| Session | Artifact | Sent | Responded |
| ------- | -------- | ---- | --------- |

## Fixes

- — · #145 · F-021 · One timed event that spans several days shows as one continuous span · needs info: Zach checking with Mom; may reopen D-057

## Enhancements

- 6 · F-008 · A maintainer token lets `issues.onStatus` move a report's status without a PIN login · Done when a script holding only the token PATCHes a report to `deployed` and the reporter is notified, and the token can't call any other route · D-075
- 6 · F-004 · ADR 074 records that Home overrides the frame's bottom inset (`md:pb-6`) · Done when ADR 074 says so, under the 6000-byte cap · D-076

## Changes

- 2026-11-14 · Adopted Throughline: sessions 2–4 carry the M4.5 Companion plan (`docs/reference/companion/`), 5 the family-feed test addendum, 6 the bridge token and an owed ADR line · the queue and kickoffs retire
