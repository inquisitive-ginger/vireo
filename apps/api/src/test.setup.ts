// Route integration tests use a real PostgreSQL DB (ADR 026).
// DATABASE_URL defaults to the dev DB; set TEST_DATABASE_URL to isolate.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos'
