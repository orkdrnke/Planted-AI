---
id: T8
title: "Move the text of the landing page, add-plant form and header into uiStrings in Ukrainian"
layer: "ui"
deps: ["T3"]
blocks: ["T9"]
acs: []
files_hint: ["app/page.tsx", "app/addPlant/page.tsx", "components/header.tsx", "components/headerMenu.tsx", "schemas/plantFormSchema.ts", "lib/uiStrings.ts"]
owner: "Orest Lyubinets"
estimate: "M"
context_budget: "S"
status: "done"
step: "COMMIT"
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T8 — Move the text of the landing page, add-plant form and header into uiStrings in Ukrainian

## Place in the sequence

- **Blocked by:** T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog · **Blocks:** T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 2.
- **Lane:** shares `lib/uiStrings.ts` with T3 — serialized.

## Why (user story)

> No user story of its own: this task carries the owner's decision that all product UI text is Ukrainian (ADR-0003).
>
> — `adr/0003, Context, abridged` · full text: [adr/0003](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

This task makes the remaining screens follow the same Ukrainian text rule so the product reads consistently.

## Inlined context

> **Chosen:** Option 1. [`lib/uiStrings.ts` exports the Ukrainian text; components import from it.] Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.
>
> — `adr/0003, Decision outcome, abridged` · full text: [adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

> Scope growth: translating the landing page, add-plant form and header (not touched by the spec) adds tasks to a size S feature. Mitigation: keep it to moving existing text into `lib/uiStrings.ts`; revisit the size at `tasks` if it grows.
>
> — `sad.md §11, risk «Scope growth», verbatim` · full text: [sad.md](../sad.md)

> SCR-06: layout and fields are unchanged by this feature; only the existing text (title, labels, placeholders, descriptions, button, schema messages) moves into `lib/uiStrings.ts` in Ukrainian. The form contract and `addPlant` behaviour are not changed. Validation shows a Ukrainian message per field per `PlantFormSchema`.
>
> — `screens.md SCR-06, abridged` · full text: [screens.md](../screens.md)

> Avoid changing the form contract without updating its consumers; keep validation rules consistent with the schema. Product UI text is Ukrainian (new requirement overrides AGENTS.md §10).
>
> — `AGENTS.md §5/§7 + sad.md §2 Override, abridged` · full text: [../../../AGENTS.md](../../../../AGENTS.md)

**Fallback:** insufficient or contradicted by the code → read the named file in full ([spec.md](../spec.md) · [sad.md](../sad.md) · [screens.md](../screens.md) · [openapi.yaml](../contracts/openapi.yaml) · [adr/](../adr/)) and follow it. Do not guess.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

No spec §5 acceptance criterion applies. This task keeps existing behaviour unchanged while translating text (ADR-0003); its checks are in the Definition of Done.

## Checklist

- [x] Add `landing`, `header`, `addPlantForm` groups to `lib/uiStrings.ts`
- [x] Replace the literals in `app/page.tsx`, `components/header.tsx`, `components/headerMenu.tsx`
- [x] Replace the form text and the Zod messages in `app/addPlant/page.tsx` and `schemas/plantFormSchema.ts` without changing the rules (name min 3, type min 5, dest min 5 when present)
- [x] Do not alter layout, fields or `addPlant` behaviour

**Plant type labels (implemented):** `PLANT_TYPES` values stay English — they are stored plant data and the `/img/<type>.png` file names. `uiStrings.plantTypeLabel(type)` translates them for display in the form select, the dashboard type cell (`components/plantListItem.tsx`) and the plant page category (`app/myGarden/[id]/page.tsx`); unknown values pass through unchanged.

## Edge cases

| Case | Behaviour |
|---|---|
| Invalid form submission | Same fields fail as before, with Ukrainian messages |
| Valid submission | Plant added and navigation to the dashboard as before |

## Definition of Done

- [ ] No English product text remains on the landing page, header or add-plant form (grep and visual check)
- [ ] Form validation rules and submit behaviour unchanged
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` clean
