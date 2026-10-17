---
id: T1
title: "Add short watering and light notes to the care-tips schema, type and prompt"
layer: "domain"
deps: []
blocks: ["T5", "T9"]
acs: ["AC-01", "AC-09"]
files_hint: ["schemas/careTipsSchema.ts", "types/plant.ts", "lib/aiHelpers.ts", "lib/aiHelpers.test.ts", "app/api/ai-care-guide/route.test.ts", "lib/store/plantsStore.test.ts"]
owner: "Orest Lyubinets"
estimate: "M"
context_budget: "S"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T1 — Add short watering and light notes to the care-tips schema, type and prompt

## Place in the sequence

- **Blocked by:** — · **Blocks:** T5 — Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight, T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 1.
- **Lane:** own lane.

## Why (user story)

> **As a** gardener  
> **I want** the dashboard to show each plant's name, type, location, how often to water and how much light it needs  
> **So that** I can tell what is in my collection without opening every plant
>
> — `spec.md §4, US-01, verbatim` · full text: [spec.md](../spec.md)

This task gives the dashboard a short watering and light note to show for each plant.

## Inlined context

> `CareTipsSchema` gains two short fields filled by the AI, so the dashboard shows 2–4 words and the plant page keeps the full text (ADR-0001).
>
> — `sad.md §4, strategic choice 1, verbatim` · full text: [sad.md](../sad.md)

> **Chosen:** Option 1 — add separate short fields `wateringShort` and `sunlightShort`, written by the AI together with the full text. The change touches the schema, the prompt in `lib/aiHelpers.ts`, `TPlant` and the tests.
> The length limit may not be enforceable by the structured-output feature of the installed `openai` ^6.7.0 and model; verify before relying on a Zod `.max(...)`. If unsupported, enforce by the prompt and the client-side `CareTipsSchema.safeParse`, and decide clip vs fail generation.
>
> — `adr/0001, Decision outcome + Consequences, abridged` · full text: [adr/0001-add-short-watering-and-light-fields-to-care-tips-schema.md](../adr/0001-add-short-watering-and-light-fields-to-care-tips-schema.md)

> `schemas/careTipsSchema.ts` must stay free of server-only imports (shared by the server and the client). Validate AI output against the schema before updating state; tests must not call the real OpenAI API.
>
> — `AGENTS.md §4.2/§5/§11, abridged` · full text: [../../../AGENTS.md](../../../../AGENTS.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

- `POST /api/ai-care-guide` → `200` `CareTips` with two new required fields: `wateringShort`, `sunlightShort` (`string`, `maxLength: 40`, 2–4 words). Errors unchanged: `400`, `502`, `500`.
- Request body unchanged (`name`, `type`, `dest`).

— `contracts/openapi.yaml, operationId generateCareTips + schema CareTips, abridged` · full text: [openapi.yaml](../contracts/openapi.yaml)

## Acceptance criteria

### AC-01 — happy path

> **Given** a gardener has several plants in the collection
> **When** the gardener opens the dashboard
> **Then** each plant is one row showing its name, type, location, watering and light needs, with the state of its care tips shown next to the name, and price, size and amount are not shown in the table; a plant that was just added is briefly highlighted, as it is today
>
> — `spec.md §5, AC-01, verbatim` · full text: [spec.md](../spec.md)

### AC-09 — happy path

> **Given** a gardener opens the dashboard on a phone-sized screen
> **When** the page is shown
> **Then** all essential information for each plant (name, type, location, watering, light, care-tip state) is readable without sideways scrolling; on a phone-sized screen each plant may be shown as a card instead of a table row, the watering and light short notes are shown in full, and a name too long for the space is truncated (the full name is on the plant page)
>
> — `spec.md §5, AC-09, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Check whether the installed `openai` SDK / `gpt-4o-mini` structured output enforces `maxLength`; record the result in the PR description — `schemas/careTipsSchema.ts`
- [ ] Add `wateringShort` and `sunlightShort` to `CareTipsSchema` — `schemas/careTipsSchema.ts`
- [ ] Add both as optional string fields to `TPlant` — `types/plant.ts`
- [ ] Ask for the two short notes (2–4 words, ≤ ~40 chars) in the prompt — `lib/aiHelpers.ts`
- [ ] Confirm the store merges the new fields with the other AI fields (merge only AI fields by id) — `lib/store/plantsStore.ts`
- [ ] Extend the existing tests with the new fields and a rejected over-long or missing short value — `lib/aiHelpers.test.ts`, `app/api/ai-care-guide/route.test.ts`, `lib/store/plantsStore.test.ts`

## Edge cases

| Case | Behaviour |
|---|---|
| Model omits a short note | `CareTipsSchema` validation fails: route returns `502`, store sets `aiStatus: "error"`, plant stays intact |
| Short note longer than ~40 chars | Rejected or clipped per the verified enforcement path; decision recorded in the PR (ADR-0001 consequence) |
| Plant already has tips from before this change | Not applicable now (in-memory store, ADR-0001 neutral); old tips without short fields are handled by T5 showing the full fallback or label |

## Definition of Done

- [ ] Schema, type, prompt and tests include both short fields; `pnpm test` passes without calling real OpenAI
- [ ] Route response example in `openapi.yaml` validates against `CareTipsSchema`
- [ ] Enforcement path for the length limit is documented
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck` and `pnpm lint` clean
