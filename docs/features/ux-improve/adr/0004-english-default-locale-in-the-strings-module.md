---
status: Accepted
owner: "Orest Lyubinets"
reviewers: ["Tech Lead"]
updated_at: "2026-10-23"
feature_size: "S"
ticket: "ux-improve"
---

# 0004 — English default locale in the strings module

- **Status:** Accepted (supersedes [[0003-keep-ukrainian-ui-text-in-a-single-strings-module]])
- **Date:** 2026-10-23
- **Deciders:** Orest Lyubinets, Claude

## Context

ADR-0003 made all product UI text Ukrainian and kept it in `lib/uiStrings.ts`. The owner now wants the whole interface in English. More languages will be added later, but no date or list of languages is set.

## Decision drivers

- The owner's explicit requirement: the interface is English now.
- More languages are planned, so the change must not close that door.
- AGENTS.md: no production-level complexity or new dependencies before they are needed.

## Considered options

1. **Translate the strings module in place** — keep `lib/uiStrings.ts` and its keys; replace the values with English.
2. **Add an i18n library now** — for example `next-intl`, with an English catalog and locale routing.
3. **Inline English literals in components** — drop the module.

## Decision outcome

**Chosen:** Option 1. English is the default locale and `lib/uiStrings.ts` stays the single place for UI text. No i18n library is added until a second language is actually requested. The AI prompt asks for English care tips, `<html lang="en">` is set, and dates use the `en-US` locale.

## Consequences

**Positive**
- Smallest change: components are untouched, only values change.
- The module keys are a ready seam for a later library or per-locale dictionaries.

**Negative**
- Adding a second language later still needs a decision on the approach (library or own dictionary), locale selection, and a locale-aware AI prompt, `lang` attribute and date format.

**Neutral**
- The guard test only checks that the English strings contain no Cyrillic; it moves with the English locale file when more languages appear.
- All files in the repository (docs, comments, agent instructions) are written in English; Ukrainian is used only in chat with the owner.

## Links

- Supersedes: [[0003-keep-ukrainian-ui-text-in-a-single-strings-module]]
- Related ADR: [[0002-derive-care-tip-state-from-stored-tips-and-generation-status]]
