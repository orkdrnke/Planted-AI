---
id: T2
title: "Add getCareTipsState and getCollectionStatus pure functions with unit tests"
layer: "domain"
deps: []
blocks: ["T4", "T6", "T9"]
acs: ["AC-02", "AC-03", "AC-04", "AC-08"]
files_hint: ["lib/careTipsState.ts", "lib/careTipsState.test.ts"]
owner: "Orest Lyubinets"
estimate: "S"
context_budget: "M"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T2 — Add getCareTipsState and getCollectionStatus pure functions with unit tests

## Place in the sequence

- **Blocked by:** — · **Blocks:** T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components, T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found, T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 1.
- **Lane:** own lane.

## Why (user story)

> **As a** gardener  
> **I want** a short status above the table showing how many plants I have and how many care tips are ready, generating or failed  
> **So that** I know the current state of my collection and which plants have tips ready, generating or failed
>
> — `spec.md §4, US-02, verbatim` · full text: [spec.md](../spec.md)

This task provides the single rule behind the row labels and the status counts the gardener reads.

## Inlined context

> **Chosen:** Option 1. One tested function is the only place the rule lives, so the dashboard, the counts and the plant page cannot drift, and it needs no change to the store's actions. (`getCareTipsState(plant)` from stored tip fields and `aiStatus`; counts from `getCollectionStatus(plants)`; nothing derived is stored.)
>
> — `adr/0002, Decision outcome + Option 1, abridged` · full text: [adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md](../adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md)

> Care-tip state rule (ADR-0002): stored tips ⇒ `ready` (even when a regeneration is under way or has failed); else generation under way ⇒ `generating`; else `failed`. Every state label below is the output of `getCareTipsState(plant)`.
>
> — `screens.md Source, gap 4, verbatim` · full text: [screens.md](../screens.md)

> QG-1. When a plant is added or removed, or its care tips finish generating or fail: the collection status shows the number of plants and how many are ready, generating and failed; the three counts add up to the number of plants and always match the plants listed. Verify: Vitest unit tests on `getCareTipsState` and `getCollectionStatus` (stored tips win over a failed regeneration; no tips and no generation counts as failed; counts sum to the total).
>
> — `sad.md §10, QG-1, abridged` · full text: [sad.md](../sad.md)

> `lib/careTipsState.ts`: `getCareTipsState(plant)` and `getCollectionStatus(plants)` (+ `.test.ts`). The rule exists only here.
>
> — `sad.md §5, internal decomposition, abridged` · full text: [sad.md](../sad.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-02 — domain invariant

> **Given** a plant whose care tips are still generating or failed (including a plant that has no tips and no generation under way, which counts as failed), so no watering or light information exists
> **When** the gardener opens the dashboard
> **Then** the plant is still listed with its name, type and location, and the watering and light cells each show the text label "Pending" (generating) or "Unavailable" (failed) instead of staying blank, and the dashboard offers no retry (retry is on the plant page, AC-06). A plant with no location entered shows a dash in the location cell instead of staying blank. A plant that has stored care tips counts as ready even when its latest regeneration failed: the stored tips decide the state and are shown
>
> — `spec.md §5, AC-02, verbatim` · full text: [spec.md](../spec.md)

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

## Checklist

- [ ] Read `types/plant.ts` and `types/store.ts` for the exact `aiStatus` values and the tip fields — `types/plant.ts`, `types/store.ts`
- [ ] Implement `getCareTipsState(plant)` returning `"ready" | "generating" | "failed"`; «stored tips» = any AI tip field present — `lib/careTipsState.ts`
- [ ] Implement `getCollectionStatus(plants)` returning `{ total, ready, generating, failed }` — `lib/careTipsState.ts`
- [ ] Unit tests for every rule and the sum invariant — `lib/careTipsState.test.ts`

## Edge cases

| Case | Behaviour |
|---|---|
| Stored tips and `aiStatus: generating` (regeneration) | `ready` |
| Stored tips and `aiStatus: error` | `ready` (stored tips win) |
| No tips, `aiStatus` undefined (seed or never started) | `failed` |
| No tips, `aiStatus: generating` | `generating` |
| Empty plants array | `{ total: 0, ready: 0, generating: 0, failed: 0 }` |

## Definition of Done

- [ ] Unit tests cover all five cases above and `ready + generating + failed === total` for any input
- [ ] No import from React, the store or server-only modules (pure function)
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm test`, `pnpm typecheck`, `pnpm lint` clean
