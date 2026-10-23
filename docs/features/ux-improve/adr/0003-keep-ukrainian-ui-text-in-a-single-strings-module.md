---
status: Accepted
owner: "Orest Lyubinets"
reviewers: ["Tech Lead"]
updated_at: "2026-10-17"
feature_size: "S"
ticket: "ux-improve"
---

# 0003 — Keep Ukrainian UI text in a single strings module

- **Status:** Accepted
- **Date:** 2026-10-17
- **Deciders:** Orest Lyubinets, Claude (design pass)

## Context

During this design pass the owner decided that all product UI text is shown in Ukrainian, on every screen. AGENTS.md §10 currently asks for English UI text, the existing pages are in English with one Ukrainian line ("not found" on the plant page), and spec AC-02 writes the labels as "Pending" and "Unavailable". The dashboard, the plant page and the removal dialog are being rewritten now, and the landing page, add-plant form and header only need their existing text moved.

## Decision drivers

- The owner's explicit requirement: product UI text in Ukrainian.
- AGENTS.md §10: avoid new dependencies and broad refactors in a focused feature.
- Several modules (dashboard, plant page, dialog, status) share the same labels, such as the care-tip state names.

## Considered options

1. **One strings module** — `lib/uiStrings.ts` exports the Ukrainian text for the changed screens; components import from it.
2. **Inline literals in components** — each component carries its own Ukrainian text.
3. **An i18n library with message catalogs** — a library such as `next-intl` with a Ukrainian catalog.

## Decision outcome

**Chosen:** Option 1. It keeps labels consistent across all consumers without adding a dependency for a single-language app. Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.

## Consequences

**Positive**
- One place to review wording and keep "Очікується" / "Недоступно"-style labels consistent.
- A future switch to a library can wrap this module's keys.

**Negative**
- Scope grows beyond the spec: three more screens are touched in a size S feature (tracked in §11).
- AGENTS.md §10 and spec AC-02 must be updated to match the decision.

**Neutral**
- No language switching or locale routing is introduced; the app stays single-language.

## Links

- Spec: [[../spec.md]] (§5 AC-02, AC-06, AC-08)
- SAD: [[../sad.md]] §4, §8
- Related ADR: [[0002-derive-care-tip-state-from-stored-tips-and-generation-status]]
