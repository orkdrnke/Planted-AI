# AGENTS.md

## 1. Project Context

Plant Care AI is a learning-oriented MVP for managing a personal plant collection and generating AI-powered plant care recommendations.

The primary goal is to explore modern frontend development patterns and AI integration in a Next.js application. Keep the implementation practical and easy to understand. Avoid introducing production-level complexity unless explicitly requested.

The application allows users to:

- Add plants to their personal collection.
- View the collection in a table.
- Open a dedicated page for an individual plant.
- Generate plant care recommendations using the OpenAI API.
- Store plant data in a client-side Zustand store.

This is an evolving MVP. Always inspect the current implementation before assuming that a feature, file, or architectural decision is fully implemented.

## 2. Technology Stack

The project primarily uses:

- **Next.js** — App Router.
- **React** — component-based UI.
- **TypeScript** — application types and contracts.
- **Tailwind CSS** — styling.
- **shadcn/ui** — reusable UI components.
- **Zustand** — client-side application state.
- **Zod** — schema validation and type inference.
- **React Hook Form** — form state and validation.
- **OpenAI JavaScript/TypeScript SDK** — AI integration.
- **OpenAI model:** `gpt-4o-mini`.

Use the versions specified in `package.json` and the lockfile. Do not assume that the project uses the latest version of every dependency.

Before using a new API, SDK method, or framework feature, verify that it is supported by the installed version.

## 3. Repository Structure

The repository has included the following structure:

```text
app/
  api/
    ai-care-guide/
      route.ts
  addPlant/
    page.tsx
  myGarden/
    page.tsx
    [id]/
      page.tsx
  search/
  takePhoto/
  page.tsx
  layout.tsx
  globals.css

components/
  ui/
  header.tsx
  infoSidebar.tsx

components.json

lib/
  aiHelpers.ts
  constants.ts
  mockdata.ts
  store/
    plantsStore.ts
  utils.ts

schemas/
  plantFormSchema.ts
  careTipsSchema.ts

types/
  plant.ts
  store.ts

public/
  img/
  icons/

README.md
package.json
```

This is a reference to the known project structure, not a guarantee that every listed directory contains a complete implementation.

Before modifying files:

1. Inspect the actual repository structure.
2. Read the relevant source files and their imports.
3. Check `package.json` for available scripts and installed dependencies.
4. Follow the existing naming conventions and component patterns.
5. Do not create duplicate files or abstractions without a clear reason.

## 4. Architecture and Data Flow

### 4.1 Application state

Zustand is currently the source of truth for plant data on the client.

Plant creation and updates should use the existing store rather than introducing a second state management mechanism.

The store (`usePlantStore`, wrapped in the `devtools` middleware) currently exposes:

- `plants` — the plant collection, initially seeded with mock data from `lib/mockdata.ts`.
- `newPlantId` — the ID of the most recently added plant, used to highlight its row in `/myGarden`.
- `addPlant` — add a plant to the collection, generate its ID, and call `generateCareTips`.
- `updatePlant` — merge partial data into an existing plant by ID.
- `generateCareTips` — request AI care tips for a plant by ID and track `aiStatus` (`generating` → `ready` / `error`) and `aiError`. Also used for retries.
- `removePlant` — remove a plant by ID.
- `clearNewPlantId` — reset `newPlantId` after the highlight.

There is no `getPlantById` action; components select a plant with `state.plants.find(...)`.

Inspect `lib/store/plantsStore.ts` before using these methods. Treat the actual implementation and types as authoritative.

Do not introduce Redux, another global store, or a separate caching layer unless explicitly required.

### 4.2 Plant creation and AI enrichment

The intended data flow is:

1. The user submits the plant form.
2. The `addPlant` store action creates the plant with a stable ID (`uuid` v4).
3. The plant is added to the Zustand store immediately.
4. `addPlant` calls the `generateCareTips` store action, which sets `aiStatus: "generating"` and sends a background `fetch` request to `/api/ai-care-guide` with `name`, `type`, and `dest`. The request is made from the store, not from a component.
5. The Next.js API route validates the request body with Zod (`400` on invalid input) and invokes the server-side AI helper.
6. The helper requests structured care recommendations from OpenAI.
7. The API returns the result validated against the care tips schema, or `502` if the AI response is incomplete or could not be parsed.
8. The store validates the response with `CareTipsSchema` (`schemas/careTipsSchema.ts`), merges only the AI fields into the plant by ID, and sets `aiStatus: "ready"`. Network errors, non-OK responses, and invalid data set `aiStatus: "error"` with `aiError`. Results for removed plants are ignored, and a new request is not started while one is pending.

AI generation should not block the initial creation of the plant.

When AI data arrives, merge it into the existing plant instead of replacing the entire object. Preserve user-entered fields and any other data that was already stored.

Handle asynchronous states explicitly where the existing UI supports them or where the task requires them. Do not assume that an AI request always succeeds.

### 4.3 Next.js API route

OpenAI requests must run on the server.

The client must communicate with the application API route using `fetch`, rather than importing and executing the OpenAI helper directly.

The expected endpoint is:

`POST /api/ai-care-guide`

Inspect `app/api/ai-care-guide/route.ts` before changing the request or response contract.

Keep HTTP request handling, input validation, and error responses in the route. Keep the reusable OpenAI integration logic in `lib/aiHelpers.ts`.

Do not expose server-only utilities or secrets to client components.

### 4.4 OpenAI integration

`lib/aiHelpers.ts` contains the server-side AI integration.

The project uses the OpenAI Responses API for one-shot care recommendation generation, rather than implementing a conversational assistant.

Use the installed OpenAI SDK and its supported API conventions.

Structured outputs should be used when appropriate to enforce the expected response shape. The project has used Zod schemas and `zodTextFormat` from `openai/helpers/zod`.

For the Responses API, the structured output configuration uses the `text.format` option. Do not substitute an API parameter from another endpoint or an older integration pattern without verifying compatibility.

Validate AI output against the expected schema before updating application state. Do not trust model-generated content merely because the request succeeded.

Before accessing parsed response data, inspect the actual response type and the installed SDK's supported helpers. Do not assume that properties such as `output_parsed` exist unless they are confirmed for the specific API and SDK version.

AI responses may be incomplete, invalid, or unavailable. Implement appropriate error handling without silently replacing valid user data.

## 5. Data Modeling and Validation

The project uses TypeScript types and Zod schemas.

Relevant files include:

- `types/plant.ts`
- `types/store.ts`
- `schemas/plantFormSchema.ts`
- `schemas/careTipsSchema.ts` — AI care tips schema shared by the server and the client; it must stay free of server-only imports.

Inspect these files before changing the plant model or form contract.

Keep form input types separate from the complete domain model when their responsibilities differ.

A plant may contain user-provided information and AI-generated care information. AI-generated fields may be unavailable while a request is pending or after a failure.

The current `TPlant` type (`types/plant.ts`) contains:

- Managed by the store: `id`.
- From the form (`schemas/plantFormSchema.ts`), all strings: `name`, `type`, `size`, `amount`, `price` (required), `dest` and `dateAdded` (optional).
- AI-generated (optional): `botanicalName`, `wateringFrequency`, `sunlightNeeds`, `soilType`, `temperatureRange`, `careTips` (`string[]`).
- Other (optional, not set by any UI yet): `nextFertilize`, `notes`, `imageUrl`, `lastWatered`.

Notes:

- There is no `location` field; the plant's placement is stored in `dest` (e.g. `"inside"` / `"outside"`).
- `dateAdded` is entered by the user in the form, not set automatically. The form produces `YYYY-MM-DD`, while mock data uses `Date.prototype.toString()`, so the format is not consistent.

Treat `types/plant.ts` as authoritative if it differs from this list.

Requirements:

- Use a stable, unique ID for each plant.
- Keep TypeScript types aligned with actual runtime data.
- Validate untrusted input at API boundaries.
- Represent optional or pending AI data accurately.
- Avoid unsafe type assertions and unnecessary use of `any`.
- Reuse existing schemas where appropriate instead of duplicating validation logic.
- Avoid changing the form contract without updating its consumers.

## 6. Environment Variables and Secrets

The OpenAI API key is configured through the server-side environment variable:

`OPENAI_API_KEY`

Store local secrets in `.env.local`.

Rules:

- Never hardcode API keys or other credentials.
- Never expose secrets through `NEXT_PUBLIC_` environment variables.
- Never include secret values in logs, error responses, screenshots, or committed files.
- Do not assume environment variables are available until the server process has loaded them.
- If an API request fails because credentials are missing, check the local environment configuration and restart the development server when necessary.

Keep `.env.local` out of version control. If environment configuration changes, update `.env.example` with variable names and safe placeholders only, if such a file exists or is introduced.

## 7. Frontend Development Guidelines

### Components

- Prefer small, focused React components.
- Follow the existing App Router conventions.
- Use Server Components by default where possible.
- Add `"use client"` only when client-side state, effects, event handlers, or browser-specific functionality requires it.
- Keep client-side components focused on UI and interaction.
- Keep server-only functionality out of the client bundle.
- Reuse existing components and shadcn/ui primitives before introducing alternatives.

### Styling

- Use the project's existing Tailwind CSS conventions.
- Reuse existing UI components and design patterns.
- Avoid introducing another styling system.
- Keep responsive behavior in mind.
- Avoid unrelated visual redesigns when working on application logic.

### Forms

- Follow the existing React Hook Form and Zod integration.
- Keep validation rules consistent with the schema.
- Provide understandable validation and request error states.
- Prevent accidental duplicate submissions where appropriate.
- Preserve existing form values and behavior unless the task requires a change.

### Navigation and routing

- Follow the existing Next.js App Router structure.
- Use the existing route conventions when adding pages or endpoints.
- Inspect the current implementation before assuming that a route exists or is complete.
- Preserve the expected behavior of the plant list and individual plant pages.

## 8. State Management and Persistence

Zustand currently stores plant data on the client.

There is no confirmed database or durable server-side persistence in the current architecture.

Do not claim that plant data survives a browser refresh unless persistence has been implemented and verified.

Do not introduce a database, authentication system, or Zustand persistence middleware as part of an unrelated task.

If persistence is requested, first evaluate the desired scope:

- Browser-local persistence.
- A remote database.
- User accounts and synchronized data across devices.

Choose the simplest approach that meets the requirement and explain any relevant trade-offs.

## 9. Error Handling and User Experience

AI generation is an asynchronous operation and can fail independently of plant creation.

When working on this flow:

- Keep the initially created plant available if AI generation fails.
- Make pending, successful, and failed states distinguishable where relevant.
- Avoid losing user-entered data.
- Provide useful error messages without exposing internal stack traces or secrets.
- Allow retrying failed AI generation when required by the task.
- Prevent stale responses from updating the wrong plant.
- Use the plant ID to associate AI results with the correct record.

Do not add complex retry queues, background jobs, or elaborate notification systems unless the project requirements justify them.

## 10. Code Quality and Dependencies

Before adding a dependency:

1. Check whether the functionality already exists in the current stack.
2. Consider whether a small amount of existing code would be sufficient.
3. Explain why the dependency is needed if it adds meaningful complexity.

General rules:

- Use TypeScript for application code.
- Keep functions and components focused.
- Prefer clear, explicit code over unnecessary abstractions.
- Avoid broad refactors when implementing a focused feature.
- Do not silently change existing behavior.
- Remove unused imports and variables introduced by your changes.
- Avoid unrelated formatting changes.
- Keep UI text and code comments in English.
- Keep explanations and development discussions with the user in Ukrainian.

## 11. Tooling and Verification

Inspect `package.json` before running commands. Use the package manager and scripts already established by the project.

The repository has included both `pnpm-lock.yaml` and `package-lock.json`. Do not assume which lockfile is authoritative without inspecting the current setup. Avoid regenerating or modifying unrelated lockfiles.

After making changes, run the most relevant available checks, such as:

- TypeScript type checking — `pnpm typecheck`.
- ESLint — `pnpm lint`.
- Tests — `pnpm test` (Vitest, `*.test.ts` next to the tested file). Tests must not call the real OpenAI API; mock `openai` or `@/lib/aiHelpers`.
- Production build — `pnpm build`.

`next dev` does not run a full type check, so a working dev server does not guarantee that `pnpm build` passes.

Use the actual scripts defined in `package.json`; do not assume that a script exists.

Do not prefix shell commands with `cd`; the session already runs in the repository root. Use repo-relative or absolute paths. Reads outside the working directories are blocked (`permissions.blockReadsOutsideWorkingDirectories`), and paths after `cd` cannot be checked before the command runs, so such commands are rejected.

Avoid inline interpreters (`python3 -c`, `node -e`, `bash -c`, `eval`) for reading files; use `jq`, `cat`, `grep` or the Read tool. The read block cannot analyze inline code, so such commands require manual approval.

If a check fails:

- Determine whether the failure was introduced by your changes.
- Fix relevant regressions.
- Report pre-existing or environment-related failures separately.
- Never claim that tests or builds passed unless they were actually run successfully.

## 12. Security and Reliability

- Keep the OpenAI API key server-side.
- Validate API request bodies.
- Validate structured AI output before storing it.
- Return appropriate HTTP status codes for invalid input and server failures.
- Avoid exposing stack traces or sensitive configuration to the client.
- Do not treat AI-generated plant care recommendations as guaranteed factual information.
- Do not introduce authentication, rate limiting, or other infrastructure without considering the current MVP scope and the task requirements.

## 13. Current Limitations

The following limitations are known or expected in the current MVP and must be verified against the repository before being treated as current facts:

- Plant data is stored in Zustand, without confirmed durable persistence.
- There is no confirmed database integration.
- There is no confirmed authentication or multi-user support.
- AI-generated recommendations may fail or be inaccurate.
- Durable background processing is not implemented.
- Search, photo capture, and other routes may be incomplete or placeholders.
- AI loading, retry, and failure states are shown on the plant detail page and as a row icon in `/myGarden`; there are no UI tests for them.

Do not silently expand the scope to address these limitations during unrelated work.

If a local `KNOWN_ISSUES.md` exists (it is not tracked by git), read it for known code issues that still need to be resolved.

## 14. Suggested Development Priorities

When asked to recommend or continue development, consider the following priorities in order of practical value:

1. Verify the plant creation and AI enrichment flow end to end.
2. Improve AI loading and error states.
3. Add retry support for failed AI generation.
4. Ensure AI results update the correct plant without overwriting user data.
5. Improve the individual plant detail page.
6. Add plant care tracking, such as watering history, if requested.
7. Introduce persistence when the product requirements justify it.
8. Consider authentication and multi-user support only when needed.

These are potential next steps, not a mandatory roadmap. Follow the user's latest instructions and existing implementation.

## 15. Definition of Done

A task is complete when:

- The requested behavior is implemented.
- Existing functionality remains intact.
- TypeScript types and runtime validation are consistent.
- Relevant loading and error states are handled.
- No secrets are exposed to the client.
- The implementation follows the existing architecture.
- Relevant checks have been run where possible.
- Any unverified behavior or remaining limitation is clearly reported.

## 16. Instructions for AI Agents

Before starting a task:

1. Read this file.
2. Inspect the relevant implementation and types.
3. Identify the smallest change that satisfies the request.
4. Confirm that the proposed solution is compatible with installed dependencies.
5. Preserve existing decisions unless there is a clear reason to change them.

While working:

- Do not invent files, methods, types, or API response properties.
- Do not assume that conceptual examples in this document match the current source code exactly.
- Do not replace existing implementations wholesale when a targeted change is sufficient.
- Do not add features beyond the requested scope.
- Do not expose server-only code or credentials.
- Keep changes easy to review.

After working:

1. Summarize the changes.
2. List relevant checks that were actually executed.
3. Mention any failures or remaining limitations.
4. Identify any important architectural decisions that changed.

When this document conflicts with the actual implementation, inspect the code and dependency versions first. When it conflicts with a new explicit requirement from the user, follow the new requirement and update this document if the change represents a lasting architectural decision.
