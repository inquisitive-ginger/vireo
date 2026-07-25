# 009 — Data Storage

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

**Decision:** PostgreSQL running as a Docker container on the primary
server. A single Postgres instance is shared across all plugin
services. Each plugin owns a dedicated schema (e.g. `chore_engine.*`,
`calendar.*`, `finance.*`) — plugins may not read or write outside
their own schema. Schema ownership is declared in the plugin manifest
and enforced at the platform level. Semi-structured data (plugin
configuration, flexible event metadata) is stored in JSONB columns
within each plugin's schema rather than in a separate store.

**Why:** Plugin data is predominantly relational — chores belong to
users, F$ transactions are ledger entries, calendar events have
participants. ADRs 002 and 005 (two-layer currency, allowance as
ledger) require ACID transactions; a partially-applied F$ credit must
roll back cleanly. Most NoSQL stores do not provide this guarantee at
the cross-document level. PostgreSQL's native JSONB support eliminates
the primary argument for a document store — semi-structured plugin
config lives in a JSONB column alongside relational tables, with no
second system to operate or back up. A single shared instance is
simpler to operate than one container per plugin, and schema-level
isolation gives plugins clean data boundaries while keeping backup and
restore to a single operation.

**Alternatives considered:** SQLite per plugin (zero infrastructure,
but write-serialisation locks cause contention under concurrent plugin
activity and cross-plugin joins are impossible); MongoDB (flexible
document schema, but plugin data shapes are known at build time so
the flexibility solves a non-existent problem, and ACID guarantees are
only document-level); Redis as primary store (fast, but not a durable
relational store — appropriate as a cache or future broker, not for
ledger data); one Postgres container per plugin (stronger isolation
but multiplies operational burden — N databases to back up, monitor,
and upgrade).

**Do not revisit unless:** A specific plugin requires a fundamentally
different storage engine (e.g. a time-series database for sensor
data), or storage moves off-server via a hosted sync layer.
