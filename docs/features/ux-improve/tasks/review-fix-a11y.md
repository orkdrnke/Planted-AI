---
id: T12
title: "Set the document language to Ukrainian and label the collection status with a valid landmark"
layer: "ui"
deps: ["T5"]
blocks: []
acs: ["AC-10"]
files_hint: ["app/layout.tsx", "components/collectionStatus.tsx", "components/dashboardComponents.test.tsx", "app/myGarden/page.test.tsx"]
owner: "Orest Lyubinets"
estimate: "XS"
context_budget: "S"
status: "done"
step: "COMMIT"
---

# T12 — Set the document language to Ukrainian and label the collection status with a valid landmark

Follow-up from `_review/review-2026-10-17.md` F4 + F6 (stage-2).

## Acceptance criteria

AC-10 (spec.md §5): state and status are conveyed in text and the dashboard is usable with assistive technology.

## Checklist

- [x] `<html lang="uk">` (ADR-0003 made every screen Ukrainian; WCAG 3.1.1) — one-line config in the root layout, no unit test
- [x] `CollectionStatus` is a `<section aria-label>` wrapping the counts paragraph, not `aria-label` on `<p>` (prohibited by ARIA 1.2)
- [x] Tests find the status by role `region` + name instead of `getByLabelText`

## Definition of Done

- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
