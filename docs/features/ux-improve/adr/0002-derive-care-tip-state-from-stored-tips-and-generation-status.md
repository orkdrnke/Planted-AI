---
status: Accepted
owner: "Orest Lyubinets"
reviewers: ["Tech Lead"]
updated_at: "2026-10-17"
feature_size: "S"
ticket: "roadmap step 7"
---

# 0002 — Derive care-tip state from stored tips and generation status

- **Status:** Accepted
- **Date:** 2026-10-17
- **Deciders:** Orest Lyubinets, Claude (design pass)

## Context

The dashboard rows, the collection status counts and the plant page all need to know whether a plant's care tips are ready, generating or failed. Today the store keeps only `aiStatus` (`generating` / `ready` / `error`) and the AI fields; the glossary adds two rules the store does not express: stored tips make a plant ready even if a later regeneration failed, and a plant with no tips and no generation under way counts as failed (seed plants, plants that never started).

## Decision drivers

- AC-02 and AC-04: the status must always match the rows, and the stored-tips rule must hold everywhere.
- Three consumers (dashboard, status counts, plant page) in different files must not disagree.
- Roadmap steps 4–5 will store the AI status on the plant record in a database; the rule should not depend on where the data lives.

## Considered options

1. **Derive the state in one pure function** — `getCareTipsState(plant)` from stored tip fields and `aiStatus`; the counts come from `getCollectionStatus(plants)`; nothing derived is stored.
2. **Store an explicit `careTipsState` field** — the store sets it on add, generation, success, failure and retry.

## Decision outcome

**Chosen:** Option 1. One tested function is the only place the rule lives, so the dashboard, the counts and the plant page cannot drift, and it needs no change to the store's actions.

## Consequences

**Positive**
- The two glossary rules are written once and unit-tested in the node-only Vitest setup.
- No store migration; seed plants and old plants are handled by the same rule.

**Negative**
- The rule runs on every render for each plant (cheap at 100 plants, but the dashboard performance target must be confirmed).
- If the database step stores a status column, this function must be reconciled with it so the two do not conflict.

**Neutral**
- The plant page keeps showing the retry action from the same state, so the page and the dashboard agree on "failed".

## Links

- Spec: [[../spec.md]] (§5 AC-02, AC-03, AC-04, AC-06)
- SAD: [[../sad.md]] §4
- Related ADR: [[0001-add-short-watering-and-light-fields-to-care-tips-schema]]
