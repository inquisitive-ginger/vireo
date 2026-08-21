-- Drop the seeded default-layout config rows.
--
-- The seed upserted `DEFAULT_LAYOUTS` into `system_config`, and GET /home/layout
-- serves a config row over the in-code default. Since the seed never runs in prod,
-- those rows were a cache of the composition at deploy-zero: when the tier-3/4
-- right column was re-split (auto-bug #116), prod would have kept serving the old
-- geometry forever. Every row matches the pre-#116 in-code default exactly, so
-- nothing user-authored is lost. The config key stays as the deliberate override
-- hook — written by hand or a future customization UI, never pre-populated.
DELETE FROM "platform"."system_config"
WHERE "key" IN ('default_layout_tier_1_2', 'default_layout_tier_3', 'default_layout_tier_3_4');
