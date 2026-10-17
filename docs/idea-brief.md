---
status: Draft
owner: "Orest Lyubinets"
updated_at: "2026-10-17"
depth: "medium"
---

# Idea brief — accounts-backend-and-ux

## 1. Raw idea

> я хочу вирішити дві основні проблеми в поточному стані мого проекту: UX та створити backend.
> Детальніше про кожен з них далі.
> UX - я хочу переконатись, що користувацький досвід відпрацьований до деталей. Мій продукт повинен бути інтуітивним, недвозначним, послідовним, корисним для користувача (мати лише ті фічі, які справді будуть необхідними в щоденному використанні).
> Наприклад, зараз головна сторінка - це по суті Welcome screen. Вона відображається завжди. Але логічно було б мати цю сторінку лише для першого входу користувача (тут вже потрібна реєстрація і відслідковування сесії). Ця сторінка повинна бути як невеликий онбординг нового користувача, але займати мінімум часу, щоб не відлякати нових користувачів. Просто, сучасно, без перевантаження навчальним процесом.
> Наступний момент по UX - таблиця доданих рослин. Ця сторінка повинна бути основним робочим інструментом. Як певний дашборд, швидкий огляд стану "що тут є і що зараз відбувається". Тут також повиннен бути акцент на відображення лише найпотрібнішої інформації. Актуальний статус колекції рослин, необхідні дії (термінові речі), сповіщення в разі нагадувань про якісь заплановані чи важливі події (це майбтній функціонал, де я буду трекати зміни сезону, погоди та інших факторів, що впливають на зміни в потребах у догляді для різних рослин).
> В таблиці повинні бути тільки найнеобхідніші дані (назва рослини, де розташована, тип, і ще щось що ти порадиш).
>
> Backend - це наступна ланка в розвитку проекту. Зараз BE немає і відповідно продукт значно обмежений в функціональності. Тому додавання BE - пріоритетний крок. Я хочу дати користувачам змогу легко зареєструватись (мінімальний набір даних, найменший супротив для нових користувачів), створити свій обліковий запис, додати перші рослини і мати змогу переглянути з різних девайсів у вебі. На цьому етапі треба прибрати наявні моки даних.
> Кожен користувач стартує з порожньої таблиці і може почати створювати колекцію.
> Тут важливо запропронувати стек технологій, який буде актуальним у 2026, задовільнить потреби моїх задач, буде актуальним для мене як FE розробника, який хочу розвиватись в напрямку fullstack.

## 2. Problem

Two problems, both **owner-reported**:

- **No backend.** Plant data lives only in a client-side Zustand store seeded with mock data (`lib/store/plantsStore.ts`, `lib/mockdata.ts` — source-verified via AGENTS.md §4.1/§8). There are no accounts, data does not survive a refresh, and a collection cannot be opened from another device. Desired outcome: a user registers with minimal friction, starts with an empty collection, adds plants, and sees the same collection from any device on the web. Mock data is removed.
- **UX is not yet intentional.** The home page (`app/page.tsx`) is a welcome screen shown on every visit. The plant table (`app/myGarden/page.tsx`) is a list rather than a working tool. Desired outcome: a short onboarding shown only on first entry; `/myGarden` becomes the main dashboard ("what is here and what is happening now"), with only essential columns and the current collection status; a click on a row opens the plant detail page with expanded care tips. The raw idea also mentions required/urgent actions and reminders — later narrowed by the owner: these are out of scope for the MVP (see §5).

## 3. Users

- **Public web users** who keep a personal plant collection — the long-term target audience is a public launch (owner-reported). **At ~week 8 access is invite-only** (deployed, registration gated by an invite); open registration follows as a later step (owner decision). There is no defined segment yet beyond "anyone who registers" (unknown).
- **Invited early users / reviewers** (e.g. people evaluating the project as a portfolio piece) — the actual users at week 8 (owner decision).
- **New users at first entry** — must reach an empty collection quickly; onboarding must not scare them off (owner-reported).
- **Returning users** — use `/myGarden` daily as their main tool (owner-reported intent; no usage data exists).
- **The owner as operator** — a frontend developer growing toward fullstack, who runs the backend and pays for hosting and OpenAI usage (owner-reported).

## 4. Why now

- **Career goal (owner-reported):** close the Node.js backend gap for fullstack job openings within **~8 weeks**. Learning depth in the backend takes priority over a fast public launch.
- **Product trigger (owner-reported):** without a backend the product cannot hold real users, accounts or cross-device data, so it is the blocking next step.
- **Definition of done for ~week 8 (owner decision):** deployed to a PaaS, invite-only access, working accounts and per-user collections. Open public registration — with email verification, password reset, rate limits and AI quotas — comes after.
- No external deadline or user demand signal has been established.

## 5. Out of scope

- **Care tracking and computed "required actions"** (watering log, "water today", overdue counters) — excluded from the MVP by owner decision. Reason: watering depends on many factors and cannot be reliably computed from an interval or from AI advice (owner-reported).
- **Reminders, notifications, season/weather tracking** — named by the owner as future functionality, not part of this release (owner-reported).
- **Mock data** — removed rather than kept; every user starts with an empty collection (owner decision).

- **BaaS for auth/data** (e.g. Supabase) — rejected by the owner; auth and access checks are written by hand for learning value.
- **Kubernetes and complex infrastructure** — excluded (owner decision).
- **Care tracking UI on the dashboard** — see above; the dashboard shows status and links to plant detail pages only.

Constraints to preserve (existing/owner-required):

- Web only, usable across devices. Next.js App Router + TypeScript frontend stays. AI care tips are generated via the OpenAI API on the server only (AGENTS.md §4.3–4.4).
- **Separate Node.js/TypeScript API service** — owner leans to **NestJS** because job postings often require it (owner decision on the shape; framework choice still to be confirmed in `design`).
- **PostgreSQL** with hand-written migrations plus some raw SQL (owner decision).
- **pnpm monorepo** with the Next.js app; types/schemas shared between frontend and backend (owner decision).
- **Single domain:** Next.js rewrites proxy `/api` to the backend, so there is no CORS and no cross-domain session (owner decision).
- **Local Docker Compose; deploy to a simple PaaS** with minimal ops; free tiers where possible (owner decision).
- **Working mode (owner-required):** the agent generates code but the owner makes the decisions. Before each significant feature the agent proposes 2 options with trade-offs and waits for a choice. After implementing, it briefly explains the key decisions and weak points. It does not generate the DB schema, migrations or auth logic without owner approval. Every decision gets a short ADR.

## 6. Risks

Ordered by consequence, weakest assumption first. Critique: an independent `sdd:devils-advocate` pass (interview mode, clean context), 3 findings.

1. **Scope vs ~8 weeks.** Committed for the window: a new framework (NestJS), Postgres with hand-written migrations, a monorepo restructure, hand-written auth, Docker Compose, PaaS deploy, the UX rework (onboarding + dashboard), and a 2-options + ADR cadence per feature. This is the weakest assumption (assumption — no estimate exists). Mitigated by the invite-only definition of done. Still reversible: cut UX polish before cutting backend depth.
2. **Unbounded OpenAI spend / unauthenticated AI route.** Mitigated for week 8 by invite-only access. It must be closed before open registration. The current Next route keeps accepting unauthenticated calls if it is not removed or moved behind the backend's auth.
3. **AI enrichment becomes a server-side contract.** The owner wants finished tips visible on another device even if the creating tab closes. That conflicts with AGENTS.md §9/§13 (no background jobs / no durable background processing) and possibly §4.2. One of these rules needs an ADR in `design`.
4. **Untyped form fields.** `price`, `size` and `amount` are unconstrained strings and will need types in a hand-written Postgres schema. Affects the shared-schema decision.

Evidence ledger:

| Claim / question | Class | Source / origin | Finding / limit |
|---|---|---|---|
| Plant data is client-only and seeded with mocks | source-verified | `lib/store/plantsStore.ts`, `lib/mockdata.ts`; AGENTS.md §4.1, §8 (rev 31188e6) | No persistence, no accounts |
| AI route has no auth and no max input length | source-verified | `app/api/ai-care-guide/route.ts` L5-9 (rev 31188e6, via critic) | Any caller triggers a paid call |
| Duplicate-request guard is client-only | source-verified | `lib/store/plantsStore.ts` L39 (via critic) | Not enforceable server-side |
| Plant ID and `aiStatus` live on the client | source-verified | `plantsStore.ts` L92; `types/plant.ts` L12-13 (via critic) | Must move for cross-device status |
| `next.config.ts` has no rewrites yet | source-verified | `next.config.ts` (via critic) | Proxy is greenfield |
| Next route handlers win over default `/api` rewrites | unknown | general Next.js behaviour, not checked against 15.3.3 | Verify in `design` |
| NestJS is often required in job postings | owner-reported | owner | Not independently checked |
| Feasible in ~8 weeks | assumption | owner goal | No estimate |
| Real users want a knowledge base more than care tracking | assumption | owner judgment | No user research |

## 7. Recommendation

**Direction (owner-accepted decisions):**

- **Product:** the MVP is a personal plant knowledge base. Accounts, an empty collection per user, cross-device web access, mock data removed.
- **Onboarding:** a short welcome/onboarding on first entry only.
- **Dashboard:** `/myGarden` is the main dashboard with essential columns and collection status; a click opens the plant detail page with care tips.
- **AI tips:** finish on the server and are visible on any device even if the creating tab was closed.
- **Week 8:** deployed, invite-only, email + password login.

**Backend shape (owner-accepted):** a separate Node.js/TS API (leaning NestJS), PostgreSQL, a pnpm monorepo, a `/api` proxy via Next rewrites, hand-written auth, Docker Compose, and a PaaS on free tiers.

**Observable intended result at ~week 8:**

- An invited user can register and log in.
- They add plants and see AI tips appear.
- They open the same collection on a second device.
- The owner can explain every backend decision via its ADR.

**Major trade-off:** learning depth over speed. More hand-written infrastructure (auth, migrations, a separate service) means a higher schedule risk. Accepted by the owner.

**Rejected alternatives:**

- BaaS such as Supabase — less backend learning.
- Backend inside Next.js — does not close the separate Node.js API gap the owner targets.
- Care tracking / computed actions — watering cannot be reliably computed.
- Open registration at week 8 — needs abuse controls first.
- Magic link / Google OAuth — add an external provider at the start.

**Proposals, not yet decided:**

- Dashboard columns: name, type, location (`dest`), a compact care summary (light / watering in general terms), and the AI-tips status. To be settled in `specify`.
- Remove the Next `/api/ai-care-guide` route once the backend owns AI generation.

**Sequencing (proposal):** this is two tracks (backend foundation + auth + plants API; UX onboarding + dashboard) with dependencies. Decompose them in `roadmap` before specifying individual features.

Owner accepted this recommendation on 2026-10-17 (final confirmation question).

Outcome: ready-for-roadmap

Next action: `/sdd:roadmap`.

## 8. Open questions

| Question | Consequence | Blocking? | Verification action | Owner |
|---|---|---|---|---|
| Where does AI generation run, and which AGENTS.md rule (§4.2 / §9 / §13) changes? | Decides the plant-creation contract, who issues IDs, and where `aiStatus` is stored | non-blocking for roadmap; blocking for the AI feature design | 2 options + ADR in `design` | Orest (decides), agent (proposes) |
| Is the Next `/api/ai-care-guide` route removed, and do route handlers shadow the `/api` rewrite in Next 15.3.3? | An unauthenticated paid endpoint could remain | non-blocking for roadmap | Check Next 15.3.3 docs; decide in `design` | agent (verify), Orest (decide) |
| Sessions vs JWT, password hashing, invite mechanism | Core auth design | non-blocking for roadmap | 2 options + ADR; owner approval before code | Orest |
| Which PaaS + Postgres free tier | Cost and ops | non-blocking | Compare current free tiers in `survey`/`design` | agent (research), Orest (decide) |
| Types for `price`, `size`, `amount` | DB schema and shared schemas | non-blocking for roadmap | Decide in `data-model` with owner approval | Orest |
| Final dashboard columns and onboarding content | UX scope | non-blocking | `specify` / `ux-flows` | Orest |
| Abuse controls for open registration (email verification, reset, rate limits, AI quotas) | Required before a public launch | non-blocking now (invite-only) | Separate roadmap step after week 8 | Orest |
