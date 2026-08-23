-- A starter staples list (design.md §M5/6: the add bar's chip strip "shows
-- staples at rest"). No management UI ships this story — a family edits this
-- set by hand today; a settings surface for it is a natural M5/7+ follow-on,
-- not invented here.
INSERT INTO "meals"."staples" ("id", "name", "category", "active")
VALUES
  (gen_random_uuid(), 'Milk', 'Dairy', true),
  (gen_random_uuid(), 'Eggs', 'Dairy', true),
  (gen_random_uuid(), 'Butter', 'Dairy', true),
  (gen_random_uuid(), 'Bread', 'Bakery', true),
  (gen_random_uuid(), 'Bananas', 'Produce', true),
  (gen_random_uuid(), 'Coffee', 'Pantry', true),
  (gen_random_uuid(), 'Rice', 'Pantry', true),
  (gen_random_uuid(), 'Chicken breast', 'Meat', true),
  (gen_random_uuid(), 'Ground beef', 'Meat', true),
  (gen_random_uuid(), 'Paper towels', 'Other', true);
