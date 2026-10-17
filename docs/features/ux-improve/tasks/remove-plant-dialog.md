---
id: T7
title: "Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal"
layer: "ui"
deps: ["T3", "T6"]
blocks: ["T9"]
acs: ["AC-11", "AC-08"]
files_hint: ["components/removePlantDialog.tsx", "app/myGarden/[id]/page.tsx"]
owner: "Orest Lyubinets"
estimate: "S"
context_budget: "S"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T7 — Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal

## Place in the sequence

- **Blocked by:** T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog, T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found · **Blocks:** T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 4.
- **Lane:** shares `app/myGarden/[id]/page.tsx` with T6 — serialized.

## Why (user story)

> **As a** gardener  
> **I want** to remove a plant from my collection  
> **So that** the dashboard shows only the plants I still keep
>
> — `spec.md §4, US-06, verbatim` · full text: [spec.md](../spec.md)

This task lets the gardener remove a plant with a confirmation, returning to the dashboard.

## Inlined context

> Removal moves to the plant page — the row has exactly one focusable item (AC-10); the remove button and its confirmation dialog live on the plant page and return to the dashboard. Inline decision (reversible, one screen), no ADR.
>
> — `sad.md §4, strategic choice 4, abridged` · full text: [sad.md](../sad.md)

> SCR-07: a `Dialog` over SCR-03/SCR-04 naming the plant. Cancel, Esc and overlay click close it with the page unchanged; focus returns to the remove control. Confirm calls `removePlant(id)` and goes to SCR-01, or SCR-02 when it was the last plant. `NEW: RemovePlantDialog` composes `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Button` outline (cancel), `Button` destructive (confirm). `removePlant` is synchronous and cannot fail.
>
> — `screens.md SCR-07, abridged` · full text: [screens.md](../screens.md)

> Drift: `ux-flows.md` and spec §8 still place the remove control on the dashboard row; `sad.md` §4/§6 Flow 3 and `screens.md` put it on the plant page. Follow the SAD and screens; AC-11 does not name a place.
>
> — `sad.md §11 + screens.md Source gap 2, abridged` · full text: [sad.md](../sad.md)

> **Chosen:** Option 1. [`lib/uiStrings.ts` exports the Ukrainian text; components import from it.] Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.
>
> — `adr/0003, Decision outcome, abridged` · full text: [adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-11 — happy path

> **Given** a gardener has plants in the collection
> **When** the gardener removes one of them
> **Then** that plant no longer appears on the dashboard, the other plants and their care tips are unchanged, and the collection status counts drop accordingly
>
> — `spec.md §5, AC-11, verbatim` · full text: [spec.md](../spec.md)

### AC-08 — cross-context

> **Given** a gardener's collection has no plants, so there are also no care tips to report
> **When** the gardener opens the dashboard
> **Then** the dashboard shows an empty-state message with a prominent action to add the first plant, and the collection status reports zero plants instead of an empty table with headers
>
> — `spec.md §5, AC-08, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Create `RemovePlantDialog({ plantName, onConfirm })` from the existing `Dialog` parts — `components/removePlantDialog.tsx`
- [ ] Add the destructive remove button to the plant page; on confirm call `removePlant(id)` and `router.push('/myGarden')` — `app/myGarden/[id]/page.tsx`
- [ ] Make sure the page does not flash the not-found screen after removal (navigate before or guard) — `app/myGarden/[id]/page.tsx`
- [ ] Text from `lib/uiStrings.ts`

## Edge cases

| Case | Behaviour |
|---|---|
| Cancel, Esc or overlay click | Dialog closes, page unchanged, focus back on the remove control |
| Confirm with other plants left | Dashboard without that plant; others and their tips unchanged; counts dropped |
| Confirm on the last plant | Dashboard shows the empty state with zero in the status |
| Plant name with markup | Shown as plain text in the dialog title |

## Definition of Done

- [ ] Removing a plant updates rows and status counts together (manual check, plus store test if one is missing for `removePlant`)
- [ ] Dialog is keyboard-operable with a focus trap
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
