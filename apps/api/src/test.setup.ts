// Route integration tests use a real PostgreSQL DB (ADR 026).
// DATABASE_URL=familyos_test is loaded from .env.test via vitest envDir (ADR 027).
// Fallback guards against running outside the normal vitest invocation.
process.env.DATABASE_URL ??= 'postgresql://familyos:familyos@localhost:5432/familyos_test'

// Safety net: the suite's beforeEach hooks TRUNCATE tables, so it must never run
// against a non-test database. If DATABASE_URL is overridden to point somewhere
// whose database name isn't a `_test` one, refuse to run rather than wipe real
// data. (A prior incident wiped dev data this way.)
{
  const url = process.env.DATABASE_URL ?? ''
  const dbName = url.split('/').pop()?.split('?')[0] ?? ''
  if (!/(^|_)test$/.test(dbName)) {
    throw new Error(
      `Refusing to run integration tests against non-test database "${dbName}". ` +
        `DATABASE_URL must point at a *_test database (got: ${url}). ` +
        `These tests truncate tables in beforeEach and would destroy real data.`
    )
  }
}
