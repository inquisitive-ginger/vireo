# Idea

Status: locked (session 0, adopted 2026-11-14)

**Vireo**, renamed 2026-08-22 from the "Family OS" working title (D-065). Infrastructure identifiers (the `@family-os/*` package scope, the GitHub repo, GHCR image names, the `familyos` databases, `/opt/family-os` on the Pi) deliberately keep the old name.

## Problem

Family life is managed across a fragmented set of apps, tools and mental overhead. Chores, schedules, money, routines and communication live in different places with no shared context, and the kids have no real part in any of them. Vireo brings these into one locally-hosted system that a family organizes, coordinates and grows with, on its own hardware.

## Users

- **Parents** (tier 4): set the household up, assign and approve, plan dinners, triage reports.
- **Kids** at different ages and trust levels (tiers 1–3): see what's theirs today, do it, earn, spend. The system gives them real agency appropriate to their tier (D-003) and grows up with them.
- **The house** (the wall): the fridge iPad, signed in as the family pseudo-profile (D-021, D-060, D-072). Glanced at from arm's length, often with wet hands.
- Later: any family that wants to run it, through community plugins.

## Features

Priority: `must` (first release) · `should` · `later`. IDs are permanent; retire, never renumber.

| ID    | Feature                                                                               | Priority | Notes                                                         |
| ----- | ------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------- |
| F-001 | A parent sets up the household and each member's profile and trust tier               | must     | Built before Throughline. platform; D-003, D-017              |
| F-002 | A member picks their profile and signs in with a PIN; the wall signs in as the house  | must     | Built before Throughline. platform; D-017, D-021, D-060       |
| F-003 | Every member has an assigned, unique identity colour that follows them everywhere     | must     | Built before Throughline. platform; D-030, D-041, D-044       |
| F-004 | Each member and the wall see a home screen of widgets from every module               | must     | Built before Throughline. platform; D-022, D-028, D-039       |
| F-005 | A parent adjusts what each profile is allowed to do                                   | must     | Built before Throughline. platform; D-015, D-018              |
| F-006 | Members get notifications in the app and as web push                                  | must     | Built before Throughline. platform; D-029                     |
| F-007 | Vireo installs as an app on the tablet and phones, with a mobile nav                  | must     | Built before Throughline. platform; D-010, D-033, D-034       |
| F-008 | Anyone reports a problem from the screen it happened on and hears when it's fixed     | must     | Built before Throughline. platform; D-046                     |
| F-009 | A member turns on focus mode to see only what's theirs                                | should   | Built before Throughline. platform; D-036                     |
| F-010 | A member's avatar can be a photo                                                      | should   | Built before Throughline. platform; D-042                     |
| F-011 | The family posts to and reads a shared feed                                           | must     | Built before Throughline. family-feed                         |
| F-012 | A parent assigns chores and each kid sees today's                                     | must     | Built before Throughline. chores; D-043                       |
| F-013 | A kid completes a chore in one tap; a parent checks it off or reopens it              | must     | Built before Throughline. chores                              |
| F-014 | A parent edits or removes a chore                                                     | must     | Built before Throughline. chores                              |
| F-015 | Chores repeat on a routine without being re-entered                                   | must     | Built before Throughline. chores; D-058                       |
| F-016 | A kid claims an up-for-grabs chore, then does it                                      | should   | Built before Throughline. chores; D-059                       |
| F-017 | A parent hears when a chore is done                                                   | must     | Built before Throughline. chores; D-029                       |
| F-018 | Kids earn XP for chores                                                               | must     | Built before Throughline. chores; D-056                       |
| F-019 | The family reads the month at a glance on the wall, coloured by who                   | must     | Built before Throughline. calendar                            |
| F-020 | A member creates and edits events, on the wall or a phone                             | must     | Built before Throughline. calendar; D-037                     |
| F-021 | Activities repeat, including daily time windows                                       | must     | Built before Throughline. calendar; D-038, D-057              |
| F-022 | Members get reminded before an event                                                  | must     | Built before Throughline. calendar; D-045                     |
| F-023 | An Up Next widget shows what's coming                                                 | must     | Built before Throughline. calendar                            |
| F-024 | Other modules mark days on the calendar (e.g. who's got dinner)                       | should   | Built before Throughline. calendar; D-050, D-066              |
| F-025 | Kids earn Pritchett Bucks for chores, held for approval where a parent wants          | must     | Built before Throughline. rewards; D-047, D-048, D-052, D-054 |
| F-026 | A kid sees their balance and where it went                                            | must     | Built before Throughline. rewards; D-051, D-053               |
| F-027 | A parent keeps a catalog of rewards                                                   | must     | Built before Throughline. rewards                             |
| F-028 | A kid buys a reward ticket, keeps it, and asks to use it; a parent grants or declines | must     | Built before Throughline. rewards; D-055                      |
| F-029 | Kids fill punch cards                                                                 | should   | Built before Throughline. rewards; D-049                      |
| F-030 | A parent grants a bonus or corrects a ticket                                          | should   | Built before Throughline. rewards                             |
| F-031 | The family plans the week's dinners and sees tonight's, claiming one in a tap         | must     | Built before Throughline. meals; D-063, D-064                 |
| F-032 | Whoever has dinner gets nudged in the afternoon, and parents when nobody does         | must     | Built before Throughline. meals; D-045                        |
| F-033 | A dinner links to its recipe                                                          | should   | Built before Throughline. meals                               |
| F-034 | A dinner is dragged to another day, moving or swapping it                             | should   | Built before Throughline. meals                               |
| F-035 | The family keeps one shopping list, captured fast and in walk order                   | must     | Built before Throughline. shopping; D-069, D-070, D-072       |
| F-036 | Two shoppers check items off together in the store                                    | must     | Built before Throughline. shopping; D-071                     |
| F-037 | A dinner's needs push to the shopping list                                            | should   | Built before Throughline. shopping, meals; D-069              |
| F-038 | The list keeps working with no signal in the store                                    | should   | Built before Throughline. shopping                            |
| F-039 | A member takes back their own add for fifteen minutes                                 | should   | Built before Throughline. shopping; D-073                     |
| F-040 | Kids spend XP on a companion critter and its gear                                     | must     | In flight. companion; D-061, D-062                            |

## Non-goals

- Not a cloud SaaS product.
- Not a replacement for specialized tools; it integrates with them.
- Not built for a single age of child; it adapts by tier.
- No recipe bank: the free-text needs field removes the reason for one.
- Nothing recycled in the 2026-09-07 queue audit comes back without a new request.

## Constraints

- Local-first: runs on a Raspberry Pi 5 at home; the family's data stays in the house. Reachable at `vireohome.app` (`docs/deployment.md`).
- One maintainer (Zach). Merge to main deploys to the live household in about 15 minutes.
- First-party modules are plugins built against the same plugin API community plugins would use (D-001, D-014).
- Every milestone is used by the family before the next begins.

## Success

Six months on, the family still runs its week from Vireo without being reminded to, the kids open it on their own, and problems keep getting reported because reports visibly get fixed.

## Suggested stacks

Decided: D-006 (stack), D-016 (monorepo), D-019 (ORM), D-023/D-024 (testing).
