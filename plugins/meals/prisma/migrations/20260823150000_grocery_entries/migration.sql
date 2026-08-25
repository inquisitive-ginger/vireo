-- Ghost completion sources from previous entries, not a fixed staple list
-- (design gate amendment, 2026-08-23). The seeded staples become this table's
-- initial contents so the field guesses on an empty house, then `staples` goes
-- away — the concept left the UI entirely and nothing else read it.

-- CreateTable
CREATE TABLE "meals"."grocery_entries" (
    "id" UUID NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grocery_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grocery_entries_normalized_name_key" ON "meals"."grocery_entries"("normalized_name");

-- Real history first, so an existing house's own words outrank the starter set.
-- The regexp is normalizeItemName() in SQL (aisle-dictionary.ts): lower, drop
-- punctuation, collapse whitespace, trim. Newest spelling of a name wins.
INSERT INTO "meals"."grocery_entries" ("id", "normalized_name", "name", "last_added_at")
SELECT DISTINCT ON (n."norm") gen_random_uuid(), n."norm", n."name", n."added_at"
FROM (
  SELECT
    btrim(regexp_replace(regexp_replace(lower("name"), '[^a-z0-9[:space:]]', '', 'g'), '\s+', ' ', 'g')) AS "norm",
    "name",
    "added_at"
  FROM "meals"."grocery_items"
) n
WHERE n."norm" <> ''
ORDER BY n."norm", n."added_at" DESC;

-- Then the starter set, dated behind everything real so it sorts last.
INSERT INTO "meals"."grocery_entries" ("id", "normalized_name", "name", "last_added_at")
SELECT DISTINCT ON (s."norm") gen_random_uuid(), s."norm", s."name", TIMESTAMPTZ '2000-01-01 00:00:00+00'
FROM (
  SELECT
    btrim(regexp_replace(regexp_replace(lower("name"), '[^a-z0-9[:space:]]', '', 'g'), '\s+', ' ', 'g')) AS "norm",
    "name"
  FROM "meals"."staples"
) s
WHERE s."norm" <> ''
ORDER BY s."norm", s."name"
ON CONFLICT ("normalized_name") DO NOTHING;

-- DropTable
DROP TABLE "meals"."staples";
