---
status: Accepted
owner: "Orest Lyubinets"
reviewers: ["Tech Lead"]
updated_at: "2026-10-17"
feature_size: "S"
ticket: "ux-improve"
---

# 0001 — Add short watering and light fields to the care-tips schema

- **Status:** Accepted
- **Date:** 2026-10-17
- **Deciders:** Orest Lyubinets, Claude (design pass)

## Context

The dashboard shows a watering and a light note per plant, on a table row and on a 360 px phone card (spec AC-01, AC-09). Today the AI returns `wateringFrequency` and `sunlightNeeds` as free text (`schemas/careTipsSchema.ts`), which can be whole sentences. The dashboard needs 2–4 words; the full text stays on the plant page. The data may later move into a database, so the shape chosen now is carried forward.

## Decision drivers

- AC-09: the short notes are shown in full at 360 px with no sideways scrolling.
- AC-02/AC-05: the dashboard shows short notes, the plant page shows the full tips.
- Spec §8 open question: separate short value vs a shortened form of the existing text.
- The care-tips schema is shared by the route, the helper and the store, so it is a contract seen by several modules.

## Considered options

1. **Add separate short fields to the schema** — `wateringShort` and `sunlightShort`, written by the AI together with the full text.
2. **Shorten the existing text on the client** — keep the contract, clip `wateringFrequency` / `sunlightNeeds` with CSS or to the first clause.

## Decision outcome

**Chosen:** Option 1. A clipped sentence reads as truncated rather than as a note, and the owner preferred a stored value that moves to the database unchanged. The change touches the schema, the prompt in `lib/aiHelpers.ts`, `TPlant` and the tests.

## Consequences

**Positive**
- The short form is always meaningful and bounded in length.
- The database step receives a ready field instead of a display rule.

**Negative**
- Four places change together (schema, prompt, type, tests).
- The length limit may not be enforceable by the structured-output feature of the installed `openai` ^6.7.0 and model; this must be verified before relying on a Zod `.max(...)`. If it is unsupported, the limit is enforced by the prompt and the client-side `CareTipsSchema.safeParse`, and an over-long value either fails the generation or is clipped (decided in `tasks`).

**Neutral**
- With the in-memory store no plant has tips saved before this change, so no fallback is needed now. If the collection moves to a database, rows saved without the short fields will need a decision (regenerate or backfill).

## Links

- Spec: [[../spec.md]] (§5 AC-01, AC-02, AC-09; §8)
- SAD: [[../sad.md]] §4
- Related ADR: [[0002-derive-care-tip-state-from-stored-tips-and-generation-status]]
