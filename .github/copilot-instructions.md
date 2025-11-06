## Quick orientation for AI coding agents

This project is a Next.js (App Router) TypeScript web app that helps users manage plants and uses OpenAI to generate plant care tips.

- Dev entrypoint: `npm run dev` (uses `next dev --turbopack`). Build with `npm run build` and run with `npm run start`.
- Key directories:
  - `app/` — Next.js App Router pages and routes (server/client components).
  - `components/` — UI and shared components. UI primitives live under `components/ui/`.
  - `lib/` — utilities and helpers. AI code and mock data live here (`lib/aiHelpers.ts`, `lib/mockdata.ts`).
  - `lib/store/` — client state (Zustand stores) used by pages (see `lib/store/plantsStore.ts`).
  - `schemas/` — `zod` validation schemas (e.g. `schemas/plantFormSchema.ts`).
  - `types/` — canonical types (e.g. `types/plant.ts`).

## Important conventions and patterns

- App Router (Next 15): prefer files under `app/` for routes and layouts. `app/layout.tsx` provides global layout and includes `Header`.
- Type aliases and path alias: sources use the `@/*` path alias. Examples: `import { usePlantStore } from "@/lib/store/plantsStore"`.
- Styling: Tailwind CSS + helper `cn` in `lib/utils.ts` for class merging. UI primitives are in `components/ui/*`.
- State: global UI/state uses `zustand` stores in `lib/store/`. The main example is `usePlantStore` in `lib/store/plantsStore.ts` (mock data seeded from `lib/mockdata.ts`).
- Validation: form validation uses `zod` schemas in `schemas/`.

## AI integration (critical)

- Entrypoint: `lib/aiHelpers.ts` — uses the `openai` npm client. The exported function `generatePlantCareTips({name,type,dest})` calls OpenAI and parses JSON output into a partial `TPlant` shape.
- Environment: `OPENAI_API_KEY` must be set in environment for AI features to work. If missing, AI calls will fail at runtime.
- Important details:
  - The function expects the model `gpt-4o-mini` (see `lib/aiHelpers.ts`).
  - The helper parses the model's `response.output[0].content[0].text` as JSON — be cautious when modifying prompts or model settings; always keep JSON-structured output in mind.
  - Error handling currently logs and returns an empty object; callers should tolerate partial/empty results.

## Common tasks and where to look

- Add a new UI component: follow `components/ui/*` patterns (props, className via `cn()`).
- Add a new data field: update `types/plant.ts`, `schemas/plantFormSchema.ts` (if user-editable), and update `lib/store/plantsStore.ts` to persist default/mock values.
- Change AI behavior: edit `lib/aiHelpers.ts`. If you change the prompt/format, update parsing and callers that expect `Partial<TPlant>`.

## Examples (copy-paste friendly)

- Call AI helper:

  - `import { generatePlantCareTips } from '@/lib/aiHelpers'`
  - `const tips = await generatePlantCareTips({ name: 'Fiddle Leaf', type: 'Indoor', dest: 'inside' })`

- State usage (read/write):
  - `import { usePlantStore } from '@/lib/store/plantsStore'`
  - `const addPlant = usePlantStore(state => state.addPlant)`

## Build / dev / lint commands

- Dev: `npm run dev` (Turbopack). Alternatives mentioned in README: `pnpm dev` or `yarn dev` if you prefer other package managers.
- Build: `npm run build` then `npm run start` for production.
- Lint: `npm run lint` (uses Next's ESLint config).

## Quick checks for reviewers / agents

- If modifying AI prompts, run a quick smoke test: set `OPENAI_API_KEY` locally and exercise the route that triggers `generatePlantCareTips` (e.g., the add-plant flow under `app/addPlant/page.tsx`).
- When changing types or schema, run TypeScript (IDE will pick up) and ensure zod validation errors are handled similarly to existing forms.

## Files worth opening first

- `lib/aiHelpers.ts` — AI prompt + parsing
- `lib/store/plantsStore.ts` — Zustand store pattern and examples
- `types/plant.ts` and `schemas/plantFormSchema.ts` — canonical data shape and validation
- `components/ui/` — component primitives
- `app/addPlant/page.tsx` and `app/myGarden` — user flows that connect UI, store, and AI

If any part of this is unclear or you'd like more examples (e.g., tests to run after modifying AI prompts or a short checklist for PRs that change data shapes), tell me which section to expand and I'll iterate.
