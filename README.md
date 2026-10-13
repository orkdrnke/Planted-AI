# Plant Care AI

Plant Care AI is an MVP of a plant management application built with Next.js. The primary goal is to explore how AI can assist users in organizing their plants and generating practical care recommendations based on plant information.

Users can add plants, browse their collection in a table, open individual plant detail pages, and receive AI-generated care recommendations (watering, sunlight, soil, temperature, general care tips) asynchronously after creating a plant. All data is stored client-side in Zustand, while AI generation runs in a server-side API route so the OpenAI API key stays on the server.

This is a learning project focused on modern frontend architecture, state management, form handling, API integration, and structured AI outputs. It is not yet a production-ready gardening platform.

Instructions for AI coding agents are in [AGENTS.md](AGENTS.md).

## Getting Started

Create `.env.local` with your OpenAI API key:

```bash
OPENAI_API_KEY=your-key-here
```

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- **Next.js** — App Router, pages, layouts, and server-side API routes.
- **React** — UI components and client-side interactions.
- **TypeScript** — Static typing.
- **Tailwind CSS** — Utility-first styling.
- **shadcn/ui** — UI components built on Radix UI and Tailwind CSS.
- **Zustand** — Global client-side state management.
- **Zod** — Schema definition and runtime validation.
- **React Hook Form** — Form state management and validation integration.
- **OpenAI JavaScript/TypeScript SDK** — Server-side communication with OpenAI (`gpt-4o-mini`, Responses API).
- **pnpm** — Preferred package manager; `pnpm-lock.yaml` is present in the repository.

Exact versions are defined in `package.json`.

## Project Structure

```text
app/
├── page.tsx
├── layout.tsx
├── globals.css
├── addPlant/
│   └── page.tsx
├── myGarden/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── search/
├── takePhoto/
└── api/
    └── ai-care-guide/
        └── route.ts

components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── sheet.tsx
│   ├── table.tsx
│   └── navigation-menu.tsx
├── header.tsx
└── infoSidebar.tsx

lib/
├── aiHelpers.ts
├── constants.ts
├── mockdata.ts
├── utils.ts
└── store/
    └── plantsStore.ts

schemas/
├── plantFormSchema.ts
└── careTipsSchema.ts

types/
├── plant.ts
└── store.ts

public/
├── img/
└── icons/

components.json
```

`app/search/` and `app/takePhoto/` are empty placeholders, and `components/infoSidebar.tsx` is currently an empty file.

## Implemented Features

### Plant creation

- A form is available at `/addPlant`.
- Form validation uses Zod and React Hook Form.
- Newly created plants are added to the Zustand store.

### Plant collection

- `/myGarden` displays the user's plants in a table; the newly added plant is highlighted.
- Clicking a row opens the plant's detail page at `/myGarden/[id]`.

### AI care recommendations

- AI recommendations are requested in the background right after a plant is added.
- The request is sent from the `generateCareTips` store action (called by `addPlant`) to `POST /api/ai-care-guide`.
- The API route validates the request body with Zod and calls `generatePlantCareTips` in `lib/aiHelpers.ts`.
- Structured output is defined using Zod and `zodTextFormat`.
- The result is validated on the client and only the AI fields are merged into the corresponding plant. Each plant tracks `aiStatus` (`generating`, `ready`, `error`).

The data flow is:

1. The user submits the plant form.
2. `addPlant` generates a `uuid` and adds the plant to Zustand immediately.
3. `generateCareTips` sets `aiStatus: "generating"` and sends `name`, `type`, and `dest` to `/api/ai-care-guide`.
4. The route validates the input (`400` on invalid input) and calls the OpenAI API through the helper.
5. The API returns structured plant care data (or `502` if the AI response is incomplete or could not be parsed).
6. The corresponding plant is updated in Zustand by its `id` (`aiStatus: "ready"`, or `"error"` with `aiError`).
7. React components reflect the updated state.

The application remains usable while AI recommendations are being generated.

## Architecture

### Next.js App Router

- `app/**/page.tsx` defines pages.
- `app/api/**/route.ts` defines server-side API endpoints.
- Dynamic segments such as `app/myGarden/[id]` identify individual plants.

### Zustand store

`usePlantStore` (`lib/store/plantsStore.ts`, wrapped in the `devtools` middleware) is the current source of truth. It exposes:

- `plants` — the collection, initially seeded with mock data from `lib/mockdata.ts`.
- `newPlantId` — the ID of the most recently added plant, used for row highlighting.
- `addPlant` — adds a plant, generates its ID, and calls `generateCareTips`.
- `updatePlant` — merges partial data into a plant by ID.
- `generateCareTips` — requests AI care tips for a plant and tracks `aiStatus` / `aiError`; also used for retries.
- `removePlant` — removes a plant by ID.
- `clearNewPlantId` — resets `newPlantId`.

Store types live in `types/store.ts`, plant types in `types/plant.ts`.

### Server-side AI integration

- The OpenAI API key is stored in `.env.local` as `OPENAI_API_KEY` and is never exposed via `NEXT_PUBLIC_` variables.
- OpenAI client initialization and API calls live in `lib/aiHelpers.ts`, which does not depend on React or Zustand.
- The frontend communicates with the AI only through the Next.js API route.

The care tips schema in `schemas/careTipsSchema.ts` is shared by the server and the client. It contains `botanicalName`, `wateringFrequency`, `sunlightNeeds`, `soilType`, `temperatureRange`, and `careTips`.

## Plant Data Model

The `TPlant` type (`types/plant.ts`) contains:

| Group | Fields | Notes |
| --- | --- | --- |
| Managed by the store | `id` | Generated with `uuid` v4 in `addPlant`. |
| From the form | `name`, `type`, `size`, `amount`, `price` | Required strings. |
| From the form | `dest`, `dateAdded` | Optional. `dest` stores placement (`"inside"` / `"outside"`); there is no `location` field. |
| AI-generated | `botanicalName`, `wateringFrequency`, `sunlightNeeds`, `soilType`, `temperatureRange`, `careTips` | Optional; empty until the AI response arrives. `careTips` is `string[]`. |
| Other | `nextFertilize`, `notes`, `imageUrl`, `lastWatered` | Optional; not set by any UI yet. |

`dateAdded` is entered by the user in the form (`YYYY-MM-DD`), not set automatically. Mock data uses `Date.prototype.toString()`, so the format is currently inconsistent.

## Current Limitations

- **No persistence.** All plant data lives in Zustand. A full page reload resets the collection to the mock data; data is not shared across browsers or devices.
- **No authentication.** There are no user accounts or multi-user data isolation.
- **No background jobs.** AI generation is an in-browser async request, not a durable background process.
- **No complete error and retry workflow in the UI.** The store tracks a per-plant AI status and supports retries, but the UI does not show loading or error states and has no Retry button yet.
- **No guaranteed AI accuracy.** AI recommendations are suggestions, not verified horticultural facts.

## Recommended Next Steps

These are potential improvements, not confirmed tasks.

1. **AI generation status** — a per-plant status (`idle`, `generating`, `ready`, `error`) for feedback on detail pages and to prevent duplicate generation.
2. **Error handling and regeneration** — display failures, allow retrying and regenerating recommendations.
3. **Plant care tracking** — last watering time, watering and fertilization reminders, notes.
4. **Persistence** — Zustand `persist` for a simple local prototype or a database for durable storage, after discussing trade-offs.
5. **UX improvements** — success feedback after adding a plant, loading and error states for AI recommendations, empty states.
