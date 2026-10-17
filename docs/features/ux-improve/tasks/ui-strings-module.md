---
id: T3
title: "Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog"
layer: "ui"
deps: []
blocks: ["T4", "T6", "T7", "T8", "T9"]
acs: ["AC-02", "AC-06", "AC-08"]
files_hint: ["lib/uiStrings.ts"]
owner: "Orest Lyubinets"
estimate: "S"
context_budget: "S"
status: "todo"
step: ""
---

> **To the executing agent:** work from what is inlined here. If a slice is insufficient, ambiguous, or contradicts the code in front of you, open the named file for the full text and follow that. Do not invent the missing part. The source always wins.

# T3 — Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog

## Place in the sequence

- **Blocked by:** — · **Blocks:** T4 — Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components, T6 — Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found, T7 — Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal, T8 — Move the text of the landing page, add-plant form and header into uiStrings in Ukrainian, T9 — Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording · **Wave:** 1.
- **Lane:** shares `lib/uiStrings.ts` with T8 — serialized.

## Why (user story)

> **As a** gardener  
> **I want** a clear next step when my collection has no plants  
> **So that** I can add my first plant without guessing what to do
>
> — `spec.md §4, US-04, verbatim` · full text: [spec.md](../spec.md)

This task supplies the Ukrainian text every dashboard and plant-page component reads, including the empty-state prompt.

## Inlined context

> **Chosen:** Option 1. [`lib/uiStrings.ts` exports the Ukrainian text; components import from it.] Scope is the whole product: every screen reads its text from the module, including the landing page, the add-plant form and the header, whose existing text is moved and translated.
>
> — `adr/0003, Decision outcome, abridged` · full text: [adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md](../adr/0003-keep-ukrainian-ui-text-in-a-single-strings-module.md)

> Wireframe text is a *proposal* to be placed in `lib/uiStrings.ts`; wording is confirmed there. State tokens, SCR ids and component names stay English.
>
> — `screens.md Source, gap 3, abridged` · full text: [screens.md](../screens.md)

> Proposed Ukrainian text from the wireframes: «Мій сад»; «Рослин: N · Готово: N · Генерується: N · Помилка: N»; state labels «Готово» / «Генерується» / «Помилка»; cell labels «Очікується» (generating) and «Недоступно» (failed); «Додати рослину»; empty state «У вашому саду ще немає рослин» + «Додайте першу рослину, щоб отримати поради з догляду.» + «Додати першу рослину»; plant page «До саду», «Згенерувати знову», «Поради з догляду готуються…», «Не вдалося створити поради з догляду.», «Спробувати ще», «Видалити рослину»; not found «Рослину не знайдено» + «Повернутися до саду»; dialog «Видалити «{name}»?», «Рослину буде видалено з вашого саду. Цю дію не можна скасувати.», «Скасувати», «Видалити».
>
> — `screens.md SCR-01…SCR-07 wireframes, abridged` · full text: [screens.md](../screens.md)

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

### AC-06 — error

> **Given** a plant whose care tips failed to generate, or that has no tips and no generation under way
> **When** the gardener opens its plant page from the dashboard
> **Then** the plant page shows one plain-language sentence saying that the tips could not be generated (the same wording in both cases, with no technical error detail) and offers a way to try again, while the plant and its entered details stay intact
>
> — `spec.md §5, AC-06, verbatim` · full text: [spec.md](../spec.md)

### AC-08 — cross-context

> **Given** a gardener's collection has no plants, so there are also no care tips to report
> **When** the gardener opens the dashboard
> **Then** the dashboard shows an empty-state message with a prominent action to add the first plant, and the collection status reports zero plants instead of an empty table with headers
>
> — `spec.md §5, AC-08, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Create a typed `uiStrings` object grouped by screen (dashboard, status, state labels, empty state, plant page, not found, removal dialog); plain strings or small functions for `{name}` — `lib/uiStrings.ts`
- [ ] Fix the old typo «Last watred» by supplying the correct text for the plant page sidebar — `lib/uiStrings.ts`
- [ ] Do not touch pages yet; components adopt the strings in T4–T7

## Edge cases

| Case | Behaviour |
|---|---|
| Plant name inserted in the dialog title | Use a function taking the name; no HTML, rendered as React text |

## Definition of Done

- [ ] `lib/uiStrings.ts` exports every string listed in `screens.md` for SCR-01…SCR-05 and SCR-07
- [ ] No new dependency added
- [ ] every Hard Rule inlined above still holds
- [ ] `pnpm typecheck` and `pnpm lint` clean
