# Tracker — ux-improve

> Status of every task in the epic. `implement` updates **Status** and **Step** after every
> subagent it runs (and commits them with the task), so this table shows where the run is right now.
> Status: `todo` · `in_progress` · `blocked` · `review` · `done`.
> Step: `SELECT` · `RED` · `GREEN` · `REFACTOR` · `GATE` · `REVIEW` · `COMMIT` (`—` before the task starts).
> A `blocked` row carries its reason in Step, e.g. `GATE — lint red after 3 retries`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status | Step |
|---|---|---|---|---|---|---|---|
| T1 | Add short watering and light notes to the care-tips schema, type and prompt | domain | Orest Lyubinets | M | — | done | COMMIT |
| T2 | Add getCareTipsState and getCollectionStatus pure functions with unit tests | domain | Orest Lyubinets | S | — | done | COMMIT |
| T3 | Create lib/uiStrings.ts with the Ukrainian text of the dashboard, plant page and removal dialog | ui | Orest Lyubinets | S | — | done | COMMIT |
| T4 | Build CareTipStateLabel, CollectionStatus, EmptyState and PlantListItem components | ui | Orest Lyubinets | M | T2, T3 | done | COMMIT |
| T5 | Rebuild /myGarden as the dashboard: status, responsive list, empty state, highlight | ui | Orest Lyubinets | M | T1, T4 | todo | — |
| T6 | Update the plant page: back link, state label, fixed failure sentence with retry, full tips, not-found | ui | Orest Lyubinets | M | T2, T3, T4 | todo | — |
| T7 | Add RemovePlantDialog on the plant page and navigate back to the dashboard after removal | ui | Orest Lyubinets | S | T3, T6 | todo | — |
| T8 | Move the text of the landing page, add-plant form and header into uiStrings in Ukrainian | ui | Orest Lyubinets | M | T3 | todo | — |
| T9 | Run all checks, audit accessibility and performance, and update AGENTS.md and spec wording | tests | Orest Lyubinets | S | T1, T2, T3, T4, T5, T6, T7, T8 | todo | — |

**Total:** 9 tasks, ~6 person-days.
