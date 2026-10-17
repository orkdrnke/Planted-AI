---
id: T11
title: "Test that submitting the add form marks the new plant and lands on the dashboard"
layer: "ui"
deps: ["T8"]
blocks: []
acs: ["AC-01"]
files_hint: ["app/addPlant/page.test.tsx"]
owner: "Orest Lyubinets"
estimate: "XS"
context_budget: "S"
status: "done"
step: "COMMIT"
---

# T11 — Test that submitting the add form marks the new plant and lands on the dashboard

Follow-up from `_review/review-2026-10-17.md` F3 (stage-1).

## Acceptance criteria

AC-01 (spec.md §5): adding a plant lands on the dashboard with its row highlighted. The row highlight is
covered by the dashboard tests; this task covers the form half — submit → `addPlant` → `newPlantId` set →
`router.replace("/myGarden")`.

## Checklist

- [x] Component test fills the required fields, submits, asserts `replace("/myGarden")` and that the store's `newPlantId` points at the new plant (`generateCareTips` stubbed, no real OpenAI call)
- [x] Invalid form does not navigate

Note: green on the first run (coverage-only task); a mutation (`replace("/")`) turned it red, so the test is not weak.
Found on the way, out of scope: the type `Select` trigger has no accessible name (the form label is not linked to it).

## Definition of Done

- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
