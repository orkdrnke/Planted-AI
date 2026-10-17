---
id: T6
title: "Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found"
layer: "ui"
deps: ["T2", "T3", "T4"]
blocks: ["T7", "T9"]
acs: ["AC-05", "AC-06", "AC-07"]
files_hint: ["app/myGarden/[id]/page.tsx"]
owner: "Orest Lyubinets"
estimate: "M"
context_budget: "M"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found

## Place in the sequence

- **Blocked by:** T2 — Add getCareTipsState and getCollectionStatus pure functions with unit tests, T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog, T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components · **Blocks:** T7 — Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal, T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 3.
- **Lane:** shares `app/myGarden/[id]/page.tsx` with T7 — serialized.

## Why (user story)

> **As a** gardener  
> **I want** to open a plant from its row and see its full care tips and details  
> **So that** I can read how to look after it, including the price, size and amount that are no longer in the table
>
> — `spec.md §4, US-03, verbatim` · full text: [spec.md](../spec.md)

This task delivers the plant page that opens from a row with full tips, the failure sentence and retry.

## Inlined context

> SCR-03 keeps the current layout (photo, details card, sidebar). Fixes here: the care-tip block, the typo «Last watred», the dropped last character of each care tip, the English strings. Adds a back link to the dashboard. Sidebar «Additional details» keeps price, size, amount, destination (AC-05).
>
> — `screens.md SCR-03, abridged` · full text: [screens.md](../screens.md)

> SCR-03 states: ready (full watering, light, temperature, soil text and every tip, `CareTipStateLabel`, regenerate button, disabled while a request is under way); generating (`role="status"` banner «Поради з догляду готуються…», sections show the pending text); ready with a failed regeneration shows stored tips and no failure message. SCR-04 (failed): `role="alert"` banner with one fixed sentence and a retry `Button`, never `plant.aiError`; details stay visible. SCR-05: unknown id → «Рослину не знайдено» + back link, no hint that the plant exists elsewhere.
>
> — `screens.md SCR-03/04/05, abridged` · full text: [screens.md](../screens.md)

> Error handling: the store records `aiStatus` / `aiError`; the UI shows one fixed Ukrainian sentence and never the technical error text. Retry on a plant with generation under way is ignored by the store.
>
> — `sad.md §8 + §6 Flow 4, abridged` · full text: [sad.md](../sad.md)

> Existing defects on the touched screens: the plant page drops the last character of each care tip (AC-05 needs full tips); typo «Last watred»; the existing Ukrainian «not found» line moves into the strings module.
>
> — `sad.md §11, abridged` · full text: [sad.md](../sad.md)

> **Chosen:** Option 1. One tested function is the only place the rule lives, so the dashboard, the counts and the plant page cannot drift, and it needs no change to the store's actions. (`getCareTipsState(plant)` from stored tip fields and `aiStatus`; counts from `getCollectionStatus(plants)`; nothing derived is stored.)
>
> — `adr/0002, Decision outcome + Option 1, abridged` · full text: [adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md](../adr/0002-derive-care-tip-state-from-stored-tips-and-generation-status.md)

> Plant names and AI text are rendered as plain text through React; `dangerouslySetInnerHTML` is not used (spec §6.1 abuse case).
>
> — `sad.md §2, Regulatory / external, verbatim` · full text: [sad.md](../sad.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-05 — happy path

> **Given** a plant with ready care tips is listed on the dashboard
> **When** the gardener selects its row
> **Then** the plant page opens showing the full care tips and all the plant's details, including price, size and amount, with the rest of the current plant page left unchanged
>
> — `spec.md §5, AC-05, verbatim` · full text: [spec.md](../spec.md)

### AC-06 — error

> **Given** a plant whose care tips failed to generate, or that has no tips and no generation under way
> **When** the gardener opens its plant page from the dashboard
> **Then** the plant page shows one plain-language sentence saying that the tips could not be generated (the same wording in both cases, with no technical error detail) and offers a way to try again, while the plant and its entered details stay intact
>
> — `spec.md §5, AC-06, verbatim` · full text: [spec.md](../spec.md)

### AC-07 — authorization

> *Verified after roadmap step 4 (per-user collections); not testable earlier.*
>
> **Given** a plant that belongs to another gardener's collection
> **When** a gardener tries to open that plant
> **Then** the gardener sees the same "plant not found" message as for a plant that does not exist, and the dashboard never lists another gardener's plants
>
> — `spec.md §5, AC-07, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Read the current page and its in-page `AiCareStatus`, `Section`, `SidebarCard` — `app/myGarden/[id]/page.tsx`
- [ ] Derive the state with `getCareTipsState(plant)`; show `CareTipStateLabel` next to the name
- [ ] Failed state: fixed sentence from `uiStrings` + retry calling `generateCareTips(id)`; never print `aiError`
- [ ] Remove the code that drops the last character of each tip; fix the typo
- [ ] Add a back `Link` to `/myGarden`; not-found branch with back link
- [ ] Move all text to `lib/uiStrings.ts`

## Edge cases

| Case | Behaviour |
|---|---|
| Plant failed or never started | Same sentence for both; retry shown; entered details intact |
| Retry clicked twice | Store ignores the duplicate; button disabled while generating |
| Stored tips and latest regeneration failed | Stored tips shown, state ready, no message |
| Unknown id (later also a foreign id) | Same «Рослину не знайдено» screen; nothing reveals that the plant exists |
| Long name | Shown in full on the plant page |

## Definition of Done

- [ ] SCR-03 ready/generating, SCR-04 failed, SCR-05 not-found render as in `screens.md`
- [ ] Each care tip shows its last character (regression test or manual check noted)
- [ ] No `aiError` text rendered
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck`, `pnpm lint` clean
