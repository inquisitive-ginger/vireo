-- ADR 021 makes the household ("family") a permanently seeded system record, but only
-- the seed and reset scripts ever wrote the row: onboarding does not, so every dev and
-- test database has it and production does not. That split is why the household photo
-- is settable in dev and 404s in prod (auto-bug #86), and why the bug_reports reporter
-- FK had to be dropped in 20260721040000. Backfill it once, everywhere.
INSERT INTO "platform"."profiles" ("id", "name", "tier")
VALUES ('family', 'Family', 1)
ON CONFLICT ("id") DO NOTHING;
