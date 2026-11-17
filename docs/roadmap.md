# Roadmap

Dashboard: https://claude.ai/artifact/6mgQwsWx852Tp7a2kEzxYe

Status: `todo` · `in progress` · `in review` (approver has a link) · `locked`. Stage: `ideate` · `plan` · `build`. Type: `decide` · `build` · `verify` · `critique` · `feature`.
Every session fits in under an hour: one deliverable, inputs locked before it starts. `/replan` keeps this table true; `/status` reads it.
Adopted 2026-11-14: Vireo was built and live before Throughline, so Scaffold and Launch count as locked. Milestones M0–M5.5 and everything before this table: `docs/history/roadmap-milestones.md` and `docs/sessions/logs/`.

| #   | Stage  | Session                        | Type    | Features     | Approver | Depends | Status    |
| --- | ------ | ------------------------------ | ------- | ------------ | -------- | ------- | --------- |
| 0   | ideate | Idea one-pager (adopted)       | decide  | —            | Zach     | —       | locked    |
| 1   | plan   | Roadmap                        | decide  | —            | Zach     | 0       | locked    |
| 2   | build  | Enhancements                   | build   | F-008, F-004 | Zach     | 1       | locked    |
| 3   | build  | Family feed: test suite        | build   | F-011        | Zach     | 2       | locked    |
| 3a  | build  | Calendar: repeats (#152, #153) | decide  | F-021, F-023 | Zach     | —       | locked    |
| 3b  | build  | Calendar: repeats (#152, #153) | build   | F-021, F-023 | Zach     | 3a      | locked    |
| 3c  | build  | Feature: Who drives the kids   | feature | —            | Zach     | —       | in review |
| 4   | build  | Companion: feature UX          | decide  | F-040        | Zach     | 3       | todo      |
| 5   | build  | Companion: foundation          | build   | F-040        | Zach     | 4       | todo      |
| 6   | build  | Companion: surfaces            | build   | F-040        | Zach     | 5       | todo      |

## Review links

| Session | Artifact                                          | Sent       | Responded  |
| ------- | ------------------------------------------------- | ---------- | ---------- |
| 0       | https://claude.ai/artifact/LKfV2cfMwoYqz2sZC7Y1v6 | 2026-11-14 | 2026-11-14 |
| 1       | https://claude.ai/artifact/RkjwctcWZouyTntvNZ8SxW | 2026-11-14 | 2026-11-14 |
| 2       | https://claude.ai/artifact/CT4Kk8KjrQRewiNi45eKeT | 2026-11-14 | 2026-11-14 |
| 3       | https://claude.ai/artifact/GUhbYwJzQ2jRuUQucMmdNe | 2026-11-14 | 2026-11-14 |
| 3a      | https://claude.ai/artifact/VYyC3KVxToStjQHMxjZDCi | 2026-11-16 | 2026-11-16 |
| 3b      | https://claude.ai/artifact/B5wGhKbprzCQndxu8wMcry | 2026-11-16 | 2026-11-17 |
| 3c      | https://claude.ai/artifact/TH2aAR7Ey3Fpz7VBiuQqYT | 2026-11-17 |            |

## Fixes

- — · #145 · F-021 · One timed event that spans several days shows as one continuous span · needs info: Zach checking with Mom; may reopen D-057

## Enhancements

- 2 · F-008 · A maintainer token lets `issues.onStatus` move a report's status without a PIN login · Done when a script holding only the token PATCHes a report to `deployed` and the reporter is notified, and the token can't call any other route · D-075 · shipped 2026-11-14
- 2 · F-004 · ADR 074 records that Home overrides the frame's bottom inset (`md:pb-6`) · Done when ADR 074 says so, under the 6000-byte cap · D-076 · shipped 2026-11-14

## Changes

- 2026-11-17 · Added 3c Feature: Who drives the kids · Zach asked for a dedicated answer to "who's dropping off / picking up" each kid today, on the calendar but quieter than an event chip, with reminders before
- 2026-11-14 · Added 3a, 3b Calendar: repeats (#152, #153) · Zach asked, via /triage, for monthly repeats (#152, reopens D-038) and for the all-week band to hold only what really runs most of the week (#153, reopens D-057)
- 2026-11-14 · Reordered: Enhancements is now 2 and Family feed: test suite 3, then the Companion sequence as 4–6 (each depends on the one before) · Zach on the session 01 board: "put the enhancements and family feed up next then companion sequence." (D-079)
- 2026-11-14 · Adopted Throughline: sessions 2–4 carry the M4.5 Companion plan (`docs/reference/companion/`), 5 the family-feed test addendum, 6 the bridge token and an owed ADR line · the queue and kickoffs retire
