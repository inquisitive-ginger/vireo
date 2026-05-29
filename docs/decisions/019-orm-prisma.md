# 019 — ORM: Prisma

**Status:** Decided

**Decision:** Prisma is the ORM for all database access across the platform
and plugins.

**Why:** `@casl/prisma` provides `accessibleBy()`, which translates CASL
ability rules into Prisma `WHERE` clauses automatically (ADR 018). Without
this, every route handler in every module must manually filter rows to what
the active profile is allowed to see — a pattern that must be replicated
across all 7+ planned modules and is easy to miss. Prisma's multi-schema
support (Prisma 5+) aligns directly with ADR 009's per-plugin schema
isolation — each plugin owns a `schema.prisma` scoped to its PostgreSQL
schema and generates its own typed client. TypeScript types generated from
the schema keep the data layer consistent with ADR 006's end-to-end
TypeScript commitment.

**Per-plugin pattern:**

```
plugins/chore-engine/
  prisma/
    schema.prisma     -- datasource + models scoped to chore_engine schema
  src/
    db.ts             -- exports the generated PrismaClient instance
```

**`accessibleBy()` in a route handler:**

```typescript
// No manual WHERE clause — CASL drives the filter
const tasks = await prisma.task.findMany({
  where: accessibleBy(request.ability, 'read').Task
})
```

**Alternatives considered:**

- **Drizzle ORM:** lighter, closer to raw SQL, strong TypeScript support —
  ruled out because there is no official CASL adapter; the community package
  `casl-drizzle-query-adapter` (v0.1.2, Jan 2026) lacks `accessibleBy()`,
  requiring manual SQL condition conversion per query
- **Raw `pg` / `postgres.js`:** full control, no abstraction — ruled out
  because row-level authorization must be manually applied to every query and
  there is no migration tooling

**Do not revisit unless:** A plugin's query patterns are fundamentally
incompatible with Prisma's query engine, or Prisma introduces a breaking
change to multi-schema support.
