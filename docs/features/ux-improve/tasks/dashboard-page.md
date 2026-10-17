---
id: T5
title: "Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight"
layer: "ui"
deps: ["T1", "T4"]
blocks: ["T9"]
acs: ["AC-01", "AC-03", "AC-04", "AC-08", "AC-09", "AC-10"]
files_hint: ["app/myGarden/page.tsx", "lib/plantTotals.ts", "lib/plantTotals.test.ts"]
owner: "Orest Lyubinets"
estimate: "M"
context_budget: "M"
status: "done"
step: "COMMIT"
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T5 — Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight

## Place in the sequence

- **Blocked by:** T1 — Add short watering and light notes to the care-tips schema, type and prompt, T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components · **Blocks:** T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 3.
- **Lane:** own lane.

## Why (user story)

> **As a** gardener  
> **I want** the dashboard to show each plant's name, type, location, how often to water and how much light it needs  
> **So that** I can tell what is in my collection without opening every plant
>
> — `spec.md §4, US-01, verbatim` · full text: [spec.md](../spec.md)

> **As a** gardener  
> **I want** a short status above the table showing how many plants I have and how many care tips are ready, generating or failed  
> **So that** I know the current state of my collection and which plants have tips ready, generating or failed
>
> — `spec.md §4, US-02, verbatim` · full text: [spec.md](../spec.md)

This task assembles the dashboard page the gardener reads at a glance, with the status above the list.

## Inlined context

> Turn the plant table page (`/myGarden`) into a dashboard a gardener can read in seconds: five essential columns, a collection status above the table, an empty state for a new collection. Price, size and amount move out of the table. The highlight of a just-added plant (`newPlantId`) is kept on the new list by marking the matching row or card for about two seconds, as today. Seed plants are left as they are and show as failed.
>
> — `sad.md §1 + §4 inline decisions, abridged` · full text: [sad.md](../sad.md)

> SCR-01: status above one responsive list; no price, size, amount or total row; no remove control; no retry on this screen. Empty (`plants.length === 0`): SCR-02 `EmptyState` + `CollectionStatus` with all counts 0, no table and no column headings. Column heading line only at `md+`.
>
> — `screens.md SCR-01/SCR-02, abridged` · full text: [screens.md](../screens.md)

> Defect to fix: `key={plant.name}` on the dashboard → key rows by `id`. `lib/plantTotals.ts` is no longer used by the dashboard; `tasks` decides whether to delete it.
>
> — `sad.md §5 + §11, abridged` · full text: [sad.md](../sad.md)

> QG-2. 100 plants: dashboard first render ≤ 1 s; opening a plant ≤ 300 ms. Verify with a browser performance trace against a production build with 100 seeded plants.
>
> — `sad.md §10, QG-2, abridged` · full text: [sad.md](../sad.md)

> **Chosen:** Option 1. One tested function is the only place the rule lives, so the dashboard, the counts and the plant page cannot drift, and it needs no change to the store's actions. (`getCareTipsState(plant)` from stored tip fields and `aiStatus`; counts from `getCollectionStatus(plants)`; nothing derived is stored.)
>
> — `adr/0002, Decision outcome + Option 1, abridged` · full text: [adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md](../adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md)

> **Chosen:** Option 1. [`lib/uiStrings.ts` exports the Ukrainian text; components import from it.] Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.
>
> — `adr/0003, Decision outcome, abridged` · full text: [adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

> No UI tests exist (Vitest runs `*.test.ts` in a node environment), so layout, keyboard and accessibility targets rely on manual and audit checks. Mitigation: keep the rule logic in pure `lib/` functions with unit tests; record manual and axe results in `review`.
>
> — `sad.md §11, risk «No UI tests exist», abridged` · full text: [sad.md](../sad.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-01 — happy path

> **Given** a gardener has several plants in the collection
> **When** the gardener opens the dashboard
> **Then** each plant is one row showing its name, type, location, watering and light needs, with the state of its care tips shown next to the name, and price, size and amount are not shown in the table; a plant that was just added is briefly highlighted, as it is today
>
> — `spec.md §5, AC-01, verbatim` · full text: [spec.md](../spec.md)

### AC-03 — happy path

> **Given** a gardener has plants with care tips ready, generating and failed
> **When** the gardener opens the dashboard
> **Then** the collection status above the table shows the number of plants and how many are in each care-tip state, and the state counts add up to the number of plants
>
> — `spec.md §5, AC-03, verbatim` · full text: [spec.md](../spec.md)

### AC-04 — domain invariant

> **Given** a gardener adds or removes a plant, or care tips finish generating
> **When** the dashboard is shown after the change
> **Then** the collection status always matches the plants listed in the table
>
> — `spec.md §5, AC-04, verbatim` · full text: [spec.md](../spec.md)

### AC-08 — cross-context

> **Given** a gardener's collection has no plants, so there are also no care tips to report
> **When** the gardener opens the dashboard
> **Then** the dashboard shows an empty-state message with a prominent action to add the first plant, and the collection status reports zero plants instead of an empty table with headers
>
> — `spec.md §5, AC-08, verbatim` · full text: [spec.md](../spec.md)

### AC-09 — happy path

> **Given** a gardener opens the dashboard on a phone-sized screen
> **When** the page is shown
> **Then** all essential information for each plant (name, type, location, watering, light, care-tip state) is readable without sideways scrolling; on a phone-sized screen each plant may be shown as a card instead of a table row, the watering and light short notes are shown in full, and a name too long for the space is truncated (the full name is on the plant page)
>
> — `spec.md §5, AC-09, verbatim` · full text: [spec.md](../spec.md)

### AC-10 — cross-context

> **Given** a gardener uses only the keyboard
> **When** the gardener moves through the dashboard
> **Then** every plant row (or card on a phone-sized screen) can be reached with the Tab key as a single focusable item and opened with Enter, and the collection status and care-tip state labels next to the plant name are conveyed in text and not by colour alone
>
> — `spec.md §5, AC-10, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [x] Replace the table with `CollectionStatus` + a list of `PlantListItem`, keyed by `plant.id` — `app/myGarden/page.tsx`
- [x] Render `EmptyState` (with zero-count status) when there are no plants — `app/myGarden/page.tsx`
- [x] Keep the `newPlantId` highlight for ~2 s then `clearNewPlantId` — `app/myGarden/page.tsx`
- [x] Keep an add action in the header of the page (link to `/addPlant`); no remove, no retry here (hidden when empty, where `EmptyState` carries the add action)
- [x] Delete `lib/plantTotals.ts` and its test since nothing uses them (confirm with `grep` first) — `lib/plantTotals.ts`, `lib/plantTotals.test.ts`
- [x] All text from `lib/uiStrings.ts`

## Edge cases

| Case | Behaviour |
|---|---|
| No plants | Empty state; status shows zero plants; no table or headings |
| Plant added | New row highlighted ~2 s, shows «Очікується» in watering and light, status counts it as generating |
| Tips finish while the page is open | Row shows short notes; status moves generating → ready |
| Generation fails with no tips | Row shows «Недоступно»; status counts failed; no retry on this page |
| Two plants with the same name | Both listed (keyed by id) |

## Definition of Done

- [ ] Dashboard shows only name, type, location, watering, light; status counts match the rows after add/retry
- [ ] No horizontal scroll at 360 px; each row is one Tab stop opened with Enter (manual check)
- [ ] `plantTotals` removal leaves no dangling import
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
