-- Identity hue: assigned and persisted, not hashed from a name (ADR 044).
--
-- UNIQUE, because "colour = person" is load-bearing: a duplicate hue does not
-- degrade the mapping, it points it at two people at once. Nullable, so the
-- `family` pseudo-profile consumes no member hue (Postgres allows many NULLs
-- under a unique index).

ALTER TABLE "platform"."profiles" ADD COLUMN "identity_hue" TEXT;

-- Backfill. The rule: nobody's colour moves unless it has to.
--
-- Every existing profile is already WEARING a hue — `getIdentityHue(name)` hashed
-- the name into the OLD SIX-hue array, and that is the colour its owner has been
-- looking at. So we reproduce that hash here and honour it. Only where two members
-- hashed to the same hue (which is the bug this migration closes — "Zach" and
-- "Emma" both land on terracotta) does somebody have to move, and then the later
-- profile by created_at is the one that moves. Ties broken by id so the result is
-- deterministic on any replay.
DO $$
DECLARE
  -- The palette getIdentityHue hashed into BEFORE this change. Used only to work out
  -- what colour each existing member is currently wearing.
  old_hues  TEXT[] := ARRAY['terracotta','marigold','sage','teal','sky','plum'];
  -- Where a displaced member lands. `moss` and `indigo` come FIRST because they are
  -- new in ADR 044 — nobody can already be wearing them, so handing one to a displaced
  -- member can never steal a colour somebody else is currently looking at. Falling back
  -- to an old hue instead would risk a cascade: the displaced member takes marigold,
  -- knocking the real marigold off onto something else, and so on down the list.
  fallback_hues TEXT[] := ARRAY['moss','indigo','terracotta','marigold','sage','teal','sky','plum'];
  taken     TEXT[] := ARRAY[]::TEXT[];
  prof      RECORD;
  h         BIGINT;
  i         INT;
  preferred TEXT;
  chosen    TEXT;
  candidate TEXT;
BEGIN
  FOR prof IN
    SELECT id, name FROM "platform"."profiles"
    WHERE id <> 'family'
    ORDER BY created_at ASC, id ASC
  LOOP
    -- hashName: h = (h * 31 + charCode) >>> 0  — uint32 wraparound, hence mod 2^32.
    h := 0;
    FOR i IN 1..length(prof.name) LOOP
      h := (h * 31 + ascii(substr(prof.name, i, 1))) % 4294967296;
    END LOOP;

    preferred := old_hues[(h % 6) + 1];
    chosen := NULL;

    IF NOT (preferred = ANY(taken)) THEN
      -- Their colour is free. Keep it — this is the common case.
      chosen := preferred;
    ELSE
      -- Collision. Somebody has to move, and it is this one (the later profile).
      FOREACH candidate IN ARRAY fallback_hues LOOP
        IF NOT (candidate = ANY(taken)) THEN
          chosen := candidate;
          EXIT;
        END IF;
      END LOOP;
    END IF;

    -- chosen IS NULL only if the household already exceeds the palette. Leave the
    -- column NULL rather than inventing a duplicate: the app falls back to the name
    -- hash for display, and Settings will report the palette as full.
    IF chosen IS NOT NULL THEN
      taken := array_append(taken, chosen);
      UPDATE "platform"."profiles" SET "identity_hue" = chosen WHERE id = prof.id;
    END IF;
  END LOOP;
END $$;

CREATE UNIQUE INDEX "profiles_identity_hue_key" ON "platform"."profiles"("identity_hue");
