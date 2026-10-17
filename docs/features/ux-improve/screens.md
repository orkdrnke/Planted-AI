---
status: draft
feature_size: "S"
tool: "code"
updated_at: "2026-10-17"
---

# Screens — ux-improve

> The canonical **screen manifest** — every screen in every state — produced by `screens` (between
> `api` and `tasks`) and read by `tasks` (each `ui` task cites SCR ids + states), `implement`
> (builds the screen to the declared states) and `review` (the built screen must match this).
> Downstream stages reference **only this manifest** — never the raw Figma / `.pen` file.

## Source

- **Tool:** code (no `docs/design-system.md` exists, so `code` is the default; recommend `/sdd:design-system` before the next UI feature).
- **File:** inline wireframes below.

**Noted gaps and drift (read before `tasks`):**

1. **No design-system inventory.** "Components" below name the shadcn primitives that exist in `components/ui/` (`Button`, `Card`, `Dialog`, `Form`, `Input`, `Select`, `Label`) as the de facto inventory. Anything else is a `NEW:` row in §New components.
2. **Removal moved to the plant page.** `ux-flows.md` still puts the remove action on the dashboard row (SCR-01 → SCR-07) and says it is not offered on the plant page. `sad.md` §4 and §6 Flow 3 decided the opposite (AC-10: a row has exactly one focusable item), and `screens` follows the SAD. SAD §11 already lists the `ux-flows.md` / spec §8 update as a to-do. This manifest therefore has the remove action on SCR-03 and SCR-04, and SCR-07 opens from them. SCR-01 has **no** remove control.
3. **UI text is Ukrainian** (ADR-0003). Wireframe text below is a *proposal* to be placed in `lib/uiStrings.ts`; wording is confirmed there, not here. State tokens, SCR ids and component names stay English.
4. **Care-tip state rule** (ADR-0002): stored tips ⇒ `ready` (even when a regeneration is under way or has failed); else generation under way ⇒ `generating`; else `failed`. Every state label below is the output of `getCareTipsState(plant)`.

## Screens

### SCR-01 — Dashboard (with plants)

Route `/myGarden`. Status above one responsive list: cards on a phone (< `md`), table-like rows with a column heading line on wide screens (≥ `md`). Each plant is one `<Link>` to `/myGarden/[id]` (one Tab stop, Enter opens). Columns: name (with the state label next to it), type, location, watering, light. No price, size, amount or total row. No remove control, no retry on this screen (AC-02).

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default | ≥ 1 plant in the store (AC-01, AC-03); status counts ready + generating + failed = total | `NEW: CollectionStatus`, `NEW: PlantListItem`, `NEW: CareTipStateLabel`, `Button` (add action, as a link to `/addPlant`) | wireframe «SCR-01 default, wide» |
| default (phone, 360 px) | viewport < `md` (AC-09): same data as cards, short notes shown in full, no sideways scroll | same as default; card layout via Tailwind breakpoints, `Card` classes reused for the card surface | wireframe «SCR-01 default, phone» |
| row: ready | `getCareTipsState` = ready (stored tips, even if the last regeneration failed or is running); AC-01, AC-02 | `PlantListItem`, `CareTipStateLabel` (ready) | wireframe «SCR-01 default, wide» |
| row: generating | no stored tips and generation under way; watering and light cells show the pending label (AC-02) | `PlantListItem`, `CareTipStateLabel` (generating), `lucide-react Loader2` (spinner, decorative next to a text label) | wireframe «SCR-01 default, wide» |
| row: failed (error) | no stored tips and no generation under way, incl. never-started and seed plants; cells show the unavailable label; no retry (AC-02) | `PlantListItem`, `CareTipStateLabel` (failed) | wireframe «SCR-01 default, wide» |
| row: no location | `dest` empty or missing; location cell shows a dash (AC-02) | `PlantListItem` | wireframe «SCR-01 default, wide» |
| row: long name | name longer than the available width; truncated with an ellipsis, full name on the plant page (AC-09, spec §6.1) | `PlantListItem` (`truncate`; the link's accessible name keeps the full name) | wireframe «SCR-01 default, phone» |
| row: just added | `newPlantId` matches the row; `animate-highlight` for about 2 s, then `clearNewPlantId` (AC-01) | `PlantListItem` | wireframe «SCR-01 default, wide» (marked `*`) |
| row: focused | keyboard focus on a row or card; visible focus ring (AC-10, QG-3) | `PlantListItem` (`focus-visible` ring) | wireframe «SCR-01 default, wide» (marked `>`) |
| empty | no plants | → SCR-02 | n/a, see SCR-02 |
| loading | N/A: the list reads from the in-memory store synchronously; no list-level request exists. Per-plant pending is the `row: generating` state | — | — |
| error | N/A at screen level: nothing is fetched for the list. Per-plant failure is the `row: failed` state | — | — |

```text
SCR-01 default, wide (≥ md)
+--------------------------------------------------------------------------------+
| Мій сад                                                                         |
| Рослин: 4 · Готово: 2 · Генерується: 1 · Помилка: 1        [ Додати рослину ]  |
|                                                                                 |
| Назва                      Тип         Місце       Полив         Світло         |
|---------------------------------------------------------------------------------|
|*Монстера   [Готово]        Кімнатна    Кімната     Раз на тиждень  Розсіяне      |
|>Фікус      [Готово]        Кімнатна    —           Раз на 2 тижні  Яскраве        |
| Алое  ⟳    [Генерується]   Сукулент    Кухня       Очікується      Очікується     |
| Кактус     [Помилка]       Сукулент    Балкон      Недоступно      Недоступно     |
+--------------------------------------------------------------------------------+
 * just added (2 s highlight)   > keyboard focus ring   — no location
 each row = one link; whole row is the hit area; no price/size/amount/total
```

```text
SCR-01 default, phone (360 px)
+--------------------------------+
| Мій сад                        |
| Рослин: 4                      |
| Готово: 2 · Генерується: 1 ·   |
| Помилка: 1                     |
| [ Додати рослину ]             |
|                                |
| +----------------------------+ |
| | Монстера         [Готово]  | |
| | Кімнатна · Кімната         | |
| | Полив: Раз на тиждень      | |
| | Світло: Розсіяне           | |
| +----------------------------+ |
| | Дуже довга назва рос… [Ген.]| |
| | Сукулент · —               | |
| | Полив: Очікується          | |
| | Світло: Очікується         | |
| +----------------------------+ |
+--------------------------------+
 long name truncated with "…" (name shrinks, label never wraps off-screen)
 state label is always text, never colour alone
```

### SCR-02 — Dashboard (empty)

Route `/myGarden`, same page as SCR-01 when `plants.length === 0`. No table and no column headings (AC-08).

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default | store has no plants; first open of a new collection, or the last plant was removed (AC-08, Flow US-06) | `NEW: EmptyState`, `CollectionStatus` (all counts 0), `Button` (prominent add action, link to `/addPlant`) | wireframe «SCR-02 default» |
| loading | N/A: store read is synchronous | — | — |
| error | N/A: no request on this screen; the add action navigates to SCR-06 | — | — |

```text
SCR-02 default
+--------------------------------------------------+
| Мій сад                                           |
| Рослин: 0 · Готово: 0 · Генерується: 0 · Помилка: 0|
|                                                   |
|              (plant glyph, decorative)            |
|        У вашому саду ще немає рослин              |
|   Додайте першу рослину, щоб отримати поради      |
|   з догляду.                                      |
|                                                   |
|              [ Додати першу рослину ]             |
+--------------------------------------------------+
```

### SCR-03 — Plant page (tips ready or generating)

Route `/myGarden/[id]`. Keeps the current layout (photo, details card, sidebar with last watered, next fertilization, additional details, notes). The care-tip block, the typo "Last watred", the dropped last character of each tip and the English strings are fixed here (SAD §11). Adds a back link to the dashboard and the **remove** control that opens SCR-07 (AC-11). Sidebar «Additional details» keeps price, size, amount, destination (AC-05).

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default (ready) | state = ready; full watering, light, temperature, soil text and every care tip with its full text (AC-05) | `Card`, existing in-page `Section` and `SidebarCard`, `CareTipStateLabel` (ready), `Button` (outline, regenerate), `Button` (destructive outline, remove), back `Link` | wireframe «SCR-03 ready» |
| generating | no stored tips and generation under way; banner `role="status"` says tips are being prepared; tip sections show the pending text; remove and back stay available | existing in-page `AiCareStatus` (generating branch), `lucide-react Loader2`, `Card`, `Section` | wireframe «SCR-03 generating» |
| ready, regenerating | stored tips present and a regeneration request under way: state stays ready (ADR-0002), stored tips remain visible, regenerate button disabled | `AiCareStatus`, `Button` (disabled) | wireframe «SCR-03 ready» (button disabled) |
| ready, regeneration failed | stored tips present, latest request failed: stored tips still shown, state stays ready, no failure message (SAD §6 Flow 4) | `AiCareStatus`, `CareTipStateLabel` (ready) | wireframe «SCR-03 ready» |
| success | generation finishes while the page is open: banner disappears, full tips appear without navigation (Flow US-03 generating → ready) | `AiCareStatus`, `Section` | wireframe «SCR-03 ready» |
| empty | N/A: a found plant always has its entered details; missing optional fields show the existing dash or placeholder text | — | — |
| error | → SCR-04 (failed) | — | n/a, see SCR-04 |

```text
SCR-03 ready
+----------------------------------------------------------------------+
| < До саду                                                             |
| +-----------------------------------------+ +----------------------+ |
| | [photo]                                 | | Востаннє поливали    | |
| | Монстера                      [Готово]  | |  Немає даних         | |
| | Ботанічна назва: Monstera deliciosa     | | Наступне підживлення | |
| | [ Згенерувати знову ]                   | |  не заплановано      | |
| |                                         | | Додатково            | |
| | Категорія         Кімнатна              | |  Розмір 40 см        | |
| | Полив             <full text>           | |  Ціна 250            | |
| | Світло            <full text>           | |  Місце Кімната       | |
| | Температура       <full text>           | |  Кількість 2         | |
| | Ґрунт             <full text>           | | Нотатки              | |
| | Поради                                  | |  Немає нотаток       | |
| |  • <full tip, last character kept>      | +----------------------+ |
| |  • <full tip>                           |                          |
| +-----------------------------------------+                          |
|                                         [ Видалити рослину ]          |
+----------------------------------------------------------------------+
```

```text
SCR-03 generating
+-----------------------------------------+
| < До саду                                |
| Алое                      [Генерується]  |
| +-------------------------------------+  |
| | ⟳ Поради з догляду готуються…       |  |  role="status"
| +-------------------------------------+  |
| Полив / Світло / Температура / Ґрунт     |
|   Очікується                             |
| Поради: Очікується                       |
|                          [ Видалити рослину ]
+-----------------------------------------+
```

### SCR-04 — Plant page (tips failed)

Route `/myGarden/[id]`, same page as SCR-03 when the state is failed. One fixed plain-language sentence, never `plant.aiError` text (AC-06, SAD §8). Entered details stay visible (AC-06).

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default (failed) | state = failed: last generation failed, or no tips and no generation under way (never started, seed plant); same wording in both cases; retry action; details intact (AC-06) | existing in-page `AiCareStatus` (error branch, `role="alert"`), `lucide-react AlertCircle`, `Button` (outline, retry), `Card`, `Section`, `SidebarCard`, `CareTipStateLabel` (failed), back `Link`, remove `Button` | wireframe «SCR-04 failed» |
| loading | user chooses retry: store marks the plant generating, the page switches to SCR-03 `generating`; a second click is ignored by the store | `AiCareStatus`, `Button` (disabled while pending) | n/a, see SCR-03 `generating` |
| success | retry returns valid tips: page switches to SCR-03 `default (ready)` | — | n/a, see SCR-03 |
| error | retry fails again with no stored tips: the same sentence and retry action show again (Flow 4) | `AiCareStatus` (error branch) | wireframe «SCR-04 failed» |
| empty | N/A: details are always present for a found plant | — | — |

```text
SCR-04 failed
+-----------------------------------------+
| < До саду                                |
| Кактус                        [Помилка]  |
| +-------------------------------------+  |
| | ⚠ Не вдалося створити поради з      |  |  role="alert"
| |   догляду.        [ Спробувати ще ] |  |
| +-------------------------------------+  |
| Категорія: Сукулент                      |
| Полив / Світло / Температура / Ґрунт     |
|   Недоступно                             |
| Поради: Недоступно                       |
| Додатково: Розмір, Ціна, Місце, Кількість|
|                          [ Видалити рослину ]
+-----------------------------------------+
```

### SCR-05 — Plant not found

Route `/myGarden/[id]` when no plant matches. The same screen for an unknown id and, after roadmap step 4, for another gardener's plant (AC-07, not testable earlier). The text must not hint that the plant exists elsewhere.

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default | `plants.find(id)` is undefined (unknown id; after step 4 also a foreign id) | `Button` (link variant or outline) as a back link to `/myGarden` | wireframe «SCR-05 default» |
| loading | N/A: store read is synchronous (revisit when the store moves to a server, roadmap step 4) | — | — |
| error | N/A: this screen is itself the error outcome of an unknown id | — | — |
| empty | N/A: nothing to list | — | — |

```text
SCR-05 default
+----------------------------------+
| Рослину не знайдено 🌱           |
| [ Повернутися до саду ]          |
+----------------------------------+
```

### SCR-06 — Add plant

Route `/addPlant`. Layout and fields are unchanged by this feature; only the existing text (title, labels, placeholders, descriptions, button, schema messages) moves into `lib/uiStrings.ts` in Ukrainian (ADR-0003). The form contract and `addPlant` behaviour are not changed. Submit navigates to SCR-01 where the new plant is highlighted with its tips generating.

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default | page opened; empty form | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `Input`, `Select`, `Button` | wireframe «SCR-06 default» |
| validation | submit with invalid fields per `PlantFormSchema` (name min 3, type min 5, dest min 5 when present); per-field `FormMessage` with a Ukrainian message | `FormMessage` | wireframe «SCR-06 validation» |
| loading | N/A: `addPlant` is synchronous and the form navigates immediately; AI generation continues in the background and shows on SCR-01 | — | — |
| error | N/A beyond `validation`: adding cannot fail; an AI failure is shown on SCR-01 / SCR-04 | — | — |
| empty | N/A: a form has no empty state | — | — |

```text
SCR-06 default
+------------------------------------------+
| Додати нову рослину                       |
| Назва рослини   [ назва            ]      |
|   Це назва вашої рослини                  |
| Тип рослини     [ Оберіть тип      v]     |
| Розмір          [ розмір           ]      |
| Кількість       [ кількість        ]      |
| Призначення     [ призначення      ]      |
| Ціна            [ ціна             ]      |
| Дата додавання  [ дд.мм.рррр       ]      |
| [ Додати ]                                |
+------------------------------------------+

SCR-06 validation (same layout)
| Назва рослини   [ ab               ]      |
|   <Ukrainian message: name too short>     |
```

### SCR-07 — Confirm removal

A `Dialog` over SCR-03 or SCR-04, opened by the remove control on the plant page (see Source, gap 2). Names the plant. Cancel, Esc and overlay click all close it with the plant page unchanged. Confirm removes that plant by id and goes to SCR-01, or SCR-02 when it was the last plant (AC-11, AC-08).

| State | Trigger / condition | Components | Source-ref |
|---|---|---|---|
| default | remove control chosen; focus moves into the dialog, returns to the remove control on cancel | `NEW: RemovePlantDialog` (composes `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Button` outline for cancel, `Button` destructive for confirm) | wireframe «SCR-07 default» |
| success | confirm: plant removed, other plants and their tips unchanged, status counts drop; navigation to SCR-01 or SCR-02 | — | n/a, see SCR-01, SCR-02 |
| loading | N/A: `removePlant` is synchronous | — | — |
| error | N/A: removing by id in the in-memory store cannot fail; revisit when persistence moves to a server (roadmap step 4) | — | — |
| empty | N/A: the dialog always names one plant | — | — |

```text
SCR-07 default
+--------------------------------------+
| Видалити «Монстера»?              [x] |
|                                       |
| Рослину буде видалено з вашого саду.  |
| Цю дію не можна скасувати.            |
|                                       |
|            [ Скасувати ] [ Видалити ] |
+--------------------------------------+
```

## New components

| Component | Why no existing primitive fits | Registered in design-system |
|---|---|---|
| NEW: `PlantListItem` | One responsive row-or-card that is a single `<Link>` (one Tab stop). `Table`/`TableRow` can't be one link and become a card on a phone; `Card` has no row layout or link semantics | pending (no `docs/design-system.md` yet) |
| NEW: `CollectionStatus` | Text summary of total and ready / generating / failed counts; no primitive shows a counted summary | pending |
| NEW: `CareTipStateLabel` | Text label (with a decorative icon) for ready / generating / failed, shared by SCR-01, SCR-03, SCR-04; there is no badge primitive in `components/ui/` | pending |
| NEW: `EmptyState` | Message plus a prominent add action; no empty-state primitive exists | pending |
| NEW: `RemovePlantDialog` | Confirmation naming one plant; composes the existing `Dialog` parts and `Button`, so it is a composite, not a new primitive | pending |

Names are proposals (SAD §5); `tasks` confirms them. `AiCareStatus`, `Section` and `SidebarCard` are existing in-page components of `app/myGarden/[id]/page.tsx` and are reused, not new.

## Assumptions ledger

- Assumed: remove lives on SCR-03 and SCR-04, not on the dashboard row = follows `sad.md` §4 and §6 Flow 3 over `ux-flows.md` (stale). [veto?]
- Assumed: the empty dashboard shows the status with all counts at 0 = AC-08 «status reports zero plants» and the AC-04 invariant. [veto?]
- Assumed: a plant with stored tips and a regeneration under way is `ready` and keeps its tips; only the regenerate button is disabled = ADR-0002 «stored tips win». [veto?]
- Assumed: a failed regeneration on a plant with stored tips shows no message (SAD §6 Flow 4 as written). This is quiet for the gardener; consider an open question if it is not wanted. [veto?]
- Assumed: the existing «regenerate» button stays on the ready page = AC-05 «rest of the page unchanged». [veto?]
- Assumed: SCR-05 adds a back link to the dashboard = ux-flows exit «Back → SCR-01 or SCR-02». [veto?]
- Assumed: a column heading line shows only on wide screens (≥ `md`); on a phone the label for each value is inline text. [veto?]
- Assumed: the screens' text in wireframes is proposed Ukrainian, finalised in `lib/uiStrings.ts`. [veto?]
