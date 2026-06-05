// Route integration tests use a real PostgreSQL DB (ADR 026).
// DATABASE_URL=familyos_test is loaded from .env.test via vitest envDir (ADR 027).
// Fallback guards against running outside the normal vitest invocation.
process.env.DATABASE_URL ??= 'postgresql://familyos:familyos@localhost:5432/familyos_test'
