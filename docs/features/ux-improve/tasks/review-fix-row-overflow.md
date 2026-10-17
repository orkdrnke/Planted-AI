---
id: T10
title: "Keep short notes untruncated and stop long type or location overflowing the phone card"
layer: "ui"
deps: ["T4"]
blocks: []
acs: ["AC-09"]
files_hint: ["components/plantListItem.tsx", "components/dashboardComponents.test.tsx"]
owner: "Orest Lyubinets"
estimate: "XS"
context_budget: "S"
status: "done"
step: "COMMIT"
---

# T10 — Keep short notes untruncated and stop long type or location overflowing the phone card

Follow-up from `_review/review-2026-10-17.md` F2 (stage-1) + F7 (stage-2).

## Acceptance criteria

AC-09 (spec.md §5) and its test-plan row: a long name is truncated, the short notes are not truncated; no sideways scrolling at 360 px.

## Checklist

- [x] Test: short watering/light notes carry no `truncate` / `md:truncate`; the full-text fallback does carry `md:truncate`
- [x] Test + fix: type and location spans are guarded at every width (`min-w-0`, `truncate`); the wrapper already has `min-w-0`, so no wrap is needed

## Definition of Done

- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
