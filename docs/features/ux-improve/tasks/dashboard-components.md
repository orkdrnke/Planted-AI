---
id: T4
title: "Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components"
layer: "ui"
deps: ["T2", "T3"]
blocks: ["T5", "T6", "T9"]
acs: ["AC-01", "AC-02", "AC-03", "AC-08", "AC-09", "AC-10"]
files_hint: ["components/careTipStateLabel.tsx", "components/collectionStatus.tsx", "components/emptyState.tsx", "components/plantListItem.tsx"]
owner: "Orest Lyubinets"
estimate: "M"
context_budget: "M"
status: "done"
step: "COMMIT"
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components

## Place in the sequence

- **Blocked by:** T2 — Add getCareTipsState and getCollectionStatus pure functions with unit tests, T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog · **Blocks:** T5 — Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight, T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found, T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 2.
- **Lane:** own lane.

## Why (user story)

> **As a** gardener  
> **I want** the dashboard to be readable and usable on a phone as well as on a desktop, with the keyboard as well as a pointer  
> **So that** I can check my plants from whichever device I have
>
> — `spec.md §4, US-05, verbatim` · full text: [spec.md](../spec.md)

This task builds the row-or-card, status, state label and empty state that make the dashboard readable on any device and by keyboard.

## Inlined context

> The dashboard is **one responsive list**, not two renderings: a table-like row on wide screens and a card on a phone, built from the same markup with Tailwind breakpoints. Each plant row is a real link to its plant page, so it is one Tab stop and Enter opens. This reuses `components/ui/` (`card`, `button`) and follows `app/myGarden/page.tsx` as the closest precedent.
>
> — `sad.md §4, UI architecture, abridged` · full text: [sad.md](../sad.md)

> Row = one `<Link>` to `/myGarden/[id]`. Columns: name (with the state label next to it), type, location, watering, light. Cells: ready → short notes (`wateringShort`, `sunlightShort`); generating → «Очікується»; failed → «Недоступно»; no location → dash. Long name: `truncate`, the link's accessible name keeps the full name. New row: `animate-highlight` ~2 s then `clearNewPlantId`. Visible `focus-visible` ring. Phone (< `md`): card, short notes in full, no sideways scroll, label never wraps off-screen.
>
> — `screens.md SCR-01 states, abridged` · full text: [screens.md](../screens.md)

> `CareTipStateLabel`: text label (with a decorative icon, `lucide-react Loader2` when generating) for ready / generating / failed, shared by SCR-01, SCR-03, SCR-04 — there is no badge primitive. `CollectionStatus`: text summary of total and ready / generating / failed counts. `EmptyState`: message plus a prominent add action (link to `/addPlant`). Names are proposals.
>
> — `screens.md §New components, abridged` · full text: [screens.md](../screens.md)

> Care-tip state rule (ADR-0002): stored tips ⇒ `ready` (even when a regeneration is under way or has failed); else generation under way ⇒ `generating`; else `failed`. Every state label below is the output of `getCareTipsState(plant)`.
>
> — `screens.md Source, gap 4, verbatim` · full text: [screens.md](../screens.md)

> **Chosen:** Option 1. [`lib/uiStrings.ts` exports the Ukrainian text; components import from it.] Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.
>
> — `adr/0003, Decision outcome, abridged` · full text: [adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

> Plant names and AI text are rendered as plain text through React; `dangerouslySetInnerHTML` is not used (spec §6.1 abuse case).
>
> — `sad.md §2, Regulatory / external, verbatim` · full text: [sad.md](../sad.md)

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

- [x] `CareTipStateLabel({ state })`: text from `uiStrings`, never colour alone, decorative icon `aria-hidden` — `components/careTipStateLabel.tsx`
- [x] `CollectionStatus({ plants })`: calls `getCollectionStatus`, renders total + three counts as text — `components/collectionStatus.tsx`
- [x] `EmptyState`: message and prominent `Button` as link to `/addPlant` — `components/emptyState.tsx`
- [x] `PlantListItem({ plant, highlighted })`: one `<Link>`, row on `md+` and card below, name `truncate`, location dash, short notes or «Очікується»/«Недоступно» from `getCareTipsState`, ready plants without short notes fall back to the full text — `components/plantListItem.tsx`
- [x] Only English comments; text only through `lib/uiStrings.ts`

**Test setup (confirmed with the owner 2026-10-17):** dev dependencies `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`; `*.test.tsx` files opt into jsdom with a `// @vitest-environment jsdom` docblock, `*.test.ts` stay in node; `vitest.config.mts` compiles JSX with the automatic runtime because `tsconfig.json` keeps `"jsx": "preserve"` for Next.js. Manual 360 px and Tab/Enter checks are recorded in T9.

## Edge cases

| Case | Behaviour |
|---|---|
| Ready plant without short notes (e.g. older tips) | Show the full `wateringFrequency` / `sunlightNeeds`, truncated; never blank |
| Name longer than the space | Truncated with an ellipsis; full name stays in the link's accessible name |
| Plant has no location | Dash in the location cell |
| Name or tip text contains markup | Rendered as plain text |
| Keyboard focus on a row | Visible focus ring; the row is a single Tab stop (no nested links or buttons) |

## Definition of Done

- [ ] The four components render the states in `screens.md` SCR-01/SCR-02; no nested interactive elements inside the row link
- [ ] State and status conveyed in text; contrast ≥ 4.5:1 on labels
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck`, `pnpm lint` clean; manual check at 360 px and with Tab/Enter recorded in the PR
