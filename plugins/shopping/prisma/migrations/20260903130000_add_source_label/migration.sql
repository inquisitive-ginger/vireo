-- The note line's words, carried by the producer across the needs-push contract
-- (ADR 069 §3/§4). A pushed row says "for Thursday"; `shopping` cannot derive
-- that, because it never reads `planned_meals`.

ALTER TABLE "shopping"."items" ADD COLUMN "source_label" TEXT;
