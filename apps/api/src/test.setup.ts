// Route integration tests use a real PostgreSQL DB (ADR 026).
// TEST_DATABASE_URL is loaded from .env.test via vitest envDir; set it to override.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos_test'
