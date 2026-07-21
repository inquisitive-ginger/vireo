-- The household pseudo-profile ("family") is synthetic on installs whose onboarding
-- never wrote a profiles row — production is one — but it is the DEFAULT profile and
-- therefore the likeliest reporter. The FK turned that report into a 500. The reporter
-- is resolved at read time instead, with a fallback to the household identity.
ALTER TABLE "platform"."bug_reports" DROP CONSTRAINT IF EXISTS "bug_reports_reporter_id_fkey";
