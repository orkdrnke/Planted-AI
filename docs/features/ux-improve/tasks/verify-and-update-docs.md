---
id: T9
title: "Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording"
layer: "tests"
deps: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"]
blocks: []
acs: ["AC-09", "AC-10"]
files_hint: ["AGENTS.md", "docs/features/ux-improve/spec.md", "docs/features/ux-improve/ux-flows.md"]
owner: "Orest Lyubinets"
estimate: "S"
context_budget: "S"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording

## Place in the sequence

- **Blocked by:** T1 — Add short watering and light notes to the care-tips schema, type and prompt, T2 — Add getCareTipsState and getCollectionStatus pure functions with unit tests, T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog, T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components, T5 — Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight, T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found, T7 — Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal, T8 — Move the text of the landing page, add-plant form and header into uiStrings in Ukrainian · **Blocks:** — · **Wave:** 5.
- **Lane:** own lane.

## Why (user story)

> **As a** gardener  
> **I want** the dashboard to be readable and usable on a phone as well as on a desktop, with the keyboard as well as a pointer  
> **So that** I can check my plants from whichever device I have
>
> — `spec.md §4, US-05, verbatim` · full text: [spec.md](../spec.md)

This task proves the dashboard works on a phone and by keyboard and brings the docs in line.

## Inlined context

> QG-3. At 360 px: no sideways scrolling; every plant row (or card) is one Tab stop opened with Enter; automated accessibility audit shows no serious issues; text contrast ≥ 4.5:1. Verify: manual check in a phone-size browser view; manual Tab/Enter walk-through; axe on the dashboard.
>
> — `sad.md §10, QG-3, abridged` · full text: [sad.md](../sad.md)

> Default measurement bounds (spec §8, open): production build, from click or navigation start to full content visible, axe with serious and critical issues failing. QG-2 targets: first render ≤ 1 s and plant page ≤ 300 ms at 100 plants.
>
> — `spec.md §8 + sad.md §11, abridged` · full text: [spec.md](../spec.md)

> Update AGENTS.md §10 and AC-02 wording (ADR-0003); reword AC-05 and spec §6.1 (contract change, size stays S); update spec §8 and `ux-flows.md` for removal on the plant page (US-06 flow, screen inventory, SCR-03/04 exit to SCR-07).
>
> — `sad.md §11, risks 1–3, abridged` · full text: [sad.md](../sad.md)

> No UI tests exist (Vitest runs `*.test.ts` in a node environment), so layout, keyboard and accessibility targets rely on manual and audit checks. Mitigation: keep the rule logic in pure `lib/` functions with unit tests; record manual and axe results in `review`.
>
> — `sad.md §11, risk «No UI tests exist», abridged` · full text: [sad.md](../sad.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

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

- [ ] Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` and record the output
- [ ] Seed 100 plants in a scratch run, take performance traces on the production build, record dashboard render and plant-open times
- [ ] Run axe on the dashboard; manual 360 px check; manual Tab/Enter walk-through
- [ ] Update `AGENTS.md` §10 (UI text is Ukrainian) and note the shared schema now has the two short fields
- [ ] Align `spec.md` (AC-02 labels, AC-05, §6.1, §8 remove placement) and `ux-flows.md` with the SAD — docs only, ask the owner before rewording ACs

## Edge cases

| Case | Behaviour |
|---|---|
| Any check fails | Fix regressions introduced here; report pre-existing failures separately |
| Performance target missed | Report the number; do not weaken the target silently |

## Definition of Done

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass, output recorded
- [ ] Axe shows no serious/critical issues on the dashboard; 360 px and keyboard checks recorded
- [ ] AGENTS.md and the drifted spec/ux-flows sections updated and committed
- [ ] every Hard Rule inlined above still holds
