---
id: T13
title: "Sync ux-flows, contract notes, screens, spec §8 and the architecture map with the built feature"
layer: "docs"
deps: ["T9"]
blocks: []
acs: ["AC-11"]
files_hint: ["docs/features/ux-improve/ux-flows.md", "docs/features/ux-improve/contracts/openapi.yaml", "docs/features/ux-improve/contracts/api-sync-report.md", "docs/features/ux-improve/spec.md", "docs/features/ux-improve/screens.md", "docs/architecture-map.md"]
owner: "Orest Lyubinets"
estimate: "XS"
context_budget: "S"
status: "done"
step: "COMMIT"
---

# T13 — Sync ux-flows, contract notes, screens, spec §8 and the architecture map with the built feature

Follow-up from `_review/review-2026-10-17.md` F1 (stage-1) + F8 (stage-2). Documentation only — no TDD cycle.

## Checklist

- [x] `ux-flows.md` platform decisions: removal starts from the plant page (SCR-03/SCR-04), confirmed via SCR-07; decided in `sad.md` §4
- [x] `contracts/openapi.yaml`, `contracts/api-sync-report.md`: the 40-character limit is implemented (`SHORT_NOTE_MAX_LENGTH`, `superRefine`) and the short fields are in `CareTipsSchema`
- [x] `spec.md` §8: the short-note question is answered by ADR-0001
- [x] `screens.md`: `docs/design-system.md` exists and the NEW components are registered; source gap 2 marked resolved
- [x] `docs/architecture-map.md`: the helpers row lists the current helpers instead of `lib/plantTotals.ts`

## Definition of Done

- [x] grep finds none of the stale statements listed above (remaining hits are historical task/review records)
