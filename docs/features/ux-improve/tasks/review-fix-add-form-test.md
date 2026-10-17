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
status: "todo"
step: "—"
---

# T11 — Test that submitting the add form marks the new plant and lands on the dashboard

Follow-up from `_review/review-2026-10-17.md` F3 (stage-1).

## Acceptance criteria

AC-01 (spec.md §5): adding a plant lands on the dashboard with its row highlighted. The row highlight is
covered by the dashboard tests; this task covers the form half — submit → `addPlant` → `newPlantId` set →
`router.replace("/myGarden")`.

## Checklist

- [ ] Component test fills the required fields, submits, asserts `replace("/myGarden")` and that the store's `newPlantId` points at the new plant (`fetch` mocked, no real OpenAI call)
- [ ] Invalid form does not navigate

## Definition of Done

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
