---
status: Draft
owner: "Orest Lyubinets"
reviewers: ["Tech Lead", "Security Lead"]
updated_at: "2026-10-17"
feature_size: "S"
---

# Spec — ux-improve

> **Glossary:** [CONTEXT](./CONTEXT.md)
> **Reference module / docs / channels used:** `docs/idea-brief.md` (§2, §3, §5, §7), `docs/roadmap.md` (step 7), `docs/architecture-map.md`; current plant table page, plant page and plant type read from source.

## 1. Context

A gardener who keeps a personal plant collection currently sees a table that lists every field entered in the add-plant form, including price, size and amount, plus a total price row. It reads as a data list, not as a place to check "what is here and what is happening now". Information that matters daily, such as where a plant lives and whether its care tips are ready, is thin or hidden in a small icon. The long-term audience is the public, and invited early users and reviewers are the actual users in the first release (owner-reported).

Why now: the product is about to gain accounts and a per-user collection that starts empty. The plant table becomes the main working screen for every gardener, so it must be intentional before real users arrive.

The committed approach: turn the plant table page into a dashboard with a small set of essential columns, a short collection status above the table, a helpful empty state for a new collection, and a plant page that opens from a row and shows the full care tips. Details that do not help daily use, such as price, size and amount, move out of the table.

Onboarding (roadmap step 6) is a separate feature. Urgent actions and reminders are out of scope (owner decision, idea brief §5).

## 2. Goals

- A gardener understands the state of the whole collection within seconds of opening the dashboard.
- The table shows only the information needed for daily use, and works on a phone-sized screen.
- A gardener reaches the full care tips of any plant in one step from the dashboard.
- A gardener can remove a plant from the collection, so the dashboard stays an accurate picture of what is kept.

## 3. Non-goals

- Onboarding or a changed welcome page — it is a separate roadmap step with its own first-entry rule.
- Urgent actions, reminders, notifications and a watering log — watering cannot be computed reliably and the owner moved them out of the first release.
- Moving the collection to a server or adding accounts — covered by other roadmap steps; this feature must work with whatever holds the collection.
- Search, filtering, sorting and photo features — not needed for a small personal collection in the first release.

## 4. User stories

### US-01: See the collection at a glance

**As a** gardener
**I want** the dashboard to show each plant's name, type, location, how often to water and how much light it needs
**So that** I can tell what is in my collection without opening every plant

### US-02: Read the collection status

**As a** gardener
**I want** a short status above the table showing how many plants I have and how many care tips are ready, generating or failed
**So that** I know the current state of my collection and which plants have tips ready, generating or failed

### US-03: Open a plant from the dashboard

**As a** gardener
**I want** to open a plant from its row and see its full care tips and details
**So that** I can read how to look after it, including the price, size and amount that are no longer in the table

### US-04: Start from an empty collection

**As a** gardener
**I want** a clear next step when my collection has no plants
**So that** I can add my first plant without guessing what to do

### US-05: Use the dashboard on any device

**As a** gardener
**I want** the dashboard to be readable and usable on a phone as well as on a desktop, with the keyboard as well as a pointer
**So that** I can check my plants from whichever device I have

### US-06: Remove a plant

**As a** gardener
**I want** to remove a plant from my collection
**So that** the dashboard shows only the plants I still keep

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a gardener has several plants in the collection
**When** the gardener opens the dashboard
**Then** each plant is one row showing its name, type, location, watering and light needs, with the state of its care tips shown next to the name, and price, size and amount are not shown in the table; a plant that was just added is briefly highlighted, as it is today

### AC-02 (US-01) — domain invariant

**Given** a plant whose care tips are still generating or failed (including a plant that has no tips and no generation under way, which counts as failed), so no watering or light information exists
**When** the gardener opens the dashboard
**Then** the plant is still listed with its name, type and location, and the watering and light cells each show the text label "Pending" (generating) or "Unavailable" (failed) instead of staying blank, and the dashboard offers no retry (retry is on the plant page, AC-06). A plant with no location entered shows a dash in the location cell instead of staying blank. A plant that has stored care tips counts as ready even when its latest regeneration failed: the stored tips decide the state and are shown

### AC-03 (US-02) — happy path

**Given** a gardener has plants with care tips ready, generating and failed
**When** the gardener opens the dashboard
**Then** the collection status above the table shows the number of plants and how many are in each care-tip state, and the state counts add up to the number of plants

### AC-04 (US-02) — domain invariant

**Given** a gardener adds or removes a plant, or care tips finish generating
**When** the dashboard is shown after the change
**Then** the collection status always matches the plants listed in the table

### AC-05 (US-03) — happy path

**Given** a plant with ready care tips is listed on the dashboard
**When** the gardener selects its row
**Then** the plant page opens showing the full care tips and all the plant's details, including price, size and amount, with the rest of the current plant page left unchanged

### AC-06 (US-03) — error

**Given** a plant whose care tips failed to generate, or that has no tips and no generation under way
**When** the gardener opens its plant page from the dashboard
**Then** the plant page shows one plain-language sentence saying that the tips could not be generated (the same wording in both cases, with no technical error detail) and offers a way to try again, while the plant and its entered details stay intact

### AC-07 (US-03) — authorization

*Verified after roadmap step 4 (per-user collections); not testable earlier.*

**Given** a plant that belongs to another gardener's collection
**When** a gardener tries to open that plant
**Then** the gardener sees the same "plant not found" message as for a plant that does not exist, and the dashboard never lists another gardener's plants

### AC-08 (US-04) — cross-context

**Given** a gardener's collection has no plants, so there are also no care tips to report
**When** the gardener opens the dashboard
**Then** the dashboard shows an empty-state message with a prominent action to add the first plant, and the collection status reports zero plants instead of an empty table with headers

### AC-09 (US-05) — happy path

**Given** a gardener opens the dashboard on a phone-sized screen
**When** the page is shown
**Then** all essential information for each plant (name, type, location, watering, light, care-tip state) is readable without sideways scrolling; on a phone-sized screen each plant may be shown as a card instead of a table row, the watering and light short notes are shown in full, and a name too long for the space is truncated (the full name is on the plant page)

### AC-10 (US-05) — cross-context

**Given** a gardener uses only the keyboard
**When** the gardener moves through the dashboard
**Then** every plant row (or card on a phone-sized screen) can be reached with the Tab key as a single focusable item and opened with Enter, and the collection status and care-tip state labels next to the plant name are conveyed in text and not by colour alone

### AC-11 (US-06) — happy path

**Given** a gardener has plants in the collection
**When** the gardener removes one of them
**Then** that plant no longer appears on the dashboard, the other plants and their care tips are unchanged, and the collection status counts drop accordingly

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Opening a plant from a row | ≤ 300 ms to show the plant page for a collection of 100 plants | browser performance trace on a mid-range laptop |
| Dashboard first render | ≤ 1 s for a collection of 100 plants | browser performance trace on a mid-range laptop |
| Smallest supported width | 360 px with no sideways scrolling | manual check in a phone-size browser view |
| Accessibility | no serious issues in an automated accessibility audit; text contrast ≥ 4.5:1 | automated audit run on the dashboard |

## 6.1 Security / privacy

- **Data classification:** internal — plant names and locations are personal collection data but not sensitive.
- **Personal data touched:** none new; the feature only changes how existing plant fields are displayed.
- **AuthZ/AuthN impact:** no new permission checks; the dashboard must list only the signed-in gardener's plants once accounts exist, and treat unknown and foreign plants identically.
- **Abuse cases:**
  - Another gardener's plant opened by guessing its identifier: show "plant not found", never reveal that it exists.
  - Markup entered as a plant name or care text: shown as plain text, never executed.
  - Very long names: truncated in the table, shown in full on the plant page.
- **Security review:** N/A — no new authorization boundary or personal data; the boundary arrives with accounts and is reviewed there.

## 7. Metrics / KPIs

- **Columns in the dashboard table** — baseline: 6 (plus a total row), target: 5 with no total row at release.
- **Clicks from the dashboard to full care tips** — baseline: 1, target: 1 (no regression).
- **Time for a reviewer to answer "how many plants are waiting for tips?"** — baseline: TBD, measured by the owner timing 3 reviewers on a sample of 10 plants before and after release; target: ≤ 5 seconds.

## 8. Open questions

- [ ] §6 measurement bounds: which build (development or production), which start and end events for the 300 ms and 1 s targets, which accessibility audit tool and which severity counts as failing? Default now: production build, from click or navigation start to full content visible, axe with serious and critical issues failing. — owner: Orest Lyubinets, due: before sdd:plan-tests
- [ ] Where is the remove control placed, and does removal ask for confirmation? Default now: a control on the dashboard row, with a confirmation step. — owner: Orest Lyubinets, due: before sdd:ux-flows
- [x] Which exact columns? Decided 2026-10-17: name, type, location, watering, light; the care-tip state is a text label next to the name, not its own column. — owner: Orest Lyubinets
- [x] Does "number of plants" count entries or the sum of the amount field? Decided 2026-10-17: entries (one row = one plant). — owner: Orest Lyubinets
- [ ] Before accounts, the starting (seed) plants have no care tips, so by the glossary rule every one counts as failed and the first view reads "N failed". Is seed data in scope, and what is the expected first-open status? Default now: out of scope, left as is, shown as failed. — owner: Orest Lyubinets, due: before sdd:design
- [ ] How is the short watering/light note produced: a separate short value stored with the care tips, or a shortened form of the existing text? Default now: a short form of a few words, not the full sentence. — owner: Orest Lyubinets, due: before sdd:design
- [x] Is the dashboard released before or after accounts and per-user collections? Decided 2026-10-17: it may ship before accounts on the current collection holder; AC-07 is verified after roadmap step 4 (this overrides the roadmap's step 4 → step 7 edge). — owner: Orest Lyubinets
