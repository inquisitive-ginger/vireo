# Session 03c — Feature: Who drives the kids

Type: feature · Approver: Zach · Status: in progress · Started: 2026-11-17 07:05 · Ended: —

## Goal

Zach decides which capabilities a "who's dropping off / picking up" feature adds, how it shows on the calendar, and the sessions that build it.

## Inputs

Intake (Zach, via /feature, 2026-11-17): a dedicated answer to "who's dropping off / picking up child X/Y today". The main case is school drop-off in the morning and pickup after school. Some days add a pickup from an after-school activity (yarn club) and a drive to an evening one (gymnastics), which matters less. It shows on the calendar, less intrusively than an event chip. Assignments are a standing weekly pattern plus one-tap claims or swaps for a day. Notifications: the driver is reminded at chosen lead times before; parents are nudged when a run is unclaimed; the kid hears only of a same-day swap.

Builds on: F-024 and D-050 / D-066 (day marks: a provider plugin, at most one mark per day per provider, no time, no reminder, permission is the provider's), F-031 / F-032 (meals: claim dinner in a tap, the afternoon nudge, the dinner day mark), D-045 (reminder scheduling), D-029 (notifications), D-003 (tiers), D-044 / D-064 (identity hue where the person is the answer), D-001 / D-014 (a new module is a plugin).

Assumed: a run is a property of a kid's day, not a calendar event, so it never writes `calendar.events`. A run's time is a default per kind (drop-off, pickup), adjustable per pattern.

## Implements

—

## Deliverable

A feature board: the new F-IDs with priorities, the approach, Touches, and the proposed sessions. Board and source path filled in when published.

## Options

—

## Exit criteria

Each proposed F-ID added or not, its priority set, an approach picked, and the sessions approved. At lock-in: the F-IDs in `docs/idea.md`, a D-### per added feature, the sessions in `docs/roadmap.md`.

## Outcome
