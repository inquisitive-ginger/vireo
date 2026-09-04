# 069 — Shopping Is Its Own Plugin, and Meals Is a Producer

**Status:** Decided (2026-09-03, product session on the groceries boundary) ·
Supersedes ADR 067 in part (the subject namespace) · Applies ADR 032 (one nav
entry per plugin) and ADR 050 (the provider contract)

## Decision

**Groceries leaves `meals` and becomes its own plugin, named `shopping`.**

1. **New plugin `shopping`**, own `shopping` Postgres schema, own nav entry
   ("Shopping"), own API route file. The four grocery models — `GroceryItem`,
   `GroceryList`, `GroceryEntry`, `GroceryAisleOverride` — move out of the
   `meals` schema. `meals` keeps `PlannedMeal` and `DinnerNudgeLog`.
2. **The name is `shopping`, not `groceries`.** A Home Depot or Michaels run is
   the same need, and ADR 067 already established that the subject is namespaced
   to the **producer** and that a rename is a data migration on live
   `platform.permission_overrides` rows. Nothing has shipped, so the rename is
   free today and is not free later.
3. **Subjects become `shopping.List` and `shopping.Item`**, replacing
   `meals.GroceryList` / `meals.GroceryItem`. Registry keys become
   `shopping.list.create`, `shopping.item.add`, `shopping.item.manage`. Tier
   baselines are unchanged from ADR 067 — list creation tier 4, adding tier 1+,
   the aisle correction tier 4 and grantable.
4. **Meals pushes needs across a contract, not into a table.** `push-needs`
   stops reaching into grocery rows directly. `meals` publishes, `shopping`
   consumes; ADR 050's day-mark provider is the precedent. Meals does not import
   `shopping`'s Prisma client, and `shopping` does not read `planned_meals`.
5. **Aisle filing belongs to `shopping`.** The dictionary, `fileAisle`,
   `normalizeItemName` and the override table move with it. Aisle order is walk
   order inside one list — a property of the list, not of meals and not of the app.

## Why

- **The split had already half-happened, accidentally.** `/groceries/*` was
  already a top-level route rather than `/meals/groceries`; `groceries.ts` was
  already its own API route file; `meals.grocery.added` was already on the bus.
  Four of the six models in the `meals` schema were grocery models. The plugin
  boundary was the only place the separation had not been drawn.
- **ADR 032 makes it near-binary.** One sidebar nav entry per plugin means a
  top-level destination _is_ a plugin. Groceries could not become a first-class
  destination while living inside meals — it was reachable only through a link in
  the meals header, which is the "crowded meals header" the M5/6 live review
  logged as a symptom.
- **The coupling was one function.** `push-needs` reads a free-text `needs`
  field and writes items. That is a contract, not a shared data model.
- **Shopping is not dinner planning.** The queue raised this on 2026-08-26 and
  M5/6 was built ahead of the answer rather than after it. The list of lists that
  ADR 067 anticipated — one that expects a hardware store — does not belong under
  a module whose job is "nobody gets ambushed by dinner".

## Alternatives considered

- **Relax ADR 032 to allow a second nav entry per plugin.** No migration, no
  scaffold, and groceries gets its slot. Rejected: it overrides a settled
  platform rule for one module's convenience and leaves four grocery tables in
  the meals schema, so the data model keeps saying the opposite of the UI.
- **Split but keep the name `groceries`.** Honest about today's scope. Rejected
  per §2 — it buys a subject rename on live override rows to gain nothing.
- **Leave it in meals and fix only the header.** Cheapest. Rejected: it treats
  placement friction as a visual problem.
- **`platform.ShoppingList` now, with meals as the first producer.** ADR 067
  called this the correct destination and deferred it. Still deferred — a
  platform-owned list registry is worth building when there is a second producer,
  not before one exists.

## Do not revisit unless

A second list producer actually lands, at which point the question is whether
`shopping` owns the registry or the platform does — not whether the split was
right. Or the `push-needs` contract proves too thin in practice, which is an
argument about the contract's shape, not about the boundary.
